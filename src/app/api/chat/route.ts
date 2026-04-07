import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/db';
import { INTAKE_SYSTEM_PROMPT, GAP_FILL_SYSTEM_PROMPT, NEW_PRIORITIES_SYSTEM_PROMPT } from '@/lib/prompts';
import {
  PHASE_TITLES,
  PHASE_TOPICS,
  createDetectionState,
  detectPhaseAndTopicTags,
  detectPhaseKeywordFallback,
  stripPhaseTags,
} from '@/lib/phase-config';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

interface Attachment {
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const DOCUMENT_TYPES = ['application/pdf'];
const TEXT_TYPES = ['text/plain', 'text/markdown', 'text/csv'];

async function buildAttachmentBlocks(
  attachments: Attachment[],
  admin: ReturnType<typeof createAdminClient>
): Promise<Anthropic.Messages.ContentBlockParam[]> {
  const blocks: Anthropic.Messages.ContentBlockParam[] = [];

  for (const att of attachments) {
    const { data: fileData, error } = await admin.storage
      .from('chat-attachments')
      .download(att.storagePath);

    if (error || !fileData) continue;

    const buffer = Buffer.from(await fileData.arrayBuffer());

    if (IMAGE_TYPES.includes(att.fileType)) {
      const mediaType = att.fileType as 'image/png' | 'image/jpeg' | 'image/gif';
      blocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: buffer.toString('base64'),
        },
      });
    } else if (DOCUMENT_TYPES.includes(att.fileType)) {
      blocks.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: buffer.toString('base64'),
        },
      } as Anthropic.Messages.ContentBlockParam);
    } else if (TEXT_TYPES.includes(att.fileType)) {
      const text = buffer.toString('utf-8');
      blocks.push({
        type: 'text',
        text: `[Attached file: ${att.fileName}]\n\n${text}`,
      });
    } else if (
      att.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      att.fileName.endsWith('.docx')
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        blocks.push({
          type: 'text',
          text: `[Attached file: ${att.fileName}]\n\n${result.value}`,
        });
      } catch {
        blocks.push({
          type: 'text',
          text: `[Attached file: ${att.fileName} — could not extract text]`,
        });
      }
    } else if (
      att.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      att.fileName.endsWith('.xlsx')
    ) {
      try {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const csvParts: string[] = [];
        for (const sheetName of workbook.SheetNames) {
          const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          csvParts.push(`## Sheet: ${sheetName}\n${csv}`);
        }
        blocks.push({
          type: 'text',
          text: `[Attached file: ${att.fileName}]\n\n${csvParts.join('\n\n')}`,
        });
      } catch {
        blocks.push({
          type: 'text',
          text: `[Attached file: ${att.fileName} — could not extract data]`,
        });
      }
    }
  }

  return blocks;
}

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { conversationId, message, mode, context, orgId, attachments } = await req.json();

  // Verify user belongs to this org
  const role = await getUserRole(orgId, user.id);
  if (!role) {
    return new Response('Forbidden', { status: 403 });
  }

  const admin = createAdminClient();

  // Load or create conversation
  let convoId = conversationId;
  if (!convoId) {
    const { data: convo, error } = await admin
      .from('conversations')
      .insert({
        org_id: orgId,
        user_id: user.id,
        mode,
        context: context || {},
      })
      .select('id')
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    convoId = convo.id;
  }

  // Build attachment content blocks if present
  let attachmentBlocks: Anthropic.Messages.ContentBlockParam[] = [];
  if (attachments && attachments.length > 0) {
    attachmentBlocks = await buildAttachmentBlocks(attachments, admin);
  }

  // Save user message (store attachment metadata alongside content)
  const messageContent = attachments?.length
    ? `${message}\n\n[Attachments: ${attachments.map((a: Attachment) => a.fileName).join(', ')}]`
    : message;

  await admin.from('messages').insert({
    conversation_id: convoId,
    role: 'user',
    content: messageContent,
  });

  // Load conversation history
  const { data: history } = await admin
    .from('messages')
    .select('role, content')
    .eq('conversation_id', convoId)
    .order('created_at', { ascending: true });

  const messages: Anthropic.Messages.MessageParam[] = (history || []).map((m, idx) => {
    const isLastUserMessage = m.role === 'user' && idx === (history || []).length - 1;
    // Only attach files to the last user message (current one)
    if (isLastUserMessage && attachmentBlocks.length > 0) {
      return {
        role: m.role as 'user' | 'assistant',
        content: [
          ...attachmentBlocks,
          { type: 'text' as const, text: message },
        ],
      };
    }
    return {
      role: m.role as 'user' | 'assistant',
      content: m.content,
    };
  });

  // Build system prompt
  let basePrompt: string;
  if (mode === 'gap-fill') {
    basePrompt = GAP_FILL_SYSTEM_PROMPT;
  } else if (mode === 'new-priorities') {
    basePrompt = NEW_PRIORITIES_SYSTEM_PROMPT;
  } else {
    basePrompt = INTAKE_SYSTEM_PROMPT;
  }
  const systemPrompt = `${basePrompt}\n\n## CONTEXT\n${context?.summary || ''}`;

  // Stream response from Claude
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    system: systemPrompt,
    messages,
  });

  // Create a ReadableStream that forwards the Claude stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullResponse = '';
      const detectionState = createDetectionState(context?.currentPhase);

      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', text, conversationId: convoId })}\n\n`));

            // Real-time phase and topic detection
            const detected = detectPhaseAndTopicTags(fullResponse, detectionState);
            for (const evt of detected) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ ...evt, conversationId: convoId })}\n\n`));

              // Update conversation context with new phase number
              if (evt.type === 'phase') {
                admin.from('conversations')
                  .update({ context: { ...context, currentPhase: evt.phase_number } })
                  .eq('id', convoId)
                  .then(() => {});
              }
            }
          }
        }

        // Keyword fallback: if no phase tags were detected in this response
        if (detectionState.detectedPhases.size === 0) {
          const fallback = detectPhaseKeywordFallback(fullResponse);
          if (fallback) {
            console.warn(`[chat] Phase keyword fallback used for conversation ${convoId}: Phase ${fallback.phase_number}`);
            const phaseEvt = {
              type: 'phase' as const,
              phase_number: fallback.phase_number,
              phase_title: PHASE_TITLES[fallback.phase_number] || `Phase ${fallback.phase_number}`,
              sub_progress: { current: 0, total: PHASE_TOPICS[fallback.phase_number] || 0 },
              conversationId: convoId,
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(phaseEvt)}\n\n`));

            admin.from('conversations')
              .update({ context: { ...context, currentPhase: fallback.phase_number } })
              .eq('id', convoId)
              .then(() => {});
          }
        }

        // Strip phase/topic tags before saving
        const cleanResponse = stripPhaseTags(fullResponse);

        // Save assistant message
        await admin.from('messages').insert({
          conversation_id: convoId,
          role: 'assistant',
          content: cleanResponse,
        });

        // Check if response contains an extraction
        const extractionMatch = fullResponse.match(/<extraction>([\s\S]*?)<\/extraction>/);
        if (extractionMatch) {
          try {
            const extractedData = JSON.parse(extractionMatch[1].trim());
            await admin.from('extractions').insert({
              conversation_id: convoId,
              extracted_data: extractedData,
            });
            await admin.from('conversations').update({ status: 'extracted' }).eq('id', convoId);

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'extraction', data: extractedData })}\n\n`));
          } catch {
            // Extraction JSON parse failed, continue without it
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: String(err) })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

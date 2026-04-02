import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/db';
import { INTAKE_SYSTEM_PROMPT, GAP_FILL_SYSTEM_PROMPT } from '@/lib/prompts';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { conversationId, message, mode, context, orgId } = await req.json();

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

  // Save user message
  await admin.from('messages').insert({
    conversation_id: convoId,
    role: 'user',
    content: message,
  });

  // Load conversation history
  const { data: history } = await admin
    .from('messages')
    .select('role, content')
    .eq('conversation_id', convoId)
    .order('created_at', { ascending: true });

  const messages = (history || []).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  // Build system prompt
  const systemPrompt = mode === 'gap-fill'
    ? `${GAP_FILL_SYSTEM_PROMPT}\n\n## CONTEXT\n${context?.summary || ''}`
    : `${INTAKE_SYSTEM_PROMPT}\n\n## CONTEXT\n${context?.summary || ''}`;

  // Stream response from Claude
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  // Create a ReadableStream that forwards the Claude stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullResponse = '';

      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', text, conversationId: convoId })}\n\n`));
          }
        }

        // Save assistant message
        await admin.from('messages').insert({
          conversation_id: convoId,
          role: 'assistant',
          content: fullResponse,
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

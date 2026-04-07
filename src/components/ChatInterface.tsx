'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PendingAttachment {
  file: File;
  preview?: string; // data URL for images
}

interface UploadedAttachment {
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'md', 'png', 'jpg', 'jpeg', 'gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface Extraction {
  profile?: {
    name: string;
    mission: string;
    scope: string;
    teamMembers: { name: string; title: string; responsibilities: string }[];
    tools: string[];
    singlePointsOfFailure: string[];
    painPoints: string[];
    tribalKnowledgeRisks: string[];
  };
  priorities?: {
    rank: number;
    name: string;
    whatToAutomate: string;
    currentState: string;
    whyItMatters: string;
    estimatedTimeSavings: string;
    effort: string;
    complexity: string;
    dependencies: string[];
    suggestedApproach: string;
    successCriteria: string;
  }[];
  // gap-fill mode
  priorityId?: string;
  fields?: Record<string, string | string[]>;
}

interface ChatInterfaceProps {
  orgId: string;
  mode: 'intake' | 'gap-fill' | 'new-priorities';
  context?: { summary: string };
  existingConversationId?: string;
  existingMessages?: Message[];
  onExtraction?: (data: Extraction, conversationId: string) => void;
  onPhaseChange?: (phase: number, subProgress: { current: number; total: number }) => void;
  onTopicChange?: (phase: number, subProgress: { current: number; total: number }) => void;
  onFirstAssistantMessage?: () => void;
  greeting?: string;
}

export default function ChatInterface({
  orgId,
  mode,
  context,
  existingConversationId,
  existingMessages,
  onExtraction,
  onPhaseChange,
  onTopicChange,
  onFirstAssistantMessage,
  greeting,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(existingMessages || []);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(existingConversationId);
  const [started, setStarted] = useState(!!existingMessages?.length);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstAssistantFired = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const valid: PendingAttachment[] = [];

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        alert(`Unsupported file type: .${ext}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File too large: ${file.name} (max 10MB)`);
        continue;
      }
      const attachment: PendingAttachment = { file };
      if (file.type.startsWith('image/')) {
        attachment.preview = URL.createObjectURL(file);
      }
      valid.push(attachment);
    }

    setPendingAttachments((prev) => [...prev, ...valid]);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeAttachment(index: number) {
    setPendingAttachments((prev) => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview!);
      updated.splice(index, 1);
      return updated;
    });
  }

  async function uploadAttachments(attachments: PendingAttachment[]): Promise<UploadedAttachment[]> {
    const results: UploadedAttachment[] = [];
    for (const att of attachments) {
      const formData = new FormData();
      formData.append('file', att.file);
      const res = await fetch('/api/upload-attachment', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      results.push(await res.json());
    }
    return results;
  }

  async function sendMessage(userMessage: string) {
    if ((!userMessage.trim() && pendingAttachments.length === 0) || streaming) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);
    setStarted(true);

    // Add placeholder for assistant response
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    // Upload pending attachments
    let uploadedAttachments: UploadedAttachment[] = [];
    const currentAttachments = [...pendingAttachments];
    setPendingAttachments([]);

    try {
      if (currentAttachments.length > 0) {
        setUploading(true);
        uploadedAttachments = await uploadAttachments(currentAttachments);
        setUploading(false);
      }

      // Clean up preview URLs
      for (const att of currentAttachments) {
        if (att.preview) URL.revokeObjectURL(att.preview);
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
          mode,
          context,
          orgId,
          attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'delta') {
                assistantContent += data.text;
                if (data.conversationId && !conversationId) {
                  setConversationId(data.conversationId);
                }
                // Fire first-assistant-message callback once
                if (!firstAssistantFired.current && onFirstAssistantMessage) {
                  firstAssistantFired.current = true;
                  onFirstAssistantMessage();
                }
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                  return updated;
                });
              } else if (data.type === 'extraction') {
                onExtraction?.(data.data, data.conversationId || conversationId || '');
              } else if (data.type === 'phase') {
                onPhaseChange?.(data.phase_number, data.sub_progress);
              } else if (data.type === 'topic') {
                onTopicChange?.(data.phase_number, data.sub_progress);
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Sorry, something went wrong. ${err instanceof Error ? err.message : ''}`,
        };
        return updated;
      });
    }

    setStreaming(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  // Strip extraction tags from displayed content
  function displayContent(content: string) {
    return content
      .replace(/<extraction>[\s\S]*?<\/extraction>/g, '')
      .replace(/<phase>[\s\S]*?<\/phase>/g, '')
      .replace(/<topic>[\s\S]*?<\/topic>/g, '')
      .trim();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {!started && greeting && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {mode === 'intake' ? 'Department X-Ray' : 'Fill Missing Details'}
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">{greeting}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap bg-emerald-600 text-white">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-slate-100 text-slate-900 prose prose-sm prose-slate max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-pre:bg-slate-200 prose-pre:text-slate-800 prose-code:text-emerald-700 prose-code:before:content-none prose-code:after:content-none prose-table:my-2">
                <div className="overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-200 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_td]:border [&_td]:border-slate-300 [&_td]:px-3 [&_td]:py-1.5 [&_td]:text-xs [&_tr:nth-child(even)]:bg-slate-50">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {displayContent(msg.content)}
                  </ReactMarkdown>
                </div>
                {streaming && i === messages.length - 1 && (
                  <span className="inline-block w-1.5 h-4 bg-slate-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 px-4 py-3 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Pending attachments preview */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {pendingAttachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                >
                  {att.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={att.preview} alt={att.file.name} className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="max-w-[120px] truncate">{att.file.name}</span>
                  <button
                    onClick={() => removeAttachment(i)}
                    className="ml-0.5 text-slate-400 hover:text-slate-600"
                    aria-label={`Remove ${att.file.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading files...
            </div>
          )}

          <div className="flex gap-2 items-end">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.csv,.txt,.md,.png,.jpg,.jpeg,.gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Paperclip button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={streaming || uploading}
              className="p-2.5 rounded-xl border border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 disabled:opacity-40 transition-colors"
              title="Attach files"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={started ? 'Type your response...' : 'Type a message to start...'}
              className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={1}
              disabled={streaming}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={(!input.trim() && pendingAttachments.length === 0) || streaming}
              className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
  mode: 'intake' | 'gap-fill';
  context?: { summary: string };
  existingConversationId?: string;
  existingMessages?: Message[];
  onExtraction?: (data: Extraction, conversationId: string) => void;
  greeting?: string;
}

export default function ChatInterface({
  orgId,
  mode,
  context,
  existingConversationId,
  existingMessages,
  onExtraction,
  greeting,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(existingMessages || []);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(existingConversationId);
  const [started, setStarted] = useState(!!existingMessages?.length);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  async function sendMessage(userMessage: string) {
    if (!userMessage.trim() || streaming) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);
    setStarted(true);

    // Add placeholder for assistant response
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
          mode,
          context,
          orgId,
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
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                  return updated;
                });
              } else if (data.type === 'extraction') {
                onExtraction?.(data.data, data.conversationId || conversationId || '');
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
    return content.replace(/<extraction>[\s\S]*?<\/extraction>/g, '').trim();
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
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              {msg.role === 'assistant' ? (
                <>
                  {displayContent(msg.content)}
                  {streaming && i === messages.length - 1 && (
                    <span className="inline-block w-1.5 h-4 bg-slate-400 animate-pulse ml-0.5 align-middle" />
                  )}
                </>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 px-4 py-3 bg-white">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
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
            disabled={!input.trim() || streaming}
            className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

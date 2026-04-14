'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import OverwriteDialog from '@/components/OverwriteDialog';
import { buildFileImportContext } from '@/lib/prompts';
import { createClient } from '@/lib/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FileImportIntakeProps {
  orgId: string;
  orgSlug: string;
}

interface UploadedAttachment {
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface ExistingDept {
  name: string;
  priorityCount: number;
}

type Phase = 'drop-zone' | 'uploading' | 'chat' | 'complete';

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'md'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FileImportIntake({ orgId, orgSlug }: FileImportIntakeProps) {
  const router = useRouter();

  // Phase state machine
  const [phase, setPhase] = useState<Phase>('drop-zone');

  // Drop zone state
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [textNote, setTextNote] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Upload / first-message state
  const [uploadProgress, setUploadProgress] = useState('');

  // Chat state (after server-side first message)
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [existingMessages, setExistingMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[] | undefined
  >(undefined);
  const [contextSummary, setContextSummary] = useState('');

  // Extraction / save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedDeptName, setSavedDeptName] = useState<string | null>(null);
  const [savedPriorityCount, setSavedPriorityCount] = useState(0);
  const [overwriteDialog, setOverwriteDialog] = useState<{
    departmentName: string;
    existingDeptId: string;
    extractedData: Record<string, unknown>;
    conversationId: string;
  } | null>(null);
  const [renameDialog, setRenameDialog] = useState<{
    extractedData: Record<string, unknown>;
    conversationId: string;
    originalName: string;
  } | null>(null);

  /* ---------------------------------------------------------------- */
  /*  File validation                                                  */
  /* ---------------------------------------------------------------- */

  function validateFiles(files: FileList | File[]): File[] {
    const valid: File[] = [];
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(`${file.name}: unsupported file type`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: exceeds 10MB limit`);
        continue;
      }
      valid.push(file);
    }

    if (errors.length > 0) {
      setFileError(errors.join('; '));
    } else {
      setFileError(null);
    }

    return valid;
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const valid = validateFiles(e.target.files);
      setStagedFiles((prev) => [...prev, ...valid]);
    }
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const valid = validateFiles(e.dataTransfer.files);
      setStagedFiles((prev) => [...prev, ...valid]);
    }
  }

  function removeFile(index: number) {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  /* ---------------------------------------------------------------- */
  /*  Server-side first message                                        */
  /* ---------------------------------------------------------------- */

  async function handleImport() {
    if (stagedFiles.length === 0) return;

    setPhase('uploading');
    setUploadProgress('Loading organization data...');

    try {
      // 1. Load org data + existing departments for context
      const supabase = createClient();
      const [orgRes, deptRes] = await Promise.all([
        supabase.from('organizations').select('name').eq('id', orgId).single(),
        supabase
          .from('departments')
          .select('name, priorities(count)')
          .eq('org_id', orgId),
      ]);

      const orgName = orgRes.data?.name || 'Organization';
      const existingDepts: ExistingDept[] = (deptRes.data || []).map(
        (d: { name: string; priorities: { count: number }[] }) => ({
          name: d.name,
          priorityCount: d.priorities?.[0]?.count ?? 0,
        }),
      );

      const ctxSummary = buildFileImportContext(orgName, existingDepts);
      setContextSummary(ctxSummary);

      // 2. Upload files to storage
      setUploadProgress(`Uploading ${stagedFiles.length} file(s)...`);
      const uploadedAttachments: UploadedAttachment[] = [];

      for (const file of stagedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload-attachment', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Failed to upload ${file.name}`);
        }
        uploadedAttachments.push(await res.json());
      }

      // 3. Send first message to /api/chat (server-side)
      setUploadProgress('Analyzing files...');

      const fileNames = stagedFiles.map((f) => f.name).join(', ');
      const userMessage = textNote.trim()
        ? `${textNote.trim()}\n\nI've uploaded ${stagedFiles.length} file(s) for you to analyze: ${fileNames}`
        : `I've uploaded ${stagedFiles.length} file(s) for you to analyze: ${fileNames}`;

      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          mode: 'file-import',
          context: { summary: ctxSummary },
          orgId,
          attachments: uploadedAttachments,
        }),
      });

      if (!chatRes.ok) {
        throw new Error(`Chat failed: ${chatRes.status}`);
      }

      // 4. Read the SSE stream to get conversationId + first assistant response
      const reader = chatRes.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let newConvoId = '';
      let firstResponseExtraction: { data: Record<string, unknown>; conversationId: string } | null = null;

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
                if (data.conversationId) {
                  newConvoId = data.conversationId;
                }
              } else if (data.type === 'extraction') {
                // Claude extracted in the first response — queue it for processing
                firstResponseExtraction = {
                  data: data.data,
                  conversationId: data.conversationId || newConvoId,
                };
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }

      if (!newConvoId) {
        throw new Error('No conversation ID returned from chat');
      }

      // 5. If extraction arrived in the first response, process it immediately
      if (firstResponseExtraction) {
        setConversationId(newConvoId);
        await handleExtraction(
          firstResponseExtraction.data,
          firstResponseExtraction.conversationId || newConvoId,
        );
        return; // handleExtraction will transition to 'complete' phase or show overwrite dialog
      }

      // 6. Otherwise transition to chat phase for continued conversation
      setConversationId(newConvoId);
      setExistingMessages([
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantContent },
      ]);
      setPhase('chat');
    } catch (err) {
      console.error('File import failed:', err);
      setFileError(err instanceof Error ? err.message : 'Import failed. Please try again.');
      setPhase('drop-zone');
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Extraction handling                                              */
  /* ---------------------------------------------------------------- */

  const callComplete = useCallback(
    async (
      payload: Record<string, unknown>,
    ): Promise<{ success?: boolean; exists?: boolean; departmentId?: string; error?: string }> => {
      const res = await fetch('/api/intake/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    [],
  );

  const saveExtraction = useCallback(
    async (
      extractedData: Record<string, unknown>,
      convId: string,
      mode: 'create' | 'overwrite' | 'append',
      departmentId?: string,
    ) => {
      setSaving(true);
      setSaveError(null);
      try {
        const deptName =
          (extractedData.profile as Record<string, unknown> | undefined)?.name as string | undefined;

        const payload: Record<string, unknown> = {
          orgId,
          extractedData,
          conversationId: convId,
          departmentName: deptName ?? 'Unknown',
          mode,
        };

        if (mode === 'append' && departmentId) {
          payload.departmentId = departmentId;
        }

        const result = await callComplete(payload);

        if (result.success) {
          const priorities = (extractedData.priorities as unknown[]) || [];
          setSavedDeptName(deptName || 'Department');
          setSavedPriorityCount(priorities.length);
          setPhase('complete');
        } else {
          setSaveError(result.error ?? 'Unknown error while saving.');
        }
      } catch (err) {
        setSaveError(String(err));
      } finally {
        setSaving(false);
      }
    },
    [callComplete, orgId],
  );

  const handleExtraction = useCallback(
    async (data: unknown, convId: string) => {
      const extractedData = data as Record<string, unknown>;
      const deptName =
        (extractedData.profile as Record<string, unknown> | undefined)?.name as string | undefined;
      const hasProfile = !!extractedData.profile;

      if (!deptName && !hasProfile) {
        // Priorities-only extraction with no profile — this shouldn't happen for create,
        // but handle gracefully
        await saveExtraction(extractedData, convId, 'create');
        return;
      }

      if (deptName) {
        // Check if department already exists
        try {
          const check = await callComplete({
            orgId,
            departmentName: deptName,
          });

          if (check.exists) {
            setOverwriteDialog({
              departmentName: deptName,
              existingDeptId: check.departmentId || '',
              extractedData,
              conversationId: convId,
            });
          } else {
            await saveExtraction(extractedData, convId, 'create');
          }
        } catch (err) {
          setSaveError(String(err));
        }
      } else {
        await saveExtraction(extractedData, convId, 'create');
      }
    },
    [callComplete, orgId, saveExtraction],
  );

  const checkDeptExists = useCallback(
    async (name: string): Promise<boolean> => {
      const result = await callComplete({ orgId, departmentName: name });
      return !!result.exists;
    },
    [callComplete, orgId],
  );

  /* ---------------------------------------------------------------- */
  /*  Render: drop zone                                                */
  /* ---------------------------------------------------------------- */

  if (phase === 'drop-zone') {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] p-6">
        <div className="max-w-lg w-full">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Import Files</h2>
          <p className="text-sm text-slate-500 mb-5">
            Upload documents and X-Ray will analyze them to create department profiles and automation priorities.
          </p>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragOver
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-import-input')?.click()}
          >
            <svg
              className="w-10 h-10 mx-auto mb-3 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-slate-400">
              PDF, DOCX, XLSX, CSV, TXT, MD — up to 10MB each
            </p>
            <input
              id="file-import-input"
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.csv,.txt,.md"
              className="hidden"
              onChange={handleFilePick}
            />
          </div>

          {/* Staged files */}
          {stagedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {stagedFiles.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                    <span className="text-xs text-slate-400 shrink-0">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text note */}
          <div className="mt-4">
            <textarea
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder="Optional: add context about these files (e.g., 'These are notes from our Operations meeting')"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
              rows={2}
            />
          </div>

          {/* Error */}
          {fileError && (
            <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{fileError}</p>
            </div>
          )}

          {/* Import button */}
          <button
            onClick={handleImport}
            disabled={stagedFiles.length === 0}
            className="mt-5 w-full px-5 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Import {stagedFiles.length > 0 ? `${stagedFiles.length} File${stagedFiles.length > 1 ? 's' : ''}` : 'Files'}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: uploading / analyzing                                    */
  /* ---------------------------------------------------------------- */

  if (phase === 'uploading') {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium">{uploadProgress}</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: completion                                               */
  /* ---------------------------------------------------------------- */

  if (phase === 'complete') {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="max-w-md w-full mx-auto text-center px-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-2">Import Complete</h2>
          <p className="text-sm text-slate-500 mb-6">
            {savedDeptName} — {savedPriorityCount} priorit{savedPriorityCount === 1 ? 'y' : 'ies'} imported successfully.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setPhase('drop-zone');
                setStagedFiles([]);
                setTextNote('');
                setConversationId(undefined);
                setExistingMessages(undefined);
                setSavedDeptName(null);
                setSavedPriorityCount(0);
                setSaveError(null);
              }}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Import Another
            </button>
            <button
              onClick={() => router.push(`/org/${orgSlug}/dashboard`)}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: chat phase                                               */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col h-full">
      {/* Saving indicator */}
      {saving && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100 text-blue-700">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Saving imported data...</span>
        </div>
      )}

      {/* Error banner */}
      {saveError && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100 text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Save failed: {saveError}</span>
          </div>
          <button
            onClick={() => setSaveError(null)}
            className="text-sm font-medium text-red-800 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat interface — resumes from server-side first message */}
      <div className="flex-1 min-h-0">
        <ChatInterface
          orgId={orgId}
          mode="file-import"
          context={{ summary: contextSummary }}
          existingConversationId={conversationId}
          existingMessages={existingMessages}
          onExtraction={handleExtraction}
          greeting="Analyzing your uploaded files..."
        />
      </div>

      {/* Overwrite / append / rename dialog */}
      {overwriteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Department Already Exists
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              A department named &ldquo;{overwriteDialog.departmentName}&rdquo; already exists.
              What would you like to do?
            </p>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  const dialog = overwriteDialog;
                  setOverwriteDialog(null);
                  await saveExtraction(dialog.extractedData, dialog.conversationId, 'append', dialog.existingDeptId);
                }}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <span className="font-semibold">Add Priorities Only</span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Append new priorities to the existing department
                </span>
              </button>

              <button
                onClick={async () => {
                  const dialog = overwriteDialog;
                  setOverwriteDialog(null);
                  await saveExtraction(dialog.extractedData, dialog.conversationId, 'overwrite');
                }}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <span className="font-semibold">Replace Existing Data</span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Overwrite the department profile and priorities
                </span>
              </button>

              <button
                onClick={() => {
                  // Fall through to OverwriteDialog for rename flow
                  const dialog = overwriteDialog;
                  setOverwriteDialog(null);
                  // Create as new with a different name — show rename dialog
                  setRenameDialog({
                    extractedData: dialog.extractedData,
                    conversationId: dialog.conversationId,
                    originalName: dialog.departmentName,
                  });
                }}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <span className="font-semibold">Create as New Department</span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Save with a different department name
                </span>
              </button>

              <button
                onClick={() => setOverwriteDialog(null)}
                className="w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename dialog (reuses OverwriteDialog for name validation) */}
      {renameDialog && (
        <OverwriteDialog
          departmentName={renameDialog.originalName}
          checkExists={checkDeptExists}
          onOverwrite={async () => {
            // Shouldn't happen from rename flow, but handle gracefully
            const dialog = renameDialog;
            setRenameDialog(null);
            await saveExtraction(dialog.extractedData, dialog.conversationId, 'create');
          }}
          onRename={async (newName: string) => {
            const dialog = renameDialog;
            setRenameDialog(null);
            const patched = { ...dialog.extractedData };
            if (patched.profile && typeof patched.profile === 'object') {
              patched.profile = { ...(patched.profile as Record<string, unknown>), name: newName };
            }
            await saveExtraction(patched, dialog.conversationId, 'create');
          }}
          onCancel={() => setRenameDialog(null)}
        />
      )}
    </div>
  );
}

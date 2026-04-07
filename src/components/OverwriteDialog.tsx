'use client';

import { useState } from 'react';

interface OverwriteDialogProps {
  departmentName: string;
  onOverwrite: () => void;
  onRename: (newName: string) => void;
  onCancel: () => void;
  /** If provided, called to check whether a name already exists. */
  checkExists?: (name: string) => Promise<boolean>;
}

export default function OverwriteDialog({
  departmentName,
  onOverwrite,
  onRename,
  onCancel,
  checkExists,
}: OverwriteDialogProps) {
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleRenameConfirm() {
    const trimmed = newName.trim();
    if (!trimmed) {
      setRenameError('Department name cannot be empty.');
      return;
    }

    if (checkExists) {
      setChecking(true);
      setRenameError(null);
      try {
        const exists = await checkExists(trimmed);
        if (exists) {
          setRenameError(`A department named "${trimmed}" also exists. Choose a different name.`);
          setChecking(false);
          return;
        }
      } catch {
        setRenameError('Failed to verify name. Please try again.');
        setChecking(false);
        return;
      }
      setChecking(false);
    }

    onRename(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Department already exists
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          A department named &ldquo;{departmentName}&rdquo; already exists in this
          organization. How would you like to proceed?
        </p>

        {!showRename ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={onOverwrite}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Overwrite existing data
            </button>
            <button
              onClick={() => setShowRename(true)}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Save with a different name
            </button>
            <button
              onClick={onCancel}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700">
              New department name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setRenameError(null);
              }}
              placeholder="e.g. Accounting (West)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !checking) handleRenameConfirm();
              }}
            />
            {renameError && (
              <p className="text-xs text-red-600">{renameError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleRenameConfirm}
                disabled={checking}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {checking ? 'Checking...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowRename(false);
                  setNewName('');
                  setRenameError(null);
                }}
                className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

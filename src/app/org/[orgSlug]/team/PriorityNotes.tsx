'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Props {
  priorityId: string;
}

export default function PriorityNotes({ priorityId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [priorityId]);

  async function fetchNotes() {
    setLoading(true);
    const res = await fetch(`/api/priorities/${priorityId}/notes`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes);
    }
    setLoading(false);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/priorities/${priorityId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    });

    if (res.ok) {
      const data = await res.json();
      setNotes((prev) => [data.note, ...prev]);
      setContent('');
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <p className="text-xs font-semibold text-slate-600 mb-2">Notes</p>

      <form onSubmit={addNote} className="flex gap-2 mb-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 disabled:opacity-40"
        >
          {submitting ? '...' : 'Add'}
        </button>
      </form>

      {loading ? (
        <p className="text-xs text-slate-400">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-xs text-slate-400">No notes yet.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="text-xs bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-slate-700">{note.content}</p>
              <p className="text-slate-400 mt-1">
                {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

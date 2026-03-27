'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Department {
  slug: string;
  name: string;
}

interface UploadFormProps {
  departments: Department[];
}

export default function UploadForm({ departments }: UploadFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState<'profile' | 'priorities'>('profile');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [department, setDepartment] = useState<string>('');
  const [newDeptName, setNewDeptName] = useState('');
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const deptParam = searchParams.get('dept');
    if (typeParam === 'priorities' || typeParam === 'profile') {
      setFileType(typeParam);
    }
    if (deptParam && departments.some((d) => d.slug === deptParam)) {
      setDepartment(deptParam);
    }
  }, [searchParams, departments]);

  function detectDepartmentFromFilename(filename: string): string | null {
    // Strip extension
    const base = filename.replace(/\.md$/i, '');
    // Remove common suffixes
    const cleaned = base
      .replace(/[_-]?(department[_-]?profile|automation[_-]?priorities|doc|v\d+)/gi, '')
      .replace(/[_-]+/g, ' ')
      .trim();
    return cleaned.length > 2 ? cleaned : null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFileError(null);
    setError(null);

    if (file && !file.name.endsWith('.md')) {
      setFileError('This file must be in .md format. Use an LLM like Claude to convert your document to markdown first.');
      setSelectedFile(null);
      setDetectedName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);

    if (file) {
      const detected = detectDepartmentFromFilename(file.name);
      setDetectedName(detected);
      if (detected) {
        // Try to match to existing department
        const match = departments.find(
          (d) => d.name.toLowerCase() === detected.toLowerCase()
        );
        if (match) {
          setDepartment(match.slug);
        } else {
          setDepartment('__new__');
          setNewDeptName(detected);
        }
      } else {
        setDepartment('');
      }
    } else {
      setDetectedName(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || (!department && !newDeptName)) return;

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileType', fileType);
    formData.append('slug', department);
    if (department === '__new__') {
      formData.append('newDepartmentName', newDeptName);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        setSubmitting(false);
        return;
      }

      router.push(`/department/${data.slug}`);
    } catch {
      setError('Upload failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File type toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          File Type
        </label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => setFileType('profile')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              fileType === 'profile'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Department Profile
          </button>
          <button
            type="button"
            onClick={() => setFileType('priorities')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              fileType === 'priorities'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Automation Priorities
          </button>
        </div>
      </div>

      {/* File input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Markdown File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />
        {fileError && (
          <p className="mt-2 text-sm text-red-600">{fileError}</p>
        )}
        {detectedName && !fileError && (
          <p className="mt-2 text-sm text-slate-500">
            Detected department: <span className="font-medium text-slate-700">{detectedName}</span>
          </p>
        )}
      </div>

      {/* Department selector -- only shown if detection failed or user wants to change */}
      {selectedFile && !fileError && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              if (e.target.value !== '__new__') setNewDeptName('');
            }}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Select department...</option>
            {departments.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
            <option value="__new__">+ New Department</option>
          </select>

          {department === '__new__' && (
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Department name"
              className="mt-2 w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
            />
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!selectedFile || fileError !== null || (!department && !newDeptName) || submitting}
        className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

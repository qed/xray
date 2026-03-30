'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Department {
  slug: string;
  name: string;
}

interface UploadFormProps {
  departments: Department[];
  orgId?: string;
  orgSlug?: string;
}

interface ProfileSummary {
  type: 'profile';
  departmentName: string;
  fields: {
    mission: boolean;
    scope: boolean;
    teamMembers: number;
    tools: number;
    singlePointsOfFailure: number;
    painPoints: number;
    tribalKnowledgeRisks: number;
  };
}

interface PrioritySummaryItem {
  rank: number;
  name: string;
  missingFields: string[];
  filledCount: number;
  totalFields: number;
}

interface PrioritiesSummary {
  type: 'priorities';
  totalPriorities: number;
  priorities: PrioritySummaryItem[];
  totalMissingFields: number;
}

type UploadSummary = ProfileSummary | PrioritiesSummary;

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  whatToAutomate: 'What to Automate',
  currentState: 'Current State',
  whyItMatters: 'Why It Matters',
  estimatedTimeSavings: 'Est. Time Savings',
  complexity: 'Complexity',
  suggestedApproach: 'Suggested Approach',
  successCriteria: 'Success Criteria',
  dependencies: 'Dependencies',
};

export default function UploadForm({ departments, orgId, orgSlug }: UploadFormProps) {
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
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [uploadedSlug, setUploadedSlug] = useState<string | null>(null);

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
    const base = filename.replace(/\.md$/i, '');
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
    setSummary(null);
    setUploadedSlug(null);

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
    setSummary(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileType', fileType);
    formData.append('slug', department);
    if (department === '__new__') {
      formData.append('newDepartmentName', newDeptName);
    }
    if (orgId) {
      formData.append('orgId', orgId);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        setSubmitting(false);
        return;
      }

      setSummary(data.summary);
      setUploadedSlug(data.slug);
      setSubmitting(false);
    } catch {
      setError('Upload failed. Please try again.');
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSummary(null);
    setUploadedSlug(null);
    setSelectedFile(null);
    setDetectedName(null);
    setDepartment('');
    setNewDeptName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Show summary after successful upload
  if (summary && uploadedSlug) {
    const deptUrl = orgSlug ? `/org/${orgSlug}/department/${uploadedSlug}` : `/department/${uploadedSlug}`;
    const unfiledUrl = orgSlug ? `/org/${orgSlug}/unfiled` : '/unfiled';

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 text-xl">&#10003;</span>
          <h3 className="text-lg font-bold text-slate-900">Upload Complete</h3>
        </div>

        {summary.type === 'profile' ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Department profile for <span className="font-semibold">{summary.departmentName}</span> has been updated.
            </p>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Extraction Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <FieldStatus label="Mission" found={summary.fields.mission} />
                <FieldStatus label="Scope" found={summary.fields.scope} />
                <FieldStatus label="Team Members" count={summary.fields.teamMembers} />
                <FieldStatus label="Tools" count={summary.fields.tools} />
                <FieldStatus label="Single Points of Failure" count={summary.fields.singlePointsOfFailure} />
                <FieldStatus label="Pain Points" count={summary.fields.painPoints} />
                <FieldStatus label="Tribal Knowledge Risks" count={summary.fields.tribalKnowledgeRisks} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Parsed <span className="font-semibold">{summary.totalPriorities} priorities</span>.
              {summary.totalMissingFields > 0
                ? ` ${summary.totalMissingFields} missing field${summary.totalMissingFields !== 1 ? 's' : ''} across all priorities.`
                : ' All fields complete!'}
            </p>
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
              {summary.priorities.map((p) => (
                <div key={p.rank} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                        {p.rank}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{p.name}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      p.missingFields.length === 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.filledCount}/{p.totalFields}
                    </span>
                  </div>
                  {p.missingFields.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                      {p.missingFields.map((field) => (
                        <span key={field} className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                          {FIELD_LABELS[field] ?? field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            href={deptUrl}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            View Department
          </Link>
          {summary.type === 'priorities' && summary.totalMissingFields > 0 && (
            <Link
              href={unfiledUrl}
              className="px-5 py-2 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-700 text-sm font-medium hover:bg-yellow-100 transition-colors"
            >
              Fill Missing Gaps ({summary.totalMissingFields})
            </Link>
          )}
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
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

      {/* Department selector */}
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

function FieldStatus({ label, found, count }: { label: string; found?: boolean; count?: number }) {
  if (count !== undefined) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-slate-600">{label}</span>
        <span className={`text-xs font-medium ${count > 0 ? 'text-emerald-600' : 'text-yellow-600'}`}>
          {count > 0 ? count : 'None found'}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`text-xs font-medium ${found ? 'text-emerald-600' : 'text-yellow-600'}`}>
        {found ? 'Found' : 'Missing'}
      </span>
    </div>
  );
}

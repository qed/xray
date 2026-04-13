'use client';

import { useState, useEffect, useCallback } from 'react';
import IntakeSidebar, { type IntakeFeature } from './IntakeSidebar';
import UpdateMissingData from './UpdateMissingData';
import XRayInterview from './XRayInterview';
import AddNewPriorities from './AddNewPriorities';
import FileImportIntake from './FileImportIntake';

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface IntakePageClientProps {
  departments: Department[];
  orgSlug: string;
  orgId: string;
}

const FEATURE_LABELS: Record<IntakeFeature, string> = {
  xray: 'Initial Department X-Ray',
  missing: 'Update Missing Data',
  'new-priorities': 'Add New AI Priorities',
  'file-import': 'Import Files',
};

export default function IntakePageClient({ departments, orgSlug, orgId }: IntakePageClientProps) {
  const featureKey = `intake_feature_${orgId}`;
  const [activeFeature, setActiveFeature] = useState<IntakeFeature | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Restore active feature from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(featureKey);
    if (stored === 'xray' || stored === 'missing' || stored === 'new-priorities' || stored === 'file-import') {
      setActiveFeature(stored);
    }
  }, [featureKey]);

  // Persist active feature to localStorage on change
  const handleFeatureSelect = useCallback((feature: IntakeFeature) => {
    setActiveFeature(feature);
    localStorage.setItem(featureKey, feature);
  }, [featureKey]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  const handleDepartmentChange = useCallback((deptId: string | null) => {
    setSelectedDeptId(deptId);
  }, []);

  const handleDepartmentSwitch = useCallback((outgoingDeptId: string, incomingDeptId: string) => {
    // Future: save in-progress interview state for outgoing department
    console.log(`Department switch: ${outgoingDeptId} -> ${incomingDeptId}`);
  }, []);

  const handleNewDepartment = useCallback(() => {
    // Future: open new department creation flow
    handleFeatureSelect('xray');
  }, [handleFeatureSelect]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)] -mx-4 -my-8">
      <IntakeSidebar
        departments={departments}
        orgSlug={orgSlug}
        orgId={orgId}
        activeFeature={activeFeature}
        onFeatureSelect={handleFeatureSelect}
        onDepartmentChange={handleDepartmentChange}
        onDepartmentSwitch={handleDepartmentSwitch}
        onNewDepartment={handleNewDepartment}
      />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeFeature === 'xray' ? (
          /* X-Ray interview takes over the full content area */
          <XRayInterview
            departmentId={selectedDeptId}
            orgId={orgId}
            orgSlug={orgSlug}
          />
        ) : activeFeature === 'file-import' ? (
          /* File import takes over the full content area — no department required */
          <FileImportIntake
            orgId={orgId}
            orgSlug={orgSlug}
          />
        ) : activeFeature === 'new-priorities' && selectedDept ? (
          /* Add New Priorities chat takes over the full content area */
          <AddNewPriorities
            departmentId={selectedDept.id}
            orgId={orgId}
            orgSlug={orgSlug}
          />
        ) : (
        <div className="p-6 flex-1 overflow-y-auto">
          {activeFeature && selectedDept ? (
            <div>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">
                  {FEATURE_LABELS[activeFeature]}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Department: {selectedDept.name}
                </p>
              </div>

              {activeFeature === 'missing' ? (
                <UpdateMissingData
                  departmentId={selectedDept.id}
                  orgSlug={orgSlug}
                  orgId={orgId}
                  onSwitchFeature={(feature) => handleFeatureSelect(feature as IntakeFeature)}
                />
              ) : (
                /* Placeholder content area — will be replaced by remaining units */
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {FEATURE_LABELS[activeFeature]} content will appear here.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    This area will be populated in upcoming units.
                  </p>
                </div>
              )}
            </div>
          ) : activeFeature && !selectedDept ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
              <p className="text-sm font-medium text-slate-600">
                Select a department to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Welcome to Intake</h2>
              <p className="text-sm text-slate-500 max-w-sm">
                {departments.length > 0
                  ? 'Select a department and choose a feature from the sidebar to begin.'
                  : 'Start by creating your first department X-Ray.'}
              </p>
            </div>
          )}
        </div>
        )}
        </div>
    </div>
  );
}

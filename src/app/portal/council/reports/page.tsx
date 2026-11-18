'use client';

import React from 'react';
import { FileBarChart2 } from 'lucide-react';
import CouncilPlaceholderModule from '@/components/council/CouncilPlaceholderModule';

export default function ReportsPlaceholderPage() {
  return (
    <CouncilPlaceholderModule
      title="Reports & Institutional Monitoring"
      badge="Council Oversight • Executive Analytics"
      description="Aggregated governance analytics, attendance trend ledgers, assessment score distributions, fee collection velocity, and immutable administrative audit logs."
      icon={FileBarChart2}
      governanceFocus="Council members can inspect multi-week absenteeism patterns, evaluate term-over-term academic progress, monitor financial dues recovery, and audit every database mutation."
      plannedFeatures={[
        'Longitudinal Attendance Analytics with class absenteeism alerts',
        'Academic Grade Distribution and FLN literacy milestone reports',
        'Financial Collection Velocity and dues aging analysis',
        'Admission Funnel Conversion metrics across academic sessions',
        'Comprehensive, filterable Audit Trail (Actor, Action, Diff, Timestamp)',
      ]}
    />
  );
}

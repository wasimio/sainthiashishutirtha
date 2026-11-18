'use client';

import React from 'react';
import { Users } from 'lucide-react';
import CouncilPlaceholderModule from '@/components/council/CouncilPlaceholderModule';

export default function StudentsAdmissionsPlaceholderPage() {
  return (
    <CouncilPlaceholderModule
      title="Students & Admissions Management"
      badge="Council Oversight • Enrollment & Registrars"
      description="Centralized student information system and prospective applicant tracking from initial digital submission to physical document verification and final enrollment."
      icon={Users}
      governanceFocus="Council members can inspect grade-wise seat utilization, review applicant conversion rates, monitor student retention, and approve section capacity threshold changes."
      plannedFeatures={[
        'Full Student Roster with Scholar IDs and emergency contact linkages',
        'Interactive Admissions Pipeline with stage-by-stage Kanban board',
        'Physical Document Verification checklist and birth certificate records',
        'One-click enrollment conversion and Scholar ID generation',
        'Transfer Certificate (TC) issuance and student withdrawal archiving',
      ]}
    />
  );
}

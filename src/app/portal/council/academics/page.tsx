'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import CouncilPlaceholderModule from '@/components/council/CouncilPlaceholderModule';

export default function AcademicsPlaceholderPage() {
  return (
    <CouncilPlaceholderModule
      title="Academic Architecture & Curriculum"
      badge="Council Oversight • Academic Wings"
      description="Foundational and primary learning governance spanning Pre-Primary, Kindergarten, and Classes I through IV, aligned with Foundational Literacy and Numeracy (FLN) frameworks."
      icon={GraduationCap}
      governanceFocus="Council members can inspect subject distribution, weekly timetables, prescribed textbook lists, term assessment schedules, and syllabus completion velocity across all grades."
      plannedFeatures={[
        'Class and Section architecture manager (Nursery to Class IV)',
        'Subject syllabus breakdown and weekly instructional hour allocations',
        'Prescribed booklist highlights and learning kit registers',
        'Assessment term calendar with moderation milestones',
        'Class teacher and subject educator matrix allocation view',
      ]}
    />
  );
}

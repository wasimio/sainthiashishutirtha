'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import CouncilPlaceholderModule from '@/components/council/CouncilPlaceholderModule';

export default function WebsiteManagementPlaceholderPage() {
  return (
    <CouncilPlaceholderModule
      title="Website Management & CMS"
      badge="Council Oversight • Public Comms & Notices"
      description="Content management desk for the public Shishutirtha website, covering official circulars, upcoming calendar events, campus photo galleries, and news bulletins."
      icon={Globe}
      governanceFocus="Council members can review and approve official notices before publication, schedule institutional announcements, manage photo gallery releases, and ensure brand integrity."
      plannedFeatures={[
        'Notice & Circular editor with categorization and PDF attachments',
        'Headmaster & Council editorial review and approval workflow',
        'Campus photo gallery uploader with category tagging',
        'Academic calendar and annual holiday planner publisher',
        'Public admission enquiry banner status and text editor',
      ]}
    />
  );
}

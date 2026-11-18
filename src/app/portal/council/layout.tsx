import React from 'react';
import { requireAdmin } from '@/lib/auth/authorization';
import CouncilPortalShell from '@/components/council/CouncilPortalShell';

export const instant = false;

export default async function CouncilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Council portal requires admin role oversight
  const { user, profile } = await requireAdmin();

  return (
    <CouncilPortalShell user={user} profile={profile}>
      {children}
    </CouncilPortalShell>
  );
}

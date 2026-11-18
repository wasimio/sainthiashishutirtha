import React from 'react';
import { requireParent } from '@/lib/auth/authorization';
import ParentPortalShell from '@/components/portal/parent/ParentPortalShell';

export const instant = false;

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication and parent role authorization
  const { user, profile } = await requireParent();

  return (
    <ParentPortalShell user={user} profile={profile}>
      {children}
    </ParentPortalShell>
  );
}

import React from 'react';
import { requireStaff } from '@/lib/auth/authorization';
import StaffPortalShell from '@/components/portal/staff/StaffPortalShell';

export const instant = false;

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication and staff role authorization
  const { user, profile } = await requireStaff();

  return (
    <StaffPortalShell user={user} profile={profile}>
      {children}
    </StaffPortalShell>
  );
}

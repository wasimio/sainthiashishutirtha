import React from 'react';
import { requireAdmin } from '@/lib/auth/authorization';
import AdminPortalShell from '@/components/portal/admin/AdminPortalShell';

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication and role authorization
  const { user, profile } = await requireAdmin();

  return (
    <AdminPortalShell user={user} profile={profile}>
      {children}
    </AdminPortalShell>
  );
}

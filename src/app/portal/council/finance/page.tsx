'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import CouncilPlaceholderModule from '@/components/council/CouncilPlaceholderModule';

export default function FinancePlaceholderPage() {
  return (
    <CouncilPlaceholderModule
      title="Finance & Accounts Oversight"
      badge="Council Oversight • Institutional Accounts"
      description="Fiscal management and accounts ledger tracking tuition dues, offline cash and UPI receipts, development fund allocations, and approved parent concessions."
      icon={CreditCard}
      governanceFocus="Council members can inspect collection velocity, evaluate outstanding defaulter aging summaries, review approved sibling/merit fee concessions, and export financial audit logs."
      plannedFeatures={[
        'Fee Head and Structure scheduler (Tuition, Development, Exam)',
        'Quarterly invoicing engine and student balance ledgers',
        'Offline Point-of-Sale (POS) counter for Cash, UPI, and Bank deposits',
        'Sequential printed receipt generation (e.g. ST-REC-2026-XXXX)',
        'Approved fee concession and scholarship ledger with verification audit',
      ]}
    />
  );
}

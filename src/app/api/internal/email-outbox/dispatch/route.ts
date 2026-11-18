import { NextRequest, NextResponse } from 'next/server';
import { dispatchAdmissionEmailOutbox } from '@/lib/services/admissionEmailOutbox';

export async function POST(request: NextRequest) {
  const secret = process.env.EMAIL_OUTBOX_DISPATCH_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const results = await dispatchAdmissionEmailOutbox();
  return NextResponse.json({ processed: results.length, results });
}

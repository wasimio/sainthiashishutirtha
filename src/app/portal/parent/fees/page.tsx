'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Receipt,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { PARENT_FEE_INVOICES, ParentFeeInvoice } from '@/data/portalParentData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function ParentFeesPage() {
  const { selectedChild } = useParent();
  const [selectedInvoice, setSelectedInvoice] = useState<ParentFeeInvoice | null>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const childInvoices = PARENT_FEE_INVOICES.filter((i) => i.childId === selectedChild.id);
  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');

  const handleSimulatePayment = () => {
    setIsPayOpen(false);
    setToastMessage('Payment gateway simulated successfully. Receipt generated (Demo simulation).');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              {selectedChild.name}
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Scholar ID: {selectedChild.scholarId}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Fee Invoices & Payment Receipts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Itemized quarterly tuition fees, activity charges, official tax receipts, and payment history.
          </p>
        </div>

        {selectedChild.pendingFeeAmount > 0 ? (
          <Button
            variant="dark"
            size="sm"
            onClick={() => setIsPayOpen(true)}
            className="text-xs h-8 gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay Due Fees ({formatCurrency(selectedChild.pendingFeeAmount)})</span>
          </Button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fees Completely Cleared</span>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Demo Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <span className="font-semibold text-zinc-950 block">Bank Reconciliation & Security</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            School fee payments are reconciled directly with the school&apos;s scheduled bank account in Sainthia. Official signed receipts are generated immediately.
          </p>
        </div>
      </div>

      {/* Balance Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Current Account Status</span>
            <div className="text-xl font-bold text-zinc-950 mt-1">{selectedChild.feeStatus}</div>
            <span className="text-[11px] text-zinc-500">Academic Session 2026–2027</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Outstanding Dues</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">
              {formatCurrency(selectedChild.pendingFeeAmount)}
            </div>
            <span className="text-[11px] text-zinc-500">Due before Term 3 commencement</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Total Settled Receipts</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">
              {childInvoices.filter((i) => i.status === 'Paid').length} Receipts
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Available for Download</span>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-sm font-semibold text-zinc-950">
            Fee Invoices & Historical Receipts for {selectedChild.name}
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Click on any paid invoice to inspect the itemized ledger or download official PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                <TableHead className="w-28 text-[11px]">Invoice No.</TableHead>
                <TableHead className="text-[11px]">Term / Description</TableHead>
                <TableHead className="text-[11px]">Due Date</TableHead>
                <TableHead className="text-right text-[11px]">Amount</TableHead>
                <TableHead className="text-[11px]">Status</TableHead>
                <TableHead className="w-28 text-[11px]">Receipt No.</TableHead>
                <TableHead className="text-right text-[11px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {childInvoices.map((inv) => (
                <TableRow key={inv.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                  <TableCell className="font-mono text-zinc-600 font-semibold">{inv.invoiceNo}</TableCell>
                  <TableCell className="font-semibold text-zinc-950">{inv.termTitle}</TableCell>
                  <TableCell className="font-mono text-zinc-500 text-[11px]">{inv.dueDate}</TableCell>
                  <TableCell className="text-right font-bold text-zinc-950 tabular-nums">
                    {formatCurrency(inv.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'Paid' ? 'zinc' : 'warning'} className="text-[10px]">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500 text-[11px]">
                    {inv.receiptNo || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="monochromeOutline"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv)}
                      className="h-7 text-xs px-2.5 rounded-md"
                    >
                      <Receipt className="w-3.5 h-3.5 mr-1" />
                      <span>Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
          <DialogContent className="max-w-md border-zinc-200">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="dark" className="text-[10px] font-mono">
                  {selectedInvoice.invoiceNo}
                </Badge>
                <Badge variant={selectedInvoice.status === 'Paid' ? 'zinc' : 'warning'} className="text-[10px]">
                  {selectedInvoice.status}
                </Badge>
              </div>
              <DialogTitle className="text-base font-bold text-zinc-950 mt-1">
                {selectedInvoice.termTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Issued for {selectedChild.name} ({selectedChild.scholarId})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700">
              <span className="font-semibold text-zinc-900 block pb-1 border-b border-zinc-200/60">
                Itemized Fee Breakdown
              </span>
              <div className="space-y-1.5">
                {selectedInvoice.breakdown.map((item) => (
                  <div key={item.head} className="flex justify-between">
                    <span className="text-zinc-600">{item.head}</span>
                    <span className="font-mono font-medium text-zinc-900">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-200/60 flex justify-between font-bold text-sm text-zinc-950">
                <span>Total Amount:</span>
                <span className="tabular-nums">{formatCurrency(selectedInvoice.amount)}</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="monochromeOutline"
                size="sm"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs"
              >
                Close
              </Button>
              {selectedInvoice.status === 'Paid' && (
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => {
                    setToastMessage(`Receipt ${selectedInvoice.receiptNo} downloaded.`);
                    setSelectedInvoice(null);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Download Receipt</span>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Pay Online Dialog */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950">
              Online Fee Settlement Simulation
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Sainthia Shishutirtha • Verified Parent Checkout
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700">
            <div className="flex justify-between">
              <span className="text-zinc-500">Scholar:</span>
              <span className="font-bold text-zinc-900">{selectedChild.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Class:</span>
              <span className="font-medium text-zinc-900">{selectedChild.grade}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-200/60 font-bold text-sm text-zinc-950">
              <span>Amount Due:</span>
              <span className="tabular-nums">{formatCurrency(selectedChild.pendingFeeAmount)}</span>
            </div>
            <p className="text-[11px] text-zinc-500 pt-1">
              Supports UPI (Google Pay, PhonePe, Paytm), Net Banking, and Debit Cards.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="monochromeOutline"
              size="sm"
              onClick={() => setIsPayOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={handleSimulatePayment}
              className="text-xs"
            >
              Simulate ₹{selectedChild.pendingFeeAmount} Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

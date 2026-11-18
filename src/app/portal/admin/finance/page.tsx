'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Receipt,
  Layers,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  getPayments,
  getInvoices,
  getFeeHeads,
  getFeeStructures,
  getStudents,
  getAcademicYears,
  getClasses,
  recordPayment,
  createFeeStructure,
  PaymentRow,
  InvoiceRow,
  FeeHeadRow,
  FeeStructureRow,
  StudentRow,
  ClassRow,
  AcademicYearRow,
} from '@/lib/services/adminService';

type EnrichedPayment = PaymentRow & { student?: StudentRow };
type EnrichedStructure = FeeStructureRow & { class?: ClassRow; fee_head?: FeeHeadRow };

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'structures'>('payments');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [payments, setPayments] = useState<EnrichedPayment[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [feeHeads, setFeeHeads] = useState<FeeHeadRow[]>([]);
  const [feeStructures, setFeeStructures] = useState<EnrichedStructure[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<EnrichedPayment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Payment form states
  const [payStudentId, setPayStudentId] = useState('');
  const [payAmount, setPayAmount] = useState<number>(1200);
  const [payMode, setPayMode] = useState<'Cash at Counter' | 'UPI' | 'Bank Transfer (NEFT)' | 'Cheque'>('UPI');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payRef, setPayRef] = useState('');
  const [payRemarks, setPayRemarks] = useState('');

  // Structure form states
  const [structHeadId, setStructHeadId] = useState('');
  const [structClassId, setStructClassId] = useState('');
  const [structYearId, setStructYearId] = useState('');
  const [structTitle, setStructTitle] = useState('Term 1 Tuition Fee');
  const [structAmount, setStructAmount] = useState<number>(3600);
  const [structDueDate, setStructDueDate] = useState('');

  const refreshData = () => {
    Promise.all([
      getPayments(),
      getInvoices(),
      getFeeHeads(),
      getFeeStructures(),
      getStudents(),
      getAcademicYears(),
      getClasses(),
    ])
      .then(([payData, invData, headsData, structsData, studentsData, yearsData, classesData]) => {
        setPayments(payData);
        setInvoices(invData);
        setFeeHeads(headsData);
        setFeeStructures(structsData);
        setStudents(studentsData);
        setAcademicYears(yearsData);
        setClasses(classesData);
        if (studentsData.length > 0) {
          setPayStudentId((prev) => prev || studentsData[0].id);
        }
        if (headsData.length > 0) {
          setStructHeadId((prev) => prev || headsData[0].id);
        }
        if (classesData.length > 0) {
          setStructClassId((prev) => prev || classesData[0].id);
        }
        const curYear = yearsData.find((y) => y.is_current) || yearsData[0];
        if (curYear) {
          setStructYearId((prev) => prev || curYear.id);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to query treasury ledger.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getPayments(),
      getInvoices(),
      getFeeHeads(),
      getFeeStructures(),
      getStudents(),
      getAcademicYears(),
      getClasses(),
    ])
      .then(([payData, invData, headsData, structsData, studentsData, yearsData, classesData]) => {
        if (isMounted) {
          setPayments(payData);
          setInvoices(invData);
          setFeeHeads(headsData);
          setFeeStructures(structsData);
          setStudents(studentsData);
          setAcademicYears(yearsData);
          setClasses(classesData);
          if (studentsData.length > 0) {
            setPayStudentId((prev) => prev || studentsData[0].id);
          }
          if (headsData.length > 0) {
            setStructHeadId((prev) => prev || headsData[0].id);
          }
          if (classesData.length > 0) {
            setStructClassId((prev) => prev || classesData[0].id);
          }
          const curYear = yearsData.find((y) => y.is_current) || yearsData[0];
          if (curYear) {
            setStructYearId((prev) => prev || curYear.id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load finance data:', err);
          setError(err instanceof Error ? err.message : 'Failed to query treasury ledger.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStudentId || !payAmount) {
      alert('Please specify a student and payment amount.');
      return;
    }

    try {
      setSubmitting(true);
      const newPay = await recordPayment({
        studentId: payStudentId,
        amount: Number(payAmount),
        paymentDate: payDate,
        paymentMode: payMode,
        transactionReference: payRef.trim() || undefined,
        remarks: payRemarks.trim() || undefined,
      });

      showToast(`Receipt #${newPay.receipt_no} recorded successfully.`);
      setIsPaymentModalOpen(false);
      setPayRef('');
      setPayRemarks('');
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error recording payment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!structYearId || !structClassId || !structHeadId || !structAmount || !structDueDate) {
      alert('Please fill out all required fee structure fields.');
      return;
    }

    try {
      setSubmitting(true);
      await createFeeStructure({
        academicYearId: structYearId,
        classId: structClassId,
        feeHeadId: structHeadId,
        termTitle: structTitle.trim(),
        amount: Number(structAmount),
        dueDate: structDueDate,
      });

      showToast(`Fee schedule "${structTitle}" created successfully.`);
      setIsStructureModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating fee structure.');
    } finally {
      setSubmitting(false);
    }
  };

  // Telemetry Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + (Number(inv.total_amount) || 0), 0);
  const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const collectionPct = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');

  const filteredPayments = payments.filter((tx) => {
    const sName = tx.student ? `${tx.student.first_name} ${tx.student.last_name}` : '';
    const sId = tx.student?.scholar_id || '';
    const rNo = tx.receipt_no || '';
    const q = search.toLowerCase();
    return sName.toLowerCase().includes(q) || sId.toLowerCase().includes(q) || rNo.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Financial Treasury
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Collection Progress: {collectionPct}%
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Fee Invoicing, Receipts & Dues
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Institutional fee collections, counter payment receipts, fee schedules, and audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={() => {
              if (feeHeads.length === 0 || classes.length === 0) {
                alert('Please ensure Classes and Fee Heads exist before creating fee schedules.');
                return;
              }
              setIsStructureModalOpen(true);
            }}
            className="text-xs h-8 gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-600" />
            <span>+ Fee Schedule</span>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              if (students.length === 0) {
                alert('No students registered yet. Register students before recording payments.');
                return;
              }
              setIsPaymentModalOpen(true);
            }}
            className="text-xs h-8 gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Manual Payment</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold block">Treasury Sync Warning</span>
            <p className="text-amber-700 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Total Invoiced Demand
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-mono text-zinc-950">
              {formatCurrency(totalBilled)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Across {invoices.length} active scholar fee schedules
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs bg-zinc-950 text-white">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Total Realized Collections
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-mono text-white">
              {formatCurrency(totalCollected)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {payments.length} verified payment transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Outstanding Dues
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-mono text-zinc-950">
              {formatCurrency(totalOutstanding)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {totalBilled === 0 ? 'No billings generated yet' : `Collection rate: ${collectionPct}%`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'payments'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('structures')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'structures'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Fee Schedules & Structures ({feeStructures.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <p className="text-xs">Querying treasury ledger and receipts...</p>
        </div>
      ) : activeTab === 'payments' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, ID, or receipt #..."
              className="pl-9 h-9 text-xs border-zinc-200"
            />
          </div>

          {payments.length === 0 ? (
            <Card className="border-dashed border-2 border-zinc-200">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900">No Payment Receipts Recorded Yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
                  The institution ledger has zero payment entries. Once students are enrolled, record tuition and admission fee collections here.
                </p>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => {
                    if (students.length === 0) {
                      alert('Register at least one student before recording fee payments.');
                      return;
                    }
                    setIsPaymentModalOpen(true);
                  }}
                  className="text-xs"
                >
                  + Record Counter Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-zinc-200/90 shadow-xs">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                      <TableHead className="w-32 text-[11px]">Receipt No</TableHead>
                      <TableHead className="text-[11px]">Scholar</TableHead>
                      <TableHead className="text-[11px]">Payment Date</TableHead>
                      <TableHead className="text-[11px]">Mode</TableHead>
                      <TableHead className="text-[11px]">Status</TableHead>
                      <TableHead className="text-right text-[11px]">Amount</TableHead>
                      <TableHead className="text-right text-[11px]">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((p) => (
                      <TableRow key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                        <TableCell className="font-mono font-medium text-zinc-950">{p.receipt_no}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-zinc-900">
                            {p.student ? `${p.student.first_name} ${p.student.last_name}` : 'Unknown Scholar'}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400">{p.student?.scholar_id || 'N/A'}</div>
                        </TableCell>
                        <TableCell className="text-zinc-600 font-mono text-[11px]">{p.payment_date}</TableCell>
                        <TableCell>
                          <Badge variant="zinc" className="text-[10px]">
                            {p.payment_mode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="dark" className="text-[10px]">
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-zinc-950">
                          {formatCurrency(Number(p.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="monochromeOutline"
                            size="sm"
                            onClick={() => setSelectedReceipt(p)}
                            className="h-7 text-xs px-2.5 rounded-md gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Voucher</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {feeStructures.length === 0 ? (
            <Card className="border-dashed border-2 border-zinc-200">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                <Layers className="w-8 h-8 text-zinc-400 mb-2" />
                <h3 className="text-sm font-bold text-zinc-900">No Fee Schedules Configured</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
                  Configure fee amounts per grade and academic year (e.g. Nursery Term 1 Tuition ₹3,600).
                </p>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setIsStructureModalOpen(true)}
                  className="text-xs"
                >
                  + Add Fee Schedule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feeStructures.map((fs) => (
                <Card key={fs.id} className="border-zinc-200/90 shadow-xs">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="zinc" className="text-[10px]">
                        {fs.class?.name || 'All Classes'}
                      </Badge>
                      <span className="text-[11px] font-mono text-zinc-400">Due: {fs.due_date}</span>
                    </div>
                    <CardTitle className="text-sm font-bold text-zinc-950 mt-1">
                      {fs.term_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1">
                    <div className="text-xl font-bold font-mono text-zinc-950">
                      {formatCurrency(Number(fs.amount))}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Fee Head: {fs.fee_head?.name || 'General Tuition'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Record Manual Payment */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleRecordPayment}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Record Fee Collection</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Generate an official institutional receipt for cash, UPI, or bank transfer payments.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Scholar *</label>
                <select
                  value={payStudentId}
                  onChange={(e) => setPayStudentId(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} ({s.scholar_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Amount (₹) *</label>
                  <Input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    min={1}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Payment Mode *</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value as 'Cash at Counter' | 'UPI' | 'Bank Transfer (NEFT)' | 'Cheque')}
                    className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash at Counter">Cash at Counter</option>
                    <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Payment Date *</label>
                  <Input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Txn / UTR Reference</label>
                  <Input
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    placeholder="e.g. UPI-928173612"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Remarks / Note</label>
                <Input
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  placeholder="e.g. Term 2 installment paid in full"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Generate Receipt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Fee Structure */}
      <Dialog open={isStructureModalOpen} onOpenChange={setIsStructureModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleCreateStructure}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Add Fee Schedule</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Define the payable fee head amount for an academic year and grade class.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Academic Session *</label>
                <select
                  value={structYearId}
                  onChange={(e) => setStructYearId(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  required
                >
                  {academicYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} {y.is_current ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Class *</label>
                  <select
                    value={structClassId}
                    onChange={(e) => setStructClassId(e.target.value)}
                    className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                    required
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Fee Head *</label>
                  <select
                    value={structHeadId}
                    onChange={(e) => setStructHeadId(e.target.value)}
                    className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                    required
                  >
                    {feeHeads.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Term Title / Description *</label>
                <Input
                  value={structTitle}
                  onChange={(e) => setStructTitle(e.target.value)}
                  placeholder="e.g. Term 1 Tuition Fee"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Amount (₹) *</label>
                  <Input
                    type="number"
                    value={structAmount}
                    onChange={(e) => setStructAmount(Number(e.target.value))}
                    min={1}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Due Date *</label>
                  <Input
                    type="date"
                    value={structDueDate}
                    onChange={(e) => setStructDueDate(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsStructureModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RECEIPT VOUCHER DIALOG */}
      {selectedReceipt && (
        <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
          <DialogContent className="max-w-md border-zinc-200">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="dark" className="text-[10px] font-mono">
                  {selectedReceipt.receipt_no}
                </Badge>
                <Badge variant="zinc" className="text-[10px]">
                  {selectedReceipt.payment_mode}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-950 mt-1">
                Official Fee Receipt
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Sainthia Shishutirtha Institutional Treasury
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Scholar Name</span>
                  <span className="font-bold text-zinc-950">
                    {selectedReceipt.student ? `${selectedReceipt.student.first_name} ${selectedReceipt.student.last_name}` : 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Scholar ID</span>
                  <span className="font-mono text-zinc-900">{selectedReceipt.student?.scholar_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Date Received</span>
                  <span className="font-mono text-zinc-900">{selectedReceipt.payment_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Transaction Ref</span>
                  <span className="font-mono text-zinc-900">{selectedReceipt.transaction_reference || 'Counter Cash'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-sm">
                <span className="font-bold text-zinc-900">Total Collected:</span>
                <span className="font-mono font-bold text-zinc-950 text-base">
                  {formatCurrency(Number(selectedReceipt.amount))}
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="dark"
                size="sm"
                onClick={() => setSelectedReceipt(null)}
                className="text-xs"
              >
                Close Voucher
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COUNCIL_FEE_SUMMARY } from '@/data/councilDemoData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
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

export default function FeeSummaryCard() {
  const totalBilled = COUNCIL_FEE_SUMMARY.reduce((acc, curr) => acc + curr.billed, 0);
  const totalCollected = COUNCIL_FEE_SUMMARY.reduce((acc, curr) => acc + curr.collected, 0);
  const totalOutstanding = COUNCIL_FEE_SUMMARY.reduce((acc, curr) => acc + curr.outstanding, 0);
  const collectionPct = ((totalCollected / totalBilled) * 100).toFixed(1);

  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <Card className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base font-semibold text-zinc-950">
                Fee Realization & Dues Ledger
              </CardTitle>
              <Badge variant="dark" className="text-[10px] font-medium">
                {collectionPct}% Realized
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500 mt-0.5">
              Term-2 fee collections, bank deposits, and outstanding student arrears.
            </CardDescription>
          </div>

          <div className="text-xs font-semibold text-zinc-900 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 self-start sm:self-auto">
            {formatCurrency(totalCollected)} Collected
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* KPI Mini Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Total Invoiced
            </span>
            <span className="text-base font-bold text-zinc-950 mt-0.5 block tabular-nums">
              {formatCurrency(totalBilled)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Collected (Bank)
            </span>
            <span className="text-base font-bold text-zinc-950 mt-0.5 block tabular-nums">
              {formatCurrency(totalCollected)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Outstanding Dues
            </span>
            <span className="text-base font-bold text-zinc-950 mt-0.5 block tabular-nums">
              {formatCurrency(totalOutstanding)}
            </span>
          </div>
        </div>

        {/* Realization Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium">Total Term-2 Realization</span>
            <span className="font-semibold text-zinc-950">{collectionPct}%</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/60">
            <div
              className="bg-zinc-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${collectionPct}%` }}
            />
          </div>
        </div>

        {/* Detailed Table */}
        <div className="rounded-lg border border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-200 bg-zinc-50/70">
                <TableHead className="h-8 text-[11px] font-semibold text-zinc-600">Fee Head</TableHead>
                <TableHead className="h-8 text-[11px] font-semibold text-zinc-600 text-right">Invoiced</TableHead>
                <TableHead className="h-8 text-[11px] font-semibold text-zinc-600 text-right">Collected</TableHead>
                <TableHead className="h-8 text-[11px] font-semibold text-zinc-600 text-right">Dues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COUNCIL_FEE_SUMMARY.map((head) => (
                <TableRow key={head.head} className="border-b border-zinc-100 text-xs hover:bg-zinc-50/50">
                  <TableCell className="py-2 font-medium text-zinc-900">{head.head}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums text-zinc-600">{formatCurrency(head.billed)}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-semibold text-zinc-950">{formatCurrency(head.collected)}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums text-zinc-700">{formatCurrency(head.outstanding)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Card Footer link */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Fee collection cycle: Quarterly (Term 1 & 2)</span>
          <Button variant="monochromeGhost" size="sm" asChild className="h-7 text-xs p-0 text-zinc-700 hover:text-zinc-950">
            <Link href="/portal/council/finance" className="flex items-center gap-1">
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

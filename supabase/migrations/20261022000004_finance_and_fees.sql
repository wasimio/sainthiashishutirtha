-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000004_finance_and_fees.sql
-- Description: Financial schema, fee structures, invoices, payment allocations, receipts, and adjustments
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Fee Heads (Standard billing categories)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fee_heads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  is_recurring boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. Fee Structures (Class-wise fee schedule per academic session)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  fee_head_id uuid NOT NULL REFERENCES public.fee_heads(id) ON DELETE RESTRICT,
  term_title text NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  due_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_fee_structure UNIQUE (academic_year_id, class_id, fee_head_id, term_title)
);

CREATE INDEX IF NOT EXISTS idx_fee_structures_class ON public.fee_structures(class_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_year ON public.fee_structures(academic_year_id);

-- ------------------------------------------------------------------------------
-- 3. Invoices (Student Fee Invoices)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text UNIQUE NOT NULL,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
  title text NOT NULL,
  issue_date date NOT NULL DEFAULT current_date,
  due_date date NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  paid_amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0 AND paid_amount <= total_amount),
  status text NOT NULL DEFAULT 'Issued' CHECK (status IN ('Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled', 'Waived')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_invoice_dates CHECK (due_date >= issue_date)
);

CREATE INDEX IF NOT EXISTS idx_invoices_student ON public.invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);

-- ------------------------------------------------------------------------------
-- 4. Invoice Line Items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  fee_head_id uuid NOT NULL REFERENCES public.fee_heads(id) ON DELETE RESTRICT,
  description text NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  concession_amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (concession_amount >= 0 AND concession_amount <= amount),
  net_amount numeric(10, 2) GENERATED ALWAYS AS (amount - concession_amount) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- ------------------------------------------------------------------------------
-- 5. Payments & Receipts
-- Preserves immutable financial history; receipt numbers are globally unique
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no text UNIQUE NOT NULL,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  guardian_id uuid REFERENCES public.guardians(id) ON DELETE SET NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL DEFAULT current_date,
  payment_mode text NOT NULL CHECK (payment_mode IN ('Bank Transfer (NEFT)', 'UPI', 'Cash at Counter', 'Cheque', 'Online Gateway')),
  transaction_reference text,
  status text NOT NULL DEFAULT 'Completed' CHECK (status IN ('Initiated', 'Completed', 'Bounced', 'Reversed', 'Refunded')),
  collected_by uuid NOT NULL REFERENCES public.profiles(id),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_student ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_receipt ON public.payments(receipt_no);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(payment_date DESC);

-- ------------------------------------------------------------------------------
-- 6. Payment Allocations (Relates single payment to one or more invoices)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  allocated_amount numeric(10, 2) NOT NULL CHECK (allocated_amount > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_payment_invoice_allocation UNIQUE (payment_id, invoice_id)
);

CREATE INDEX IF NOT EXISTS idx_allocations_payment ON public.payment_allocations(payment_id);
CREATE INDEX IF NOT EXISTS idx_allocations_invoice ON public.payment_allocations(invoice_id);

-- ------------------------------------------------------------------------------
-- 7. Financial Adjustments (Concessions, Waivers, Refunds, Reversals)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  adjustment_type text NOT NULL CHECK (adjustment_type IN ('Concession', 'Waiver', 'Late Fee Addition', 'Refund', 'Reversal')),
  amount numeric(10, 2) NOT NULL CHECK (amount != 0),
  reason text NOT NULL,
  authorized_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_adjustments_invoice ON public.financial_adjustments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_payment ON public.financial_adjustments(payment_id);

-- ------------------------------------------------------------------------------
-- 8. Receipt Immutability Trigger
-- Prohibits altering or overwriting an existing receipt number
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_receipt_immutability()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.receipt_no IS DISTINCT FROM NEW.receipt_no THEN
    RAISE EXCEPTION 'Audit violation: Receipt number % is an immutable legal audit record and cannot be altered.', OLD.receipt_no;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_receipt_immutability ON public.payments;
CREATE TRIGGER trg_protect_receipt_immutability
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_receipt_immutability();

-- ------------------------------------------------------------------------------
-- 9. Payment Deletion Prohibition Trigger
-- Prohibits deleting issued payment records; corrections must use reversals/adjustments
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_payment_deletion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Audit violation: Issued payment receipt % cannot be deleted. Legal financial corrections must be recorded as reversals or adjustments.', OLD.receipt_no;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_payment_deletion ON public.payments;
CREATE TRIGGER trg_protect_payment_deletion
  BEFORE DELETE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_payment_deletion();

-- ------------------------------------------------------------------------------
-- 10. Payment Allocation Balance & Invoice Paid Amount Sync Trigger
-- Ensures allocated funds do not exceed payment amounts and automatically
-- updates invoice paid_amount and lifecycle status
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_invoice_payment_allocation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_target_invoice_id uuid;
  v_target_payment_id uuid;
  v_total_allocated numeric(10, 2);
  v_payment_amount numeric(10, 2);
  v_invoice_total numeric(10, 2);
  v_invoice_paid numeric(10, 2);
  v_due_date date;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_target_invoice_id := OLD.invoice_id;
    v_target_payment_id := OLD.payment_id;
  ELSE
    v_target_invoice_id := NEW.invoice_id;
    v_target_payment_id := NEW.payment_id;
  END IF;

  -- 1. Check total allocations for this payment do not exceed payment amount
  SELECT amount INTO v_payment_amount FROM public.payments WHERE id = v_target_payment_id;
  SELECT COALESCE(SUM(allocated_amount), 0) INTO v_total_allocated
  FROM public.payment_allocations
  WHERE payment_id = v_target_payment_id;

  IF v_total_allocated > v_payment_amount THEN
    RAISE EXCEPTION 'Financial reconciliation violation: Total allocated amounts (₹%) exceed payment amount (₹%).', v_total_allocated, v_payment_amount;
  END IF;

  -- 2. Recalculate invoice paid amount from all its allocations
  SELECT COALESCE(SUM(allocated_amount), 0) INTO v_invoice_paid
  FROM public.payment_allocations
  WHERE invoice_id = v_target_invoice_id;

  SELECT total_amount, due_date INTO v_invoice_total, v_due_date
  FROM public.invoices
  WHERE id = v_target_invoice_id;

  -- 3. Update invoice paid amount and status
  UPDATE public.invoices
  SET
    paid_amount = v_invoice_paid,
    status = CASE
      WHEN v_invoice_paid >= v_invoice_total THEN 'Paid'::text
      WHEN v_invoice_paid > 0 THEN 'Partially Paid'::text
      WHEN current_date > v_due_date THEN 'Overdue'::text
      ELSE 'Issued'::text
    END,
    updated_at = now()
  WHERE id = v_target_invoice_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_invoice_payment_allocation ON public.payment_allocations;
CREATE TRIGGER trg_sync_invoice_payment_allocation
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_invoice_payment_allocation();

import { createClient } from '@/lib/supabase/client';
import type { Database, StudentStatus, AppRole } from '@/types/database.types';

export type StudentRow = Database['public']['Tables']['students']['Row'];
export type AcademicYearRow = Database['public']['Tables']['academic_years']['Row'];
export type ClassRow = Database['public']['Tables']['classes']['Row'];
export type SectionRow = Database['public']['Tables']['sections']['Row'];
export type SubjectRow = Database['public']['Tables']['subjects']['Row'];
export type StaffProfileRow = Database['public']['Tables']['staff_profiles']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type FeeHeadRow = Database['public']['Tables']['fee_heads']['Row'];
export type FeeStructureRow = Database['public']['Tables']['fee_structures']['Row'];
export type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
export type PaymentRow = Database['public']['Tables']['payments']['Row'];
export type NoticeRow = Database['public']['Tables']['notices']['Row'];
export type SchoolSettingsRow = Database['public']['Tables']['school_settings']['Row'];
export type AdmissionApplicationRow = Database['public']['Tables']['admissions_applications']['Row'];

export interface EnrolledStudentDetail extends StudentRow {
  enrollment?: {
    id: string;
    rollNumber: number;
    status: string;
    sectionName?: string;
    className?: string;
    academicYearName?: string;
  };
  primaryGuardian?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface AdminDashboardTelemetry {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  totalSections: number;
  totalCollections: number;
  totalOutstandingFees: number;
  todayAttendancePct: number | null;
  pendingAdmissions: number;
  recentNoticesCount: number;
  hasAcademicYear: boolean;
  currentAcademicYearName: string | null;
}

// ------------------------------------------------------------------------------
// 1. Dashboard Telemetry
// ------------------------------------------------------------------------------
export async function getAdminDashboardTelemetry(): Promise<AdminDashboardTelemetry> {
  const supabase = createClient();

  const [
    studentsRes,
    staffRes,
    classesRes,
    sectionsRes,
    paymentsRes,
    admissionsRes,
    noticesRes,
    currentYearRes,
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'Enrolled'),
    supabase.from('staff_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('classes').select('*', { count: 'exact', head: true }),
    supabase.from('sections').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'Completed'),
    supabase.from('admissions_applications').select('*', { count: 'exact', head: true }).eq('status', 'Pending Review'),
    supabase.from('notices').select('*', { count: 'exact', head: true }).eq('status', 'Published'),
    supabase.from('academic_years').select('name').eq('is_current', true).maybeSingle(),
  ]);

  const totalPayments = (paymentsRes.data || []).reduce(
    (acc, p) => acc + (Number(p.amount) || 0),
    0
  );

  return {
    totalStudents: studentsRes.count || 0,
    totalStaff: staffRes.count || 0,
    totalClasses: classesRes.count || 0,
    totalSections: sectionsRes.count || 0,
    totalCollections: totalPayments,
    totalOutstandingFees: 0,
    todayAttendancePct: null, // Null indicates no sessions registered today
    pendingAdmissions: admissionsRes.count || 0,
    recentNoticesCount: noticesRes.count || 0,
    hasAcademicYear: !!currentYearRes.data,
    currentAcademicYearName: currentYearRes.data?.name || null,
  };
}

// ------------------------------------------------------------------------------
// 2. Academic Years & Hierarchy
// ------------------------------------------------------------------------------
export async function getAcademicYears(): Promise<AcademicYearRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAcademicYear(input: {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}): Promise<AcademicYearRow> {
  const supabase = createClient();

  // If setting this year as current, unset existing current years
  if (input.isCurrent) {
    await supabase.from('academic_years').update({ is_current: false }).eq('is_current', true);
  }

  const { data, error } = await supabase
    .from('academic_years')
    .insert({
      name: input.name,
      start_date: input.startDate,
      end_date: input.endDate,
      is_current: input.isCurrent ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getClasses(): Promise<ClassRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createClass(input: {
  name: string;
  code: string;
  wing: 'Early Childhood' | 'Pre-Primary' | 'Junior Primary' | 'Senior Primary';
  displayOrder: number;
}): Promise<ClassRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('classes')
    .insert({
      name: input.name,
      code: input.code.toUpperCase().trim(),
      wing: input.wing,
      display_order: input.displayOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSections(academicYearId?: string): Promise<(SectionRow & { class?: ClassRow })[]> {
  const supabase = createClient();
  let query = supabase.from('sections').select('*, class:classes(*)').order('name');
  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as (SectionRow & { class?: ClassRow })[]) || [];
}

export async function createSection(input: {
  classId: string;
  academicYearId: string;
  name: string;
  capacity?: number;
  roomNumber?: string;
}): Promise<SectionRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sections')
    .insert({
      class_id: input.classId,
      academic_year_id: input.academicYearId,
      name: input.name.trim(),
      capacity: input.capacity ?? 35,
      room_number: input.roomNumber || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSubjects(): Promise<SubjectRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('subjects').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function createSubject(input: {
  name: string;
  code: string;
  description?: string;
}): Promise<SubjectRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      name: input.name.trim(),
      code: input.code.toUpperCase().trim(),
      description: input.description || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------------------
// 3. Student Information System (SIS)
// ------------------------------------------------------------------------------
export async function getStudents(options?: {
  search?: string;
  status?: string;
}): Promise<EnrolledStudentDetail[]> {
  const supabase = createClient();
  let query = supabase.from('students').select('*').order('created_at', { ascending: false });

  if (options?.status && options.status !== 'All') {
    query = query.eq('status', options.status as StudentStatus);
  }

  const { data: students, error } = await query;
  if (error) throw error;
  if (!students || students.length === 0) return [];

  // Query linked enrollments and guardians in parallel
  const studentIds = students.map((s) => s.id);

  const [enrollmentsRes, guardiansRes] = await Promise.all([
    supabase
      .from('student_enrollments')
      .select('id, student_id, roll_number, status, section:sections(name, class:classes(name)), academic_year:academic_years(name)')
      .in('student_id', studentIds)
      .eq('status', 'active'),
    supabase
      .from('student_guardians')
      .select('student_id, relationship, is_primary, guardian:guardians(primary_guardian_name, primary_phone)')
      .in('student_id', studentIds)
      .eq('is_primary', true),
  ]);

  const enrollmentMap = new Map();
  (enrollmentsRes.data || []).forEach((e: unknown) => {
    const item = e as {
      id: string;
      student_id: string;
      roll_number: number;
      status: string;
      section?: { name: string; class?: { name: string } };
      academic_year?: { name: string };
    };
    enrollmentMap.set(item.student_id, {
      id: item.id,
      rollNumber: item.roll_number,
      status: item.status,
      sectionName: item.section?.name,
      className: item.section?.class?.name,
      academicYearName: item.academic_year?.name,
    });
  });

  const guardianMap = new Map();
  (guardiansRes.data || []).forEach((g: unknown) => {
    const item = g as {
      student_id: string;
      relationship: string;
      guardian?: { primary_guardian_name: string; primary_phone: string };
    };
    guardianMap.set(item.student_id, {
      name: item.guardian?.primary_guardian_name || 'Not Recorded',
      phone: item.guardian?.primary_phone || 'N/A',
      relationship: item.relationship,
    });
  });

  return students.map((s) => ({
    ...s,
    enrollment: enrollmentMap.get(s.id),
    primaryGuardian: guardianMap.get(s.id),
  }));
}

export async function registerStudent(input: {
  scholarId: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  bloodGroup?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  academicYearId: string;
  sectionId: string;
  rollNumber: number;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: 'Father' | 'Mother' | 'Legal Guardian' | 'Grandparent' | 'Other';
  guardianAddress?: string;
}): Promise<StudentRow> {
  const supabase = createClient();

  // 1. Insert Student Record
  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert({
      scholar_id: input.scholarId.trim().toUpperCase(),
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      gender: input.gender,
      date_of_birth: input.dateOfBirth,
      blood_group: (input.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-') || null,
      emergency_contact_phone: input.emergencyPhone || null,
      medical_notes: input.medicalNotes || null,
      status: 'Enrolled',
    })
    .select()
    .single();

  if (studentError) throw studentError;

  // 2. Insert or Link Guardian
  const guardianCode = `GRD-${Date.now().toString().slice(-6)}`;
  const { data: guardian, error: guardianError } = await supabase
    .from('guardians')
    .insert({
      guardian_code: guardianCode,
      primary_guardian_name: input.guardianName.trim(),
      primary_phone: input.guardianPhone.trim(),
      residential_address: input.guardianAddress || null,
      verification_status: 'verified',
    })
    .select()
    .single();

  if (guardianError) throw guardianError;

  // 3. Link Student to Guardian
  const { error: linkError } = await supabase.from('student_guardians').insert({
    student_id: student.id,
    guardian_id: guardian.id,
    relationship: input.guardianRelation,
    is_primary: true,
  });
  if (linkError) throw linkError;

  // 4. Enroll Student in Section
  const { error: enrollError } = await supabase.from('student_enrollments').insert({
    student_id: student.id,
    section_id: input.sectionId,
    academic_year_id: input.academicYearId,
    roll_number: input.rollNumber,
    status: 'active',
  });
  if (enrollError) throw enrollError;

  return student;
}

// ------------------------------------------------------------------------------
// 4. Staff & Faculty Management
// ------------------------------------------------------------------------------
export async function getStaffMembers(): Promise<(StaffProfileRow & { profile?: ProfileRow })[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('staff_profiles')
    .select('*, profile:profiles(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as (StaffProfileRow & { profile?: ProfileRow })[]) || [];
}

export async function addStaffMember(input: {
  profileId: string;
  employeeId: string;
  designation: string;
  department?: string;
  qualification?: string;
  experienceYears?: number;
}): Promise<StaffProfileRow> {
  const supabase = createClient();

  // Insert Staff Profile linked to the verified profile ID
  const { data: staff, error: staffError } = await supabase
    .from('staff_profiles')
    .insert({
      profile_id: input.profileId,
      employee_id: input.employeeId.trim().toUpperCase(),
      designation: input.designation.trim(),
      department: input.department || null,
      qualification: input.qualification || null,
      experience_years: input.experienceYears || 0,
    })
    .select()
    .single();

  if (staffError) throw staffError;
  return staff;
}

// ------------------------------------------------------------------------------
// 5. Fee Management & Treasury
// ------------------------------------------------------------------------------
export async function getFeeHeads(): Promise<FeeHeadRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('fee_heads').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function createFeeHead(input: {
  name: string;
  description?: string;
  isRecurring?: boolean;
}): Promise<FeeHeadRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('fee_heads')
    .insert({
      name: input.name.trim(),
      description: input.description || null,
      is_recurring: input.isRecurring ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFeeStructures(academicYearId?: string): Promise<(FeeStructureRow & { class?: ClassRow; fee_head?: FeeHeadRow })[]> {
  const supabase = createClient();
  let query = supabase.from('fee_structures').select('*, class:classes(*), fee_head:fee_heads(*)').order('term_title');
  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as (FeeStructureRow & { class?: ClassRow; fee_head?: FeeHeadRow })[]) || [];
}

export async function createFeeStructure(input: {
  academicYearId: string;
  classId: string;
  feeHeadId: string;
  termTitle: string;
  amount: number;
  dueDate: string;
}): Promise<FeeStructureRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('fee_structures')
    .insert({
      academic_year_id: input.academicYearId,
      class_id: input.classId,
      fee_head_id: input.feeHeadId,
      term_title: input.termTitle.trim(),
      amount: input.amount,
      due_date: input.dueDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPayments(studentId?: string): Promise<(PaymentRow & { student?: StudentRow })[]> {
  const supabase = createClient();
  let query = supabase.from('payments').select('*, student:students(*)').order('payment_date', { ascending: false });
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as (PaymentRow & { student?: StudentRow })[]) || [];
}

export async function recordPayment(input: {
  studentId: string;
  guardianId?: string;
  amount: number;
  paymentDate?: string;
  paymentMode: 'Bank Transfer (NEFT)' | 'UPI' | 'Cash at Counter' | 'Cheque' | 'Online Gateway';
  transactionReference?: string;
  remarks?: string;
}): Promise<PaymentRow> {
  const supabase = createClient();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Unauthenticated user cannot record payment.');

  const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const { data, error } = await supabase
    .from('payments')
    .insert({
      receipt_no: receiptNo,
      student_id: input.studentId,
      guardian_id: input.guardianId || null,
      amount: input.amount,
      payment_date: input.paymentDate || new Date().toISOString().split('T')[0],
      payment_mode: input.paymentMode,
      transaction_reference: input.transactionReference || null,
      status: 'Completed',
      collected_by: user.id,
      remarks: input.remarks || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------------------
// 6. Notices & Circulars (Website CMS)
// ------------------------------------------------------------------------------
export async function getNotices(options?: {
  status?: 'Draft' | 'Published' | 'Archived';
  targetAudience?: 'All' | 'Public' | 'Staff Only' | 'Parents Only';
}): Promise<NoticeRow[]> {
  const supabase = createClient();
  let query = supabase.from('notices').select('*').order('published_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.targetAudience) {
    query = query.eq('target_audience', options.targetAudience);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createNotice(input: {
  title: string;
  category: 'Academic' | 'Holiday' | 'Admission' | 'Circular';
  content: string;
  targetAudience?: 'All' | 'Public' | 'Staff Only' | 'Parents Only' | 'Class Specific';
  isPinned?: boolean;
  status?: 'Draft' | 'Published' | 'Archived';
}): Promise<NoticeRow> {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Unauthenticated user cannot create a notice.');

  const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Date.now().toString().slice(-4)}`;

  const { data, error } = await supabase
    .from('notices')
    .insert({
      title: input.title.trim(),
      slug,
      category: input.category,
      content: input.content.trim(),
      author_id: user.id,
      target_audience: input.targetAudience || 'All',
      is_pinned: input.isPinned ?? false,
      status: input.status || 'Published',
      published_at: input.status === 'Published' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------------------
// 7. School Settings
// ------------------------------------------------------------------------------
export async function getSchoolSettings(): Promise<SchoolSettingsRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .eq('id', 'primary_config')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateSchoolSettings(input: Partial<SchoolSettingsRow>): Promise<SchoolSettingsRow> {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from('school_settings')
    .upsert({
      id: 'primary_config',
      ...input,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------------------
// 8. User Profiles & Directory Lookup
// ------------------------------------------------------------------------------
export async function getProfiles(role?: AppRole): Promise<ProfileRow[]> {
  const supabase = createClient();
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (role) {
    query = query.eq('role', role);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ------------------------------------------------------------------------------
// 9. Attendance Telemetry & Records
// ------------------------------------------------------------------------------
export interface DailyAttendanceSummary {
  date: string;
  totalSessions: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalStudents: number;
  attendancePct: number | null;
  absentees: Array<{
    studentId: string;
    studentName: string;
    scholarId: string;
    sectionName: string;
    className: string;
    status: string;
    remarks: string | null;
  }>;
}

export async function getDailyAttendanceSummary(sessionDate?: string): Promise<DailyAttendanceSummary> {
  const supabase = createClient();
  const targetDate = sessionDate || new Date().toISOString().split('T')[0];

  const { data: sessions, error: sessionErr } = await supabase
    .from('attendance_sessions')
    .select('id, section_id, session_date, is_locked, section:sections(name, class:classes(name))')
    .eq('session_date', targetDate);

  if (sessionErr) throw sessionErr;

  if (!sessions || sessions.length === 0) {
    return {
      date: targetDate,
      totalSessions: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalStudents: 0,
      attendancePct: null,
      absentees: [],
    };
  }

  const sessionIds = sessions.map((s) => s.id);
  const { data: records, error: recErr } = await supabase
    .from('attendance_records')
    .select('id, session_id, student_id, status, remarks, student:students(id, scholar_id, first_name, last_name)')
    .in('session_id', sessionIds);

  if (recErr) throw recErr;

  const totalPresent = (records || []).filter((r) => r.status === 'present').length;
  const totalAbsent = (records || []).filter((r) => r.status === 'absent').length;
  const totalLate = (records || []).filter((r) => r.status === 'late').length;
  const totalStudents = (records || []).length;

  const sessionMap = new Map();
  sessions.forEach((s: unknown) => {
    const sess = s as { id: string; section?: { name: string; class?: { name: string } } };
    sessionMap.set(sess.id, {
      sectionName: sess.section?.name || '',
      className: sess.section?.class?.name || '',
    });
  });

  const absentees = (records || [])
    .filter((r) => r.status === 'absent')
    .map((r: unknown) => {
      const rec = r as {
        student_id: string;
        session_id: string;
        status: string;
        remarks: string | null;
        student?: { scholar_id: string; first_name: string; last_name: string };
      };
      const sessInfo = sessionMap.get(rec.session_id) || { sectionName: '', className: '' };
      return {
        studentId: rec.student_id,
        studentName: rec.student ? `${rec.student.first_name} ${rec.student.last_name}` : 'Unknown Scholar',
        scholarId: rec.student?.scholar_id || 'N/A',
        sectionName: sessInfo.sectionName,
        className: sessInfo.className,
        status: rec.status,
        remarks: rec.remarks,
      };
    });

  return {
    date: targetDate,
    totalSessions: sessions.length,
    totalPresent,
    totalAbsent,
    totalLate,
    totalStudents,
    attendancePct: totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 1000) / 10 : null,
    absentees,
  };
}

// ------------------------------------------------------------------------------
// 10. Invoices & Billing
// ------------------------------------------------------------------------------
export async function getInvoices(studentId?: string): Promise<(InvoiceRow & { student?: StudentRow })[]> {
  const supabase = createClient();
  let query = supabase.from('invoices').select('*, student:students(*)').order('created_at', { ascending: false });
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as (InvoiceRow & { student?: StudentRow })[]) || [];
}

export async function createInvoice(input: {
  studentId: string;
  academicYearId: string;
  title: string;
  dueDate: string;
  totalAmount: number;
  notes?: string;
}): Promise<InvoiceRow> {
  const supabase = createClient();
  const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      invoice_no: invoiceNo,
      student_id: input.studentId,
      academic_year_id: input.academicYearId,
      title: input.title.trim(),
      due_date: input.dueDate,
      total_amount: input.totalAmount,
      paid_amount: 0,
      status: 'Issued',
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------------------
// 11. Delete Helpers for Administrative Pruning
// ------------------------------------------------------------------------------
export async function deleteNotice(noticeId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('notices').delete().eq('id', noticeId);
  if (error) throw error;
}

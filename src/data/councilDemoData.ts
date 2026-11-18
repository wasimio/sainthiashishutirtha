/**
 * DEMONSTRATION DATA FOR COUNCIL PORTAL
 * 
 * DISCLAIMER:
 * This data is strictly for UI prototype and layout evaluation.
 * It does NOT represent verified live school records, actual student identities,
 * official audit figures, or real employee data of Sainthia Shishutirtha.
 */

export interface CouncilKpi {
  id: string;
  label: string;
  value: string;
  subtext: string;
  changeLabel?: string;
  changeType?: 'positive' | 'neutral' | 'alert';
  category: 'students' | 'attendance' | 'admissions' | 'finance';
}

export interface EnrollmentGrade {
  grade: string;
  wing: 'Pre-Primary' | 'Primary';
  enrolled: number;
  capacity: number;
  sections: number;
}

export interface AttendanceSnapshot {
  grade: string;
  present: number;
  total: number;
  percentage: number;
}

export interface AdmissionFunnelStage {
  stage: string;
  count: number;
  color: string;
  description: string;
}

export interface FeeHeadSummary {
  head: string;
  billed: number;
  collected: number;
  outstanding: number;
  percentage: number;
}

export interface PendingTaskItem {
  id: string;
  category: 'Approval' | 'Admissions' | 'Finance' | 'Staff';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'normal';
  dateSubmitted: string;
  submittedBy: string;
  actionRoute: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  title: string;
  actor: string;
  category: 'attendance' | 'finance' | 'academics' | 'admissions' | 'circular';
}

export const COUNCIL_METADATA = {
  portalTitle: 'Council Oversight Portal',
  portalSubtitle: 'Sainthia Shishutirtha • Governing Body & Executive Management',
  academicSession: 'Academic Session 2025–2026',
  currentDateFormatted: 'Wednesday, 21 October 2026',
  councilMemberName: 'Dr. Debabrata Banerjee',
  councilRoleTitle: 'Governing Council Member',
  isDemoEnvironment: true,
  demoNotice:
    'Demonstration Prototype View: Metrics, enrollment figures, attendance rolls, and fee ledgers shown below are illustrative sample data for council navigation and layout review.',
};

export const COUNCIL_KPIS: CouncilKpi[] = [
  {
    id: 'kpi-students',
    label: 'Total Enrolled Students',
    value: '342',
    subtext: 'Capacity: 360 (95.0% utilized)',
    changeLabel: '+14 vs Previous Session',
    changeType: 'positive',
    category: 'students',
  },
  {
    id: 'kpi-attendance',
    label: "Today's Campus Attendance",
    value: '95.9%',
    subtext: '328 present • 14 absent • 3 on leave',
    changeLabel: 'Staff attendance: 95.5%',
    changeType: 'positive',
    category: 'attendance',
  },
  {
    id: 'kpi-admissions',
    label: 'Admission Pipeline (2026–27)',
    value: '48 Active',
    subtext: '12 in review • 14 interview-ready',
    changeLabel: '10 approved • 4 enrolled',
    changeType: 'neutral',
    category: 'admissions',
  },
  {
    id: 'kpi-finance',
    label: 'Term 2 Fee Collection',
    value: '89.0%',
    subtext: '₹5,48,000 collected of ₹6,15,600',
    changeLabel: '₹67,600 outstanding (38 accts)',
    changeType: 'alert',
    category: 'finance',
  },
];

export const COUNCIL_ENROLLMENT: EnrollmentGrade[] = [
  { grade: 'Pre-Primary / Nursery', wing: 'Pre-Primary', enrolled: 48, capacity: 50, sections: 2 },
  { grade: 'Kindergarten (KG)', wing: 'Pre-Primary', enrolled: 64, capacity: 65, sections: 2 },
  { grade: 'Class I', wing: 'Primary', enrolled: 62, capacity: 65, sections: 2 },
  { grade: 'Class II', wing: 'Primary', enrolled: 58, capacity: 60, sections: 2 },
  { grade: 'Class III', wing: 'Primary', enrolled: 56, capacity: 60, sections: 2 },
  { grade: 'Class IV', wing: 'Primary', enrolled: 54, capacity: 60, sections: 2 },
];

export const COUNCIL_ATTENDANCE_SNAPSHOT: AttendanceSnapshot[] = [
  { grade: 'Pre-Primary', present: 46, total: 48, percentage: 95.8 },
  { grade: 'Kindergarten', present: 62, total: 64, percentage: 96.9 },
  { grade: 'Class I', present: 59, total: 62, percentage: 95.2 },
  { grade: 'Class II', present: 56, total: 58, percentage: 96.6 },
  { grade: 'Class III', present: 53, total: 56, percentage: 94.6 },
  { grade: 'Class IV', present: 52, total: 54, percentage: 96.3 },
];

export const COUNCIL_ADMISSION_PIPELINE: AdmissionFunnelStage[] = [
  { stage: 'Inquiries Submitted', count: 48, color: 'bg-sky-500', description: 'Initial digital & office forms received' },
  { stage: 'Under Office Review', count: 12, color: 'bg-amber-500', description: 'Age criteria & document checks' },
  { stage: 'Interaction Scheduled', count: 14, color: 'bg-indigo-500', description: 'Child & parent campus walkthrough' },
  { stage: 'Admission Approved', count: 10, color: 'bg-teal-500', description: 'Granted by Principal, awaiting fee' },
  { stage: 'Fully Enrolled', count: 4, color: 'bg-emerald-600', description: 'Kit issued & student ID generated' },
];

export const COUNCIL_FEE_SUMMARY: FeeHeadSummary[] = [
  { head: 'Tuition Fee (Term 2)', billed: 410400, collected: 375000, outstanding: 35400, percentage: 91.4 },
  { head: 'Development & Facility', billed: 102600, collected: 92000, outstanding: 10600, percentage: 89.7 },
  { head: 'Exams & Activity Kit', billed: 102600, collected: 81000, outstanding: 21600, percentage: 78.9 },
];

export const COUNCIL_PENDING_TASKS: PendingTaskItem[] = [
  {
    id: 'task-1',
    category: 'Approval',
    title: 'Review Annual Sports Day 2026 Circular',
    description: 'Drafted by Headmaster with revised grounds timetable and parent advisory guidelines.',
    urgency: 'high',
    dateSubmitted: 'Today, 08:30 AM',
    submittedBy: 'Headmaster Desk',
    actionRoute: '/portal/council/website',
  },
  {
    id: 'task-2',
    category: 'Admissions',
    title: '3 Class II Transfer Applications Awaiting Final Seat Allocation',
    description: 'Document verification cleared by office; needs confirmation against section capacity limits.',
    urgency: 'medium',
    dateSubmitted: 'Yesterday, 04:15 PM',
    submittedBy: 'Office Registrar',
    actionRoute: '/portal/council/students-admissions',
  },
  {
    id: 'task-3',
    category: 'Finance',
    title: 'Sibling Fee Concession Request (KG & Class III)',
    description: 'Parent application for concession according to school governing body guidelines.',
    urgency: 'medium',
    dateSubmitted: '20 Oct 2026',
    submittedBy: 'Accounts Officer',
    actionRoute: '/portal/council/finance',
  },
  {
    id: 'task-4',
    category: 'Staff',
    title: 'Primary Assistant Teacher Vacancy Shortlist',
    description: 'Panel recommendations for primary foundational reading and phonics educator.',
    urgency: 'normal',
    dateSubmitted: '19 Oct 2026',
    submittedBy: 'Academic Committee',
    actionRoute: '/portal/council/faculty-access',
  },
];

export const COUNCIL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act-1',
    timestamp: '09:15 AM',
    title: 'Daily morning attendance registered for all 6 wings (328 present, 14 absent, 3 excused)',
    actor: 'Class Teachers',
    category: 'attendance',
  },
  {
    id: 'act-2',
    timestamp: '08:45 AM',
    title: 'Offline tuition fee collection logged: ₹5,400 for Class II-B (Receipt #ST-REC-2026-0418)',
    actor: 'Accounts Counter',
    category: 'finance',
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday 04:30 PM',
    title: 'Term 2 evaluation marks uploaded by Class IV teachers for Principal moderation',
    actor: 'Senior Primary Wing',
    category: 'academics',
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday 02:15 PM',
    title: '2 new online admission enquiries registered for Academic Session 2026–27',
    actor: 'Public Portal Desk',
    category: 'admissions',
  },
  {
    id: 'act-5',
    timestamp: '20 Oct 11:30 AM',
    title: 'Class II-B student leave request approved for 22 Oct 2026',
    actor: 'Mrs. S. Ganguly',
    category: 'attendance',
  },
];

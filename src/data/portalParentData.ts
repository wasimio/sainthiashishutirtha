/**
 * DEMO FIXTURES FOR PARENT / GUARDIAN PORTAL
 * 
 * DISCLAIMER:
 * Illustrative sample fixtures for UI testing and evaluation.
 * Not real student identities, payment receipts, or medical records.
 */

export interface ParentChildProfile {
  id: string;
  scholarId: string;
  name: string;
  grade: string;
  section: string;
  rollNo: number;
  dob: string;
  bloodGroup: string;
  classTeacher: string;
  classTeacherContact: string;
  avatarInitials: string;
  attendancePct: number;
  presentDays: number;
  totalWorkingDays: number;
  excusedLeaves: number;
  unexcusedAbsences: number;
  busRoute: string;
  activeHomeworkCount: number;
  pendingFeeAmount: number;
  feeStatus: 'Up to Date' | 'Term 3 Due' | 'Overdue';
}

export interface ParentHomeworkItem {
  id: string;
  childId: string;
  subject: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  teacherName: string;
  instructions: string;
  attachmentName?: string;
  isCompleted: boolean;
}

export interface ParentReportCardSubject {
  subject: string;
  fullMarks: number;
  passMarks: number;
  marksObtained: number;
  gradeLetter: string;
  teacherRemarks: string;
}

export interface ParentFeeInvoice {
  id: string;
  childId: string;
  invoiceNo: string;
  termTitle: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Overdue';
  paymentDate?: string;
  receiptNo?: string;
  paymentMode?: string;
  breakdown: { head: string; amount: number }[];
}

export interface ParentAbsenceRequest {
  id: string;
  childId: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reasonCategory: 'Medical / Sickness' | 'Family Function' | 'Emergency' | 'Travel';
  reasonText: string;
  submittedOn: string;
  status: 'Approved' | 'Under Review' | 'Rejected';
  reviewedBy?: string;
}

export const PARENT_PROFILE = {
  guardianId: 'GRD-2024-055',
  primaryGuardianName: 'Mr. Subrata Sen',
  secondaryGuardianName: 'Mrs. Priyanka Sen',
  email: 'parent.demo@sainthiashishutirtha.org',
  phone: '+91 94340 12890',
  address: 'Station Road, Ward No. 7, Sainthia, Birbhum, West Bengal 731234',
  emergencyContact: '+91 98321 99002 (Maternal Grandparent)',
};

export const SIBLING_CHILDREN: ParentChildProfile[] = [
  {
    id: 'child-aarav',
    scholarId: 'ST-2024-089',
    name: 'Aarav Sen',
    grade: 'Class II',
    section: 'B',
    rollNo: 14,
    dob: '14 August 2018',
    bloodGroup: 'B+',
    classTeacher: 'Mrs. Sharmistha Ganguly',
    classTeacherContact: 'Office Ext: 104 (Mon–Fri, 2:30–3:15 PM)',
    avatarInitials: 'AS',
    attendancePct: 96.4,
    presentDays: 81,
    totalWorkingDays: 84,
    excusedLeaves: 2,
    unexcusedAbsences: 1,
    busRoute: 'School Bus Route #2 (Station Road / College More)',
    activeHomeworkCount: 2,
    pendingFeeAmount: 0,
    feeStatus: 'Up to Date',
  },
  {
    id: 'child-ananya',
    scholarId: 'ST-2026-034',
    name: 'Ananya Sen',
    grade: 'Pre-Primary / Nursery',
    section: 'A',
    rollNo: 6,
    dob: '22 February 2022',
    bloodGroup: 'O+',
    classTeacher: 'Mrs. Poulomi Das',
    classTeacherContact: 'Office Ext: 101 (Mon–Fri, 12:00–12:45 PM)',
    avatarInitials: 'AN',
    attendancePct: 93.8,
    presentDays: 60,
    totalWorkingDays: 64,
    excusedLeaves: 4,
    unexcusedAbsences: 0,
    busRoute: 'Parent Drop & Pick-up (Walk-in)',
    activeHomeworkCount: 1,
    pendingFeeAmount: 2400,
    feeStatus: 'Term 3 Due',
  },
];

export const PARENT_HOMEWORK_ITEMS: ParentHomeworkItem[] = [
  // For Aarav (Class II)
  {
    id: 'phw-01',
    childId: 'child-aarav',
    subject: 'English Language',
    title: 'Phonics & Reading Practice: "The Little Red Hen"',
    assignedDate: '2026-10-21',
    dueDate: '2026-10-23',
    teacherName: 'Mrs. S. Ganguly',
    instructions: 'Read Chapter 4 aloud twice at home. Underline compound words and copy 5 sentences in cursive script in your English notebook.',
    attachmentName: 'Chapter4_Phonics_Worksheet.pdf',
    isCompleted: false,
  },
  {
    id: 'phw-02',
    childId: 'child-aarav',
    subject: 'Environmental Studies',
    title: 'Parts of a Plant & Seed Observation',
    assignedDate: '2026-10-20',
    dueDate: '2026-10-24',
    teacherName: 'Mrs. S. Ganguly',
    instructions: 'Observe a potted houseplant. Label root, stem, leaf and flower in Workbook Page 24.',
    attachmentName: 'Plant_Diagram_Reference.pdf',
    isCompleted: true,
  },
  {
    id: 'phw-03',
    childId: 'child-aarav',
    subject: 'Bengali (সহজ পাঠ)',
    title: 'সহজ পাঠ - দ্বিতীয় ভাগ (কবিতা আবৃত্তি)',
    assignedDate: '2026-10-18',
    dueDate: '2026-10-20',
    teacherName: 'Mrs. M. Mukherjee',
    instructions: 'প্রথম ৪ লাইন সুন্দর উচ্চারণে মুখস্থ করে পড়তে হবে। খাতায় একবার পরিষ্কার করে লিখে আনবে।',
    isCompleted: true,
  },
  // For Ananya (Nursery)
  {
    id: 'phw-04',
    childId: 'child-ananya',
    subject: 'Pre-Primary Activity',
    title: 'Colouring & Fine Motor: Primary Colors Wheel',
    assignedDate: '2026-10-21',
    dueDate: '2026-10-23',
    teacherName: 'Mrs. P. Das',
    instructions: 'Colour the sun yellow and tree leaf green inside the borders using wax crayons.',
    attachmentName: 'Kindergarten_Crayon_Worksheet.pdf',
    isCompleted: false,
  },
];

export const PARENT_REPORT_CARDS: Record<string, { term: string; rank: string; totalMarks: number; maxMarks: number; percentage: string; subjects: ParentReportCardSubject[]; remarks: string }> = {
  'child-aarav': {
    term: 'Term 1 Cumulative Evaluation (2025–2026)',
    rank: '3rd in Class Section',
    totalMarks: 278,
    maxMarks: 300,
    percentage: '92.7%',
    subjects: [
      { subject: 'English Language & Reading', fullMarks: 50, passMarks: 20, marksObtained: 47, gradeLetter: 'A+', teacherRemarks: 'Very fluent oral reading and clear handwriting.' },
      { subject: 'Bengali Literature & Spelling', fullMarks: 50, passMarks: 20, marksObtained: 45, gradeLetter: 'A+', teacherRemarks: 'Good phonetic grasp of Bengali conjuncts.' },
      { subject: 'Mental Arithmetic & Tables', fullMarks: 50, passMarks: 20, marksObtained: 48, gradeLetter: 'A+', teacherRemarks: 'Rapid mental calculation and neat number drafting.' },
      { subject: 'Environmental Studies (EVS)', fullMarks: 50, passMarks: 20, marksObtained: 46, gradeLetter: 'A+', teacherRemarks: 'Observant child; curious about natural surroundings.' },
      { subject: 'Art, Craft & Handwriting', fullMarks: 50, passMarks: 20, marksObtained: 44, gradeLetter: 'A', teacherRemarks: 'Shows great enthusiasm in watercolor sessions.' },
      { subject: 'Physical Education & Discipline', fullMarks: 50, passMarks: 20, marksObtained: 48, gradeLetter: 'A+', teacherRemarks: 'Courteous, cooperative, and energetic on campus.' },
    ],
    remarks: 'Aarav is an exemplary, disciplined student with an innate curiosity for reading and storytelling. Promoted with Distinction.',
  },
  'child-ananya': {
    term: 'Kindergarten Foundation Assessment (Term 1)',
    rank: 'Grade A+ Star Scholar',
    totalMarks: 190,
    maxMarks: 200,
    percentage: '95.0%',
    subjects: [
      { subject: 'Phonetic Sound Identification', fullMarks: 50, passMarks: 20, marksObtained: 48, gradeLetter: 'A+', teacherRemarks: 'Quickly grasps letter-sound relationships.' },
      { subject: 'Number Concepts (1 to 20)', fullMarks: 50, passMarks: 20, marksObtained: 46, gradeLetter: 'A+', teacherRemarks: 'Accurate object counting and grouping skills.' },
      { subject: 'Sensory Play & Fine Motor', fullMarks: 50, passMarks: 20, marksObtained: 49, gradeLetter: 'A+', teacherRemarks: 'Excellent clay moulding and scissor control.' },
      { subject: 'Social Interaction & Rhymes', fullMarks: 50, passMarks: 20, marksObtained: 47, gradeLetter: 'A+', teacherRemarks: 'Loves singing along during morning assembly circles.' },
    ],
    remarks: 'Ananya has settled happily into the campus routine. She expresses her needs clearly and participates with joy.',
  },
};

export const PARENT_FEE_INVOICES: ParentFeeInvoice[] = [
  {
    id: 'inv-01',
    childId: 'child-aarav',
    invoiceNo: 'INV-2025-0104',
    termTitle: 'Term 1 Tuition & Annual Development Fee',
    issueDate: '2025-06-10',
    dueDate: '2025-06-30',
    amount: 5400,
    status: 'Paid',
    paymentDate: '2025-06-18',
    receiptNo: 'REC-2025-0092',
    paymentMode: 'Net Banking (SBI)',
    breakdown: [
      { head: 'Tuition Fee (Q1)', amount: 3600 },
      { head: 'Annual Development Fee', amount: 1200 },
      { head: 'Library & Activity Kit', amount: 600 },
    ],
  },
  {
    id: 'inv-02',
    childId: 'child-aarav',
    invoiceNo: 'INV-2025-0452',
    termTitle: 'Term 2 Tuition & Computer Lab Fee',
    issueDate: '2025-10-01',
    dueDate: '2025-10-20',
    amount: 4200,
    status: 'Paid',
    paymentDate: '2025-10-14',
    receiptNo: 'REC-2026-0891',
    paymentMode: 'Bank Transfer (NEFT)',
    breakdown: [
      { head: 'Tuition Fee (Q2)', amount: 3600 },
      { head: 'Computer & Audio-Visual Lab', amount: 600 },
    ],
  },
  {
    id: 'inv-03',
    childId: 'child-ananya',
    invoiceNo: 'INV-2026-0044',
    termTitle: 'Kindergarten Term 1 Admission & Montessori Kit',
    issueDate: '2026-01-10',
    dueDate: '2026-01-25',
    amount: 6800,
    status: 'Paid',
    paymentDate: '2026-01-15',
    receiptNo: 'REC-2026-0120',
    paymentMode: 'UPI',
    breakdown: [
      { head: 'Admission & Registration Charge', amount: 3500 },
      { head: 'Nursery Tuition Fee (Q1)', amount: 2400 },
      { head: 'Montessori Activity Material', amount: 900 },
    ],
  },
  {
    id: 'inv-04',
    childId: 'child-ananya',
    invoiceNo: 'INV-2026-0310',
    termTitle: 'Nursery Term 3 Tuition Fee',
    issueDate: '2026-10-15',
    dueDate: '2026-11-05',
    amount: 2400,
    status: 'Due',
    breakdown: [
      { head: 'Tuition Fee (Q3)', amount: 2400 },
    ],
  },
];

export const PARENT_ABSENCE_REQUESTS: ParentAbsenceRequest[] = [
  {
    id: 'abs-01',
    childId: 'child-aarav',
    startDate: '2026-09-12',
    endDate: '2026-09-13',
    daysCount: 2,
    reasonCategory: 'Medical / Sickness',
    reasonText: 'Mild seasonal viral fever and pediatrician advised bed rest.',
    submittedOn: '2026-09-11',
    status: 'Approved',
    reviewedBy: 'Mrs. S. Ganguly (Class Teacher)',
  },
  {
    id: 'abs-02',
    childId: 'child-aarav',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    daysCount: 2,
    reasonCategory: 'Family Function',
    reasonText: 'Family wedding ceremony at Bolpur, Santiniketan.',
    submittedOn: '2026-10-20',
    status: 'Under Review',
  },
];

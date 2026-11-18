/**
 * DEMO FIXTURES FOR ADMIN / COUNCIL PORTAL
 * 
 * DISCLAIMER:
 * These records are strictly illustrative sample fixtures for UI testing and evaluation.
 * They do NOT represent real student records, live financial transactions, or verified personal data.
 */

export interface AdminStudent {
  id: string;
  scholarId: string;
  name: string;
  grade: string;
  section: string;
  rollNo: number;
  gender: 'Male' | 'Female';
  dob: string;
  guardianName: string;
  guardianPhone: string;
  bloodGroup: string;
  status: 'Enrolled' | 'Under Review' | 'TC Issued';
  feeStatus: 'Up to Date' | 'Dues Pending' | 'Overdue';
}

export interface AdminAdmissionApplication {
  id: string;
  applicationNo: string;
  candidateName: string;
  appliedGrade: string;
  guardianName: string;
  guardianPhone: string;
  submissionDate: string;
  stage: 'Applied' | 'Document Verification' | 'Parent Interaction' | 'Provisional Admission' | 'Enrolled';
  status: 'Pending Review' | 'Verified' | 'Approved' | 'Deferred';
  notes: string;
}

export interface AdminFacultyAccount {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  assignedGrade: string;
  subject: string;
  email: string;
  phone: string;
  role: 'Class Teacher' | 'Subject Teacher' | 'Coordinator' | 'Administrator';
  status: 'Active' | 'On Leave';
  lastActive: string;
}

export interface AdminFeeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  scholarId: string;
  grade: string;
  feeHead: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'Bank Transfer (NEFT)' | 'UPI' | 'Cash at Counter' | 'Cheque';
  status: 'Paid' | 'Pending Verification' | 'Overdue';
}

export interface AdminCmsNotice {
  id: string;
  title: string;
  category: 'Academic' | 'Holiday' | 'Admission' | 'Circular';
  publishDate: string;
  author: string;
  status: 'Published' | 'Draft' | 'Archived';
  pinned: boolean;
  content: string;
}

export const ADMIN_STUDENTS_LIST: AdminStudent[] = [
  {
    id: 'st-01',
    scholarId: 'ST-2024-089',
    name: 'Aarav Sen',
    grade: 'Class II',
    section: 'B',
    rollNo: 14,
    gender: 'Male',
    dob: '2018-08-14',
    guardianName: 'Subrata Sen',
    guardianPhone: '+91 94340 12890',
    bloodGroup: 'B+',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
  {
    id: 'st-02',
    scholarId: 'ST-2026-034',
    name: 'Ananya Sen',
    grade: 'Nursery / KG-I',
    section: 'A',
    rollNo: 6,
    gender: 'Female',
    dob: '2022-02-22',
    guardianName: 'Subrata Sen',
    guardianPhone: '+91 94340 12890',
    bloodGroup: 'O+',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
  {
    id: 'st-03',
    scholarId: 'ST-2023-042',
    name: 'Bishal Mukherjee',
    grade: 'Class II',
    section: 'A',
    rollNo: 3,
    gender: 'Male',
    dob: '2018-05-11',
    guardianName: 'Sunil Mukherjee',
    guardianPhone: '+91 98321 44510',
    bloodGroup: 'A+',
    status: 'Enrolled',
    feeStatus: 'Dues Pending',
  },
  {
    id: 'st-04',
    scholarId: 'ST-2022-018',
    name: 'Debasmita Roy',
    grade: 'Class IV',
    section: 'A',
    rollNo: 8,
    gender: 'Female',
    dob: '2016-11-29',
    guardianName: 'Prabir Roy',
    guardianPhone: '+91 97334 88120',
    bloodGroup: 'AB+',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
  {
    id: 'st-05',
    scholarId: 'ST-2025-067',
    name: 'Ishaan Banerjee',
    grade: 'Class I',
    section: 'B',
    rollNo: 19,
    gender: 'Male',
    dob: '2019-09-04',
    guardianName: 'Amit Banerjee',
    guardianPhone: '+91 94740 66231',
    bloodGroup: 'B+',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
  {
    id: 'st-06',
    scholarId: 'ST-2023-095',
    name: 'Kavya Mondal',
    grade: 'Class III',
    section: 'A',
    rollNo: 21,
    gender: 'Female',
    dob: '2017-07-19',
    guardianName: 'Rabin Mondal',
    guardianPhone: '+91 96478 99014',
    bloodGroup: 'O-',
    status: 'Enrolled',
    feeStatus: 'Overdue',
  },
  {
    id: 'st-07',
    scholarId: 'ST-2024-112',
    name: 'Rohan Ghosh',
    grade: 'Class II',
    section: 'B',
    rollNo: 28,
    gender: 'Male',
    dob: '2018-12-03',
    guardianName: 'Manojit Ghosh',
    guardianPhone: '+91 94348 22109',
    bloodGroup: 'A-',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
  {
    id: 'st-08',
    scholarId: 'ST-2022-005',
    name: 'Sohini Das',
    grade: 'Class IV',
    section: 'B',
    rollNo: 2,
    gender: 'Female',
    dob: '2016-04-15',
    guardianName: 'Sandip Das',
    guardianPhone: '+91 98320 11984',
    bloodGroup: 'B+',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
  {
    id: 'st-09',
    scholarId: 'ST-2025-014',
    name: 'Sourish Pal',
    grade: 'Kindergarten (KG-II)',
    section: 'A',
    rollNo: 11,
    gender: 'Male',
    dob: '2020-03-25',
    guardianName: 'Alok Pal',
    guardianPhone: '+91 97322 55670',
    bloodGroup: 'O+',
    status: 'Enrolled',
    feeStatus: 'Dues Pending',
  },
  {
    id: 'st-10',
    scholarId: 'ST-2023-078',
    name: 'Titas Dutta',
    grade: 'Class III',
    section: 'B',
    rollNo: 15,
    gender: 'Female',
    dob: '2017-10-10',
    guardianName: 'Joydeep Dutta',
    guardianPhone: '+91 94341 77800',
    bloodGroup: 'B+',
    status: 'Enrolled',
    feeStatus: 'Up to Date',
  },
];

export const ADMIN_ADMISSIONS_LIST: AdminAdmissionApplication[] = [
  {
    id: 'adm-01',
    applicationNo: 'APP-2026-041',
    candidateName: 'Rudra Sengupta',
    appliedGrade: 'Pre-Primary / Nursery',
    guardianName: 'Dr. Kaushik Sengupta',
    guardianPhone: '+91 94342 88123',
    submissionDate: '2026-10-18',
    stage: 'Document Verification',
    status: 'Verified',
    notes: 'Birth certificate and immunization record verified. Eligible for parent meeting.',
  },
  {
    id: 'adm-02',
    applicationNo: 'APP-2026-042',
    candidateName: 'Shruti Bhattacharya',
    appliedGrade: 'Class I',
    guardianName: 'Dipankar Bhattacharya',
    guardianPhone: '+91 98325 11904',
    submissionDate: '2026-10-19',
    stage: 'Parent Interaction',
    status: 'Approved',
    notes: 'Prior schooling at Santiniketan Kindergarten. Readiness assessment cleared.',
  },
  {
    id: 'adm-03',
    applicationNo: 'APP-2026-043',
    candidateName: 'Ayush Karmakar',
    appliedGrade: 'Kindergarten (KG-II)',
    guardianName: 'Gopal Karmakar',
    guardianPhone: '+91 97331 44509',
    submissionDate: '2026-10-20',
    stage: 'Applied',
    status: 'Pending Review',
    notes: 'Online submission received. Awaiting original address proof and photograph submission.',
  },
  {
    id: 'adm-04',
    applicationNo: 'APP-2026-044',
    candidateName: 'Trisha Chowdhury',
    appliedGrade: 'Class II',
    guardianName: 'Samir Chowdhury',
    guardianPhone: '+91 94744 33210',
    submissionDate: '2026-10-21',
    stage: 'Provisional Admission',
    status: 'Approved',
    notes: 'Seat offered in Class II Section A. Term 1 admission fees pending receipt.',
  },
  {
    id: 'adm-05',
    applicationNo: 'APP-2026-045',
    candidateName: 'Arjun Dasgupta',
    appliedGrade: 'Pre-Primary / Nursery',
    guardianName: 'Sourav Dasgupta',
    guardianPhone: '+91 96472 88910',
    submissionDate: '2026-10-22',
    stage: 'Applied',
    status: 'Pending Review',
    notes: 'Digital application via website form. Scheduled for morning verification slot.',
  },
];

export const ADMIN_FACULTY_LIST: AdminFacultyAccount[] = [
  {
    id: 'fac-01',
    employeeId: 'ST-FAC-014',
    name: 'Mrs. Sharmistha Ganguly',
    designation: 'Senior Primary Teacher',
    assignedGrade: 'Class II-A & Class III',
    subject: 'English & Environmental Studies',
    email: 'sharmistha.ganguly@shishutirtha.org',
    phone: '+91 94340 55120',
    role: 'Class Teacher',
    status: 'Active',
    lastActive: '12 mins ago',
  },
  {
    id: 'fac-02',
    employeeId: 'ST-FAC-008',
    name: 'Mr. Tanmoy Roy',
    designation: 'Primary Mathematics Coordinator',
    assignedGrade: 'Class II, III & IV',
    subject: 'Mathematics & Arithmetic',
    email: 'tanmoy.roy@shishutirtha.org',
    phone: '+91 98321 77340',
    role: 'Coordinator',
    status: 'Active',
    lastActive: '28 mins ago',
  },
  {
    id: 'fac-03',
    employeeId: 'ST-FAC-019',
    name: 'Mrs. Moushumi Mukherjee',
    designation: 'Language Faculty',
    assignedGrade: 'Class I & II',
    subject: 'Bengali Literature (সহজ পাঠ)',
    email: 'moushumi.mukherjee@shishutirtha.org',
    phone: '+91 97334 11890',
    role: 'Subject Teacher',
    status: 'Active',
    lastActive: '1 hour ago',
  },
  {
    id: 'fac-04',
    employeeId: 'ST-FAC-003',
    name: 'Dr. Debabrata Banerjee',
    designation: 'Academic Dean & Governing Council Member',
    assignedGrade: 'Institutional Oversight',
    subject: 'Educational Administration',
    email: 'debabrata.banerjee@shishutirtha.org',
    phone: '+91 94340 00101',
    role: 'Administrator',
    status: 'Active',
    lastActive: 'Online Now',
  },
];

export const ADMIN_FEE_TRANSACTIONS: AdminFeeRecord[] = [
  {
    id: 'fee-01',
    receiptNo: 'REC-2026-0891',
    studentName: 'Aarav Sen',
    scholarId: 'ST-2024-089',
    grade: 'Class II-B',
    feeHead: 'Term 2 Tuition & Activity Fee',
    amount: 4200,
    paymentDate: '2026-10-14',
    paymentMode: 'Bank Transfer (NEFT)',
    status: 'Paid',
  },
  {
    id: 'fee-02',
    receiptNo: 'REC-2026-0892',
    studentName: 'Ananya Sen',
    scholarId: 'ST-2026-034',
    grade: 'Nursery-A',
    feeHead: 'Term 2 Tuition & Montessori Kit',
    amount: 3800,
    paymentDate: '2026-10-14',
    paymentMode: 'UPI',
    status: 'Paid',
  },
  {
    id: 'fee-03',
    receiptNo: 'REC-2026-0893',
    studentName: 'Bishal Mukherjee',
    scholarId: 'ST-2023-042',
    grade: 'Class II-A',
    feeHead: 'Term 2 Tuition Fee',
    amount: 3200,
    paymentDate: '2026-10-18',
    paymentMode: 'Cash at Counter',
    status: 'Paid',
  },
  {
    id: 'fee-04',
    receiptNo: 'REC-2026-0894',
    studentName: 'Kavya Mondal',
    scholarId: 'ST-2023-095',
    grade: 'Class III-A',
    feeHead: 'Term 2 Tuition & Books',
    amount: 4500,
    paymentDate: '2026-10-21',
    paymentMode: 'Cheque',
    status: 'Pending Verification',
  },
];

export const ADMIN_CMS_NOTICES: AdminCmsNotice[] = [
  {
    id: 'cms-01',
    title: 'Admission Window Open for Academic Session 2026–2027 (KG – Class IV)',
    category: 'Admission',
    publishDate: '2026-10-15',
    author: 'Principal Office',
    status: 'Published',
    pinned: true,
    content: 'Applications are invited for Kindergarten, Class I, II, III and IV. Prospectus and offline inquiry forms available at the school campus counter on weekdays.',
  },
  {
    id: 'cms-02',
    title: 'Annual Sports & Physical Culture Day Schedule',
    category: 'Academic',
    publishDate: '2026-10-19',
    author: 'Sports Committee',
    status: 'Published',
    pinned: false,
    content: 'The Annual Sports Meet for Junior & Senior Primary wings will be held at the Sainthia Municipal Stadium in December 2026.',
  },
  {
    id: 'cms-03',
    title: 'Mid-Term Parent-Teacher Consultation Meeting (PTM) Guidelines',
    category: 'Circular',
    publishDate: '2026-10-22',
    author: 'Academic Coordinator',
    status: 'Draft',
    pinned: false,
    content: 'Scheduled for Saturday, 7 November 2026. Grade-wise consultation slots will be distributed via student diaries and parent portal.',
  },
];

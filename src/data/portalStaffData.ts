/**
 * DEMO FIXTURES FOR STAFF / FACULTY PORTAL
 * 
 * DISCLAIMER:
 * Illustrative sample fixtures for UI testing and evaluation.
 * Not real student attendance records, grades, or personal information.
 */

export interface StaffStudentAttendance {
  rollNo: number;
  scholarId: string;
  name: string;
  gender: 'M' | 'F';
  guardianPhone: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface StaffHomework {
  id: string;
  title: string;
  grade: string;
  section: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  instructions: string;
  attachmentName?: string;
  submissionsCount: number;
  totalStudents: number;
  status: 'Active' | 'Review Completed' | 'Archived';
}

export interface StaffMarksRecord {
  rollNo: number;
  scholarId: string;
  studentName: string;
  marksObtained: number;
  maxMarks: number;
  gradeLetter: string;
  remarks: string;
}

export interface StaffStudentRemark {
  id: string;
  studentName: string;
  scholarId: string;
  grade: string;
  category: 'Academic' | 'Behavioral' | 'Appreciation' | 'Attendance';
  date: string;
  content: string;
  visibility: 'Parents Only' | 'Internal Faculty' | 'Both';
}

export const STAFF_PROFILE = {
  employeeId: 'ST-FAC-014',
  name: 'Mrs. Sharmistha Ganguly',
  designation: 'Senior Primary Teacher & Class II-A Mentor',
  department: 'Primary English & Environmental Studies',
  qualification: 'M.A. (English), B.Ed. (Visva-Bharati University)',
  experience: '9 Years',
  email: 'sharmistha.ganguly@shishutirtha.org',
  phone: '+91 94340 55120',
  assignedSections: [
    { grade: 'Class II', section: 'A', role: 'Class Teacher', students: 32 },
    { grade: 'Class III', section: 'B', role: 'Subject Teacher (English)', students: 30 },
    { grade: 'Class IV', section: 'A', role: 'Subject Teacher (EVS)', students: 28 },
  ],
  todaySchedule: [
    { period: 'Period 1', time: '8:00 – 8:45 AM', grade: 'Class II-A', subject: 'English Reading & Phonics', room: 'Room 201' },
    { period: 'Period 2', time: '8:45 – 9:30 AM', grade: 'Class II-A', subject: 'Daily Attendance & Moral Science', room: 'Room 201' },
    { period: 'Period 3', time: '9:30 – 10:15 AM', grade: 'Class III-B', subject: 'English Grammar & Composition', room: 'Room 302' },
    { period: 'Break', time: '10:15 – 10:45 AM', grade: 'Campus', subject: 'Staff Assembly & Tiffin', room: 'Staff Room' },
    { period: 'Period 4', time: '10:45 – 11:30 AM', grade: 'Class IV-A', subject: 'Environmental Studies (Plant Life)', room: 'Room 401' },
    { period: 'Period 5', time: '11:30 – 12:15 PM', grade: 'Class II-A', subject: 'Storytelling & Cursive Penmanship', room: 'Room 201' },
  ],
  leaveBalance: {
    casualLeave: '6 Remaining of 12',
    medicalLeave: '8 Remaining of 10',
    earnedLeave: '14 Days Accrued',
  },
};

export const STAFF_ATTENDANCE_REGISTER: StaffStudentAttendance[] = [
  { rollNo: 1, scholarId: 'ST-2024-001', name: 'Aahan Chakraborty', gender: 'M', guardianPhone: '+91 94341 12345', status: 'present' },
  { rollNo: 2, scholarId: 'ST-2024-002', name: 'Aditi Ghosh', gender: 'F', guardianPhone: '+91 98320 22345', status: 'present' },
  { rollNo: 3, scholarId: 'ST-2023-042', name: 'Bishal Mukherjee', gender: 'M', guardianPhone: '+91 98321 44510', status: 'present' },
  { rollNo: 4, scholarId: 'ST-2024-004', name: 'Bristi Mondal', gender: 'F', guardianPhone: '+91 97334 33456', status: 'present' },
  { rollNo: 5, scholarId: 'ST-2024-005', name: 'Debjit Roy', gender: 'M', guardianPhone: '+91 96478 44567', status: 'late', notes: 'Arrived 8:15 AM due to rain' },
  { rollNo: 6, scholarId: 'ST-2024-006', name: 'Diya Das', gender: 'F', guardianPhone: '+91 94740 55678', status: 'present' },
  { rollNo: 7, scholarId: 'ST-2024-007', name: 'Gourab Pal', gender: 'M', guardianPhone: '+91 94348 66789', status: 'present' },
  { rollNo: 8, scholarId: 'ST-2024-008', name: 'Ishani Sen', gender: 'F', guardianPhone: '+91 98322 77890', status: 'present' },
  { rollNo: 9, scholarId: 'ST-2024-009', name: 'Jeet Karmakar', gender: 'M', guardianPhone: '+91 97325 88901', status: 'absent', notes: 'Parent notified: Viral fever' },
  { rollNo: 10, scholarId: 'ST-2024-010', name: 'Koyel Banerjee', gender: 'F', guardianPhone: '+91 96471 99012', status: 'present' },
  { rollNo: 11, scholarId: 'ST-2024-011', name: 'Mayank Dutta', gender: 'M', guardianPhone: '+91 94342 00123', status: 'present' },
  { rollNo: 12, scholarId: 'ST-2024-012', name: 'Nilanjana Saha', gender: 'F', guardianPhone: '+91 98324 11234', status: 'present' },
  { rollNo: 13, scholarId: 'ST-2024-013', name: 'Pritam Ghosh', gender: 'M', guardianPhone: '+91 97332 22345', status: 'present' },
  { rollNo: 14, scholarId: 'ST-2024-089', name: 'Aarav Sen', gender: 'M', guardianPhone: '+91 94340 12890', status: 'present' },
  { rollNo: 15, scholarId: 'ST-2024-015', name: 'Riya Chatterjee', gender: 'F', guardianPhone: '+91 96470 33456', status: 'present' },
  { rollNo: 16, scholarId: 'ST-2024-016', name: 'Sayan Dey', gender: 'M', guardianPhone: '+91 94741 44567', status: 'present' },
  { rollNo: 17, scholarId: 'ST-2024-017', name: 'Shreya Roy', gender: 'F', guardianPhone: '+91 94345 55678', status: 'present' },
  { rollNo: 18, scholarId: 'ST-2024-018', name: 'Subham Pal', gender: 'M', guardianPhone: '+91 98323 66789', status: 'present' },
  { rollNo: 19, scholarId: 'ST-2024-019', name: 'Tanvi Sen', gender: 'F', guardianPhone: '+91 97330 77890', status: 'absent' },
  { rollNo: 20, scholarId: 'ST-2024-020', name: 'Uddalak Mukherjee', gender: 'M', guardianPhone: '+91 96474 88901', status: 'present' },
];

export const STAFF_HOMEWORK_LIST: StaffHomework[] = [
  {
    id: 'hw-01',
    title: 'English Phonics: Read & Record "The Little Red Hen"',
    grade: 'Class II',
    section: 'A',
    subject: 'English Language',
    assignedDate: '2026-10-21',
    dueDate: '2026-10-23',
    instructions: 'Read Chapter 4 aloud twice. Underline five new compound words in your reader book and write sentences in cursive handwriting.',
    attachmentName: 'Chapter4_Phonics_Worksheet.pdf',
    submissionsCount: 26,
    totalStudents: 32,
    status: 'Active',
  },
  {
    id: 'hw-02',
    title: 'EVS Workbook: Parts of a Plant & Seed Germination',
    grade: 'Class II',
    section: 'A',
    subject: 'Environmental Studies',
    assignedDate: '2026-10-20',
    dueDate: '2026-10-24',
    instructions: 'Complete Workbook Page 24. Draw a neat diagram of a mustard seedling and label root, stem, leaf and bud.',
    attachmentName: 'Plant_Diagram_Reference.pdf',
    submissionsCount: 19,
    totalStudents: 32,
    status: 'Active',
  },
  {
    id: 'hw-03',
    title: 'Poetry Recitation Preparation: "The Swing" by R.L. Stevenson',
    grade: 'Class III',
    section: 'B',
    subject: 'English Literature',
    assignedDate: '2026-10-18',
    dueDate: '2026-10-22',
    instructions: 'Memorize the first two stanzas with rhythmic intonation. Class recitation tomorrow.',
    submissionsCount: 30,
    totalStudents: 30,
    status: 'Review Completed',
  },
];

export const STAFF_MARKS_ROSTER: StaffMarksRecord[] = [
  { rollNo: 1, scholarId: 'ST-2024-001', studentName: 'Aahan Chakraborty', marksObtained: 46, maxMarks: 50, gradeLetter: 'A+', remarks: 'Exceptional comprehension and neat handwriting.' },
  { rollNo: 2, scholarId: 'ST-2024-002', studentName: 'Aditi Ghosh', marksObtained: 42, maxMarks: 50, gradeLetter: 'A', remarks: 'Good vocabulary; minor punctuation slips.' },
  { rollNo: 3, scholarId: 'ST-2023-042', studentName: 'Bishal Mukherjee', marksObtained: 38, maxMarks: 50, gradeLetter: 'B+', remarks: 'Steady progress in sentence construction.' },
  { rollNo: 4, scholarId: 'ST-2024-004', studentName: 'Bristi Mondal', marksObtained: 48, maxMarks: 50, gradeLetter: 'A+', remarks: 'Outstanding creative paragraph writing.' },
  { rollNo: 5, scholarId: 'ST-2024-005', studentName: 'Debjit Roy', marksObtained: 34, maxMarks: 50, gradeLetter: 'B', remarks: 'Needs revision in singular-plural forms.' },
  { rollNo: 14, scholarId: 'ST-2024-089', studentName: 'Aarav Sen', marksObtained: 45, maxMarks: 50, gradeLetter: 'A+', remarks: 'Excellent reading articulation and spelling accuracy.' },
];

export const STAFF_STUDENT_REMARKS: StaffStudentRemark[] = [
  {
    id: 'rem-01',
    studentName: 'Aarav Sen (Roll #14)',
    scholarId: 'ST-2024-089',
    grade: 'Class II-A',
    category: 'Appreciation',
    date: '2026-10-18',
    content: 'Volunteered enthusiastically during our library storytelling circle. Very polite peer cooperation.',
    visibility: 'Both',
  },
  {
    id: 'rem-02',
    studentName: 'Bishal Mukherjee (Roll #03)',
    scholarId: 'ST-2023-042',
    grade: 'Class II-A',
    category: 'Academic',
    date: '2026-10-19',
    content: 'Requires mild revision on 2-digit borrowing subtraction. Please practice 10 problems daily at home.',
    visibility: 'Both',
  },
  {
    id: 'rem-03',
    studentName: 'Tanvi Sen (Roll #19)',
    scholarId: 'ST-2024-019',
    grade: 'Class II-A',
    category: 'Attendance',
    date: '2026-10-21',
    content: 'Consecutive absence recorded on Wednesday. Class diary updated for parent follow-up.',
    visibility: 'Internal Faculty',
  },
];

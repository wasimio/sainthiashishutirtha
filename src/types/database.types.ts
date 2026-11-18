/**
-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- TypeScript Database Definitions
-- File: src/types/database.types.ts
-- Matching Supabase PostgreSQL Schema Migrations (20261022000001 - 20261022000007)
-- ==============================================================================
*/

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'admin' | 'staff' | 'parent';
export type GuardianVerificationStatus = 'pending' | 'verified' | 'rejected';
export type StudentStatus = 'Enrolled' | 'Under Review' | 'TC Issued' | 'Alumni' | 'Suspended';
export type EnrollmentStatus = 'active' | 'promoted' | 'transferred' | 'withdrawn';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type HomeworkStatus = 'Active' | 'Review Completed' | 'Archived';
export type InvoiceStatus = 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled' | 'Waived';
export type PaymentStatus = 'Initiated' | 'Completed' | 'Bounced' | 'Reversed' | 'Refunded';
export type PaymentMode = 'Bank Transfer (NEFT)' | 'UPI' | 'Cash at Counter' | 'Cheque' | 'Online Gateway';
export type NoticeCategory = 'Academic' | 'Holiday' | 'Admission' | 'Circular';
export type NoticeAudience = 'All' | 'Public' | 'Staff Only' | 'Parents Only' | 'Class Specific';
export type AdmissionStage = 'Applied' | 'Document Verification' | 'Parent Interaction' | 'Provisional Admission' | 'Enrolled' | 'Rejected';
export type AdmissionStatus = 'Pending Review' | 'Verified' | 'Approved' | 'Deferred' | 'Withdrawn';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: AppRole;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: AppRole;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: AppRole;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      staff_profiles: {
        Row: {
          profile_id: string;
          employee_id: string;
          designation: string;
          department: string | null;
          qualification: string | null;
          experience_years: number;
          joining_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          employee_id: string;
          designation: string;
          department?: string | null;
          qualification?: string | null;
          experience_years?: number;
          joining_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          employee_id?: string;
          designation?: string;
          department?: string | null;
          qualification?: string | null;
          experience_years?: number;
          joining_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      guardians: {
        Row: {
          id: string;
          profile_id: string | null;
          guardian_code: string;
          primary_guardian_name: string;
          primary_phone: string;
          secondary_guardian_name: string | null;
          secondary_phone: string | null;
          email: string | null;
          residential_address: string | null;
          verification_status: GuardianVerificationStatus;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          guardian_code: string;
          primary_guardian_name: string;
          primary_phone: string;
          secondary_guardian_name?: string | null;
          secondary_phone?: string | null;
          email?: string | null;
          residential_address?: string | null;
          verification_status?: GuardianVerificationStatus;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string | null;
          primary_guardian_name?: string;
          primary_phone?: string;
          secondary_guardian_name?: string | null;
          secondary_phone?: string | null;
          email?: string | null;
          residential_address?: string | null;
          verification_status?: GuardianVerificationStatus;
          verified_at?: string | null;
          verified_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      guardian_invitations: {
        Row: {
          id: string;
          guardian_id: string;
          email: string;
          invitation_token: string;
          expires_at: string;
          claimed_at: string | null;
          claimed_by: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          guardian_id: string;
          email: string;
          invitation_token: string;
          expires_at: string;
          claimed_at?: string | null;
          claimed_by?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          claimed_at?: string | null;
          claimed_by?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      academic_years: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          start_date?: string;
          end_date?: string;
          is_current?: boolean;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          name: string;
          code: string;
          wing: 'Early Childhood' | 'Pre-Primary' | 'Junior Primary' | 'Senior Primary';
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          wing: 'Early Childhood' | 'Pre-Primary' | 'Junior Primary' | 'Senior Primary';
          display_order: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
          wing?: 'Early Childhood' | 'Pre-Primary' | 'Junior Primary' | 'Senior Primary';
          display_order?: number;
        };
        Relationships: [];
      };
      sections: {
        Row: {
          id: string;
          class_id: string;
          academic_year_id: string;
          name: string;
          capacity: number;
          room_number: string | null;
          class_teacher_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          academic_year_id: string;
          name: string;
          capacity?: number;
          room_number?: string | null;
          class_teacher_id?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          capacity?: number;
          room_number?: string | null;
          class_teacher_id?: string | null;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
          description?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          scholar_id: string;
          first_name: string;
          last_name: string;
          gender: 'Male' | 'Female' | 'Other';
          date_of_birth: string;
          blood_group: string | null;
          status: StudentStatus;
          emergency_contact_phone: string | null;
          medical_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scholar_id: string;
          first_name: string;
          last_name: string;
          gender: 'Male' | 'Female' | 'Other';
          date_of_birth: string;
          blood_group?: string | null;
          status?: StudentStatus;
          emergency_contact_phone?: string | null;
          medical_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          gender?: 'Male' | 'Female' | 'Other';
          date_of_birth?: string;
          blood_group?: string | null;
          status?: StudentStatus;
          emergency_contact_phone?: string | null;
          medical_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_enrollments: {
        Row: {
          id: string;
          student_id: string;
          section_id: string;
          academic_year_id: string;
          roll_number: number;
          enrollment_date: string;
          status: EnrollmentStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          section_id: string;
          academic_year_id: string;
          roll_number: number;
          enrollment_date?: string;
          status?: EnrollmentStatus;
          created_at?: string;
        };
        Update: {
          section_id?: string;
          roll_number?: number;
          status?: EnrollmentStatus;
        };
        Relationships: [];
      };
      student_guardians: {
        Row: {
          id: string;
          student_id: string;
          guardian_id: string;
          relationship: 'Father' | 'Mother' | 'Legal Guardian' | 'Grandparent' | 'Other';
          is_primary: boolean;
          can_pickup: boolean;
          is_emergency_contact: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          guardian_id: string;
          relationship: 'Father' | 'Mother' | 'Legal Guardian' | 'Grandparent' | 'Other';
          is_primary?: boolean;
          can_pickup?: boolean;
          is_emergency_contact?: boolean;
          created_at?: string;
        };
        Update: {
          relationship?: 'Father' | 'Mother' | 'Legal Guardian' | 'Grandparent' | 'Other';
          is_primary?: boolean;
          can_pickup?: boolean;
          is_emergency_contact?: boolean;
        };
        Relationships: [];
      };
      teacher_allocations: {
        Row: {
          id: string;
          staff_id: string;
          section_id: string;
          subject_id: string;
          academic_year_id: string;
          role: 'Subject Teacher' | 'Co-Teacher' | 'Assistant';
          created_at: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          section_id: string;
          subject_id: string;
          academic_year_id: string;
          role?: 'Subject Teacher' | 'Co-Teacher' | 'Assistant';
          created_at?: string;
        };
        Update: {
          role?: 'Subject Teacher' | 'Co-Teacher' | 'Assistant';
        };
        Relationships: [];
      };
      attendance_sessions: {
        Row: {
          id: string;
          section_id: string;
          session_date: string;
          marked_by: string;
          marked_at: string;
          is_locked: boolean;
          locked_at: string | null;
          locked_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          session_date?: string;
          marked_by: string;
          marked_at?: string;
          is_locked?: boolean;
          locked_at?: string | null;
          locked_by?: string | null;
          created_at?: string;
        };
        Update: {
          is_locked?: boolean;
          locked_at?: string | null;
          locked_by?: string | null;
        };
        Relationships: [];
      };
      attendance_records: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          status: AttendanceStatus;
          remarks: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          status: AttendanceStatus;
          remarks?: string | null;
          created_at?: string;
        };
        Update: {
          status?: AttendanceStatus;
          remarks?: string | null;
        };
        Relationships: [];
      };
      homework: {
        Row: {
          id: string;
          section_id: string;
          subject_id: string;
          teacher_id: string;
          title: string;
          instructions: string;
          assigned_date: string;
          due_date: string;
          attachment_path: string | null;
          status: HomeworkStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          subject_id: string;
          teacher_id: string;
          title: string;
          instructions: string;
          assigned_date?: string;
          due_date: string;
          attachment_path?: string | null;
          status?: HomeworkStatus;
          created_at?: string;
        };
        Update: {
          title?: string;
          instructions?: string;
          due_date?: string;
          attachment_path?: string | null;
          status?: HomeworkStatus;
        };
        Relationships: [];
      };
      homework_submissions: {
        Row: {
          id: string;
          homework_id: string;
          student_id: string;
          is_completed: boolean;
          parent_acknowledgement: boolean;
          completed_at: string | null;
          teacher_feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          homework_id: string;
          student_id: string;
          is_completed?: boolean;
          parent_acknowledgement?: boolean;
          completed_at?: string | null;
          teacher_feedback?: string | null;
          created_at?: string;
        };
        Update: {
          is_completed?: boolean;
          parent_acknowledgement?: boolean;
          completed_at?: string | null;
          teacher_feedback?: string | null;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          academic_year_id: string;
          section_id: string;
          subject_id: string;
          teacher_id: string;
          term: string;
          name: string;
          assessment_date: string | null;
          max_marks: number;
          pass_marks: number;
          is_published: boolean;
          published_at: string | null;
          published_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          academic_year_id: string;
          section_id: string;
          subject_id: string;
          teacher_id: string;
          term: string;
          name: string;
          assessment_date?: string | null;
          max_marks: number;
          pass_marks: number;
          is_published?: boolean;
          published_at?: string | null;
          published_by?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          assessment_date?: string | null;
          max_marks?: number;
          pass_marks?: number;
          is_published?: boolean;
          published_at?: string | null;
          published_by?: string | null;
        };
        Relationships: [];
      };
      assessment_marks: {
        Row: {
          id: string;
          assessment_id: string;
          student_id: string;
          marks_obtained: number;
          grade_letter: string;
          teacher_remarks: string | null;
          entered_by: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          student_id: string;
          marks_obtained: number;
          grade_letter: string;
          teacher_remarks?: string | null;
          entered_by: string;
          updated_at?: string;
        };
        Update: {
          marks_obtained?: number;
          grade_letter?: string;
          teacher_remarks?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      report_cards: {
        Row: {
          id: string;
          student_id: string;
          academic_year_id: string;
          term: string;
          headmaster_remarks: string | null;
          attendance_percentage: number | null;
          overall_grade: string | null;
          promotion_status: 'Eligible' | 'Promoted' | 'Retained' | 'Under Review';
          is_published: boolean;
          published_at: string | null;
          published_by: string | null;
          pdf_storage_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          academic_year_id: string;
          term: string;
          headmaster_remarks?: string | null;
          attendance_percentage?: number | null;
          overall_grade?: string | null;
          promotion_status?: 'Eligible' | 'Promoted' | 'Retained' | 'Under Review';
          is_published?: boolean;
          published_at?: string | null;
          published_by?: string | null;
          pdf_storage_path?: string | null;
          created_at?: string;
        };
        Update: {
          headmaster_remarks?: string | null;
          attendance_percentage?: number | null;
          overall_grade?: string | null;
          promotion_status?: 'Eligible' | 'Promoted' | 'Retained' | 'Under Review';
          is_published?: boolean;
          published_at?: string | null;
          published_by?: string | null;
          pdf_storage_path?: string | null;
        };
        Relationships: [];
      };
      student_remarks: {
        Row: {
          id: string;
          student_id: string;
          staff_id: string;
          category: 'Academic' | 'Behavioral' | 'Appreciation' | 'Attendance';
          visibility: 'Parents Only' | 'Internal Faculty' | 'Both';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          staff_id: string;
          category: 'Academic' | 'Behavioral' | 'Appreciation' | 'Attendance';
          visibility?: 'Parents Only' | 'Internal Faculty' | 'Both';
          content: string;
          created_at?: string;
        };
        Update: {
          category?: 'Academic' | 'Behavioral' | 'Appreciation' | 'Attendance';
          visibility?: 'Parents Only' | 'Internal Faculty' | 'Both';
          content?: string;
        };
        Relationships: [];
      };
      absence_requests: {
        Row: {
          id: string;
          student_id: string;
          guardian_id: string;
          start_date: string;
          end_date: string;
          days_count: number;
          reason_category: 'Medical / Sickness' | 'Family Function' | 'Emergency' | 'Travel';
          reason_text: string;
          attachment_path: string | null;
          status: 'Under Review' | 'Approved' | 'Rejected';
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          guardian_id: string;
          start_date: string;
          end_date: string;
          days_count: number;
          reason_category: 'Medical / Sickness' | 'Family Function' | 'Emergency' | 'Travel';
          reason_text: string;
          attachment_path?: string | null;
          status?: 'Under Review' | 'Approved' | 'Rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          created_at?: string;
        };
        Update: {
          status?: 'Under Review' | 'Approved' | 'Rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
        };
        Relationships: [];
      };
      fee_heads: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_recurring: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_recurring?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_recurring?: boolean;
        };
        Relationships: [];
      };
      fee_structures: {
        Row: {
          id: string;
          academic_year_id: string;
          class_id: string;
          fee_head_id: string;
          term_title: string;
          amount: number;
          due_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          academic_year_id: string;
          class_id: string;
          fee_head_id: string;
          term_title: string;
          amount: number;
          due_date: string;
          created_at?: string;
        };
        Update: {
          amount?: number;
          due_date?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          invoice_no: string;
          student_id: string;
          academic_year_id: string;
          title: string;
          issue_date: string;
          due_date: string;
          total_amount: number;
          paid_amount: number;
          status: InvoiceStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_no: string;
          student_id: string;
          academic_year_id: string;
          title: string;
          issue_date?: string;
          due_date: string;
          total_amount: number;
          paid_amount?: number;
          status?: InvoiceStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          due_date?: string;
          total_amount?: number;
          paid_amount?: number;
          status?: InvoiceStatus;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          fee_head_id: string;
          description: string;
          amount: number;
          concession_amount: number;
          net_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          fee_head_id: string;
          description: string;
          amount: number;
          concession_amount?: number;
          created_at?: string;
        };
        Update: {
          description?: string;
          amount?: number;
          concession_amount?: number;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          receipt_no: string;
          student_id: string;
          guardian_id: string | null;
          amount: number;
          payment_date: string;
          payment_mode: PaymentMode;
          transaction_reference: string | null;
          status: PaymentStatus;
          collected_by: string;
          remarks: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          receipt_no: string;
          student_id: string;
          guardian_id?: string | null;
          amount: number;
          payment_date?: string;
          payment_mode: PaymentMode;
          transaction_reference?: string | null;
          status?: PaymentStatus;
          collected_by: string;
          remarks?: string | null;
          created_at?: string;
        };
        Update: {
          status?: PaymentStatus;
          remarks?: string | null;
        };
        Relationships: [];
      };
      payment_allocations: {
        Row: {
          id: string;
          payment_id: string;
          invoice_id: string;
          allocated_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          invoice_id: string;
          allocated_amount: number;
          created_at?: string;
        };
        Update: {
          allocated_amount?: number;
        };
        Relationships: [];
      };
      financial_adjustments: {
        Row: {
          id: string;
          invoice_id: string | null;
          payment_id: string | null;
          adjustment_type: 'Concession' | 'Waiver' | 'Late Fee Addition' | 'Refund' | 'Reversal';
          amount: number;
          reason: string;
          authorized_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id?: string | null;
          payment_id?: string | null;
          adjustment_type: 'Concession' | 'Waiver' | 'Late Fee Addition' | 'Refund' | 'Reversal';
          amount: number;
          reason: string;
          authorized_by: string;
          created_at?: string;
        };
        Update: {
          reason?: string;
        };
        Relationships: [];
      };
      admissions_applications: {
        Row: {
          id: string;
          application_no: string;
          academic_year_id: string;
          candidate_first_name: string;
          candidate_last_name: string;
          applied_class_id: string;
          date_of_birth: string;
          gender: 'Male' | 'Female' | 'Other';
          guardian_name: string;
          guardian_phone: string;
          guardian_email: string | null;
          residential_address: string;
          previous_school: string | null;
          stage: AdmissionStage;
          status: AdmissionStatus;
          internal_notes: string | null;
          assigned_reviewer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_no?: string;
          academic_year_id: string;
          candidate_first_name: string;
          candidate_last_name: string;
          applied_class_id: string;
          date_of_birth: string;
          gender: 'Male' | 'Female' | 'Other';
          guardian_name: string;
          guardian_phone: string;
          guardian_email?: string | null;
          residential_address: string;
          previous_school?: string | null;
          stage?: AdmissionStage;
          status?: AdmissionStatus;
          internal_notes?: string | null;
          assigned_reviewer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stage?: AdmissionStage;
          status?: AdmissionStatus;
          internal_notes?: string | null;
          assigned_reviewer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_outbox: {
        Row: {
          id: string;
          admission_application_id: string;
          template_key: 'admission_school_notification' | 'admission_parent_acknowledgement';
          recipient_email: string;
          recipient_name: string | null;
          payload: Json;
          idempotency_key: string;
          status: 'pending' | 'processing' | 'retry_scheduled' | 'sent' | 'failed';
          attempt_count: number;
          max_attempts: number;
          next_attempt_at: string;
          locked_at: string | null;
          sent_at: string | null;
          provider_status: number | null;
          last_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          admission_application_id: string;
          template_key: 'admission_school_notification' | 'admission_parent_acknowledgement';
          recipient_email: string;
          recipient_name?: string | null;
          payload?: Json;
          idempotency_key: string;
          status?: 'pending' | 'processing' | 'retry_scheduled' | 'sent' | 'failed';
          attempt_count?: number;
          max_attempts?: number;
          next_attempt_at?: string;
          locked_at?: string | null;
          sent_at?: string | null;
          provider_status?: number | null;
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'processing' | 'retry_scheduled' | 'sent' | 'failed';
          attempt_count?: number;
          next_attempt_at?: string;
          locked_at?: string | null;
          sent_at?: string | null;
          provider_status?: number | null;
          last_error?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notices: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          category: NoticeCategory;
          content: string;
          summary: string | null;
          author_id: string;
          updated_by: string | null;
          target_audience: NoticeAudience;
          target_class_id: string | null;
          is_pinned: boolean;
          status: 'Draft' | 'Published' | 'Archived';
          published_at: string | null;
          expires_at: string | null;
          attachment_path: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          category: NoticeCategory;
          content: string;
          summary?: string | null;
          author_id: string;
          updated_by?: string | null;
          target_audience?: NoticeAudience;
          target_class_id?: string | null;
          is_pinned?: boolean;
          status?: 'Draft' | 'Published' | 'Archived';
          published_at?: string | null;
          expires_at?: string | null;
          attachment_path?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string | null;
          category?: NoticeCategory;
          content?: string;
          summary?: string | null;
          author_id?: string;
          updated_by?: string | null;
          target_audience?: NoticeAudience;
          target_class_id?: string | null;
          is_pinned?: boolean;
          status?: 'Draft' | 'Published' | 'Archived';
          published_at?: string | null;
          expires_at?: string | null;
          attachment_path?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      school_settings: {
        Row: {
          id: string;
          school_name: string;
          short_name: string | null;
          tagline: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          about_text: string | null;
          estd_year: string | null;
          school_type: string | null;
          board: string | null;
          registration_no: string | null;
          udise_code: string;
          affiliation: string | null;
          campus_address: string;
          landmark: string | null;
          ward: string | null;
          city: string | null;
          district: string | null;
          state: string | null;
          pincode: string | null;
          map_location_url: string | null;
          official_phone: string;
          primary_phone: string | null;
          secondary_phone: string | null;
          admission_phone: string | null;
          official_email: string;
          social_links: Json | null;
          summer_timing: string | null;
          winter_timing: string | null;
          working_days: string | null;
          weekly_holidays: string | null;
          office_hours: string | null;
          admission_hours: string | null;
          curriculum: string | null;
          classes_offered: string | null;
          academic_session: string | null;
          medium_of_instruction: string | null;
          facilities_summary: string | null;
          current_academic_year_id: string | null;
          fee_late_fine_daily: number | null;
          attendance_grace_period_mins: number | null;
          seo_default_title: string | null;
          seo_default_description: string | null;
          seo_og_image_url: string | null;
          seo_canonical_base: string | null;
          seo_robots_directive: string | null;
          announcement_banner: Json | null;
          draft_settings: Json | null;
          published_at: string | null;
          draft_updated_at: string | null;
          draft_updated_by: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          school_name?: string;
          short_name?: string | null;
          tagline?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          about_text?: string | null;
          estd_year?: string | null;
          school_type?: string | null;
          board?: string | null;
          registration_no?: string | null;
          udise_code?: string;
          affiliation?: string | null;
          campus_address?: string;
          landmark?: string | null;
          ward?: string | null;
          city?: string | null;
          district?: string | null;
          state?: string | null;
          pincode?: string | null;
          map_location_url?: string | null;
          official_phone?: string;
          primary_phone?: string | null;
          secondary_phone?: string | null;
          admission_phone?: string | null;
          official_email?: string;
          social_links?: Json | null;
          summer_timing?: string | null;
          winter_timing?: string | null;
          working_days?: string | null;
          weekly_holidays?: string | null;
          office_hours?: string | null;
          admission_hours?: string | null;
          curriculum?: string | null;
          classes_offered?: string | null;
          academic_session?: string | null;
          medium_of_instruction?: string | null;
          facilities_summary?: string | null;
          current_academic_year_id?: string | null;
          fee_late_fine_daily?: number | null;
          attendance_grace_period_mins?: number | null;
          seo_default_title?: string | null;
          seo_default_description?: string | null;
          seo_og_image_url?: string | null;
          seo_canonical_base?: string | null;
          seo_robots_directive?: string | null;
          announcement_banner?: Json | null;
          draft_settings?: Json | null;
          published_at?: string | null;
          draft_updated_at?: string | null;
          draft_updated_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          school_name?: string;
          short_name?: string | null;
          tagline?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          about_text?: string | null;
          estd_year?: string | null;
          school_type?: string | null;
          board?: string | null;
          registration_no?: string | null;
          udise_code?: string;
          affiliation?: string | null;
          campus_address?: string;
          landmark?: string | null;
          ward?: string | null;
          city?: string | null;
          district?: string | null;
          state?: string | null;
          pincode?: string | null;
          map_location_url?: string | null;
          official_phone?: string;
          primary_phone?: string | null;
          secondary_phone?: string | null;
          admission_phone?: string | null;
          official_email?: string;
          social_links?: Json | null;
          summer_timing?: string | null;
          winter_timing?: string | null;
          working_days?: string | null;
          weekly_holidays?: string | null;
          office_hours?: string | null;
          admission_hours?: string | null;
          curriculum?: string | null;
          classes_offered?: string | null;
          academic_session?: string | null;
          medium_of_instruction?: string | null;
          facilities_summary?: string | null;
          current_academic_year_id?: string | null;
          fee_late_fine_daily?: number | null;
          attendance_grace_period_mins?: number | null;
          seo_default_title?: string | null;
          seo_default_description?: string | null;
          seo_og_image_url?: string | null;
          seo_canonical_base?: string | null;
          seo_robots_directive?: string | null;
          announcement_banner?: Json | null;
          draft_settings?: Json | null;
          published_at?: string | null;
          draft_updated_at?: string | null;
          draft_updated_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      contact_inquiries: {
        Row: {
          id: string;
          reference_no: string;
          parent_name: string;
          phone: string;
          email: string | null;
          subject: string;
          class_interest: string | null;
          message: string;
          status: 'New' | 'Contacted' | 'Resolved' | 'Archived';
          internal_notes: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          ip_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_no?: string;
          parent_name: string;
          phone: string;
          email?: string | null;
          subject?: string;
          class_interest?: string | null;
          message?: string | null;
          status?: 'New' | 'Contacted' | 'Resolved' | 'Archived';
          internal_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          ip_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_no?: string;
          parent_name?: string;
          phone?: string;
          email?: string | null;
          subject?: string;
          class_interest?: string | null;
          message?: string;
          status?: 'New' | 'Contacted' | 'Resolved' | 'Archived';
          internal_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          ip_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cms_admin_roles: {
        Row: {
          profile_id: string;
          role: 'super_admin' | 'content_editor' | 'enquiry_manager';
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          role: 'super_admin' | 'content_editor' | 'enquiry_manager';
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          role?: 'super_admin' | 'content_editor' | 'enquiry_manager';
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cms_admin_roles_profile_id_fkey';
            columns: ['profile_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      website_pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          meta_title: string | null;
          meta_description: string | null;
          is_published: boolean;
          published_at: string | null;
          draft_data: Json | null;
          draft_updated_at: string | null;
          draft_updated_by: string | null;
          content_revision: number;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          meta_title?: string | null;
          meta_description?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          draft_data?: Json | null;
          draft_updated_at?: string | null;
          draft_updated_by?: string | null;
          content_revision?: number;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          draft_data?: Json | null;
          draft_updated_at?: string | null;
          draft_updated_by?: string | null;
          content_revision?: number;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      website_sections: {
        Row: {
          id: string;
          page_id: string;
          section_key: string;
          section_type: string;
          title: string;
          subtitle: string | null;
          content_json: Json;
          sort_order: number;
          is_published: boolean;
          draft_title: string | null;
          draft_subtitle: string | null;
          draft_content: Json | null;
          draft_sort_order: number | null;
          draft_updated_at: string | null;
          draft_updated_by: string | null;
          is_deleted_in_draft: boolean;
          is_new_in_draft: boolean;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          section_key: string;
          section_type?: string;
          title: string;
          subtitle?: string | null;
          content_json?: Json;
          sort_order?: number;
          is_published?: boolean;
          draft_title?: string | null;
          draft_subtitle?: string | null;
          draft_content?: Json | null;
          draft_sort_order?: number | null;
          draft_updated_at?: string | null;
          draft_updated_by?: string | null;
          is_deleted_in_draft?: boolean;
          is_new_in_draft?: boolean;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_id?: string;
          section_key?: string;
          section_type?: string;
          title?: string;
          subtitle?: string | null;
          content_json?: Json;
          sort_order?: number;
          is_published?: boolean;
          draft_title?: string | null;
          draft_subtitle?: string | null;
          draft_content?: Json | null;
          draft_sort_order?: number | null;
          draft_updated_at?: string | null;
          draft_updated_by?: string | null;
          is_deleted_in_draft?: boolean;
          is_new_in_draft?: boolean;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'website_sections_page_id_fkey';
            columns: ['page_id'];
            referencedRelation: 'website_pages';
            referencedColumns: ['id'];
          }
        ];
      };
      media_assets: {
        Row: {
          id: string;
          bucket_id: string;
          file_path: string;
          file_name: string;
          mime_type: string;
          file_size: number;
          width: number | null;
          height: number | null;
          alt_text: string;
          uploaded_by: string | null;
          storage_provider: 'supabase' | 'hostinger';
          public_url: string | null;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          caption: string | null;
          category: 'general' | 'campus' | 'academic' | 'sports' | 'cultural' | 'celebration' | 'document' | 'notice' | 'profile';
          status: 'pending' | 'ready' | 'failed';
          album_id: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bucket_id?: string;
          file_path: string;
          file_name: string;
          mime_type: string;
          file_size: number;
          width?: number | null;
          height?: number | null;
          alt_text?: string;
          uploaded_by?: string | null;
          storage_provider?: 'supabase' | 'hostinger';
          public_url?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          caption?: string | null;
          category?: 'general' | 'campus' | 'academic' | 'sports' | 'cultural' | 'celebration' | 'document' | 'notice' | 'profile';
          status?: 'pending' | 'ready' | 'failed';
          album_id?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bucket_id?: string;
          file_path?: string;
          file_name?: string;
          mime_type?: string;
          file_size?: number;
          width?: number | null;
          height?: number | null;
          alt_text?: string;
          uploaded_by?: string | null;
          storage_provider?: 'supabase' | 'hostinger';
          public_url?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          caption?: string | null;
          category?: 'general' | 'campus' | 'academic' | 'sports' | 'cultural' | 'celebration' | 'document' | 'notice' | 'profile';
          status?: 'pending' | 'ready' | 'failed';
          album_id?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          album_id: string | null;
          title: string;
          caption: string | null;
          alt_text: string;
          category: 'Campus & Infrastructure' | 'Classroom & Learning' | 'Sports & Activities' | 'Cultural & Events' | 'Celebrations';
          media_asset_id: string | null;
          image_url: string;
          sort_order: number;
          is_published: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          album_id?: string | null;
          title: string;
          caption?: string | null;
          alt_text?: string;
          category: 'Campus & Infrastructure' | 'Classroom & Learning' | 'Sports & Activities' | 'Cultural & Events' | 'Celebrations';
          media_asset_id?: string | null;
          image_url: string;
          sort_order?: number;
          is_published?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string | null;
          title?: string;
          caption?: string | null;
          alt_text?: string;
          category?: 'Campus & Infrastructure' | 'Classroom & Learning' | 'Sports & Activities' | 'Cultural & Events' | 'Celebrations';
          media_asset_id?: string | null;
          image_url?: string;
          sort_order?: number;
          is_published?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'gallery_items_media_asset_id_fkey';
            columns: ['media_asset_id'];
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          }
        ];
      };
      gallery_albums: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image_url: string | null;
          category: 'Campus & Infrastructure' | 'Classroom & Learning' | 'Sports & Activities' | 'Cultural & Events' | 'Celebrations';
          sort_order: number;
          is_published: boolean;
          published_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image_url?: string | null;
          category?: 'Campus & Infrastructure' | 'Classroom & Learning' | 'Sports & Activities' | 'Cultural & Events' | 'Celebrations';
          sort_order?: number;
          is_published?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image_url?: string | null;
          category?: 'Campus & Infrastructure' | 'Classroom & Learning' | 'Sports & Activities' | 'Cultural & Events' | 'Celebrations';
          sort_order?: number;
          is_published?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faculty_members: {
        Row: {
          id: string;
          name: string;
          designation: string;
          department: string;
          qualification: string | null;
          experience_years: number;
          bio: string | null;
          photo_url: string | null;
          sort_order: number;
          is_active: boolean;
          is_published: boolean;
          published_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          designation: string;
          department: string;
          qualification?: string | null;
          experience_years?: number;
          bio?: string | null;
          photo_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          is_published?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          designation?: string;
          department?: string;
          qualification?: string | null;
          experience_years?: number;
          bio?: string | null;
          photo_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          is_published?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      website_navigation: {
        Row: {
          id: string;
          menu_location: 'header_main' | 'footer_quick_links' | 'footer_academics' | 'footer_legal' | 'social_links';
          label: string;
          url: string;
          is_external: boolean;
          sort_order: number;
          is_published: boolean;
          target: '_self' | '_blank';
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          menu_location: 'header_main' | 'footer_quick_links' | 'footer_academics' | 'footer_legal' | 'social_links';
          label: string;
          url: string;
          is_external?: boolean;
          sort_order?: number;
          is_published?: boolean;
          target?: '_self' | '_blank';
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          menu_location?: 'header_main' | 'footer_quick_links' | 'footer_academics' | 'footer_legal' | 'social_links';
          label?: string;
          url?: string;
          is_external?: boolean;
          sort_order?: number;
          is_published?: boolean;
          target?: '_self' | '_blank';
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          cover_image_alt: string | null;
          category: 'Campus News' | 'Academics & Pedagogy' | 'Early Childhood' | 'School Events' | 'Parenting & Care' | 'Achievements';
          tags: string[];
          author_id: string | null;
          author_name: string;
          reading_time_minutes: number;
          status: 'Draft' | 'Published' | 'Archived';
          is_featured: boolean;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          canonical_url: string | null;
          og_image_url: string | null;
          view_count: number;
          is_deleted: boolean;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          category: 'Campus News' | 'Academics & Pedagogy' | 'Early Childhood' | 'School Events' | 'Parenting & Care' | 'Achievements';
          tags?: string[];
          author_id?: string | null;
          author_name?: string;
          reading_time_minutes?: number;
          status?: 'Draft' | 'Published' | 'Archived';
          is_featured?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          canonical_url?: string | null;
          og_image_url?: string | null;
          view_count?: number;
          is_deleted?: boolean;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          category?: 'Campus News' | 'Academics & Pedagogy' | 'Early Childhood' | 'School Events' | 'Parenting & Care' | 'Achievements';
          tags?: string[];
          author_id?: string | null;
          author_name?: string;
          reading_time_minutes?: number;
          status?: 'Draft' | 'Published' | 'Archived';
          is_featured?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          canonical_url?: string | null;
          og_image_url?: string | null;
          view_count?: number;
          is_deleted?: boolean;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_posts_author_id_fkey';
            columns: ['author_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_posts_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_posts_updated_by_fkey';
            columns: ['updated_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Functions: {
      is_cms_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_cms_role: {
        Args: { required_role: string };
        Returns: boolean;
      };
      cms_save_page_draft: {
        Args: {
          p_page_id: string;
          p_draft_data: Json;
          p_expected_revision: number;
          p_request_id: string;
        };
        Returns: Json;
      };
      cms_save_section_draft: {
        Args: {
          p_page_id: string;
          p_section_id: string;
          p_section_key: string;
          p_section_type: string;
          p_title: string;
          p_subtitle: string | null;
          p_content: Json;
          p_sort_order: number;
          p_expected_revision: number;
          p_request_id: string;
        };
        Returns: Json;
      };
      cms_add_section: {
        Args: {
          p_page_id: string;
          p_section_key: string;
          p_section_type: string;
          p_title: string;
          p_subtitle: string | null;
          p_content: Json;
          p_sort_order: number | null;
          p_expected_revision: number;
          p_request_id: string;
        };
        Returns: Json;
      };
      cms_stage_delete_section: {
        Args: {
          p_page_id: string;
          p_section_id: string;
          p_expected_revision: number;
          p_request_id: string;
        };
        Returns: Json;
      };
      cms_publish_page: {
        Args: { p_page_id: string; p_expected_revision: number; p_request_id: string };
        Returns: Json;
      };
      cms_discard_page_draft: {
        Args: { p_page_id: string; p_expected_revision: number; p_request_id: string };
        Returns: Json;
      };
      cms_reorder_page_sections: {
        Args: {
          p_page_id: string;
          p_ordered_section_ids: string[];
          p_expected_revision: number;
          p_request_id: string;
        };
        Returns: Json;
      };
      cms_unpublish_section: {
        Args: {
          p_page_id: string;
          p_section_id: string;
          p_expected_revision: number;
          p_request_id: string;
        };
        Returns: Json;
      };
      cms_unpublish_page: {
        Args: { p_page_id: string; p_expected_revision: number; p_request_id: string };
        Returns: Json;
      };
      cms_assign_user_role: {
        Args: {
          p_profile_id: string;
          p_role: string;
          p_notes?: string | null;
        };
        Returns: Json;
      };
      cms_toggle_user_active: {
        Args: {
          p_profile_id: string;
          p_is_active: boolean;
        };
        Returns: Json;
      };
      cms_set_notice_status: {
        Args: {
          p_notice_id: string;
          p_status: string;
        };
        Returns: Json;
      };
      cms_update_enquiry_status: {
        Args: {
          p_enquiry_id: string;
          p_status: string;
          p_internal_notes?: string | null;
        };
        Returns: Json;
      };
      cms_delete_enquiry: {
        Args: {
          p_enquiry_id: string;
        };
        Returns: Json;
      };
      cms_update_seo_settings: {
        Args: {
          p_title?: string | null;
          p_desc?: string | null;
          p_og_image?: string | null;
          p_canonical?: string | null;
          p_robots?: string | null;
          p_banner?: Json;
        };
        Returns: Json;
      };
      submit_admission_enquiry: {
        Args: {
          p_academic_year_id: string;
          p_applied_class_id: string;
          p_candidate_first_name: string;
          p_candidate_last_name: string;
          p_date_of_birth: string;
          p_gender: string;
          p_guardian_name: string;
          p_guardian_phone: string;
          p_guardian_email?: string | null;
          p_residential_address?: string | null;
          p_previous_school?: string | null;
        };
        Returns: {
          success: boolean;
          application_no: string;
        };
      };
      current_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      try_cast_uuid: {
        Args: { val: string };
        Returns: string | null;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_parent: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_guardian_of: {
        Args: { target_student_id: string };
        Returns: boolean;
      };
      is_teacher_of_section: {
        Args: { target_section_id: string };
        Returns: boolean;
      };
      is_teacher_of_student: {
        Args: { target_student_id: string };
        Returns: boolean;
      };
      cms_set_blog_post_status: {
        Args: {
          p_post_id: string;
          p_status: 'Draft' | 'Published' | 'Archived';
        };
        Returns: Json;
      };
      cms_soft_delete_blog_post: {
        Args: {
          p_post_id: string;
        };
        Returns: Json;
      };
      cms_restore_blog_post: {
        Args: {
          p_post_id: string;
        };
        Returns: Json;
      };
      increment_blog_post_views: {
        Args: {
          p_post_id: string;
        };
        Returns: void;
      };
    };
    Views: Record<string, never>;
    Enums: {
      app_role: AppRole;
      guardian_verification_status: GuardianVerificationStatus;
      student_status: StudentStatus;
      enrollment_status: EnrollmentStatus;
      attendance_status: AttendanceStatus;
      homework_status: HomeworkStatus;
      invoice_status: InvoiceStatus;
      payment_status: PaymentStatus;
      payment_mode: PaymentMode;
      notice_category: NoticeCategory;
      notice_audience: NoticeAudience;
      admission_stage: AdmissionStage;
      admission_status: AdmissionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type WebsitePageRow = Database['public']['Tables']['website_pages']['Row'];
export type WebsiteSectionRow = Database['public']['Tables']['website_sections']['Row'];
export type MediaAssetRow = Database['public']['Tables']['media_assets']['Row'];
export type GalleryItemRow = Database['public']['Tables']['gallery_items']['Row'];
export type CmsAdminRoleRow = Database['public']['Tables']['cms_admin_roles']['Row'];
export type SchoolSettingsRow = Database['public']['Tables']['school_settings']['Row'];
export type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];

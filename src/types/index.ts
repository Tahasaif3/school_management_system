// User types
export type UserRole = 'admin' | 'teacher' | 'student';
export type Status = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: Status;
  created_at: string;
  updated_at: string;
}

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  user: User;
}

// Student types
export interface Student {
  id: string;
  user_id?: string;
  roll_number: string;
  full_name: string;
  class: string;
  section: string;
  date_of_birth: string;
  guardian_contact: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

// Attendance types
export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  recorded_by: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceMarkRequest {
  date: string;
  attendance_records: {
    student_id: string;
    status: AttendanceStatus;
  }[];
}

export interface AttendanceSummary {
  student_id: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  percentage: number;
}

// Fee types
export type FeeType = 'tuition' | 'examination' | 'library' | 'transport' | 'other';
export type FeeStatus = 'unpaid' | 'paid';

export interface Fee {
  id: string;
  student_id: string;
  amount: number;
  fee_type: FeeType;
  due_date: string;
  status: FeeStatus;
  payment_date?: string;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

// Exam types
export type ExamType = 'unit' | 'midterm' | 'final' | 'practical';

export interface Exam {
  id: string;
  name: string;
  exam_type: ExamType;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

// Marksheet types
export type MarksheetStatus = 'draft' | 'published';

export interface Marksheet {
  id: string;
  student_id: string;
  exam_id: string;
  subject_marks: Record<string, number>;
  total_marks: number;
  percentage: number;
  grade: string;
  status: MarksheetStatus;
  created_at: string;
  updated_at: string;
}

export interface MarksHistory {
  id: string;
  marksheet_id: string;
  old_marks: Record<string, number>;
  new_marks: Record<string, number>;
  changed_by: string;
  change_reason?: string;
  created_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  error_code?: string;
}

// Subject types
export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  class: string;
  is_active: boolean;
  max_marks: string;
  created_at: string;
  updated_at: string;
}

// Fee summary types
export interface FeeSummary {
  total_fees: number;
  paid_fees: number;
  unpaid_fees: number;
  overdue_fees: number;
}

// Marksheet with exam details
export interface MarksheetWithExam extends Marksheet {
  exam?: Exam;
}

// Student profile with all related data
export interface StudentProfile extends Student {
  attendance_summary?: AttendanceSummary;
  fee_summary?: FeeSummary;
  marksheets?: MarksheetWithExam[];
  subjects?: Subject[];
}

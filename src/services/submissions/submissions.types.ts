export type SubmissionStatus = "Submitted" | "In Progress" | "Not Started";

export interface Submission {
  Submission_ID: number;
  Stud_ID: number;
  Student_Name: string;
  Track_ID: number;
  Track_Name: string;
  Course_ID: number;
  Course_Name: string;
  Exam_ID: number;
  Exam_Title: string;
  Exam_Duration_Minutes: number;
  Grade: number | null;
  Attempt_No: number;
  Max_Attempt: number;
  Submit_Date: string | null; // ISO string
  Taken_Date: string | null;  // ISO string
  Time_Taken_Minutes: number | null;
  Status: SubmissionStatus;
}

export interface SubmissionFilters {
  courseId: string | "all";
  examId: string | "all";
  studentId: string | "all";
  status: SubmissionStatus | "all";
}

export type SubmissionSortOption = 
  | "date_desc" 
  | "date_asc" 
  | "grade_desc" 
  | "grade_asc" 
  | "name_asc" 
  | "name_desc";

export interface SubmissionStats {
  total: number;
  graded: number;
  pending: number;
  avgGrade: number; // or string representation "85.50"
}

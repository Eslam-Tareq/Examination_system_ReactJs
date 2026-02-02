/**
 * Shared pagination props for any list: exams, questions, students, courses, submissions, etc.
 */
export type PaginationProps = {
  /** Current 1-based page */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Called when user changes page */
  onChange: (page: number) => void;
  /** How many page numbers to show beside current (e.g. 1 = prev, current, next) */
  siblingCount?: number;
  /** Optional class name for the container */
  className?: string;
};

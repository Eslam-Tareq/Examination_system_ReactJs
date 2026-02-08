import { mockSubmissions } from "./mockSubmissionsData";
import { Submission, SubmissionFilters, SubmissionSortOption, SubmissionStats } from "./submissions.types";

export const submissionMockService = {
  // Get all submissions for instructor
  getInstructorSubmissions: async (instructorId: number): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockSubmissions;
  },

  // Filter submissions
  filterSubmissions: async (filters: SubmissionFilters): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockSubmissions];

    if (filters.courseId && filters.courseId !== "all") {
      filtered = filtered.filter((s) => s.Course_ID === parseInt(filters.courseId));
    }

    if (filters.examId && filters.examId !== "all") {
      filtered = filtered.filter((s) => s.Exam_ID === parseInt(filters.examId));
    }

    if (filters.studentId && filters.studentId !== "all") {
      filtered = filtered.filter((s) => s.Stud_ID === parseInt(filters.studentId));
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((s) => s.Status === filters.status);
    }

    return filtered;
  },

  // Sort submissions
  sortSubmissions: (submissions: Submission[], sortBy: SubmissionSortOption): Submission[] => {
    const sorted = [...submissions];

    switch (sortBy) {
      case "date_desc":
        return sorted.sort((a, b) => {
          const dateA = a.Submit_Date ? new Date(a.Submit_Date).getTime() : 0;
          const dateB = b.Submit_Date ? new Date(b.Submit_Date).getTime() : 0;
          return dateB - dateA;
        });
      case "date_asc":
        return sorted.sort((a, b) => {
          const dateA = a.Submit_Date ? new Date(a.Submit_Date).getTime() : 0;
          const dateB = b.Submit_Date ? new Date(b.Submit_Date).getTime() : 0;
          return dateA - dateB;
        });
      case "grade_desc":
        return sorted.sort((a, b) => (b.Grade || 0) - (a.Grade || 0));
      case "grade_asc":
        return sorted.sort((a, b) => (a.Grade || 0) - (b.Grade || 0));
      case "name_asc":
        return sorted.sort((a, b) => a.Student_Name.localeCompare(b.Student_Name));
      case "name_desc":
        return sorted.sort((a, b) => b.Student_Name.localeCompare(a.Student_Name));
      default:
        return sorted;
    }
  },

  // Search submissions
  searchSubmissions: async (searchTerm: string): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!searchTerm) return mockSubmissions;

    const term = searchTerm.toLowerCase();
    return mockSubmissions.filter(
      (s) =>
        s.Student_Name.toLowerCase().includes(term) ||
        s.Exam_Title.toLowerCase().includes(term) ||
        s.Course_Name.toLowerCase().includes(term)
    );
  },

  // Get submission by ID
  getSubmissionById: async (submissionId: number): Promise<Submission | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions.find((s) => s.Submission_ID === submissionId);
  },

  // Get submission statistics
  getSubmissionStats: async (instructorId: number): Promise<SubmissionStats> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const total = mockSubmissions.length;
    const graded = mockSubmissions.filter((s) => s.Status === "Submitted").length;
    const pending = mockSubmissions.filter((s) => s.Status === "In Progress").length;
    const grades = mockSubmissions
      .filter((s) => s.Grade !== null)
      .map((s) => s.Grade as number);
    
    const avgGrade =
      grades.length > 0
        ? parseFloat((grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(2))
        : 0;

    return { total, graded, pending, avgGrade };
  },

  // Get submissions by student
  getStudentSubmissions: async (studentId: number): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions.filter((s) => s.Stud_ID === studentId);
  },

  // Get submissions by exam
  getExamSubmissions: async (examId: number): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions.filter((s) => s.Exam_ID === examId);
  },

  // Get submissions by course
  getCourseSubmissions: async (courseId: number): Promise<Submission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSubmissions.filter((s) => s.Course_ID === courseId);
  },
};

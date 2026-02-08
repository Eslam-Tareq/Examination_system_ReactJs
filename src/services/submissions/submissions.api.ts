import axios from "axios";
import { Submission, SubmissionFilters, SubmissionSortOption, SubmissionStats, SubmissionDetail, QuestionResult } from "./submissions.types";
import { storage } from "@/utils/storage";

// @ts-expect-error
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const submissionApiService = {
  // Get all submissions for instructor
  getInstructorSubmissions: async (instructorId: number): Promise<Submission[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/instructors/${instructorId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw error;
    }
  },

  // Filter submissions
  filterSubmissions: async (filters: SubmissionFilters): Promise<Submission[]> => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.courseId && filters.courseId !== "all") {
        queryParams.append("courseId", filters.courseId);
      }
      if (filters.examId && filters.examId !== "all") {
        queryParams.append("examId", filters.examId);
      }
      if (filters.studentId && filters.studentId !== "all") {
        queryParams.append("studentId", filters.studentId);
      }
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status);
      }

      // Assuming we can pass filters to a generic endpoint or the instructor endpoint
      const response = await axios.get(
        `${API_BASE_URL}/submissions?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error filtering submissions:", error);
      throw error;
    }
  },

  sortSubmissions: (submissions: Submission[], sortBy: SubmissionSortOption): Submission[] => {
      // Sorting is typically done on the client side in this architecture if the API returns a list,
      // or we could add a sort param to the API.
      // For now, implementing client-side sort helper similar to mock.
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
    try {
      const response = await axios.get(
        `${API_BASE_URL}/submissions/search?q=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching submissions:", error);
      throw error;
    }
  },

  // Get submission by ID
  getSubmissionById: async (submissionId: number): Promise<Submission> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/submissions/${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submission details:", error);
      throw error;
    }
  },

  // Get submission statistics
  getSubmissionStats: async (instructorId: number): Promise<SubmissionStats> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/instructors/${instructorId}/submissions/stats`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submission stats:", error);
      throw error;
    }
  },

  // Get submissions by student
  getStudentSubmissions: async (studentId: number): Promise<Submission[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/students/${studentId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student submissions:", error);
      throw error;
    }
  },

  // Get submissions by exam
  getExamSubmissions: async (examId: number): Promise<Submission[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/exams/${examId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching exam submissions:", error);
      throw error;
    }
  },

  // Get submissions by course
  getCourseSubmissions: async (courseId: number): Promise<Submission[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course submissions:", error);
      throw error;
    }
  },

  // Get submission with detailed answers
  getSubmissionWithAnswers: async (submissionId: number): Promise<SubmissionDetail> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/submissions/${submissionId}/details`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submission details:", error);
      throw error;
    }
  },

  // Get submission answers (questions + student answers)
  getSubmissionAnswers: async (submissionId: number): Promise<QuestionResult[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/submissions/${submissionId}/answers`,
        {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submission answers:", error);
      throw error;
    }
  },
};

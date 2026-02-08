import { mockSubmissions } from "./mockSubmissionsData";
import { Submission, SubmissionFilters, SubmissionSortOption, SubmissionStats, SubmissionDetail, QuestionResult } from "./submissions.types";

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

  // Get submission with detailed answers
  getSubmissionWithAnswers: async (submissionId: number): Promise<SubmissionDetail> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const submission = mockSubmissions.find(s => s.Submission_ID === submissionId);
    if (!submission) throw new Error("Submission not found");

    // Dynamic import to avoid circular dependency issues if any, or just standard import
    // Assuming relative path to questions mock
    const { getAllQuestionsMock } = await import("../questions/question.mock");
    const questions = await getAllQuestionsMock(submission.Exam_ID);
    
    // Deterministic answer generation based on grade
    const grade = submission.Grade || 0;
    const totalQuestions = questions.length;
    // Simple logic: first N questions are correct to match grade percentage roughly
    const correctCount = Math.round((grade / 100) * totalQuestions);
    
    // Create detailed questions
    const detailedQuestions: QuestionResult[] = questions.map((q, index) => {
        const isCorrect = index < correctCount;
        let studentAnswer: string | number | boolean;

        if (q.type === "MCQ") {
             const correctChoice = q.mcq?.choices.find(c => c.isCorrect);
             const wrongChoices = q.mcq?.choices.filter(c => !c.isCorrect) || [];
             
             if (isCorrect) {
                 studentAnswer = correctChoice?.choiceNo || 1;
             } else {
                 // Pick deterministic wrong answer
                 studentAnswer = wrongChoices.length > 0 
                    ? wrongChoices[index % wrongChoices.length].choiceNo 
                    : (correctChoice?.choiceNo || 1); // Fallback
             }
        } else {
            // TF
            const correctVal = q.tf?.correctChoice || false;
            studentAnswer = isCorrect ? correctVal : !correctVal;
        }

        return {
            Ques_ID: q.quesId,
            Exam_ID: q.examId,
            Ques_Text: q.text,
            Ques_Type: q.type,
            Ques_Mark: q.mark,
            Choices: q.mcq?.choices.map(c => ({
                Choice_No: c.choiceNo,
                Choice_Text: c.text,
                IsCorrect: c.isCorrect
            })),
            Correct_Choice: q.tf?.correctChoice,
            Student_Answer: studentAnswer,
            Is_Correct: isCorrect,
            Points_Earned: isCorrect ? q.mark : 0
        };
    });

    const totalPoints = detailedQuestions.reduce((sum, q) => sum + q.Ques_Mark, 0);
    const earnedPoints = detailedQuestions.reduce((sum, q) => sum + q.Points_Earned, 0);

    return {
        ...submission,
        Questions: detailedQuestions,
        Total_Questions: totalQuestions,
        Correct_Answers: correctCount,
        Total_Points: totalPoints,
        Points_Earned: earnedPoints
    };
  }
};

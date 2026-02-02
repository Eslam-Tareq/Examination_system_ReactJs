export type ExamStatus = "upcoming" | "active" | "completed";

/* ===== API Models ===== */

export type ExamDTO = {
  id: string;
  title: string;
  status: ExamStatus;
  date: string;
  duration: number;
  questionsCount: number;
  course: {
    id: string;
    name: string;
  };
};

/* ===== Frontend Model ===== */

export type Exam = {
  id: string;
  title: string;
  status: ExamStatus;
  date: string;
  duration: number;
  questionsCount: number;
  courseName: string;
};

/* ===== Requests ===== */

export type GetExamsRequest = {
  status?: ExamStatus;
};

/* ===== Responses ===== */

export type GetExamsResponse = {
  success: boolean;
  data: ExamDTO[];
};

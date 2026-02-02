export type QuestionType = "MCQ" | "TF";

/* ===== DB DTO ===== */
export type QuestionDTO = {
  quesId: number;
  examId: number;
  text: string;
  type: QuestionType;
  mark: number;

  mcq?: {
    allowMulti: boolean;
    choices: {
      choiceNo: number;
      text: string;
      isCorrect: boolean;
    }[];
  };

  tf?: {
    correctChoice: boolean;
  };
};

/* ===== Frontend Model ===== */
export type Question = {
  id: number;
  text: string;
  type: QuestionType;
  mark: number;
  choices?: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
  correctTF?: boolean;
};

/* ===== Requests ===== */
export type GetQuestionsRequest = {
  examId: number;
  page: number;
  pageSize: number;
};

/* ===== Responses ===== */
export type GetQuestionsResponse = {
  success: boolean;
  total: number;
  questions: QuestionDTO[];
};

export type QuestionType = "MCQ" | "TF";

/**
 * DTOs aligned with DB schema:
 * - Question: Ques_ID, Exam_ID, Ques_Text, Ques_Type, Ques_Mark
 * - Question_MCQ: Ques_ID, Exam_ID, Allow_Multi (BIT)
 * - Question_TF: Ques_ID, Exam_ID, Correct_Choice (BIT)
 * - MCQ_Choice: Choice_No, Ques_ID, Exam_ID, Choice_Text, IsCorrect (BIT)
 */
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
  /** For MCQ: allow multiple correct choices (DB: Question_MCQ.Allow_Multi) */
  allowMulti?: boolean;
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

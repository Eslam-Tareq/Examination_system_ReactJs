import { USE_MOCK } from "@/config/app.config";
import { Question, QuestionDTO } from "./question.types";
import { getQuestionsApi } from "./question.api";
import {
  getQuestionsMock,
  getAllQuestionsMock,
  addQuestionMock,
  updateQuestionMock,
  deleteQuestionMock,
} from "./question.mock";
import type { AddQuestionPayload } from "./question.mock";

export type { AddQuestionPayload };

const mapQuestion = (dto: QuestionDTO): Question => ({
  id: dto.quesId,
  text: dto.text,
  type: dto.type,
  mark: dto.mark,
  allowMulti: dto.mcq?.allowMulti ?? false,
  choices: dto.mcq?.choices?.map((c) => ({
    id: c.choiceNo,
    text: c.text,
    isCorrect: c.isCorrect,
  })),
  correctTF: dto.tf?.correctChoice,
});

export const getExamQuestions = async (
  examId: number,
  page: number,
  pageSize: number
) => {
  if (USE_MOCK) {
    const res = await getQuestionsMock(examId, page, pageSize);
    return {
      total: res.total,
      questions: res.questions.map(mapQuestion),
    };
  }
  const res = await getQuestionsApi({ examId, page, pageSize });
  return {
    total: res.total ?? 0,
    questions: (res.questions ?? []).map(mapQuestion),
  };
};

/** Get all questions for an exam (e.g. edit page). When backend: GET /exams/:examId/questions?pageSize=999 */
export const getAllExamQuestions = async (
  examId: number
): Promise<Question[]> => {
  if (USE_MOCK) {
    const dtos = await getAllQuestionsMock(examId);
    return dtos.map(mapQuestion);
  }
  const res = await getExamQuestions(examId, 1, 999);
  return res.questions;
};

export const addQuestion = async (
  examId: number,
  payload: AddQuestionPayload
): Promise<Question> => {
  if (USE_MOCK) {
    const dto = await addQuestionMock(examId, payload);
    return mapQuestion(dto);
  }
  // const res = await http.post(`/exams/${examId}/questions`, payload); return mapQuestion(res.data);
  throw new Error("Not implemented for API");
};

export const updateQuestion = async (
  quesId: number,
  payload: Partial<AddQuestionPayload>
): Promise<Question | null> => {
  if (USE_MOCK) {
    const dto = await updateQuestionMock(quesId, payload);
    return dto ? mapQuestion(dto) : null;
  }
  // const res = await http.patch(`/questions/${quesId}`, payload); return mapQuestion(res.data);
  return null;
};

export const deleteQuestion = async (
  quesId: number
): Promise<{ success: boolean }> => {
  if (USE_MOCK) {
    return deleteQuestionMock(quesId);
  }
  // await http.delete(`/questions/${quesId}`); return { success: true };
  return { success: false };
};

import { USE_MOCK } from "@/config/app.config";
import { Question, QuestionDTO } from "./question.types";
import { getQuestionsApi } from "./question.api";
import { getQuestionsMock } from "./question.mock";

const mapQuestion = (dto: QuestionDTO): Question => ({
  id: dto.quesId,
  text: dto.text,
  type: dto.type,
  mark: dto.mark,
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

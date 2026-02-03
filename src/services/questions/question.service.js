import { USE_MOCK } from "@/config/app.config";
import { getQuestionsApi } from "./question.api";
import { getQuestionsMock, getAllQuestionsMock, addQuestionMock, updateQuestionMock, deleteQuestionMock, } from "./question.mock";
const mapQuestion = (dto) => ({
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
export const getExamQuestions = async (examId, page, pageSize) => {
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
export const getAllExamQuestions = async (examId) => {
    if (USE_MOCK) {
        const dtos = await getAllQuestionsMock(examId);
        return dtos.map(mapQuestion);
    }
    const res = await getExamQuestions(examId, 1, 999);
    return res.questions;
};
export const addQuestion = async (examId, payload) => {
    if (USE_MOCK) {
        const dto = await addQuestionMock(examId, payload);
        return mapQuestion(dto);
    }
    // const res = await http.post(`/exams/${examId}/questions`, payload); return mapQuestion(res.data);
    throw new Error("Not implemented for API");
};
export const updateQuestion = async (quesId, payload) => {
    if (USE_MOCK) {
        const dto = await updateQuestionMock(quesId, payload);
        return dto ? mapQuestion(dto) : null;
    }
    // const res = await http.patch(`/questions/${quesId}`, payload); return mapQuestion(res.data);
    return null;
};
export const deleteQuestion = async (quesId) => {
    if (USE_MOCK) {
        return deleteQuestionMock(quesId);
    }
    // await http.delete(`/questions/${quesId}`); return { success: true };
    return { success: false };
};

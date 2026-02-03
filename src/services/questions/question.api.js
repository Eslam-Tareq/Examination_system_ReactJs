import http from "../http";
export const getQuestionsApi = async (params) => {
    const res = await http.get(`/exams/${params.examId}/questions`, { params });
    return res.data;
};

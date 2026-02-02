import http from "../http";
import { GetQuestionsRequest, GetQuestionsResponse } from "./question.types";

export const getQuestionsApi = async (
  params: GetQuestionsRequest,
): Promise<GetQuestionsResponse> => {
  const res = await http.get<GetQuestionsResponse>(
    `/exams/${params.examId}/questions`,
    { params },
  );
  return res.data;
};

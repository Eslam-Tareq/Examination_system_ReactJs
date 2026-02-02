import http from "@/services/http";
import { GetExamsRequest, GetExamsResponse } from "./exam.types";

export const getExamsApi = async (
  params: GetExamsRequest,
): Promise<GetExamsResponse> => {
  const res = await http.get<GetExamsResponse>("/exams", {
    params,
  });

  return res.data;
};

import { USE_MOCK } from "@/config/app.config";
import { Exam, ExamStatus } from "./exam.types";
import { getExamsApi } from "./exam.api";
import {
  getExamsMock,
  getExamsMockPaginated,
  getExamByIdMock,
  updateExamMock,
  createExamMock,
} from "./exam.mock";
import type { CreateExamPayload } from "./exam.mock";

export type { CreateExamPayload };

const mapExam = (dto: any): Exam => ({
  id: dto.id,
  title: dto.title,
  status: dto.status,
  date: new Date(dto.date).toLocaleString(),
  duration: dto.duration,
  questionsCount: dto.questionsCount,
  courseName: dto.course?.name ?? "",
});

export const getExams = async (status?: ExamStatus): Promise<Exam[]> => {
  if (USE_MOCK) {
    const data = await getExamsMock(status);
    return data.map(mapExam);
  }
  const res = await getExamsApi({ status });
  return (res.data ?? []).map(mapExam);
};

export type GetExamsPaginatedResult = { data: Exam[]; total: number };

/** Paginated exams for any list (examinations, dashboard, etc.) */
export const getExamsPaginated = async (
  status?: ExamStatus,
  page = 1,
  pageSize = 6
): Promise<GetExamsPaginatedResult> => {
  if (USE_MOCK) {
    const res = await getExamsMockPaginated(status, page, pageSize);
    return { data: res.data.map(mapExam), total: res.total };
  }
  const res = await getExamsApi({ status, page, pageSize });
  const data = (res.data ?? []).map(mapExam);
  const total = res.total ?? data.length;
  return { data, total };
};

/** Get single exam by id. When backend ready: GET /exams/:id */
export const getExamById = async (id: string): Promise<Exam | null> => {
  if (USE_MOCK) {
    const dto = await getExamByIdMock(id);
    return dto ? mapExam(dto) : null;
  }
  // const res = await http.get(`/exams/${id}`); return res.data ? mapExam(res.data) : null;
  return null;
};

/** Update exam. When backend ready: PATCH /exams/:id */
export const updateExam = async (
  id: string,
  data: Partial<
    Pick<
      Exam,
      "title" | "status" | "date" | "duration" | "questionsCount" | "courseName"
    >
  >
): Promise<{ success: boolean }> => {
  if (USE_MOCK) {
    return updateExamMock(id, data as any);
  }
  // await http.patch(`/exams/${id}`, data); return { success: true };
  return { success: false };
};

/** Create exam. When backend ready: POST /exams */
export const createExam = async (
  payload: CreateExamPayload
): Promise<Exam | null> => {
  if (USE_MOCK) {
    const dto = await createExamMock(payload);
    return mapExam(dto);
  }
  // const res = await http.post('/exams', payload); return mapExam(res.data);
  return null;
};

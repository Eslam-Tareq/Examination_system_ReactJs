import { USE_MOCK } from "@/config/app.config";
import { Exam, ExamStatus } from "./exam.types";
import { getExamsApi } from "./exam.api";
import { getExamsMock, getExamsMockPaginated } from "./exam.mock";

const mapExam = (dto: any): Exam => ({
  id: dto.id,
  title: dto.title,
  status: dto.status,
  date: new Date(dto.date).toLocaleString(),
  duration: dto.duration,
  questionsCount: dto.questionsCount,
  courseName: dto.course.name,
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

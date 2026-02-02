import { Exam, ExamStatus } from "./exam.types";
import { getExamsMock } from "./exam.mock";
// import { getExamsApi } from "./exam.api";

const USE_MOCK = true; // ← بس دي تتغير

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

  // const res = await getExamsApi({ status });
  // return res.data.map(mapExam);

  return [];
};

import { ExamDTO, ExamStatus } from "./exam.types";

const MOCK_EXAMS: ExamDTO[] = [
  {
    id: "1",
    title: "Midterm Exam",
    status: "upcoming",
    date: "2026-02-05T10:00:00",
    duration: 90,
    questionsCount: 50,
    course: {
      id: "CS201",
      name: "Data Structures",
    },
  },
  {
    id: "2",
    title: "Quiz 1",
    status: "active",
    date: "2026-02-01T15:00:00",
    duration: 60,
    questionsCount: 45,
    course: {
      id: "CS301",
      name: "Operating Systems",
    },
  },
  {
    id: "3",
    title: "Quiz 3",
    status: "completed",
    date: "2026-01-28T12:00:00",
    duration: 45,
    questionsCount: 30,
    course: {
      id: "CS401",
      name: "Algorithms",
    },
  },
];

export const getExamsMock = async (status?: ExamStatus): Promise<ExamDTO[]> => {
  await new Promise((res) => setTimeout(res, 400)); // fake delay

  if (!status) return MOCK_EXAMS;

  return MOCK_EXAMS.filter((e) => e.status === status);
};

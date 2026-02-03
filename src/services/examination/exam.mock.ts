import { ExamDTO, ExamStatus } from "./exam.types";

/**
 * Mock for exams list. Replace with real API when backend is ready.
 * Real API: GET /exams?status=upcoming|active|completed
 * Response shape: { success, data: ExamDTO[] }
 * See: src/services/mock/BACKEND_API_MAPPING.md
 */

const COURSES = [
  { id: "CS201", name: "Data Structures" },
  { id: "CS301", name: "Operating Systems" },
  { id: "CS401", name: "Algorithms" },
  { id: "CS501", name: "Database Systems" },
  { id: "CS601", name: "Networks" },
];

function makeExams(
  status: ExamStatus,
  startId: number,
  count: number,
  baseDate: string,
  dayOffset: number
): ExamDTO[] {
  const titles: Record<ExamStatus, string[]> = {
    upcoming: [
      "Midterm Exam",
      "Final Prep",
      "Quiz 1",
      "Quiz 2",
      "Assignment 1",
      "Practice Test",
      "Review Exam",
      "Module Test",
      "Lab Exam",
      "Capstone Prep",
    ],
    active: [
      "Quiz 1",
      "Quiz 2",
      "In-Class Test",
      "Weekly Exam",
      "Progress Check",
      "Timed Quiz",
      "Section Test",
      "Unit Exam",
      "Open Book Quiz",
      "Online Assessment",
    ],
    completed: [
      "Quiz 3",
      "Assignment Exam",
      "Midterm",
      "Final",
      "Lab Final",
      "Project Exam",
      "Review Test",
      "Practice Final",
      "Module Final",
      "Course Exam",
    ],
  };
  const list = titles[status];
  return Array.from({ length: count }, (_, i) => {
    const idx = startId + i;
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i * dayOffset);
    return {
      id: String(idx),
      title: list[i],
      status,
      date: d.toISOString(),
      duration: [45, 60, 90, 120][idx % 4],
      questionsCount: [20, 25, 30, 40, 50][idx % 5],
      course: COURSES[idx % COURSES.length],
    };
  });
}

const MOCK_EXAMS: ExamDTO[] = [
  ...makeExams("upcoming", 1, 10, "2026-02-05T10:00:00", 2),
  ...makeExams("active", 11, 10, "2026-02-01T15:00:00", 0),
  ...makeExams("completed", 21, 10, "2026-01-28T12:00:00", -2),
];

export const getExamsMock = async (status?: ExamStatus): Promise<ExamDTO[]> => {
  await new Promise((res) => setTimeout(res, 400)); // fake delay

  if (!status) return MOCK_EXAMS;

  return MOCK_EXAMS.filter((e) => e.status === status);
};

/** Paginated mock for exams (same as real API shape when backend supports page/pageSize) */
export const getExamsMockPaginated = async (
  status?: ExamStatus,
  page = 1,
  pageSize = 6
): Promise<{ data: ExamDTO[]; total: number }> => {
  await new Promise((res) => setTimeout(res, 400));

  const filtered = !status
    ? MOCK_EXAMS
    : MOCK_EXAMS.filter((e) => e.status === status);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total };
};

/** Get single exam by id. Real API: GET /exams/:id */
export const getExamByIdMock = async (id: string): Promise<ExamDTO | null> => {
  await new Promise((res) => setTimeout(res, 300));
  return MOCK_EXAMS.find((e) => e.id === id) ?? null;
};

/** Update exam. Real API: PATCH /exams/:id. Mock returns success; backend will persist. */
export const updateExamMock = async (
  id: string,
  data: Partial<Omit<ExamDTO, "id">>
): Promise<{ success: boolean }> => {
  await new Promise((res) => setTimeout(res, 300));
  return { success: true };
};

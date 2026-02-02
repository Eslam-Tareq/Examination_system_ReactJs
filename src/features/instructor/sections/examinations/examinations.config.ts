import type { ExamStatus } from "@/services/examination/exam.types";

export const EXAM_TABS: { id: ExamStatus; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

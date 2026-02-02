export type ExamStatus = "upcoming" | "active" | "completed";

export type Exam = {
  id: string;
  title: string;
  courseName: string; // 👈 جديد
  date: string;
  duration: number;
  questionsCount: number;
  status: ExamStatus;
};

export const EXAMS: Exam[] = [
  {
    id: "1",
    title: "Midterm Exam",
    courseName: "Data Structures",
    date: "Feb 5, 2026 10:00 AM",
    duration: 90,
    questionsCount: 50,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Quiz 1",
    courseName: "Operating Systems",
    date: "Today 3:00 PM",
    duration: 60,
    questionsCount: 45,
    status: "active",
  },
  {
    id: "3",
    title: "Quiz 3",
    courseName: "Algorithms",
    date: "Jan 28, 2026",
    duration: 45,
    questionsCount: 30,
    status: "completed",
  },
];

import { USE_MOCK } from "@/config/app.config";
import http from "@/services/http";
import { mockCourses } from "@/services/courses/course.mock";
import { buildStudentSummaries, mockEnrollments } from "./students.mock";
import type { StudentSummary } from "./students.types";

export const getInstructorStudents = async (
  instructorId: number,
): Promise<StudentSummary[]> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return buildStudentSummaries(instructorId);
  }
  const { data } = await http.get<StudentSummary[]>(
    `/instructors/${instructorId}/students`,
  );
  return data;
};

export const getStudentsByCourse = async (
  courseId: number,
  sortBy: "name" | "grade" | "attempts" = "name",
): Promise<StudentSummary[]> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const instructorId = mockCourses.find((c) => c.Course_ID === courseId)
      ?.Inst_ID;
    const list = instructorId
      ? buildStudentSummaries(instructorId).filter(
          (s) => s.Course_ID === courseId,
        )
      : [];
    const sorted = [...list].sort((a, b) => {
      if (sortBy === "grade") return b.Highest_Grade - a.Highest_Grade;
      if (sortBy === "attempts") return b.Used_Attempt - a.Used_Attempt;
      return a.Name.localeCompare(b.Name);
    });
    return sorted;
  }
  const { data } = await http.get<StudentSummary[]>(
    `/courses/${courseId}/students`,
  );
  return data;
};

export const searchStudents = async (
  searchTerm: string,
  instructorId: number,
): Promise<StudentSummary[]> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const all = buildStudentSummaries(instructorId);
    const term = searchTerm.trim().toLowerCase();
    if (!term) return all;
    return all.filter(
      (s) =>
        s.Name.toLowerCase().includes(term) ||
        s.Email.toLowerCase().includes(term) ||
        s.Phone.includes(term) ||
        s.Track_Name.toLowerCase().includes(term),
    );
  }
  const { data } = await http.get<StudentSummary[]>(
    `/instructors/${instructorId}/students`,
    { params: { q: searchTerm } },
  );
  return data;
};

export const getStudentById = async (
  studentId: number,
): Promise<StudentSummary | null> => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    const enrollment = mockEnrollments.find((e) => e.Stud_ID === studentId);
    if (!enrollment) return null;
    const instructorId =
      mockCourses.find((c) => c.Course_ID === enrollment.Course_ID)?.Inst_ID ??
      0;
    const summaries = buildStudentSummaries(instructorId);
    return summaries.find((s) => s.Stud_ID === studentId) ?? null;
  }
  const { data } = await http.get<StudentSummary>(`/students/${studentId}`);
  return data ?? null;
};

export const getInstructorCoursesForFilter = async (
  instructorId: number,
): Promise<{ Course_ID: number; Course_Name: string }[]> => {
  if (USE_MOCK) {
    return mockCourses
      .filter((c) => c.Inst_ID === instructorId)
      .map((c) => ({ Course_ID: c.Course_ID, Course_Name: c.Course_Name }));
  }
  const { data } = await http.get<
    { Course_ID: number; Course_Name: string }[]
  >(`/instructors/${instructorId}/courses`);
  return data;
};

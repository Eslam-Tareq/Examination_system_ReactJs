import { USE_MOCK } from "@/config/app.config";
import { mockCourses } from "./course.mock";
export const getInstructorCourses = async (instructorId) => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockCourses.filter((c) => c.Inst_ID === instructorId);
    }
    // TODO: API call when backend is ready
    return mockCourses.filter((c) => c.Inst_ID === instructorId);
};
export const getCoursesPaginated = async (instructorId, page = 1, pageSize = 6, searchTerm = "") => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        let filtered = mockCourses.filter((c) => c.Inst_ID === instructorId);
        if (searchTerm.trim()) {
            filtered = filtered.filter((c) => c.Course_Name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const data = filtered.slice(start, start + pageSize);
        return { data, total };
    }
    // TODO: API call
    const filtered = mockCourses.filter((c) => c.Inst_ID === instructorId);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);
    return { data, total };
};
export const getCourseById = async (courseId) => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockCourses.find((c) => c.Course_ID === courseId) ?? null;
    }
    // TODO: API call
    return mockCourses.find((c) => c.Course_ID === courseId) ?? null;
};
export const searchCourses = async (searchTerm, instructorId) => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return mockCourses.filter((c) => c.Inst_ID === instructorId &&
            c.Course_Name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // TODO: API call
    return mockCourses.filter((c) => c.Inst_ID === instructorId &&
        c.Course_Name.toLowerCase().includes(searchTerm.toLowerCase()));
};

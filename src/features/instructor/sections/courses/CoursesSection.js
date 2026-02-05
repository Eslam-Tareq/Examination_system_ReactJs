import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";
import { getInstructorCourses, searchCourses, } from "@/services/courses/course.service";
import CourseCard from "../../components/CourseCard";
const CoursesSection = () => {
    const user = useAuthStore((s) => s.user);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const instructorId = user?.id ?? 2;
    useEffect(() => {
        setLoading(true);
        if (searchTerm.trim()) {
            searchCourses(searchTerm, instructorId)
                .then(setCourses)
                .finally(() => setLoading(false));
        }
        else {
            getInstructorCourses(instructorId)
                .then(setCourses)
                .finally(() => setLoading(false));
        }
    }, [instructorId, searchTerm]);
    return (_jsxs("section", { className: "courses-section fade-in", children: [_jsxs("div", { className: "courses-header", children: [_jsx("h2", { className: "courses-title", children: "My Courses" }), _jsx("p", { className: "courses-subtitle", children: "Manage and view your course information" })] }), _jsx("div", { className: "courses-toolbar", children: _jsx("input", { type: "search", placeholder: "Search courses...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "courses-search-input", "aria-label": "Search courses" }) }), _jsx("div", { className: "courses-content", children: loading ? (_jsxs("div", { className: "courses-loading", children: [_jsx("div", { className: "skeleton skeleton-course-card" }), _jsx("div", { className: "skeleton skeleton-course-card" }), _jsx("div", { className: "skeleton skeleton-course-card" })] })) : courses.length === 0 ? (_jsx("p", { className: "courses-empty", children: "No courses found" })) : (_jsx("div", { className: "courses-grid", children: courses.map((course) => (_jsx(CourseCard, { course: course }, course.Course_ID))) })) })] }));
};
export default CoursesSection;

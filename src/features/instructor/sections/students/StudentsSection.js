import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store";
import { getInstructorStudents, getInstructorCoursesForFilter, getStudentsByCourse, searchStudents, } from "@/services/students/students.service";
import Pagination from "@/components/pagination/Pagination";
const StudentsSection = () => {
    const user = useAuthStore((s) => s.user);
    const instructorId = user?.id ?? 2;
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    useEffect(() => {
        getInstructorCoursesForFilter(instructorId).then(setCourses);
    }, [instructorId]);
    useEffect(() => {
        setLoading(true);
        const run = async () => {
            if (searchTerm.trim()) {
                const res = await searchStudents(searchTerm, instructorId);
                setStudents(res);
            }
            else if (selectedCourse !== "all") {
                const res = await getStudentsByCourse(Number(selectedCourse), sortBy);
                setStudents(res);
            }
            else {
                const res = await getInstructorStudents(instructorId);
                const sorted = sortBy === "grade"
                    ? [...res].sort((a, b) => b.Highest_Grade - a.Highest_Grade)
                    : sortBy === "attempts"
                        ? [...res].sort((a, b) => b.Used_Attempt - a.Used_Attempt)
                        : [...res].sort((a, b) => a.Name.localeCompare(b.Name));
                setStudents(sorted);
            }
            setLoading(false);
            setPage(1);
        };
        run();
    }, [instructorId, searchTerm, selectedCourse, sortBy]);
    const total = students.length;
    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return students.slice(start, start + pageSize);
    }, [students, page]);
    return (_jsxs("section", { className: "courses-section fade-in", children: [_jsxs("div", { className: "courses-header", children: [_jsx("h2", { className: "courses-title", children: "All Students" }), _jsx("p", { className: "courses-subtitle", children: "Browse and manage students across your courses" })] }), _jsxs("div", { className: "courses-toolbar", style: {
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }, children: [_jsx("input", { type: "search", placeholder: "Search students by name, email, phone, track...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "courses-search-input", "aria-label": "Search students" }), _jsxs("select", { value: selectedCourse, onChange: (e) => setSelectedCourse(e.target.value === "all" ? "all" : Number(e.target.value)), className: "courses-search-input", "aria-label": "Filter by course", children: [_jsx("option", { value: "all", children: "All Courses" }), courses.map((c) => (_jsx("option", { value: c.Course_ID, children: c.Course_Name }, c.Course_ID)))] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "courses-search-input", "aria-label": "Sort by", children: [_jsx("option", { value: "name", children: "Sort: Name" }), _jsx("option", { value: "grade", children: "Sort: Highest Grade" }), _jsx("option", { value: "attempts", children: "Sort: Used Attempts" })] })] }), _jsx("div", { className: "courses-content", children: loading ? (_jsxs("div", { className: "courses-loading", children: [_jsx("div", { className: "skeleton skeleton-course-card" }), _jsx("div", { className: "skeleton skeleton-course-card" }), _jsx("div", { className: "skeleton skeleton-course-card" })] })) : total === 0 ? (_jsx("p", { className: "courses-empty", children: "No students found" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "exam-list", children: paged.map((s) => (_jsxs("div", { className: "exam-card", children: [_jsxs("div", { className: "exam-card-header", children: [_jsx("div", { className: "exam-title", children: s.Name }), _jsx("span", { className: `exam-status ${s.Status === "Success" ? "success" : "fail"}`, children: s.Status })] }), _jsxs("div", { className: "exam-meta", children: [_jsx("span", { className: "exam-course", children: s.Course_Name }), _jsxs("span", { className: "exam-questions", children: ["Grade: ", s.Highest_Grade, "%"] }), _jsxs("span", { className: "exam-date", children: ["Attempts used: ", s.Used_Attempt] })] }), _jsxs("div", { className: "exam-actions", children: [_jsx("button", { type: "button", className: "action-btn secondary", children: s.Email }), _jsx("button", { type: "button", className: "action-btn secondary", children: s.Phone }), _jsx("button", { type: "button", className: "action-btn secondary", children: s.Track_Name })] })] }, s.Stud_ID))) }), _jsx("div", { className: "courses-pagination", children: _jsx(Pagination, { page: page, pageSize: pageSize, total: total, onChange: setPage }) })] })) })] }));
};
export default StudentsSection;

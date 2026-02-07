import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store";
import {
  getInstructorStudents,
  getInstructorCoursesForFilter,
  getStudentsByCourse,
  searchStudents,
} from "@/services/students/students.service";
import type { StudentSummary } from "@/services/students/students.types";
import Pagination from "@/components/pagination/Pagination";
 
const StudentsSection = () => {
  const user = useAuthStore((s) => s.user);
  const instructorId = user?.id ?? 2;
 
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<{ Course_ID: number; Course_Name: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "grade" | "attempts">("name");
 
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
      } else if (selectedCourse !== "all") {
        const res = await getStudentsByCourse(Number(selectedCourse), sortBy);
        setStudents(res);
      } else {
        const res = await getInstructorStudents(instructorId);
        const sorted =
          sortBy === "grade"
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
 
  return (
    <section className="courses-section fade-in">
      <div className="courses-header">
        <h2 className="courses-title">All Students</h2>
        <p className="courses-subtitle">
          Browse and manage students across your courses
        </p>
      </div>
 
      <div className="courses-toolbar" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <input
          type="search"
          placeholder="Search students by name, email, phone, track..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="courses-search-input"
          aria-label="Search students"
        />
        <select
          value={selectedCourse}
          onChange={(e) =>
            setSelectedCourse(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="courses-search-input"
          aria-label="Filter by course"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.Course_ID} value={c.Course_ID}>
              {c.Course_Name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "grade" | "attempts")}
          className="courses-search-input"
          aria-label="Sort by"
        >
          <option value="name">Sort: Name</option>
          <option value="grade">Sort: Highest Grade</option>
          <option value="attempts">Sort: Used Attempts</option>
        </select>
      </div>
 
      <div className="courses-content">
        {loading ? (
          <div className="courses-loading">
            <div className="skeleton skeleton-course-card" />
            <div className="skeleton skeleton-course-card" />
            <div className="skeleton skeleton-course-card" />
          </div>
        ) : total === 0 ? (
          <p className="courses-empty">No students found</p>
        ) : (
          <>
            <div className="student-list-grid">
              {paged.map((s) => (
                <div
                  key={s.Stud_ID}
                  className={`student-card-modern ${
                    s.Status === "Success" ? "status-success" : "status-fail"
                  }`}
                >
                  {/* Header */}
                  <div className="student-header">
                    <div className="student-identity">
                      <div className="student-name">{s.Name}</div>
                      <div className="student-id-wrapper">
                        <span className="student-id-badge">ID: {s.Stud_ID}</span>
                        <span className="student-id-badge">
                          Track: {s.Track_Name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`student-status-badge ${
                        s.Status === "Success" ? "success" : "fail"
                      }`}
                    >
                      {s.Status}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="student-info-grid">
                    <div className="student-info-item">
                      <span className="student-label">Contact Info</span>
                      <div className="student-contact">
                        <span className="student-value">
                          Email: {s.Email}
                        </span>
                        <span className="student-value">
                          Phone: {s.Phone}
                        </span>
                      </div>
                    </div>

                    <div className="student-info-item">
                      <span className="student-label">Course Performance</span>
                      <div className="flex flex-col gap-1">
                        <span className="student-value highlight">
                          Course: {s.Course_Name}
                        </span>
                        <span className="student-value">
                          Highest Grade: {s.Highest_Grade}%
                        </span>
                      </div>
                    </div>

                    <div className="student-info-item">
                      <span className="student-label">Engagement</span>
                      <span className="student-value">
                        Attempts Used: {s.Used_Attempt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="courses-pagination">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};
 
export default StudentsSection;

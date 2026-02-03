import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";
import {
  getInstructorCourses,
  searchCourses,
} from "@/services/courses/course.service";
import type { Course } from "@/services/courses/course.types";
import CourseCard from "../../components/CourseCard";

const CoursesSection = () => {
  const user = useAuthStore((s) => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const instructorId = user?.id ?? 2;

  useEffect(() => {
    setLoading(true);
    if (searchTerm.trim()) {
      searchCourses(searchTerm, instructorId)
        .then(setCourses)
        .finally(() => setLoading(false));
    } else {
      getInstructorCourses(instructorId)
        .then(setCourses)
        .finally(() => setLoading(false));
    }
  }, [instructorId, searchTerm]);

  return (
    <section className="courses-section fade-in">
      <div className="courses-header">
        <h2 className="courses-title">My Courses</h2>
        <p className="courses-subtitle">
          Manage and view your course information
        </p>
      </div>

      <div className="courses-toolbar">
        <input
          type="search"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="courses-search-input"
          aria-label="Search courses"
        />
      </div>

      <div className="courses-content">
        {loading ? (
          <div className="courses-loading">
            <div className="skeleton skeleton-course-card" />
            <div className="skeleton skeleton-course-card" />
            <div className="skeleton skeleton-course-card" />
          </div>
        ) : courses.length === 0 ? (
          <p className="courses-empty">No courses found</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.Course_ID} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;

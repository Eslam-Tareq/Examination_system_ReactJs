import type { Course } from "@/services/courses/course.types";

type Props = {
  course: Course;
};

const CourseCard = ({ course }: Props) => {
  return (
    <div className="course-card">
      <h3 className="course-card-title">{course.Course_Name}</h3>

      <div className="course-card-track">
        <span className="course-track-badge">{course.Track_Name}</span>
      </div>

      <div className="course-card-stats">
        <div className="course-stat">
          <span className="course-stat-value">{course.Students_Count}</span>
          <span className="course-stat-label">Students</span>
        </div>
        <div className="course-stat">
          <span className="course-stat-value">{course.Exams_Count}</span>
          <span className="course-stat-label">Exams</span>
        </div>
        <div className="course-stat">
          <span className="course-stat-value">{course.Max_Attempt}</span>
          <span className="course-stat-label">Attempts</span>
        </div>
      </div>

      <div className="course-card-footer">
        <span className="course-last-updated">
          Updated {course.Last_Updated}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;

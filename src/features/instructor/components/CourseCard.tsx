import { useMemo, useState } from "react";
import type { Course } from "@/services/courses/course.types";

type Props = {
  course: Course;
};

const CourseCard = ({ course }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const topics = course.Topics;
  const visibleTopics = useMemo(() => (expanded ? topics : topics.slice(0, 3)), [expanded, topics]);
  const remainingCount = Math.max(0, topics.length - visibleTopics.length);
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
        <div className="course-stat">
          <span className="course-stat-value">{course.Passing_Grade}%</span>
          <span className="course-stat-label">Passing Grade</span>
        </div>
      </div>

      <div className={`course-card-topics ${expanded ? "topics-expanded" : "topics-collapsed"}`} style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {visibleTopics.map((t, idx) => (
          <span
            key={t.Topic_ID}
            className="course-track-badge topic-pill"
            style={{ animationDelay: expanded ? `${idx * 60}ms` : "0ms" }}
          >
            {t.Topic_Name}
          </span>
        ))}
        {remainingCount > 0 && !expanded && (
          <span
            className="course-last-updated topics-view-all"
            onClick={() => setExpanded(true)}
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
          >
            +{remainingCount} more
          </span>
        )}
        {showPopover && !expanded && (
          <div className="topics-popover">
            <div className="topics-popover-grid">
              {topics.map((t) => (
                <span key={t.Topic_ID} className="course-track-badge">
                  {t.Topic_Name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {topics.length > 3 && (
        <button
          type="button"
          className="course-view-btn"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Show less topics" : "View all topics"}
        >
          {expanded ? "Show Less" : "View All Topics"}
        </button>
      )}

      <div className="course-card-footer">
        <span className="course-last-updated">
          Updated {course.Last_Updated}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;

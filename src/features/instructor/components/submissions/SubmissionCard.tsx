import { Submission } from "@/services/submissions";
import { Clock, Calendar, RefreshCcw, User, BookOpen } from "lucide-react";

interface SubmissionCardProps {
  submission: Submission;
  onView: (submission: Submission) => void;
}

export const SubmissionCard = ({ submission, onView }: SubmissionCardProps) => {
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "#94a3b8"; // Gray for pending
    if (grade >= 90) return "var(--success)";
    if (grade >= 80) return "var(--accent-primary)";
    if (grade >= 70) return "var(--accent-secondary)";
    if (grade >= 60) return "#f59e0b"; // Orange
    return "var(--danger)";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const borderColor = getGradeColor(submission.Grade);

  return (
    <div className="submission-card">
      {/* Header */}
      <div className="submission-header">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={14} className="text-secondary" />
          <span className="text-xs uppercase font-bold text-muted tracking-wider">
            {submission.Course_Name}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white leading-tight">
          {submission.Exam_Title}
        </h3>
      </div>

      <div className="submission-body">
        {/* Student Info */}
        <div className="student-info-section">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-accent-secondary" />
            <span className="font-semibold text-white">
              {submission.Student_Name}
            </span>
          </div>
          <div className="flex gap-3 text-sm text-secondary pl-6">
            <span>ID: {submission.Stud_ID}</span>
            <span>•</span>
            <span>{submission.Track_Name}</span>
          </div>
        </div>

        {/* Grade & Stats Grid */}
        <div className="submission-stats-grid">
          {/* Grade Circle */}
          <div
            className="grade-circle"
            style={{ borderColor: borderColor, color: borderColor }}
          >
            {submission.Grade !== null ? (
              <>
                <span className="grade-value">{submission.Grade}%</span>
                <span className="grade-label">Grade</span>
              </>
            ) : (
              <span className="text-sm font-medium text-muted">Pending</span>
            )}
          </div>

          {/* Details */}
          <div className="submission-details">
            <div className="detail-row">
              <Calendar size={14} />
              <span>{formatDate(submission.Submit_Date)}</span>
            </div>
            <div className="detail-row">
              <Clock size={14} />
              <span>
                {submission.Time_Taken_Minutes
                  ? `${submission.Time_Taken_Minutes} mins`
                  : "--"}
              </span>
            </div>
            <div className="detail-row">
              <RefreshCcw size={14} />
              <span>
                Attempt {submission.Attempt_No}/{submission.Max_Attempt}
              </span>
            </div>
            <div
              className={`status-badge ${
                submission.Status === "Submitted"
                  ? "status-success"
                  : "status-pending"
              }`}
            >
              {submission.Status}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(submission)}
        className="w-full mt-4 py-2 bg-bg-tertiary hover:bg-bg-secondary text-accent-primary text-sm font-medium rounded-lg transition-colors border border-border-color hover:border-accent-primary"
      >
        View Submission
      </button>
    </div>
  );
};

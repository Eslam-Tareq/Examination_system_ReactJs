import { Exam } from "@/services/examination/exam.types";

type Props = {
  exam: Exam;
  onPreviewClick?: (exam: Exam) => void;
  onEditClick?: (exam: Exam) => void;
};

const ExamCard = ({ exam, onPreviewClick, onEditClick }: Props) => {
  return (
    <div className="exam-card">
      <div className="exam-card-header">
        <h3 className="exam-title">{exam.title}</h3>

        <span className={`exam-status ${exam.status}`}>
          {exam.status.toUpperCase()}
        </span>
      </div>

      <div className="exam-meta">
        <span className="exam-course">{exam.courseName}</span>
        <span>•</span>
        <span>{exam.duration} mins</span>
        <span>•</span>
        <span className="exam-questions">{exam.questionsCount} Questions</span>
      </div>

      <div className="exam-date">{exam.date}</div>

      <div className="exam-actions">
        {exam.status === "upcoming" && (
          <button
            type="button"
            className="btn-edit"
            onClick={() => onEditClick?.(exam)}
          >
            Edit
          </button>
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={() => onPreviewClick?.(exam)}
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default ExamCard;

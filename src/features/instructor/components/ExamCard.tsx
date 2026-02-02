import { Exam } from "../sections/examinations/examinations.config";

type Props = {
  exam: Exam;
};

const ExamCard = ({ exam }: Props) => {
  return (
    <div className="exam-card">
      {/* Header */}
      <div className="exam-card-header">
        <h3 className="exam-title">{exam.title}</h3>

        <span className={`exam-status ${exam.status}`}>
          {exam.status.toUpperCase()}
        </span>
      </div>

      {/* Meta */}
      <div className="exam-meta">
        <span className="exam-course">{exam.courseName}</span>
        <span>•</span>
        <span>{exam.duration} mins</span>
        <span>•</span>
        <span className="exam-questions">{exam.questionsCount} Questions</span>
      </div>

      {/* Date */}
      <div className="exam-date">{exam.date}</div>

      {/* Actions */}
      <div className="exam-actions">
        {exam.status === "upcoming" && (
          <button className="btn-edit">Edit</button>
        )}

        <button className="btn-primary">Preview</button>
      </div>
    </div>
  );
};

export default ExamCard;

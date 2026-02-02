import Pagination from "@/components/pagination/Pagination";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { useState } from "react";
import "./exam-preview.css";

const PREVIEW_PAGE_SIZE = 5;

type Props = {
  examId: string;
  questions: any[];
  onClose: () => void;
};

const ExamPreviewModal = ({ questions, onClose }: Props) => {
  const [page, setPage] = useState(1);
  const total = questions.length;
  const start = (page - 1) * PREVIEW_PAGE_SIZE;
  const pageQuestions = questions.slice(start, start + PREVIEW_PAGE_SIZE);

  return (
    <div className="exam-preview-overlay">
      <div className="exam-preview">
        <header>
          <h3>Exam Preview</h3>
          <button onClick={onClose}>✕</button>
        </header>

        <div className="questions-wrapper">
          {pageQuestions.map((q, index) => (
            <QuestionRenderer key={start + index} question={q} />
          ))}
        </div>

        {total > PREVIEW_PAGE_SIZE && (
          <Pagination
            page={page}
            pageSize={PREVIEW_PAGE_SIZE}
            total={total}
            onChange={setPage}
            siblingCount={1}
          />
        )}
      </div>
    </div>
  );
};

export default ExamPreviewModal;

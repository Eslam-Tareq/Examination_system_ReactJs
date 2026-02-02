import Pagination from "@/components/pagination/Pagination";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { getExamQuestions } from "@/services/questions/question.service";
import { Question } from "@/services/questions/question.types";
import { useEffect, useState } from "react";

const QUESTIONS_PAGE_SIZE = 5;

/** Map service Question to the shape QuestionRenderer expects */
function toDisplayQuestion(
  q: Question
): Parameters<typeof QuestionRenderer>[0]["question"] {
  if (q.type === "MCQ") {
    return {
      type: "MCQ",
      question: q.text,
      mark: q.mark,
      allowMulti: false,
      choices: q.choices ?? [],
    };
  }
  return {
    type: "TF",
    question: q.text,
    mark: q.mark,
    correctAnswer: q.correctTF ?? false,
  };
}

type Props = {
  examId: number;
  examTitle?: string;
  onBack?: () => void;
};

const ExamPreviewPage = ({ examId, examTitle, onBack }: Props) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getExamQuestions(examId, page, QUESTIONS_PAGE_SIZE)
      .then((res) => {
        setQuestions(res.questions);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [examId, page]);

  return (
    <div className="exam-preview-page">
      <div className="exam-preview-header">
        {onBack && (
          <button
            type="button"
            className="btn-back"
            onClick={onBack}
            aria-label="Back to examinations"
          >
            ← Back to Examinations
          </button>
        )}
        <h2 className="exam-preview-title">
          {examTitle ? `Preview: ${examTitle}` : "Exam Preview"}
        </h2>
        <p className="exam-preview-subtitle">
          {total > 0
            ? `${total} question${total === 1 ? "" : "s"} total`
            : "No questions"}
        </p>
      </div>

      {loading && <p className="text-muted">Loading questions...</p>}

      {!loading && questions.length === 0 && (
        <p className="text-muted">No questions in this exam.</p>
      )}

      {!loading && questions.length > 0 && (
        <>
          <div className="exam-preview-questions">
            {questions.map((q) => (
              <QuestionRenderer key={q.id} question={toDisplayQuestion(q)} />
            ))}
          </div>

          {total > QUESTIONS_PAGE_SIZE && (
            <Pagination
              page={page}
              pageSize={QUESTIONS_PAGE_SIZE}
              total={total}
              onChange={setPage}
              siblingCount={1}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExamPreviewPage;

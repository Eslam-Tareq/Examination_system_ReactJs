import ExamPreviewPage from "@/features/instructor/pages/ExamPreviewPage";
import Pagination from "@/components/pagination/Pagination";
import { getExamsPaginated } from "@/services/examination/exam.service";
import { Exam, ExamStatus } from "@/services/examination/exam.types";
import { useEffect, useState } from "react";
import ExamCard from "../../components/ExamCard";
import { EXAM_TABS } from "./examinations.config";

const EXAMS_PAGE_SIZE = 6;

const ExaminationsSection = () => {
  const [activeTab, setActiveTab] = useState<ExamStatus>("upcoming");
  const [exams, setExams] = useState<Exam[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);

  useEffect(() => {
    setLoading(true);
    getExamsPaginated(activeTab, page, EXAMS_PAGE_SIZE)
      .then(({ data, total: t }) => {
        setExams(data);
        setTotal(t);
      })
      .finally(() => setLoading(false));
  }, [activeTab, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  if (previewExam) {
    return (
      <section className="examinations-section fade-in">
        <ExamPreviewPage
          examId={Number(previewExam.id)}
          examTitle={previewExam.title}
          onBack={() => setPreviewExam(null)}
        />
      </section>
    );
  }

  return (
    <section className="examinations-section fade-in">
      <div className="examinations-header">
        <div>
          <h2 className="section-title">Examinations</h2>
          <p className="section-subtitle">
            Create, manage and monitor your exams
          </p>
        </div>

        <button type="button" className="btn-primary">
          + Create Exam
        </button>
      </div>

      <div className="exam-tabs">
        {EXAM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`exam-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="exam-cards">
        {loading && <p className="text-muted">Loading exams...</p>}

        {!loading && exams.length === 0 && (
          <p className="text-muted">No exams found</p>
        )}

        {!loading &&
          exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onPreviewClick={setPreviewExam}
            />
          ))}
      </div>

      {!loading && total > EXAMS_PAGE_SIZE && (
        <Pagination
          page={page}
          pageSize={EXAMS_PAGE_SIZE}
          total={total}
          onChange={setPage}
          siblingCount={1}
        />
      )}
    </section>
  );
};

export default ExaminationsSection;

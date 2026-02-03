import Pagination from "@/components/pagination/Pagination";
import { getExamsPaginated } from "@/services/examination/exam.service";
import { Exam, ExamStatus } from "@/services/examination/exam.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamCard from "../../components/ExamCard";
import { EXAM_TABS } from "./examinations.config";

const EXAMS_PAGE_SIZE = 6;

const ExaminationsSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ExamStatus>("upcoming");
  const [exams, setExams] = useState<Exam[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const handlePreview = (exam: Exam) => {
    navigate(`/instructor/examinations/${exam.id}/preview`);
  };

  const handleEdit = (exam: Exam) => {
    navigate(`/instructor/examinations/${exam.id}/edit`);
  };

  return (
    <section className="examinations-section fade-in">
      <div className="examinations-header">
        <div>
          <h2 className="section-title">Examinations</h2>
          <p className="section-subtitle">
            Create, manage and monitor your exams
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/instructor/examinations/create")}
        >
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
              onPreviewClick={handlePreview}
              onEditClick={handleEdit}
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

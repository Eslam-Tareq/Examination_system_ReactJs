import { useEffect, useState } from "react";
import ExamCard from "../../components/ExamCard";
import { Exam, ExamStatus } from "./exam.types";
import { getExams } from "./exam.service";

const TABS: { id: ExamStatus; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

const ExaminationsSection = () => {
  const [activeTab, setActiveTab] = useState<ExamStatus>("upcoming");
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getExams(activeTab)
      .then((data) => setExams(data))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section className="examinations-section fade-in">
      {/* Header */}
      <div className="examinations-header">
        <div>
          <h2 className="section-title">Examinations</h2>
          <p className="section-subtitle">
            Create, manage and monitor your exams
          </p>
        </div>

        <button className="btn-primary">+ Create Exam</button>
      </div>

      {/* Tabs */}
      <div className="exam-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`exam-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="exam-cards">
        {loading && <p className="text-muted">Loading exams...</p>}

        {!loading && exams.length === 0 && (
          <p className="text-muted">No exams found</p>
        )}

        {!loading &&
          exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
      </div>
    </section>
  );
};

export default ExaminationsSection;

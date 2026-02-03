import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Pagination from "@/components/pagination/Pagination";
import { getExamsPaginated } from "@/services/examination/exam.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamCard from "../../components/ExamCard";
import { EXAM_TABS } from "./examinations.config";
const EXAMS_PAGE_SIZE = 6;
const ExaminationsSection = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [exams, setExams] = useState([]);
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
    const handlePreview = (exam) => {
        navigate(`/instructor/examinations/${exam.id}/preview`);
    };
    const handleEdit = (exam) => {
        navigate(`/instructor/examinations/${exam.id}/edit`);
    };
    return (_jsxs("section", { className: "examinations-section fade-in", children: [_jsxs("div", { className: "examinations-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "section-title", children: "Examinations" }), _jsx("p", { className: "section-subtitle", children: "Create, manage and monitor your exams" })] }), _jsx("button", { type: "button", className: "btn-primary", onClick: () => navigate("/instructor/examinations/create"), children: "+ Create Exam" })] }), _jsx("div", { className: "exam-tabs", children: EXAM_TABS.map((tab) => (_jsx("button", { type: "button", className: `exam-tab ${activeTab === tab.id ? "active" : ""}`, onClick: () => setActiveTab(tab.id), children: tab.label }, tab.id))) }), _jsxs("div", { className: "exam-cards", children: [loading && _jsx("p", { className: "text-muted", children: "Loading exams..." }), !loading && exams.length === 0 && (_jsx("p", { className: "text-muted", children: "No exams found" })), !loading &&
                        exams.map((exam) => (_jsx(ExamCard, { exam: exam, onPreviewClick: handlePreview, onEditClick: handleEdit }, exam.id)))] }), !loading && total > EXAMS_PAGE_SIZE && (_jsx(Pagination, { page: page, pageSize: EXAMS_PAGE_SIZE, total: total, onChange: setPage, siblingCount: 1 }))] }));
};
export default ExaminationsSection;

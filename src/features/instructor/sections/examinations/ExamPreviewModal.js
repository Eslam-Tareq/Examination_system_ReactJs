import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Pagination from "@/components/pagination/Pagination";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { useState } from "react";
import "./exam-preview.css";
const PREVIEW_PAGE_SIZE = 5;
const ExamPreviewModal = ({ questions, onClose }) => {
    const [page, setPage] = useState(1);
    const total = questions.length;
    const start = (page - 1) * PREVIEW_PAGE_SIZE;
    const pageQuestions = questions.slice(start, start + PREVIEW_PAGE_SIZE);
    return (_jsx("div", { className: "exam-preview-overlay", children: _jsxs("div", { className: "exam-preview", children: [_jsxs("header", { children: [_jsx("h3", { children: "Exam Preview" }), _jsx("button", { onClick: onClose, children: "\u2715" })] }), _jsx("div", { className: "questions-wrapper", children: pageQuestions.map((q, index) => (_jsx(QuestionRenderer, { question: q }, start + index))) }), total > PREVIEW_PAGE_SIZE && (_jsx(Pagination, { page: page, pageSize: PREVIEW_PAGE_SIZE, total: total, onChange: setPage, siblingCount: 1 }))] }) }));
};
export default ExamPreviewModal;

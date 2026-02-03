import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Pagination from "@/components/pagination/Pagination";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { getExamQuestions } from "@/services/questions/question.service";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const QUESTIONS_PAGE_SIZE = 5;
/** Map service Question to the shape QuestionRenderer expects */
function toDisplayQuestion(q) {
    if (q.type === "MCQ") {
        return {
            type: "MCQ",
            question: q.text,
            mark: q.mark,
            allowMulti: q.allowMulti ?? false,
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
const ExamPreviewPage = ({ examId: examIdProp, examTitle, onBack }) => {
    const { examId: examIdParam } = useParams();
    const navigate = useNavigate();
    const examId = examIdProp ?? Number(examIdParam ?? 0);
    const handleBack = onBack ?? (() => navigate("/instructor/examinations"));
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [questions, setQuestions] = useState([]);
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
    return (_jsxs("div", { className: "exam-preview-page", children: [_jsxs("div", { className: "exam-preview-header", children: [_jsx("button", { type: "button", className: "btn-back", onClick: handleBack, "aria-label": "Back to examinations", children: "\u2190 Back to Examinations" }), _jsx("h2", { className: "exam-preview-title", children: examTitle ? `Preview: ${examTitle}` : "Exam Preview" }), _jsx("p", { className: "exam-preview-subtitle", children: total > 0
                            ? `${total} question${total === 1 ? "" : "s"} total`
                            : "No questions" })] }), loading && _jsx("p", { className: "text-muted", children: "Loading questions..." }), !loading && questions.length === 0 && (_jsx("p", { className: "text-muted", children: "No questions in this exam." })), !loading && questions.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "exam-preview-questions", children: questions.map((q) => (_jsx(QuestionRenderer, { question: toDisplayQuestion(q) }, q.id))) }), total > QUESTIONS_PAGE_SIZE && (_jsx(Pagination, { page: page, pageSize: QUESTIONS_PAGE_SIZE, total: total, onChange: setPage, siblingCount: 1 }))] }))] }));
};
export default ExamPreviewPage;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "@/styles/questions.css";
const MCQQuestion = ({ question, mark, choices, allowMulti }) => {
    return (_jsxs("div", { className: "question-card", children: [_jsxs("div", { className: "question-header", children: [_jsx("span", { className: "question-type", children: "MCQ" }), _jsxs("span", { className: "question-mark", children: [mark, " Mark"] })] }), _jsx("p", { className: "question-text", children: question }), _jsx("ul", { className: "mcq-list", children: choices.map((c) => (_jsxs("li", { className: `mcq-choice ${c.isCorrect ? "correct" : ""}`, children: [_jsx("span", { className: "choice-indicator", children: allowMulti ? "☑" : "◉" }), c.text] }, c.id))) })] }));
};
export default MCQQuestion;

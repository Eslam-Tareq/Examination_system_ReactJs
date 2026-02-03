import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "@/styles/questions.css";
const TFQuestion = ({ question, mark, correctAnswer }) => {
    return (_jsxs("div", { className: "question-card", children: [_jsxs("div", { className: "question-header", children: [_jsx("span", { className: "question-type", children: "True / False" }), _jsxs("span", { className: "question-mark", children: [mark, " Mark"] })] }), _jsx("p", { className: "question-text", children: question }), _jsxs("div", { className: "tf-choices", children: [_jsx("span", { className: `tf-choice ${correctAnswer === true ? "correct" : ""}`, children: "True" }), _jsx("span", { className: `tf-choice ${correctAnswer === false ? "correct" : ""}`, children: "False" })] })] }));
};
export default TFQuestion;

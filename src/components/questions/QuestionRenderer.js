import { jsx as _jsx } from "react/jsx-runtime";
import MCQQuestion from "./MCQQuestion";
import TFQuestion from "./TFQuestion";
const QuestionRenderer = ({ question }) => {
    if (question.type === "MCQ") {
        return _jsx(MCQQuestion, { ...question });
    }
    return _jsx(TFQuestion, { ...question });
};
export default QuestionRenderer;

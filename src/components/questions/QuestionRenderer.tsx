import MCQQuestion from "./MCQQuestion";
import TFQuestion from "./TFQuestion";

type Question =
  | {
      type: "MCQ";
      question: string;
      mark: number;
      allowMulti: boolean;
      choices: {
        id: number;
        text: string;
        isCorrect: boolean;
      }[];
    }
  | {
      type: "TF";
      question: string;
      mark: number;
      correctAnswer: boolean;
    };

const QuestionRenderer = ({ question }: { question: Question }) => {
  if (question.type === "MCQ") {
    return <MCQQuestion {...question} />;
  }

  return <TFQuestion {...question} />;
};

export default QuestionRenderer;

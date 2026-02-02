import "@/styles/questions.css";

type Props = {
  question: string;
  mark: number;
  correctAnswer: boolean;
};

const TFQuestion = ({ question, mark, correctAnswer }: Props) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-type">True / False</span>
        <span className="question-mark">{mark} Mark</span>
      </div>

      <p className="question-text">{question}</p>

      <div className="tf-choices">
        <span
          className={`tf-choice ${correctAnswer === true ? "correct" : ""}`}
        >
          True
        </span>
        <span
          className={`tf-choice ${correctAnswer === false ? "correct" : ""}`}
        >
          False
        </span>
      </div>
    </div>
  );
};

export default TFQuestion;

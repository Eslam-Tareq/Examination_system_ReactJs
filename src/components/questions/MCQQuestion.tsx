import "@/styles/questions.css";

type Choice = {
  id: number;
  text: string;
  isCorrect: boolean;
};

type Props = {
  question: string;
  mark: number;
  choices: Choice[];
  allowMulti: boolean;
};

const MCQQuestion = ({ question, mark, choices, allowMulti }: Props) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-type">MCQ</span>
        <span className="question-mark">{mark} Mark</span>
      </div>

      <p className="question-text">{question}</p>

      <ul className="mcq-list">
        {choices.map((c) => (
          <li
            key={c.id}
            className={`mcq-choice ${c.isCorrect ? "correct" : ""}`}
          >
            <span className="choice-indicator">{allowMulti ? "☑" : "◉"}</span>
            {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MCQQuestion;

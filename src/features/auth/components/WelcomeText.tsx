import { useEffect, useState } from "react";

const TEXT = "Welcome to Examy";

const WelcomeText = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === TEXT.length) {
      const restartTimeout = setTimeout(() => {
        setText("");
        setIndex(0);
      }, 1500);

      return () => clearTimeout(restartTimeout);
    }

    const timeout = setTimeout(() => {
      setText((prev) => prev + TEXT[index]);
      setIndex(index + 1);
    }, 120);

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <h2 className="text-3xl font-semibold text-center mb-8">
      {text}
      <span className="animate-pulse">|</span>
    </h2>
  );
};

export default WelcomeText;

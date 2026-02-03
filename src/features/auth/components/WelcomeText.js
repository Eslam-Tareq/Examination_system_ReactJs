import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const TEXT = "Welcome to Examy";
const WelcomeText = () => {
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    useEffect(() => {
        if (index === TEXT.length) {
            const timeout = setTimeout(() => {
                setText("");
                setIndex(0);
            }, 1500);
            return () => clearTimeout(timeout);
        }
        const timeout = setTimeout(() => {
            setText((prev) => prev + TEXT[index]);
            setIndex(index + 1);
        }, 120);
        return () => clearTimeout(timeout);
    }, [index]);
    return (_jsxs("h2", { className: "mb-8 text-center text-3xl font-semibold", children: [text, _jsx("span", { className: "animate-pulse", children: "|" })] }));
};
export default WelcomeText;

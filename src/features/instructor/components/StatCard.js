import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
const StatCard = ({ title, value, trend, footer }) => {
    const valueRef = useRef(null);
    useEffect(() => {
        if (!valueRef.current)
            return;
        const target = value;
        const duration = 1200;
        const startTime = performance.now();
        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            valueRef.current.innerText = Math.floor(progress * target).toString();
            if (progress < 1)
                requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }, [value]);
    return (_jsxs("div", { className: "stat-card", children: [_jsxs("div", { className: "stat-header", children: [_jsx("span", { className: "stat-title", children: title }), _jsx("span", { className: "stat-trend", children: trend })] }), _jsx("div", { ref: valueRef, className: "stat-value", children: "0" }), _jsx("div", { className: "stat-footer", children: footer })] }));
};
export default StatCard;

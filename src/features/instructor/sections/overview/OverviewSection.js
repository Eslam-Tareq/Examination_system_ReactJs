import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StatCard from "../../components/StatCard";
import { OVERVIEW_STATS } from "./overview.config";
import { useEffect } from "react";
const OverviewSection = () => {
    useEffect(() => {
        const cards = document.querySelectorAll(".stat-card");
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
        });
    }, []);
    return (_jsxs("section", { className: "overview-section fade-in", children: [_jsxs("div", { className: "overview-header", children: [_jsx("h2", { className: "overview-title", children: "Dashboard Overview" }), _jsx("p", { className: "overview-subtitle", children: "Your teaching performance at a glance" })] }), _jsx("div", { className: "overview-grid", children: OVERVIEW_STATS.map((item) => (_jsx(StatCard, { title: item.title, value: item.value, trend: item.trend, footer: item.footer }, item.id))) })] }));
};
export default OverviewSection;

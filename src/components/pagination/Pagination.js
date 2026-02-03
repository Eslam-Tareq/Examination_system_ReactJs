import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Global pagination: use for exams, questions, students, courses, submissions, etc.
 * Renders: Previous | [page numbers: prev, current, next] | Next
 */
const Pagination = ({ page, pageSize, total, onChange, siblingCount = 1, className = "", }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const hasPrev = page > 1;
    const hasNext = page < totalPages;
    const prevPage = Math.max(1, page - 1);
    const nextPage = Math.min(totalPages, page + 1);
    const start = Math.max(1, page - siblingCount);
    const end = Math.min(totalPages, page + siblingCount);
    const pages = [];
    for (let i = start; i <= end; i++)
        pages.push(i);
    return (_jsxs("nav", { className: `pagination ${className}`.trim(), role: "navigation", "aria-label": "Pagination", children: [_jsx("button", { type: "button", className: "pagination-btn pagination-prev", disabled: !hasPrev, onClick: () => onChange(prevPage), "aria-label": "Previous page", children: "Previous" }), _jsxs("div", { className: "pagination-pages", children: [start > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "pagination-page", onClick: () => onChange(1), "aria-label": "Page 1", children: "1" }), start > 2 && _jsx("span", { className: "pagination-ellipsis", children: "\u2026" })] })), pages.map((p) => (_jsx("button", { type: "button", className: `pagination-page ${p === page ? "pagination-page--current" : ""}`, onClick: () => p !== page && onChange(p), disabled: p === page, "aria-label": p === page ? `Current page, page ${p}` : `Page ${p}`, "aria-current": p === page ? "page" : undefined, children: p }, p))), end < totalPages && (_jsxs(_Fragment, { children: [end < totalPages - 1 && (_jsx("span", { className: "pagination-ellipsis", children: "\u2026" })), _jsx("button", { type: "button", className: "pagination-page", onClick: () => onChange(totalPages), "aria-label": `Page ${totalPages}`, children: totalPages })] }))] }), _jsx("button", { type: "button", className: "pagination-btn pagination-next", disabled: !hasNext, onClick: () => onChange(nextPage), "aria-label": "Next page", children: "Next" }), _jsxs("span", { className: "pagination-info", "aria-live": "polite", children: ["Page ", page, " of ", totalPages] })] }));
};
export default Pagination;

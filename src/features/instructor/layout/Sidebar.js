import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { INSTRUCTOR_NAV } from "../config/navigation.config";
const Sidebar = ({ active: _active }) => {
    const navPaths = {
        overview: "/instructor",
        examinations: "/instructor/examinations",
        courses: "/instructor/courses",
        students: "/instructor/students",
        submissions: "/instructor/submissions",
    };
    return (_jsxs("aside", { className: "sidebar", children: [_jsx("div", { className: "sidebar-logo", children: "EXAMLY" }), _jsx("nav", { className: "sidebar-nav", children: INSTRUCTOR_NAV.map((item) => {
                    const to = navPaths[item.id] ?? "/instructor";
                    const isDisabled = ![
                        "overview",
                        "examinations",
                        "courses",
                        "students",
                    ].includes(item.id);
                    return (_jsx(NavLink, { to: isDisabled ? "#" : to, end: item.id === "overview", className: ({ isActive }) => `sidebar-item ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`, onClick: isDisabled ? (e) => e.preventDefault() : undefined, children: item.label }, item.id));
                }) })] }));
};
export default Sidebar;

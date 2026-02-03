import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
const InstructorLayout = () => {
    const { pathname } = useLocation();
    const activeSection = pathname.startsWith("/instructor/examinations")
        ? "examinations"
        : "overview";
    return (_jsxs("div", { className: "instructor-root", children: [_jsx(Sidebar, { active: activeSection }), _jsxs("div", { className: "instructor-main", children: [_jsx(Header, { activeSection: activeSection }), _jsx("main", { className: "instructor-content fade-in", children: _jsx(Outlet, {}) })] })] }));
};
export default InstructorLayout;

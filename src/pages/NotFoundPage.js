import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store";
import { UserRoles } from "@/types/userRoles";
import { FileQuestion, Home } from "lucide-react";
const NotFoundPage = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);
    const homePath = isAuthenticated
        ? user?.role === UserRoles.INSTRUCTOR
            ? "/instructor"
            : "/student"
        : "/login";
    return (_jsx("div", { className: "not-found-page", children: _jsxs("div", { className: "not-found-content", children: [_jsx("div", { className: "not-found-icon", children: _jsx(FileQuestion, { size: 80, strokeWidth: 1.5 }) }), _jsx("h1", { className: "not-found-code", children: "404" }), _jsx("p", { className: "not-found-message", children: "Oops! Page not found" }), _jsx("p", { className: "not-found-submessage", children: "The page you're looking for doesn't exist or has been moved." }), _jsxs(Link, { to: homePath, className: "not-found-btn", children: [_jsx(Home, { size: 20 }), "Back to Home"] })] }) }));
};
export default NotFoundPage;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useToastStore } from "@/store/toast.store";
import { UserRoles } from "@/types/userRoles";
import { GraduationCap, LogOut, User } from "lucide-react";
const AppTopBar = () => {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const showToast = useToastStore((s) => s.showToast);
    const handleLogout = () => {
        showToast("Logging out...", "warning", "Session");
        setTimeout(() => {
            logout();
            showToast("Logged out successfully", "success");
        }, 500);
    };
    const dashboardPath = user?.role === UserRoles.INSTRUCTOR ? "/instructor" : "/student";
    return (_jsxs("header", { className: "app-topbar", children: [_jsxs(Link, { to: dashboardPath, className: "app-topbar-logo", children: [_jsx("div", { className: "app-topbar-logo-icon", children: _jsx(GraduationCap, { size: 24, strokeWidth: 2 }) }), _jsx("span", { className: "app-topbar-logo-text", children: "EXAMLY" })] }), _jsxs("div", { className: "app-topbar-user", children: [_jsxs("div", { className: "app-topbar-user-info", children: [_jsx("div", { className: "app-topbar-user-avatar", children: _jsx(User, { size: 18 }) }), _jsxs("div", { className: "app-topbar-user-details", children: [_jsx("span", { className: "app-topbar-user-name", children: user?.username ?? "User" }), _jsx("span", { className: "app-topbar-user-role", children: user?.role ?? "" })] })] }), _jsxs("button", { type: "button", onClick: handleLogout, className: "app-topbar-logout-btn", "aria-label": "Logout", children: [_jsx(LogOut, { size: 18 }), _jsx("span", { children: "Logout" })] })] })] }));
};
export default AppTopBar;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { INSTRUCTOR_NAV } from "../config/navigation.config";
import { useToastStore } from "@/store/toast.store";
import { useAuthStore } from "@/store";
import { LogOut, User } from "lucide-react";
const Header = ({ activeSection }) => {
    const user = useAuthStore((s) => s.user);
    const showToast = useToastStore((s) => s.showToast);
    const logout = useAuthStore((s) => s.logout);
    const current = INSTRUCTOR_NAV.find((n) => n.id === activeSection);
    const handleLogout = () => {
        showToast("Logging out...", "warning", "Session");
        setTimeout(() => {
            logout();
            showToast("Logged out successfully", "success");
        }, 500);
    };
    return (_jsxs("header", { className: "header", children: [_jsx("div", { className: "header-left", children: _jsx("h1", { className: "header-title", children: current?.title }) }), _jsxs("div", { className: "header-user", children: [_jsxs("div", { className: "header-user-info", children: [_jsx("div", { className: "header-user-avatar", children: _jsx(User, { size: 18 }) }), _jsxs("div", { className: "header-user-details", children: [_jsx("span", { className: "header-user-name", children: user?.username ?? "User" }), _jsx("span", { className: "header-user-role", children: user?.role ?? "Instructor" })] })] }), _jsxs("button", { type: "button", onClick: handleLogout, className: "header-logout-btn", "aria-label": "Logout", children: [_jsx(LogOut, { size: 18 }), _jsx("span", { children: "Logout" })] })] })] }));
};
export default Header;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router-dom";
import AppTopBar from "@/components/layout/AppTopBar";
const MainLayout = () => {
    const { pathname } = useLocation();
    const isInstructor = pathname.startsWith("/instructor");
    return (_jsxs("div", { className: "app-shell", children: [!isInstructor && _jsx(AppTopBar, {}), _jsx("main", { className: isInstructor
                    ? "app-main app-main-full"
                    : "app-main app-main-with-topbar", children: _jsx(Outlet, {}) })] }));
};
export default MainLayout;

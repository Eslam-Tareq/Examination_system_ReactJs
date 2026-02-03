import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { UserRoles } from "@/types/userRoles";
/**
 * Redirects authenticated users to their role-specific dashboard.
 * Unauthenticated users see the LoginPage (parent route).
 */
const LandingRedirect = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (user?.role === UserRoles.INSTRUCTOR) {
        return _jsx(Navigate, { to: "/instructor", replace: true });
    }
    if (user?.role === UserRoles.STUDENT) {
        return _jsx(Navigate, { to: "/student", replace: true });
    }
    return _jsx(Navigate, { to: "/login", replace: true });
};
export default LandingRedirect;

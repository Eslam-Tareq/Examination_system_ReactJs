import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { UserRoles } from "@/types/userRoles";
/**
 * Restricts access to routes based on user role.
 */
const RoleGuard = ({ children, allowedRoles }) => {
    const user = useAuthStore((s) => s.user);
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!allowedRoles.includes(user.role)) {
        const redirectPath = user.role === UserRoles.INSTRUCTOR ? "/instructor" : "/student";
        return _jsx(Navigate, { to: redirectPath, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default RoleGuard;

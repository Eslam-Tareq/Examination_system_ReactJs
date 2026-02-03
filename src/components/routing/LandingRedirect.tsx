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
    return <Navigate to="/login" replace />;
  }

  if (user?.role === UserRoles.INSTRUCTOR) {
    return <Navigate to="/instructor" replace />;
  }

  if (user?.role === UserRoles.STUDENT) {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default LandingRedirect;

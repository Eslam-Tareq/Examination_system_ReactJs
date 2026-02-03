import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { UserRoles } from "@/types/userRoles";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRoles[];
};

/**
 * Restricts access to routes based on user role.
 */
const RoleGuard = ({ children, allowedRoles }: Props) => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === UserRoles.INSTRUCTOR ? "/instructor" : "/student";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;

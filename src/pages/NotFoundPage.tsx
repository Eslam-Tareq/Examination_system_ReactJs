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

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FileQuestion size={80} strokeWidth={1.5} />
        </div>
        <h1 className="not-found-code">404</h1>
        <p className="not-found-message">Oops! Page not found</p>
        <p className="not-found-submessage">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to={homePath} className="not-found-btn">
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

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

  const dashboardPath =
    user?.role === UserRoles.INSTRUCTOR ? "/instructor" : "/student";

  return (
    <header className="app-topbar">
      <Link to={dashboardPath} className="app-topbar-logo">
        <div className="app-topbar-logo-icon">
          <GraduationCap size={24} strokeWidth={2} />
        </div>
        <span className="app-topbar-logo-text">EXAMLY</span>
      </Link>

      <div className="app-topbar-user">
        <div className="app-topbar-user-info">
          <div className="app-topbar-user-avatar">
            <User size={18} />
          </div>
          <div className="app-topbar-user-details">
            <span className="app-topbar-user-name">
              {user?.username ?? "User"}
            </span>
            <span className="app-topbar-user-role">{user?.role ?? ""}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="app-topbar-logout-btn"
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AppTopBar;

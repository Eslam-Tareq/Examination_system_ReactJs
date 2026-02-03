import { INSTRUCTOR_NAV } from "../config/navigation.config";
import { useToastStore } from "@/store/toast.store";
import { useAuthStore } from "@/store";
import { LogOut, User } from "lucide-react";

type Props = {
  activeSection: string;
};

const Header = ({ activeSection }: Props) => {
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

  return (
    <header className="header">
      {/* Section Title */}
      <div className="header-left">
        <h1 className="header-title">{current?.title}</h1>
      </div>

      {/* User Info + Logout */}
      <div className="header-user">
        <div className="header-user-info">
          <div className="header-user-avatar">
            <User size={18} />
          </div>
          <div className="header-user-details">
            <span className="header-user-name">{user?.username ?? "User"}</span>
            <span className="header-user-role">
              {user?.role ?? "Instructor"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="header-logout-btn"
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

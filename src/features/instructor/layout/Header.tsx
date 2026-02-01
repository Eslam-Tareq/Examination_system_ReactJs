import { INSTRUCTOR_NAV } from "../config/navigation.config";
import { useToastStore } from "@/store/toast.store";
import { useAuthStore } from "@/store";

type Props = {
  activeSection: string;
};

const Header = ({ activeSection }: Props) => {
  const showToast = useToastStore((s) => s.showToast);
  const logout = useAuthStore((s) => s.logout);

  const current = INSTRUCTOR_NAV.find((n) => n.id === activeSection);

  const handleLogout = () => {
    showToast("Logging out...", "warning", "Session");
    setTimeout(() => {
      logout();
      showToast("Logged out successfully", "success");
    }, 1000);
  };

  return (
    <header className="header">
      {/* Title */}
      <h1 className="header-title">{current?.title}</h1>

      {/* User */}
      <div className="header-user">
        <div className="user-info">
          <div className="user-name">Ahmed Ali</div>
          <div className="user-dept">Computer Science</div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

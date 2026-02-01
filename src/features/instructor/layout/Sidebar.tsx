import { INSTRUCTOR_NAV } from "../config/navigation.config";

type Props = {
  active: string;
  onChange: (id: string) => void;
};

const Sidebar = ({ active, onChange }: Props) => {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">EXAMLY</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {INSTRUCTOR_NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`sidebar-item ${active === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

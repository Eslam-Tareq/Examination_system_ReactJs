import { NavLink } from "react-router-dom";
import { INSTRUCTOR_NAV } from "../config/navigation.config";

type Props = {
  active: string;
};

const Sidebar = ({ active: _active }: Props) => {
  const navPaths: Record<string, string> = {
    overview: "/instructor",
    examinations: "/instructor/examinations",
    courses: "/instructor/courses",
    students: "/instructor/students",
    submissions: "/instructor/submissions",
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">EXAMLY</div>

      <nav className="sidebar-nav">
        {INSTRUCTOR_NAV.map((item) => {
          const to = navPaths[item.id] ?? "/instructor";
          const isDisabled = ![
            "overview",
            "examinations",
            "courses",
            "students",
          ].includes(item.id);
          return (
            <NavLink
              key={item.id}
              to={isDisabled ? "#" : to}
              end={item.id === "overview"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""} ${
                  isDisabled ? "disabled" : ""
                }`
              }
              onClick={isDisabled ? (e) => e.preventDefault() : undefined}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

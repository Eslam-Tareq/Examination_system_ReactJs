import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const InstructorLayout = () => {
  const { pathname } = useLocation();
  const activeSection = pathname.startsWith("/instructor/examinations")
    ? "examinations"
    : pathname.startsWith("/instructor/courses")
    ? "courses"
    : "overview";

  return (
    <div className="instructor-root">
      <Sidebar active={activeSection} />

      <div className="instructor-main">
        <Header activeSection={activeSection} />
        <main className="instructor-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;

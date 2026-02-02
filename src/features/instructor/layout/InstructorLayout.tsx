import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { INSTRUCTOR_NAV } from "../config/navigation.config";
import OverviewSection from "../sections/overview/OverviewSection";
import ExaminationsSection from "../sections/examinations/ExaminationsSection";
const InstructorLayout = () => {
  const [activeSection, setActiveSection] = useState(INSTRUCTOR_NAV[0].id);

  const renderSection = () => {
    switch (activeSection) {
      case "examinations":
        return <ExaminationsSection />;
      // case "courses":
      //   return <CoursesSection />;
      // case "students":
      //   return <StudentsSection />;
      // case "submissions":
      //   return <SubmissionsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="instructor-root">
      <Sidebar active={activeSection} onChange={setActiveSection} />

      <div className="instructor-main">
        <Header activeSection={activeSection} />
        <main className="instructor-content fade-in">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "examinations" && <ExaminationsSection />}
        </main>{" "}
      </div>
    </div>
  );
};
export default InstructorLayout;

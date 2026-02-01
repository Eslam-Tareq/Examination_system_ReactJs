import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { INSTRUCTOR_NAV } from "../config/navigation.config";
import OverviewSection from "../sections/overview/OverviewSection";
const InstructorLayout = () => {
  const [activeSection, setActiveSection] = useState(INSTRUCTOR_NAV[0].id);

  return (
    <div className="instructor-root">
      <Sidebar active={activeSection} onChange={setActiveSection} />

      <div className="instructor-main">
        <Header activeSection={activeSection} />

        <main className="instructor-content fade-in">
          <OverviewSection />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;

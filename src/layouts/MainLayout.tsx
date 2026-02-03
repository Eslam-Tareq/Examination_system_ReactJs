import { Outlet, useLocation } from "react-router-dom";
import AppTopBar from "@/components/layout/AppTopBar";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isInstructor = pathname.startsWith("/instructor");

  return (
    <div className="app-shell">
      {!isInstructor && <AppTopBar />}
      <main
        className={
          isInstructor
            ? "app-main app-main-full"
            : "app-main app-main-with-topbar"
        }
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

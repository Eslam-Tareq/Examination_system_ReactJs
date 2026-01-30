import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <header className="p-4 bg-slate-900 text-white">
        Examination System
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

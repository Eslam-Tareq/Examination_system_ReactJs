import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-slate-800 text-white p-4">Admin Menu</aside>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

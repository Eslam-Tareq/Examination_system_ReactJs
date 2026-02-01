import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] to-[#111827]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Header */}
      <header className="flex items-center justify-center pt-12">
        <div className="flex flex-col items-center gap-4">
          {/* Big Logo */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg">
            E
          </div>

          {/* App Name */}
          <h1 className="text-4xl font-extrabold tracking-wide">Examy</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex justify-center mt-14">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

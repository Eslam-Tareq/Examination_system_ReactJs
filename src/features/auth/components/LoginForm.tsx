import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { loginService } from "../services/auth.service";
// import WelcomeText from "./WelcomeText";
import Logo from "./Logo";
import { UserRoles } from "@/types/userRoles";
import { useToastStore } from "@/store/toast.store";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((s) => s.login);
  const showToast = useToastStore((s) => s.showToast);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setError("");
      const res = await loginService(username, password);
      console.log("res", res);
      login(res.data.user, res.data.token.accessToken);
      if (res.success) {
        showToast("Login successful", "success", "Welcome", 5000);
      }
      if (res.data.user.role === UserRoles.INSTRUCTOR) {
        navigate("/instructor");
      } else {
        navigate("/student");
      }
    } catch (error: unknown) {
      console.log(error);
      setError("Username or password is incorrect");
    }
  };

  return (
    <div className="w-[520px] rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl px-10 py-12 text-white">
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <Logo />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0b1020]/80 px-5 py-4 text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0b1020]/80 px-5 py-4 text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 text-lg font-semibold transition hover:opacity-90"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

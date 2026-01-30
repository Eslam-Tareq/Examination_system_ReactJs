import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeText from "./WelcomeText";
import { loginService } from "../services/auth.service";
import { useAuthStore } from "@/store";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setError("");

      const response = await loginService(username, password);

      login(response.user, response.token);

      // Redirect حسب الـ role
      if (response.user.role === "student") {
        navigate("/student");
      } else {
        navigate("/instructor");
      }
    } catch {
      setError("Username or password is incorrect");
    }
  };

  return (
    <div className="w-[520px] bg-[#111827] border border-white/10 rounded-3xl shadow-2xl px-10 py-12">
      <WelcomeText />

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-5 py-4 bg-[#0b0f1a] text-white border border-white/10 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-4 bg-[#0b0f1a] text-white border border-white/10 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

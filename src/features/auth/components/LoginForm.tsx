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
      if (!res.data) {
        setError(res.message ?? "Login failed");
        return;
      }
      const { user, token } = res.data;
      login({ ...user, role: user.role as UserRoles }, token.accessToken);
      if (res.success) {
        showToast("Login successful", "success", "Welcome", 5000);
      }
      navigate("/", { replace: true });
    } catch (error: unknown) {
      console.log(error);
      setError("Username or password is incorrect");
    }
  };

  return (
    <div className="login-card">
      <div className="login-card-inner">
        {/* Logo */}
        <div className="login-logo">
          <Logo />
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            autoComplete="current-password"
          />

          <button type="button" onClick={handleLogin} className="login-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

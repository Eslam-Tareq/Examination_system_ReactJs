import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { loginService } from "../services/auth.service";
// import WelcomeText from "./WelcomeText";
import Logo from "./Logo";
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
            login({ ...user, role: user.role }, token.accessToken);
            if (res.success) {
                showToast("Login successful", "success", "Welcome", 5000);
            }
            navigate("/", { replace: true });
        }
        catch (error) {
            console.log(error);
            setError("Username or password is incorrect");
        }
    };
    return (_jsx("div", { className: "login-card", children: _jsxs("div", { className: "login-card-inner", children: [_jsx("div", { className: "login-logo", children: _jsx(Logo, {}) }), error && _jsx("div", { className: "login-error", children: error }), _jsxs("div", { className: "login-form", children: [_jsx("input", { type: "text", placeholder: "Username", value: username, onChange: (e) => setUsername(e.target.value), className: "login-input", autoComplete: "username" }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "login-input", autoComplete: "current-password" }), _jsx("button", { type: "button", onClick: handleLogin, className: "login-btn", children: "Login" })] })] }) }));
};
export default LoginForm;

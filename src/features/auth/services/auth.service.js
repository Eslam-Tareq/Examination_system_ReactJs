import { USE_MOCK } from "@/config/app.config";
import { mockLogin } from "../mocks/login.mock";
import { loginApi } from "./auth.api";
export const loginService = async (username, password) => {
    if (USE_MOCK) {
        return mockLogin(username, password);
    }
    return loginApi({ username, password });
};

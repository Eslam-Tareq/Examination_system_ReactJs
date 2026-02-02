import { USE_MOCK } from "@/config/app.config";
import { ApiResponse } from "@/services/api.types";
import { mockLogin } from "../mocks/login.mock";
import { loginApi } from "./auth.api";

type LoginData = {
  user: {
    id: number;
    username: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  token: { accessToken: string; expiresIn: number };
};

export const loginService = async (
  username: string,
  password: string
): Promise<ApiResponse<LoginData>> => {
  if (USE_MOCK) {
    return mockLogin(username, password);
  }
  return loginApi({ username, password });
};

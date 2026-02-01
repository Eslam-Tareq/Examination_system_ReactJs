// import http from "@/services/http";
import { ApiResponse } from "@/services/api.types";
import { mockLogin } from "../mocks/login.mock";

type LoginResponse = ApiResponse<{
  user: any;
  token: {
    accessToken: string;
    expiresIn: number;
  };
}>;

export const loginService = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  // 🔁 دلوقتي mock
  return mockLogin(username, password);

  // 🔁 لما الباك يخلص
  // return http.post("/api/auth/login", { username, password }).then(r => r.data);
};

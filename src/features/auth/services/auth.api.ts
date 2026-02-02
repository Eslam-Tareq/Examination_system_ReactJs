import http from "@/services/http";
import { ApiResponse } from "@/services/api.types";

type LoginPayload = { username: string; password: string };
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

/**
 * Real API (when backend is ready).
 * POST /api/auth/login
 * Body: LoginPayload
 * Response: ApiResponse<LoginData>
 */
export const loginApi = async (
  payload: LoginPayload
): Promise<ApiResponse<LoginData>> => {
  const res = await http.post<ApiResponse<LoginData>>(
    "/api/auth/login",
    payload
  );
  return res.data;
};

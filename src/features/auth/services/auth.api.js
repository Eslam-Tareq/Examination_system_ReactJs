import http from "@/services/http";
/**
 * Real API (when backend is ready).
 * POST /api/auth/login
 * Body: LoginPayload
 * Response: ApiResponse<LoginData>
 */
export const loginApi = async (payload) => {
    const res = await http.post("/api/auth/login", payload);
    return res.data;
};

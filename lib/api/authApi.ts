import { LoginPayload, LoginResponse } from "@/schema/auth";
import axiosInstance from "../axiosInstance";

/**
 * Auth API — handles login/logout against the backend.
 */
const authApi = {
  /**
   * POST /auth/login
   * Sends credentials and returns { token, user }.
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/admin/auth/login",
      payload
    );
    return response.data;
  },

  /**
   * POST /auth/logout (optional server-side invalidation)
   */
  // logout: async (): Promise<void> => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //   } catch {
  //     // Silently fail — we still clear client-side token
  //   }
  // },

  // Removed getMe as the backend does not implement /auth/me
};

export default authApi;

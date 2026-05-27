import axiosInstance from "../axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
}

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
      "/auth/login",
      payload
    );
    return response.data;
  },

  /**
   * POST /auth/logout (optional server-side invalidation)
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Silently fail — we still clear client-side token
    }
  },

  /**
   * GET /auth/me — validate current token and return user profile
   */
  getMe: async (): Promise<LoginResponse["user"]> => {
    const response = await axiosInstance.get<LoginResponse["user"]>("/auth/me");
    return response.data;
  },
};

export default authApi;

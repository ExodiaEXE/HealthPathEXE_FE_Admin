import { UserSummary, AdminCreateUser, PageResponse } from "@/schema/user";
import axiosInstance from "../axiosInstance";

const userApi = {
  getUsers: async (
    search?: string,
    onlyPremium?: boolean,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageResponse<UserSummary>> => {
    const params: Record<string, string | number | boolean> = { page, pageSize };
    if (search) params.search = search;
    if (onlyPremium !== undefined) params.onlyPremium = onlyPremium;
    const response = await axiosInstance.get<PageResponse<UserSummary>>(
      "/admin/users",
      { params }
    );
    return response.data;
  },

  getUserDetail: async (id: string) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (payload: AdminCreateUser) => {
    const response = await axiosInstance.post("/admin/users", payload);
    return response.data;
  },

  toggleUserActive: async (id: string) => {
    const response = await axiosInstance.put(`/admin/users/${id}/toggle-active`);
    return response.data;
  },
};

export default userApi;

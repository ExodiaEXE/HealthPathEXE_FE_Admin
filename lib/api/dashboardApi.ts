import { DashboardStats } from "@/schema/dashboard";
import axiosInstance from "../axiosInstance";

const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>(
      "/admin/dashboard/stats"
    );
    return response.data;
  },
};

export default dashboardApi;

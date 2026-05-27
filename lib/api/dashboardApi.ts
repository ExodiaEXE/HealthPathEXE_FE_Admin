import axiosInstance from "../axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  growthRate: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

// ─── Dashboard API ──────────────────────────────────────────────────────────

const dashboardApi = {
  /**
   * GET /dashboard/stats
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>(
      "/dashboard/stats"
    );
    return response.data;
  },

  /**
   * GET /dashboard/recent-orders
   */
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const response = await axiosInstance.get<RecentOrder[]>(
      "/dashboard/recent-orders"
    );
    return response.data;
  },

  /**
   * GET /dashboard/revenue
   */
  getRevenueData: async (): Promise<RevenueDataPoint[]> => {
    const response = await axiosInstance.get<RevenueDataPoint[]>(
      "/dashboard/revenue"
    );
    return response.data;
  },
};

export default dashboardApi;

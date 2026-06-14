import {
  SubscriptionPlan,
  CreateSubscriptionPlan,
  UpdateSubscriptionPlan,
} from "@/schema/subscription";
import { TransactionDto } from "@/schema/dashboard";
import { PageResponse } from "@/schema/user";
import axiosInstance from "../axiosInstance";

const subscriptionApi = {
  getPlans: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageResponse<SubscriptionPlan>> => {
    const response = await axiosInstance.get<PageResponse<SubscriptionPlan>>(
      "/admin/subscriptions/plans",
      { params: { page, pageSize } }
    );
    return response.data;
  },

  getPlanById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.get<SubscriptionPlan>(
      `/admin/subscriptions/plans/${id}`
    );
    return response.data;
  },

  createPlan: async (payload: CreateSubscriptionPlan): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.post<SubscriptionPlan>(
      "/admin/subscriptions/plans",
      payload
    );
    return response.data;
  },

  updatePlan: async (
    id: string,
    payload: UpdateSubscriptionPlan
  ): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.put<SubscriptionPlan>(
      `/admin/subscriptions/plans/${id}`,
      payload
    );
    return response.data;
  },

  deletePlan: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/subscriptions/plans/${id}`);
  },

  getTransactions: async (
    search?: string,
    platform?: string,
    status?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageResponse<TransactionDto>> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (search) params.search = search;
    if (platform) params.platform = platform;
    if (status) params.status = status;
    const response = await axiosInstance.get<PageResponse<TransactionDto>>(
      "/admin/subscriptions/transactions",
      { params }
    );
    return response.data;
  },
};

export default subscriptionApi;

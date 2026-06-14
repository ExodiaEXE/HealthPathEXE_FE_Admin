// ─── Dashboard DTOs (matches DashboardDto.cs) ──────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalPremiumUsers: number;
  conversionRate: number;
  totalRevenue: number;
  platformBreakdown: PlatformRevenueItem[];
  monthlyRevenueChart: MonthlyRevenueItem[];
  recentTransactions: TransactionDto[];
}

export interface PlatformRevenueItem {
  platform: string;
  revenue: number;
  transactionCount: number;
}

export interface MonthlyRevenueItem {
  month: string;
  revenue: number;
  transactionCount: number;
}

export interface TransactionDto {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  platform: string;
  platformTransactionId: string;
  originalTransactionId?: string;
  status: string;
  amount: number;
  currency: string;
  purchasedAt: string;
  expiresAt?: string;
  createdAt: string;
}

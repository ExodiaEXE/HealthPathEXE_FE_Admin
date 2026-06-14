// ─── Subscription DTOs (matches SubscriptionPlanDto.cs, CreateSubscriptionPlanDto.cs) ─

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string;
  isActive: boolean;
  appleProductId?: string;
  googleProductId?: string;
}

export interface CreateSubscriptionPlan {
  name: string;
  code: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string;
  isActive: boolean;
  appleProductId?: string;
  googleProductId?: string;
}

export type UpdateSubscriptionPlan = CreateSubscriptionPlan;

// ─── User DTOs (matches AdminUserDtos.cs) ───────────────────────────────────

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  hasPremiumAccess: boolean;
  createdAt: string;
}

export interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreateUser {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── Pagination (matches PageResponse.cs) ───────────────────────────────────

export interface PageResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

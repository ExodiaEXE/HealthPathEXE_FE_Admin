// ─── Blog DTOs (matches BlogDtos.cs) ────────────────────────────────────────

// --- BlogCategory ---

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBlogCategory {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateBlogCategory {
  name: string;
  description?: string;
  isActive: boolean;
}

// --- Blog ---

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId: string;
  categoryName: string;
  views: number;
  isActive: boolean;
  createdAt: string;
}

export interface BlogDetail {
  id: string;
  title: string;
  slug: string;
  body: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId: string;
  categoryName: string;
  views: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlog {
  title: string;
  body: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId: string;
  isActive: boolean;
}

export interface UpdateBlog {
  title: string;
  body: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId: string;
  isActive: boolean;
}

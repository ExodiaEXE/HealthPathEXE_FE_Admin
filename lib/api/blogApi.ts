import {
  BlogCategory,
  CreateBlogCategory,
  UpdateBlogCategory,
  Blog,
  BlogDetail,
  CreateBlog,
  UpdateBlog,
} from "@/schema/blog";
import { PageResponse } from "@/schema/user";
import axiosInstance from "../axiosInstance";

const blogApi = {
  // ─── Categories ─────────────────────────────────────────────────────────────

  getCategories: async (): Promise<BlogCategory[]> => {
    const response = await axiosInstance.get<BlogCategory[]>(
      "/admin/blog-categories"
    );
    return response.data;
  },

  getCategoryById: async (id: string): Promise<BlogCategory> => {
    const response = await axiosInstance.get<BlogCategory>(
      `/admin/blog-categories/${id}`
    );
    return response.data;
  },

  createCategory: async (
    payload: CreateBlogCategory
  ): Promise<BlogCategory> => {
    const response = await axiosInstance.post<BlogCategory>(
      "/admin/blog-categories",
      payload
    );
    return response.data;
  },

  updateCategory: async (
    id: string,
    payload: UpdateBlogCategory
  ): Promise<BlogCategory> => {
    const response = await axiosInstance.put<BlogCategory>(
      `/admin/blog-categories/${id}`,
      payload
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/blog-categories/${id}`);
  },

  // ─── Blogs ──────────────────────────────────────────────────────────────────

  getBlogs: async (
    categoryId?: string,
    search?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageResponse<Blog>> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;
    const response = await axiosInstance.get<PageResponse<Blog>>(
      "/admin/blogs",
      { params }
    );
    return response.data;
  },

  getBlogById: async (id: string): Promise<BlogDetail> => {
    const response = await axiosInstance.get<BlogDetail>(
      `/admin/blogs/${id}`
    );
    return response.data;
  },

  createBlog: async (payload: CreateBlog): Promise<BlogDetail> => {
    const response = await axiosInstance.post<BlogDetail>(
      "/admin/blogs",
      payload
    );
    return response.data;
  },

  updateBlog: async (
    id: string,
    payload: UpdateBlog
  ): Promise<BlogDetail> => {
    const response = await axiosInstance.put<BlogDetail>(
      `/admin/blogs/${id}`,
      payload
    );
    return response.data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/blogs/${id}`);
  },

  toggleBlogActive: async (id: string): Promise<void> => {
    await axiosInstance.put(`/admin/blogs/${id}/toggle-active`);
  },
};

export default blogApi;

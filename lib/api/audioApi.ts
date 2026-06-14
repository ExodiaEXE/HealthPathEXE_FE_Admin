import {
  AudioTrack,
  AudioCategory,
  CreateAudioTrack,
  UpdateAudioTrack,
  CreateAudioCategory,
  UpdateAudioCategory,
} from "@/schema/audio";
import { PageResponse } from "@/schema/user";
import axiosInstance from "../axiosInstance";

const audioApi = {
  // ─── Tracks ─────────────────────────────────────────────────────────────────
  getTracks: async (
    category?: string,
    search?: string,
    isPremium?: boolean,
    sortBy: string = "newest",
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageResponse<AudioTrack>> => {
    const params: Record<string, string | number | boolean> = { sortBy, page, pageSize };
    if (category) params.category = category;
    if (search) params.search = search;
    if (isPremium !== undefined) params.isPremium = isPremium;
    const response = await axiosInstance.get<PageResponse<AudioTrack>>(
      "/audiotrack",
      { params }
    );
    return response.data;
  },

  createTrack: async (payload: CreateAudioTrack): Promise<AudioTrack> => {
    const response = await axiosInstance.post<AudioTrack>("/audiotrack", payload);
    return response.data;
  },

  updateTrack: async (id: string, payload: UpdateAudioTrack): Promise<AudioTrack> => {
    const response = await axiosInstance.put<AudioTrack>(`/audiotrack/${id}`, payload);
    return response.data;
  },

  deleteTrack: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/audiotrack/${id}`);
  },

  // ─── Categories ─────────────────────────────────────────────────────────────
  getCategories: async (): Promise<AudioCategory[]> => {
    const response = await axiosInstance.get<AudioCategory[]>(
      "/audiotrack/categories/all"
    );
    return response.data;
  },

  createCategory: async (payload: CreateAudioCategory): Promise<AudioCategory> => {
    const response = await axiosInstance.post<AudioCategory>(
      "/audiotrack/categories",
      payload
    );
    return response.data;
  },

  updateCategory: async (
    id: string,
    payload: UpdateAudioCategory
  ): Promise<AudioCategory> => {
    const response = await axiosInstance.put<AudioCategory>(
      `/audiotrack/categories/${id}`,
      payload
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/audiotrack/categories/${id}`);
  },
};

export default audioApi;

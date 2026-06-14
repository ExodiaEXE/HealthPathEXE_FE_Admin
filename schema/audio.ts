// ─── Audio DTOs (matches AudioDtos.cs) ──────────────────────────────────────

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  studio?: string;
  category: string;
  categoryId: string;
  durationSeconds: number;
  coverUrl?: string;
  isPremium: boolean;
  playCount: number;
  isFavorited: boolean;
  createdAt: string;
}

export interface AudioCategory {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CreateAudioTrack {
  title: string;
  artist?: string;
  studio?: string;
  categoryId: string;
  durationSeconds: number;
  fileUrl: string;
  coverUrl?: string;
  isPremium: boolean;
}

export interface UpdateAudioTrack {
  title?: string;
  artist?: string;
  studio?: string;
  categoryId?: string;
  durationSeconds?: number;
  coverUrl?: string;
  isPremium?: boolean;
  isActive?: boolean;
}

export interface CreateAudioCategory {
  name: string;
  description?: string;
  iconUrl?: string;
  sortOrder: number;
}

export interface UpdateAudioCategory {
  name?: string;
  description?: string;
  iconUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

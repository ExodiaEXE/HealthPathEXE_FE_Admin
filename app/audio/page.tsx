"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import audioApi from "@/lib/api/audioApi";
import {
  AudioTrack, AudioCategory,
  CreateAudioTrack, CreateAudioCategory,
  UpdateAudioTrack, UpdateAudioCategory,
} from "@/schema/audio";
import { PageResponse } from "@/schema/user";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Track Modal ────────────────────────────────────────────────────────────

function TrackModal({
  track, categories, onClose, onSaved,
}: {
  track?: AudioTrack;
  categories: AudioCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!track;
  const [form, setForm] = useState<CreateAudioTrack & { isActive?: boolean }>(
    track
      ? { title: track.title, artist: track.artist || "", studio: track.studio || "", categoryId: track.categoryId, durationSeconds: track.durationSeconds, fileUrl: "", coverUrl: track.coverUrl || "", isPremium: track.isPremium }
      : { title: "", artist: "", studio: "", categoryId: categories[0]?.id || "", durationSeconds: 0, fileUrl: "", coverUrl: "", isPremium: false }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.title) { setError("Title is required."); return; }
    if (!isEdit && !form.fileUrl) { setError("File URL is required for new tracks."); return; }
    setSubmitting(true);
    try {
      if (isEdit && track) {
        const update: UpdateAudioTrack = {
          title: form.title, artist: form.artist, studio: form.studio,
          categoryId: form.categoryId, durationSeconds: form.durationSeconds,
          coverUrl: form.coverUrl, isPremium: form.isPremium,
        };
        await audioApi.updateTrack(track.id, update);
      } else {
        await audioApi.createTrack(form);
      }
      onSaved(); onClose();
    } catch {
      setError(isEdit ? "Failed to update track." : "Failed to create track.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? "Edit Track" : "Create Track"}</h2>
        {error && <div className="alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="form-group">
          <label className="input-label">Title *</label>
          <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Artist</label>
            <input className="input-field" value={form.artist || ""} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="input-label">Studio</label>
            <input className="input-field" value={form.studio || ""} onChange={(e) => setForm({ ...form, studio: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Category</label>
            <select className="select-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="input-label">Duration (seconds)</label>
            <input className="input-field" type="number" value={form.durationSeconds} onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) })} />
          </div>
        </div>
        {!isEdit && (
          <div className="form-group">
            <label className="input-label">File URL (R2 Key) *</label>
            <input className="input-field" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="audio/tracks/uuid.mp3" />
          </div>
        )}
        <div className="form-group">
          <label className="input-label">Cover URL</label>
          <input className="input-field" value={form.coverUrl || ""} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="checkbox-wrapper">
            <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Premium Only</span>
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Modal ─────────────────────────────────────────────────────────

function CategoryModal({
  category, onClose, onSaved,
}: {
  category?: AudioCategory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;
  const [form, setForm] = useState<CreateAudioCategory & { isActive?: boolean }>(
    category
      ? { name: category.name, description: category.description || "", iconUrl: category.iconUrl || "", sortOrder: category.sortOrder, isActive: category.isActive }
      : { name: "", description: "", iconUrl: "", sortOrder: 0 }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name) { setError("Name is required."); return; }
    setSubmitting(true);
    try {
      if (isEdit && category) {
        const update: UpdateAudioCategory = { name: form.name, description: form.description, iconUrl: form.iconUrl, sortOrder: form.sortOrder, isActive: form.isActive };
        await audioApi.updateCategory(category.id, update);
      } else {
        await audioApi.createCategory(form);
      }
      onSaved(); onClose();
    } catch {
      setError(isEdit ? "Failed to update category." : "Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? "Edit Category" : "Create Category"}</h2>
        {error && <div className="alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="form-group">
          <label className="input-label">Name *</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="input-label">Description</label>
          <input className="input-field" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Icon URL</label>
            <input className="input-field" value={form.iconUrl || ""} onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="input-label">Sort Order</label>
            <input className="input-field" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
        </div>
        {isEdit && (
          <div className="form-group">
            <label className="input-label">Active</label>
            <button className={`toggle-switch ${form.isActive ? "active" : ""}`} onClick={() => setForm({ ...form, isActive: !form.isActive })} />
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ───────────────────────────────────────────────────────────

function AudioContent() {
  const [tab, setTab] = useState<"tracks" | "categories">("tracks");
  const [tracks, setTracks] = useState<PageResponse<AudioTrack> | null>(null);
  const [categories, setCategories] = useState<AudioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [editTrack, setEditTrack] = useState<AudioTrack | undefined>();
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState<AudioCategory | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await audioApi.getCategories();
      setCategories(res);
    } catch {
      console.error("Failed to load categories");
    }
  }, []);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await audioApi.getTracks(undefined, search || undefined, undefined, "newest", page, 10);
      setTracks(res);
    } catch {
      console.error("Failed to load tracks");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { if (tab === "tracks") fetchTracks(); else setLoading(false); }, [tab, fetchTracks]);

  const handleDeleteTrack = async (id: string) => {
    if (!confirm("Delete this track?")) return;
    setDeleting(id);
    try { await audioApi.deleteTrack(id); fetchTracks(); } catch { console.error("Delete failed"); } finally { setDeleting(null); }
  };

  const handleDeleteCat = async (id: string) => {
    if (!confirm("Delete this category? Only possible if no tracks belong to it.")) return;
    setDeleting(id);
    try { await audioApi.deleteCategory(id); fetchCategories(); } catch { alert("Cannot delete: category may have tracks."); } finally { setDeleting(null); }
  };

  return (
    <div className="animate-fade-in">
      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-btn ${tab === "tracks" ? "active" : ""}`} onClick={() => setTab("tracks")}>Tracks</button>
        <button className={`tab-btn ${tab === "categories" ? "active" : ""}`} onClick={() => setTab("categories")}>Categories</button>
      </div>

      {tab === "tracks" && (
        <>
          <div className="search-bar">
            <div className="search-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="search-input" placeholder="Search tracks..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <button className="btn-primary" onClick={() => { setEditTrack(undefined); setShowTrackModal(true); }}>+ Add Track</button>
          </div>
          <div className="glass-card-static" style={{ padding: "1.5rem" }}>
            {loading ? (
              <div className="empty-state"><div className="spinner" /></div>
            ) : !tracks || tracks.items.length === 0 ? (
              <div className="empty-state">No tracks found.</div>
            ) : (
              <>
                <div style={{ overflowX: "auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Title</th><th>Artist</th><th>Category</th><th>Duration</th><th>Plays</th><th>Premium</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {tracks.items.map((t) => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {t.coverUrl ? (
                                <img src={t.coverUrl} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                              ) : (
                                <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                                </div>
                              )}
                              {t.title}
                            </div>
                          </td>
                          <td>{t.artist || "—"}</td>
                          <td><span className="badge badge-info">{t.category}</span></td>
                          <td>{formatDuration(t.durationSeconds)}</td>
                          <td>{t.playCount.toLocaleString()}</td>
                          <td>{t.isPremium ? <span className="badge badge-warning">Premium</span> : <span className="badge badge-success">Free</span>}</td>
                          <td>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }} onClick={() => { setEditTrack(t); setShowTrackModal(true); }}>Edit</button>
                              <button className="btn-danger" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }} onClick={() => handleDeleteTrack(t.id)} disabled={deleting === t.id}>{deleting === t.id ? "..." : "Del"}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tracks.totalPages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={!tracks.hasPrev} onClick={() => setPage((p) => p - 1)}>←</button>
                    {Array.from({ length: tracks.totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
                      <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn" disabled={!tracks.hasNext} onClick={() => setPage((p) => p + 1)}>→</button>
                  </div>
                )}
              </>
            )}
          </div>
          {showTrackModal && <TrackModal track={editTrack} categories={categories} onClose={() => setShowTrackModal(false)} onSaved={fetchTracks} />}
        </>
      )}

      {tab === "categories" && (
        <>
          <div className="search-bar">
            <div style={{ flex: 1 }} />
            <button className="btn-primary" onClick={() => { setEditCat(undefined); setShowCatModal(true); }}>+ Add Category</button>
          </div>
          <div className="glass-card-static" style={{ padding: "1.5rem" }}>
            {categories.length === 0 ? (
              <div className="empty-state">No categories found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr><th>Name</th><th>Description</th><th>Sort Order</th><th>Active</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</td>
                        <td>{c.description || "—"}</td>
                        <td>{c.sortOrder}</td>
                        <td>{c.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}</td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }} onClick={() => { setEditCat(c); setShowCatModal(true); }}>Edit</button>
                            <button className="btn-danger" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }} onClick={() => handleDeleteCat(c.id)} disabled={deleting === c.id}>{deleting === c.id ? "..." : "Del"}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {showCatModal && <CategoryModal category={editCat} onClose={() => setShowCatModal(false)} onSaved={fetchCategories} />}
        </>
      )}
    </div>
  );
}

export default function AudioPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AudioContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

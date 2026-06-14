"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import userApi from "@/lib/api/userApi";
import { UserSummary, AdminCreateUser, PageResponse } from "@/schema/user";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ─── Create User Modal ──────────────────────────────────────────────────────

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<AdminCreateUser>({ fullName: "", email: "", password: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.fullName || !form.email || !form.password) {
      setError("Full name, email, and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      await userApi.createUser(form);
      onCreated();
      onClose();
    } catch {
      setError("Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Create User</h2>
        {error && <div className="alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="form-group">
          <label className="input-label">Full Name *</label>
          <input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="input-label">Email *</label>
          <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Password *</label>
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label className="input-label">Phone</label>
            <input className="input-field" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+84..." />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? "Creating..." : "Create User"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ───────────────────────────────────────────────────────────

function UsersContent() {
  const [data, setData] = useState<PageResponse<UserSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers(search || undefined, onlyPremium || undefined, page, 10);
      setData(res);
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, onlyPremium, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (id: string) => {
    setToggling(id);
    try {
      await userApi.toggleUserActive(id);
      fetchUsers();
    } catch {
      console.error("Toggle failed");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Search & Actions */}
      <div className="search-bar">
        <div className="search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <label className="checkbox-wrapper">
          <input type="checkbox" checked={onlyPremium} onChange={(e) => { setOnlyPremium(e.target.checked); setPage(1); }} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Premium only</span>
        </label>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Create User</button>
      </div>

      {/* Table */}
      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : !data || data.items.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Premium</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--gradient-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {u.fullName.charAt(0)}
                          </div>
                          {u.fullName}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || "—"}</td>
                      <td>{u.hasPremiumAccess ? <span className="badge badge-success">Premium</span> : <span className="badge badge-warning">Free</span>}</td>
                      <td>{u.isVerified ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>}</td>
                      <td>
                        <button
                          className={`toggle-switch ${u.isActive ? "active" : ""}`}
                          onClick={() => handleToggle(u.id)}
                          disabled={toggling === u.id}
                          aria-label={u.isActive ? "Deactivate" : "Activate"}
                        />
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>
                        <button
                          className={u.isActive ? "btn-danger" : "btn-success"}
                          style={{ fontSize: "0.75rem", padding: "0.4rem 0.75rem" }}
                          onClick={() => handleToggle(u.id)}
                          disabled={toggling === u.id}
                        >
                          {u.isActive ? "Ban" : "Unban"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={!data.hasPrev} onClick={() => setPage((p) => p - 1)}>←</button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
                  <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" disabled={!data.hasNext} onClick={() => setPage((p) => p + 1)}>→</button>
              </div>
            )}
          </>
        )}
      </div>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={fetchUsers} />}
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <UsersContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

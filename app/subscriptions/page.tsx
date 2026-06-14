"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import subscriptionApi from "@/lib/api/subscriptionApi";
import { SubscriptionPlan, CreateSubscriptionPlan } from "@/schema/subscription";
import { PageResponse } from "@/schema/user";

// ─── Plan Modal ─────────────────────────────────────────────────────────────

const emptyPlan: CreateSubscriptionPlan = {
  name: "", code: "", description: "", priceMonthly: 0, priceYearly: 0,
  currency: "VND", features: "[]", isActive: true, appleProductId: "", googleProductId: "",
};

function PlanModal({
  plan,
  onClose,
  onSaved,
}: {
  plan?: SubscriptionPlan;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!plan;
  const [form, setForm] = useState<CreateSubscriptionPlan>(
    plan
      ? { name: plan.name, code: plan.code, description: plan.description || "", priceMonthly: plan.priceMonthly, priceYearly: plan.priceYearly, currency: plan.currency, features: plan.features, isActive: plan.isActive, appleProductId: plan.appleProductId || "", googleProductId: plan.googleProductId || "" }
      : { ...emptyPlan }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.code) { setError("Name and Code are required."); return; }
    setSubmitting(true);
    try {
      if (isEdit && plan) {
        await subscriptionApi.updatePlan(plan.id, form);
      } else {
        await subscriptionApi.createPlan(form);
      }
      onSaved();
      onClose();
    } catch {
      setError(isEdit ? "Failed to update plan." : "Failed to create plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? "Edit Plan" : "Create Plan"}</h2>
        {error && <div className="alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Name *</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Premium Monthly" />
          </div>
          <div className="form-group">
            <label className="input-label">Code *</label>
            <input className="input-field" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="premium_monthly" />
          </div>
        </div>
        <div className="form-group">
          <label className="input-label">Description</label>
          <input className="input-field" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Plan description..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Monthly Price</label>
            <input className="input-field" type="number" value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="input-label">Yearly Price</label>
            <input className="input-field" type="number" value={form.priceYearly} onChange={(e) => setForm({ ...form, priceYearly: Number(e.target.value) })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Currency</label>
            <input className="input-field" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="input-label">Active</label>
            <button className={`toggle-switch ${form.isActive ? "active" : ""}`} onClick={() => setForm({ ...form, isActive: !form.isActive })} style={{ marginTop: "0.5rem" }} />
          </div>
        </div>
        <div className="form-group">
          <label className="input-label">Features (JSON)</label>
          <input className="input-field" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder='["Feature 1", "Feature 2"]' />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Apple Product ID</label>
            <input className="input-field" value={form.appleProductId || ""} onChange={(e) => setForm({ ...form, appleProductId: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="input-label">Google Product ID</label>
            <input className="input-field" value={form.googleProductId || ""} onChange={(e) => setForm({ ...form, googleProductId: e.target.value })} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? "Saving..." : isEdit ? "Update" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ───────────────────────────────────────────────────────────

function SubscriptionsContent() {
  const [data, setData] = useState<PageResponse<SubscriptionPlan> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getPlans(page, 10);
      setData(res);
    } catch {
      console.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    setDeleting(id);
    try {
      await subscriptionApi.deletePlan(id);
      fetchPlans();
    } catch {
      console.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  return (
    <div className="animate-fade-in">
      <div className="search-bar">
        <div style={{ flex: 1 }} />
        <button className="btn-primary" onClick={() => { setEditPlan(undefined); setShowModal(true); }}>+ Create Plan</button>
      </div>

      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : !data || data.items.length === 0 ? (
          <div className="empty-state">No subscription plans found.</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Monthly</th>
                    <th>Yearly</th>
                    <th>Currency</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</td>
                      <td><span className="badge badge-info">{p.code}</span></td>
                      <td style={{ fontWeight: 600 }}>{formatPrice(p.priceMonthly)}</td>
                      <td style={{ fontWeight: 600 }}>{formatPrice(p.priceYearly)}</td>
                      <td>{p.currency}</td>
                      <td>{p.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }} onClick={() => { setEditPlan(p); setShowModal(true); }}>Edit</button>
                          <button className="btn-danger" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }} onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>{deleting === p.id ? "..." : "Delete"}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {showModal && <PlanModal plan={editPlan} onClose={() => setShowModal(false)} onSaved={fetchPlans} />}
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SubscriptionsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

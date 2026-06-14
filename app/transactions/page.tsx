"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import subscriptionApi from "@/lib/api/subscriptionApi";
import { TransactionDto } from "@/schema/dashboard";
import { PageResponse } from "@/schema/user";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { className: string; label: string }> = {
    Completed: { className: "badge badge-success", label: "Completed" },
    completed: { className: "badge badge-success", label: "Completed" },
    Pending: { className: "badge badge-warning", label: "Pending" },
    pending: { className: "badge badge-warning", label: "Pending" },
    Failed: { className: "badge badge-danger", label: "Failed" },
    failed: { className: "badge badge-danger", label: "Failed" },
    Refunded: { className: "badge badge-info", label: "Refunded" },
    refunded: { className: "badge badge-info", label: "Refunded" },
  };
  const s = map[status] || { className: "badge badge-info", label: status };
  return <span className={s.className}>{s.label}</span>;
}

function TransactionsContent() {
  const [data, setData] = useState<PageResponse<TransactionDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getTransactions(
        search || undefined,
        platform || undefined,
        status || undefined,
        page, 10
      );
      setData(res);
    } catch {
      console.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [search, platform, status, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="animate-fade-in">
      {/* Filters */}
      <div className="search-bar">
        <div className="search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className="search-input" placeholder="Search transactions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="select-field" style={{ width: "auto", minWidth: 150 }} value={platform} onChange={(e) => { setPlatform(e.target.value); setPage(1); }}>
          <option value="">All Platforms</option>
          <option value="GooglePlay">Google Play</option>
          <option value="AppStore">App Store</option>
        </select>
        <select className="select-field" style={{ width: "auto", minWidth: 150 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : !data || data.items.length === 0 ? (
          <div className="empty-state">No transactions found.</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Platform</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Purchased</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{t.planName}</td>
                      <td><span className="badge badge-info">{t.platform}</span></td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCurrency(t.amount)}</td>
                      <td>{t.currency}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>{formatDate(t.purchasedAt)}</td>
                      <td>{t.expiresAt ? formatDate(t.expiresAt) : "—"}</td>
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
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TransactionsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

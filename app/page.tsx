"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import dashboardApi from "@/lib/api/dashboardApi";
import {
  DashboardStats,
  MonthlyRevenueItem,
  TransactionDto,
} from "@/schema/dashboard";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── SVG Icon Components ────────────────────────────────────────────────────

function UsersStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function PremiumIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function RevenueStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function ConversionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  );
}

// ─── Revenue Chart ──────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: MonthlyRevenueItem[] }) {
  if (!data.length) return <div className="empty-state">No revenue data</div>;

  const max = Math.max(...data.map((d) => d.revenue));
  const width = 700;
  const height = 200;
  const padding = 20;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * chartW,
    y: padding + chartH - (max > 0 ? (d.revenue / max) * chartH : 0),
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="chart-area">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            y1={padding + chartH * ratio}
            x2={width - padding}
            y2={padding + chartH * ratio}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}
        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--accent-primary)" stroke="var(--bg-primary)" strokeWidth="2" />
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem 1rem 0",
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
        }}
      >
        {data.map((d) => (
          <span key={d.month} style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {d.month.split("-")[1] ? new Date(d.month + "-01").toLocaleString("en-US", { month: "short" }) : d.month}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { className: string; label: string }> = {
    completed: { className: "badge badge-success", label: "Completed" },
    Completed: { className: "badge badge-success", label: "Completed" },
    pending: { className: "badge badge-warning", label: "Pending" },
    Pending: { className: "badge badge-warning", label: "Pending" },
    failed: { className: "badge badge-danger", label: "Failed" },
    Failed: { className: "badge badge-danger", label: "Failed" },
    refunded: { className: "badge badge-info", label: "Refunded" },
    Refunded: { className: "badge badge-info", label: "Refunded" },
  };
  const s = map[status] || { className: "badge badge-info", label: status };
  return <span className={s.className}>{s.label}</span>;
}

// ─── Main Dashboard Content ─────────────────────────────────────────────────

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return <div className="alert-error">{error || "No data available."}</div>;
  }

  const statCards = [
    { title: "Total Users", value: formatNumber(stats.totalUsers), color: "purple" as const, icon: UsersStatIcon },
    { title: "Premium Users", value: formatNumber(stats.totalPremiumUsers), color: "cyan" as const, icon: PremiumIcon },
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), color: "green" as const, icon: RevenueStatIcon },
    { title: "Conversion Rate", value: `${stats.conversionRate.toFixed(1)}%`, color: "amber" as const, icon: ConversionIcon },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stat Cards */}
      <div
        className="stagger-children"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`glass-card stat-card ${card.color}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: "0.25rem" }}>{card.title}</p>
                  <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>{card.value}</p>
                </div>
                <div style={{ width: 40, height: 40, background: "var(--bg-glass-hover)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Platform Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="glass-card-static" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.15rem" }}>Revenue Overview</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Monthly revenue chart</p>
            </div>
            <div className="badge badge-info">Live</div>
          </div>
          <RevenueChart data={stats.monthlyRevenueChart} />
        </div>

        {/* Platform Breakdown */}
        <div className="glass-card-static" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>Platform Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {stats.platformBreakdown.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No platform data yet.</p>}
            {stats.platformBreakdown.map((p) => (
              <div key={p.platform} style={{ padding: "1rem", background: "var(--bg-glass-hover)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{p.platform}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(p.revenue)}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.transactionCount} transactions</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Recent Transactions */}
      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>Recent Transactions</h2>
        {stats.recentTransactions.length === 0 ? (
          <div className="empty-state">No transactions yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Platform</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.slice(0, 5).map((t: TransactionDto) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{t.planName}</td>
                    <td><span className="badge badge-info">{t.platform}</span></td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCurrency(t.amount)}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{formatDate(t.purchasedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

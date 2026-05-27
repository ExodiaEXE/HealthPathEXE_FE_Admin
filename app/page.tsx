"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import dashboardApi, {
  DashboardStats,
  RecentOrder,
  RevenueDataPoint,
} from "@/lib/api/dashboardApi";

// ─── Fallback mock data (used when API is unavailable) ──────────────────────

const MOCK_STATS: DashboardStats = {
  totalUsers: 12847,
  totalRevenue: 284350,
  totalOrders: 3642,
  growthRate: 12.5,
};

const MOCK_ORDERS: RecentOrder[] = [
  {
    id: "ORD-001",
    customerName: "Sarah Johnson",
    product: "Health Check Premium",
    amount: 299,
    status: "completed",
    date: "2026-05-27",
  },
  {
    id: "ORD-002",
    customerName: "Michael Chen",
    product: "Lab Test Package",
    amount: 149,
    status: "pending",
    date: "2026-05-26",
  },
  {
    id: "ORD-003",
    customerName: "Emily Davis",
    product: "Annual Checkup",
    amount: 450,
    status: "completed",
    date: "2026-05-26",
  },
  {
    id: "ORD-004",
    customerName: "James Wilson",
    product: "Blood Panel Basic",
    amount: 89,
    status: "cancelled",
    date: "2026-05-25",
  },
  {
    id: "ORD-005",
    customerName: "Olivia Martinez",
    product: "Health Check Standard",
    amount: 199,
    status: "completed",
    date: "2026-05-25",
  },
];

const MOCK_REVENUE: RevenueDataPoint[] = [
  { month: "Jan", revenue: 18500 },
  { month: "Feb", revenue: 22300 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 27400 },
  { month: "May", revenue: 31200 },
  { month: "Jun", revenue: 28900 },
  { month: "Jul", revenue: 35600 },
  { month: "Aug", revenue: 33100 },
  { month: "Sep", revenue: 38400 },
  { month: "Oct", revenue: 36700 },
  { month: "Nov", revenue: 42100 },
  { month: "Dec", revenue: 45200 },
];

// ─── Helper Components ──────────────────────────────────────────────────────

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

function StatusBadge({ status }: { status: RecentOrder["status"] }) {
  const map: Record<string, { className: string; label: string }> = {
    completed: { className: "badge badge-success", label: "Completed" },
    pending: { className: "badge badge-warning", label: "Pending" },
    cancelled: { className: "badge badge-danger", label: "Cancelled" },
  };
  const s = map[status] || map.pending;
  return <span className={s.className}>{s.label}</span>;
}

// ─── Mini SVG Chart ─────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.revenue));
  const width = 700;
  const height = 200;
  const padding = 20;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * chartW,
    y: padding + chartH - (d.revenue / max) * chartH,
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
        {/* Grid lines */}
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
        {/* Area */}
        <path d={areaD} fill="url(#chartGrad)" />
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="var(--accent-primary)"
            stroke="var(--bg-primary)"
            strokeWidth="2"
          />
        ))}
      </svg>
      {/* Month labels */}
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
          <span
            key={d.month}
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {d.month}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card Icons ────────────────────────────────────────────────────────

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

function RevenueStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function OrdersStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function GrowthStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [orders, setOrders] = useState<RecentOrder[]>(MOCK_ORDERS);
  const [revenue, setRevenue] = useState<RevenueDataPoint[]>(MOCK_REVENUE);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData, revenueData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentOrders(),
          dashboardApi.getRevenueData(),
        ]);
        setStats(statsData);
        setOrders(ordersData);
        setRevenue(revenueData);
      } catch {
        // API unavailable — keep mock data
        console.log("Using mock dashboard data (API unavailable)");
      } finally {
        setDataLoaded(true);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: formatNumber(stats.totalUsers),
      change: "+8.2%",
      changeUp: true,
      color: "purple" as const,
      icon: UsersStatIcon,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+14.3%",
      changeUp: true,
      color: "cyan" as const,
      icon: RevenueStatIcon,
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.totalOrders),
      change: "+5.7%",
      changeUp: true,
      color: "green" as const,
      icon: OrdersStatIcon,
    },
    {
      title: "Growth Rate",
      value: `${stats.growthRate}%`,
      change: "+2.1%",
      changeUp: true,
      color: "amber" as const,
      icon: GrowthStatIcon,
    },
  ];

  return (
    <div className={dataLoaded ? "animate-fade-in" : ""}>
      {/* Stat Cards */}
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`glass-card stat-card ${card.color}`}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {card.title}
                  </p>
                  <p
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--bg-glass-hover)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Icon />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.8rem",
                }}
              >
                <span
                  style={{
                    color: card.changeUp
                      ? "var(--accent-success)"
                      : "var(--accent-danger)",
                    fontWeight: 600,
                  }}
                >
                  {card.change}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  vs last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-column layout: Chart + Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Revenue Chart */}
        <div className="glass-card-static" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.15rem",
                }}
              >
                Revenue Overview
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Monthly revenue for {new Date().getFullYear()}
              </p>
            </div>
            <div className="badge badge-info">Live</div>
          </div>
          <RevenueChart data={revenue} />
        </div>

        {/* Quick Stats */}
        <div className="glass-card-static" style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
            }}
          >
            Quick Overview
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Active now */}
            <div
              style={{
                padding: "1rem",
                background: "var(--bg-glass-hover)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  Active Users Now
                </span>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: "var(--accent-success)",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "pulse-glow 2s infinite",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                347
              </p>
            </div>

            {/* Conversion rate */}
            <div
              style={{
                padding: "1rem",
                background: "var(--bg-glass-hover)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Conversion Rate
              </span>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                3.24%
              </p>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "32.4%",
                    height: "100%",
                    background: "var(--gradient-primary)",
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>

            {/* Avg Order */}
            <div
              style={{
                padding: "1rem",
                background: "var(--bg-glass-hover)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Avg. Order Value
              </span>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                $78.10
              </p>
            </div>

            {/* Satisfaction */}
            <div
              style={{
                padding: "1rem",
                background: "var(--bg-glass-hover)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Customer Satisfaction
              </span>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--accent-success)",
                }}
              >
                4.8/5.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for responsive 2-col → 1-col */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Recent Orders Table */}
      <div className="glass-card-static" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.15rem",
              }}
            >
              Recent Orders
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Latest transactions from your customers
            </p>
          </div>
          <button className="btn-ghost">View All</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {order.id}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--gradient-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {order.customerName.charAt(0)}
                      </div>
                      {order.customerName}
                    </div>
                  </td>
                  <td>{order.product}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {formatCurrency(order.amount)}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

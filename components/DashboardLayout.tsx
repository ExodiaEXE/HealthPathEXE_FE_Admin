"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// ─── SVG Icon Components ────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 765 765" style={{ display: "block" }}>
      <path d="M 516.478 89.750 C 491.886 117.794, 480.496 141.154, 479.287 166.023 C 478.387 184.542, 482.691 200.624, 492.532 215.505 C 496.817 221.984, 512.801 239.001, 514.602 239.001 C 516.613 239, 521.898 215.432, 524.551 194.631 C 525.402 187.959, 526.377 174.625, 526.718 165 C 527.384 146.155, 527.861 145.935, 530.509 163.243 C 532.666 177.341, 532.445 203.462, 530.007 222.448 C 526.309 251.245, 520.064 275.817, 509.788 302 C 506.332 310.807, 496.999 329, 495.937 329 C 495.532 329, 494.910 323.262, 494.554 316.250 C 492.927 284.236, 484.919 250.843, 474.708 233.500 C 460.629 209.584, 437.836 195.242, 406.371 190.500 C 395.006 188.787, 379.416 188.519, 378.487 190.021 C 378.140 190.582, 377.834 198.344, 377.806 207.271 C 377.729 231.939, 381.025 248.118, 389.623 265.283 C 392.302 270.630, 395.475 274.708, 401.869 281.020 C 415.337 294.314, 429.563 300.577, 452.167 303.162 C 467.213 304.883, 467.438 304.613, 462.743 290.500 C 457.866 275.843, 447.085 258.492, 434.819 245.563 C 431.682 242.256, 429.294 239.372, 429.513 239.154 C 430.237 238.430, 438.403 243.763, 445.174 249.381 C 460.288 261.921, 473.669 283.272, 479.091 303.500 C 482.150 314.912, 482.796 333.315, 480.501 343.670 C 477.651 356.526, 472.429 365.386, 460.091 378.300 C 443.536 395.628, 421.551 409.901, 389 424.451 C 350.214 441.789, 340.165 449.573, 339.191 463.035 C 338.167 477.194, 349.924 487.830, 376.500 496.787 C 381.450 498.456, 395.850 502.805, 408.500 506.452 C 465.945 523.015, 487.120 532.251, 502.611 547.500 C 514.190 558.899, 519.647 573.127, 517.274 585.732 C 512.493 611.130, 494.502 629.116, 449 653.985 C 421.768 668.869, 403.517 681.055, 395.396 689.775 C 391.246 694.232, 388.355 700.755, 389.862 702.262 C 390.309 702.709, 392.885 701.506, 395.587 699.590 C 401.865 695.138, 414.472 687.849, 419 686.053 C 420.925 685.289, 422.950 684.339, 423.500 683.940 C 424.050 683.542, 435.300 678.882, 448.500 673.584 C 509.568 649.077, 537.144 630.382, 549.979 604.787 C 561.690 581.433, 558.333 555.465, 541.070 535.884 C 529.233 522.457, 507.887 510.191, 480.500 501.078 C 465.109 495.957, 460.062 494.506, 435 487.998 C 387.939 475.778, 376.889 470.683, 379.954 462.622 C 381.206 459.327, 383.715 457.758, 406 446.324 C 435.920 430.972, 449.597 421.397, 468.578 402.515 C 475.470 395.659, 483.757 386.126, 487.876 380.314 C 494.228 371.354, 507.812 348.964, 512.017 340.523 C 512.833 338.886, 516.882 334.159, 521.015 330.018 C 526.703 324.320, 530.672 321.404, 537.342 318.022 L 546.153 313.555 552.327 315.855 C 573.488 323.742, 576.560 324.400, 592.500 324.451 C 609.177 324.505, 616.541 322.918, 627.820 316.838 C 639.661 310.455, 652.433 298.759, 662.039 285.500 C 667.695 277.693, 680 253.966, 680 250.867 C 680 249.361, 678.218 248.052, 672.750 245.541 C 653.227 236.576, 633.088 232.298, 615.191 233.313 C 585.248 235.013, 561.386 250.220, 548.995 275.500 C 544.530 284.609, 543.779 287.576, 546 287.342 C 546.825 287.254, 552.456 285.137, 558.512 282.636 C 576.957 275.020, 586.190 272.912, 603.894 272.276 C 615.270 271.868, 619.105 272.021, 618.585 272.862 C 618.199 273.488, 616.635 274, 615.111 274 C 611.196 274, 589.063 280.196, 577.360 284.569 C 563.442 289.769, 550.087 296.668, 536.955 305.442 C 530.734 309.599, 525.265 313, 524.803 313 C 524.340 313, 524.203 311.987, 524.498 310.750 C 524.793 309.512, 525.881 304.675, 526.917 300 C 527.952 295.325, 530.176 285.425, 531.859 278 C 533.541 270.575, 535.861 259.100, 537.013 252.500 C 539.041 240.882, 539.225 240.404, 542.792 237.500 C 559.838 223.622, 565.928 216.898, 571.652 205.636 C 582.030 185.214, 581.464 157.665, 570.205 135.169 C 559.952 114.684, 532.288 81, 525.717 81 C 524.856 81, 520.698 84.938, 516.478 89.750 M 395 403.408 C 391.650 405.188, 376.855 408.981, 351.902 414.457 C 306.335 424.458, 288.405 430.995, 271.854 443.642 C 244.194 464.779, 244.572 495.579, 272.748 516.470 C 282.742 523.881, 296.350 530.822, 317 539.041 C 334.974 546.195, 340.869 549.114, 346.766 553.783 C 353.790 559.343, 355.877 565.876, 352.273 571.021 C 342.673 584.726, 310.525 594.903, 222.886 611.980 C 182.142 619.920, 143.622 633.343, 119.661 647.952 C 98.968 660.568, 80.005 679.403, 71.495 695.791 C 69.984 698.700, 69.063 701.397, 69.449 701.782 C 69.835 702.168, 70.556 701.758, 71.052 700.871 C 76.831 690.546, 93.432 674.354, 108.851 664.004 C 132.782 647.941, 159.633 637.795, 198.500 630.127 C 212.864 627.293, 219.310 626.295, 261 620.448 C 307.530 613.923, 333.556 607.379, 354.668 596.895 C 374.587 587.004, 382.930 577.476, 382.978 564.566 C 383.015 554.626, 377.998 547.148, 365.683 538.785 C 358.167 533.681, 349.519 529.768, 327.576 521.543 C 301.841 511.896, 290.757 506.345, 282.954 499.195 C 273.873 490.874, 270.571 484.542, 270.595 475.500 C 270.620 466.687, 272.954 461.233, 279.643 454.367 C 290.117 443.614, 306.879 435.613, 340 425.558 C 375.019 414.926, 384.803 411.619, 392.142 407.929 C 396.381 405.797, 400.134 403.592, 400.483 403.027 C 401.375 401.585, 397.989 401.820, 395 403.408" fill="#93B18F" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function SubscriptionIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function TransactionIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function RolesIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// ─── Navigation Items ───────────────────────────────────────────────────────

const navItems = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/users", label: "Users", icon: UsersIcon },
  { href: "/subscriptions", label: "Subscriptions", icon: SubscriptionIcon },
  { href: "/transactions", label: "Transactions", icon: TransactionIcon },
  { href: "/audio", label: "Audio", icon: AudioIcon },
  { href: "/roles", label: "Roles", icon: RolesIcon },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || "A";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 35,
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div
          style={{
            padding: "1.25rem 1.25rem 1rem",
            borderBottom: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--bg-primary)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogoIcon />
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              HealthPath
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
          <div
            style={{
              padding: "0 1.25rem",
              marginBottom: "0.5rem",
              fontSize: "0.65rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
            }}
          >
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(--gradient-secondary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.fullName || "Admin"}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.role || "Administrator"}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-nav-item"
            style={{
              color: "var(--accent-danger)",
              margin: 0,
              width: "100%",
            }}
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-ghost"
              style={{
                padding: "0.5rem",
                display: "none",
                border: "none",
              }}
              id="sidebar-toggle"
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </button>
            <style>{`
              @media (max-width: 1024px) {
                #sidebar-toggle { display: flex !important; }
              }
            `}</style>
            <div>
              <h1
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {navItems.find((i) => i.href === pathname)?.label || "Dashboard"}
              </h1>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Welcome back, {user?.fullName || "Admin"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Notification bell */}
            {/* <button
              className="btn-ghost"
              style={{ padding: "0.5rem", position: "relative" }}
              aria-label="Notifications"
              id="notifications-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  background: "var(--accent-danger)",
                  borderRadius: "50%",
                  border: "2px solid var(--bg-primary)",
                }}
              />
            </button> */}

            {/* User avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                background: "var(--gradient-primary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  );
}

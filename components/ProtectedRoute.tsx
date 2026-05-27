"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wraps any page that requires authentication.
 * Shows a loading spinner while checking auth, then renders children
 * only if authenticated. The actual redirect happens in AuthProvider.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // AuthProvider handles the redirect — show loading while it happens
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Redirecting to login...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

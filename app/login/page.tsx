"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as Record<string, unknown>).response === "object"
      ) {
        const response = (err as { response: { data?: { message?: string }; status?: number } }).response;
        if (response?.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(response?.data?.message || "Login failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Don't show login form if already authenticated
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="login-bg">
      {/* Decorative grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">H</div>

        <h1
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
            color: "var(--text-primary)",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          Sign in to your admin dashboard
        </p>

        {/* Error */}
        {error && (
          <div className="alert-error" style={{ marginBottom: "1.25rem" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="email" className="input-label">
              Email address
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="input-field"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "0.95rem",
            }}
            id="login-submit"
          >
            {submitting ? (
              <>
                <div
                  className="spinner"
                  style={{ width: 18, height: 18, borderWidth: 2 }}
                />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginTop: "1.5rem",
          }}
        >
          HealthPath Admin Panel — Authorized personnel only
        </p>
      </div>
    </div>
  );
}

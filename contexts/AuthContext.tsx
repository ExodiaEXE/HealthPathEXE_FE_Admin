"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import authApi from "@/lib/api/authApi";
import { LoginPayload } from "@/schema/auth";

// ─── Types ──────────────────────────────────────────────────────────────────

interface User {
  username: string;
  fullName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!token && !!user;

  // On mount — check for existing token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // No /auth/me endpoint exists, so we restore user from localStorage.
          // If the token is expired, any subsequent API call will fail with 401
          // and the axios interceptor will log the user out.
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
        } catch {
          // Token is invalid — clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  const login = useCallback(
    async (username: string, password: string) => {
      const payload: LoginPayload = { username, password };
      const data = await authApi.login(payload);

      const user: User = {
        username: data.username,
        fullName: data.fullName,
        role: data.role,
      };

      // Persist token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(data.token);
      setUser(user);

      router.replace("/");
    },
    [router]
  );

  const logout = useCallback(() => {
    // // Fire-and-forget server-side logout
    // authApi.logout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

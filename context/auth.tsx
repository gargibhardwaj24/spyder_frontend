/**
 * Auth context — holds the signed-in user and exposes login/signup/logout to
 * the whole app. On mount it restores the session from secure storage.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import * as authService from "../services/auth";
import type { User } from "../services/auth";

type AuthContextValue = {
  user: User | null;
  /** True only while the initial session restore is in flight. */
  initializing: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Restore session on app launch.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const restored = await authService.me();
        if (active) setUser(restored);
      } finally {
        if (active) setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user,
      login: async (email, password) => {
        const session = await authService.login(email, password);
        setUser(session.user);
      },
      signup: async (fullName, email, password) => {
        const session = await authService.signup(fullName, email, password);
        setUser(session.user);
      },
      logout: async () => {
        await authService.logout();
        setUser(null);
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

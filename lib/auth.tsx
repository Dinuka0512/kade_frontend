"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "./api";
import type { User } from "./types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role: User["role"]
  ) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "kade.token";
const USER_KEY = "kade.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = window.localStorage.getItem(TOKEN_KEY);
      const storedUser = window.localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        /* eslint-disable react-hooks/set-state-in-effect */
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoading(false);
  }, []);

  const persist = useCallback((session: { token: string; user: User }) => {
    setToken(session.token);
    setUser(session.user);
    window.localStorage.setItem(TOKEN_KEY, session.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await api.login(email, password);
      persist(session);
      return session.user;
    },
    [persist]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: User["role"]
    ) => {
      const session = await api.register(name, email, password, role);
      persist(session);
      return session.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

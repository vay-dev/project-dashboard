import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { tokenStore, setForceLogout } from "../lib/api";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStore.get());

  function login(t: string) {
    tokenStore.set(t);
    setToken(t);
  }

  function logout() {
    tokenStore.clear();
    setToken(null);
  }

  useEffect(() => {
    setForceLogout(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

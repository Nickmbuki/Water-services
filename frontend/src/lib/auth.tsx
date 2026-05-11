import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, authStore, type User } from "./api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(authStore.token));

  useEffect(() => {
    if (!authStore.token) return;
    api
      .me()
      .then((result) => setUser(result.user))
      .catch(() => {
        authStore.token = null;
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: (token, nextUser) => {
        authStore.token = token;
        setUser(nextUser);
      },
      logout: () => {
        authStore.token = null;
        setUser(null);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

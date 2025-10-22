import { createContext, useContext, useMemo, useState, useEffect } from "react";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auth_isAdmin");
    setIsAdmin(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("auth_isAdmin", isAdmin ? "1" : "0");
  }, [isAdmin]);

  const value = useMemo(
    () => ({
      isAdmin,
      async login(u, p) {
        if (u === "admin" && p === "1234") {
          setIsAdmin(true);
          return true;
        }
        return false;
      },
      logout() {
        setIsAdmin(false);
      },
    }),
    [isAdmin]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

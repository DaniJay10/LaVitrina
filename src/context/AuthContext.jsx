import { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

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

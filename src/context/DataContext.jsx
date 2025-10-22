import { createContext, useContext, useMemo } from "react";
import data from "../data/empresas.json";

const Ctx = createContext(null);

export function DataProvider({ children }) {
  const empresas = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
    );
  }, []);

  const value = useMemo(() => ({ empresas }), [empresas]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}

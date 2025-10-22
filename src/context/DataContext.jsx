import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import seed from "../data/empresas.json";

const C_CREATED = "empresasCreadas";
const C_REMOVED = "empresasEliminadas";

const Ctx = createContext(null);

export function DataProvider({ children }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const creadas = JSON.parse(localStorage.getItem(C_CREATED) || "[]");
      const eliminadas = JSON.parse(localStorage.getItem(C_REMOVED) || "[]");
      const base = seed.filter((e) => !eliminadas.includes(e.id));
      const merged = [...base, ...creadas].sort(
        (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
      );
      setEmpresas(merged);
      setLoading(false);
    }, 150);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const crearEmpresa = useCallback(
    (e) => {
      const creadas = JSON.parse(localStorage.getItem(C_CREATED) || "[]");
      localStorage.setItem(C_CREATED, JSON.stringify([e, ...creadas]));
      load();
    },
    [load]
  );

  const eliminarEmpresa = useCallback(
    (id) => {
      const eliminadas = JSON.parse(localStorage.getItem(C_REMOVED) || "[]");
      if (!eliminadas.includes(id)) {
        eliminadas.push(id);
        localStorage.setItem(C_REMOVED, JSON.stringify(eliminadas));
      }
      const creadas = JSON.parse(
        localStorage.getItem(C_CREATED) || "[]"
      ).filter((e) => e.id !== id);
      localStorage.setItem(C_CREATED, JSON.stringify(creadas));
      load();
    },
    [load]
  );

  const value = useMemo(
    () => ({ empresas, loading, crearEmpresa, eliminarEmpresa }),
    [empresas, loading, crearEmpresa, eliminarEmpresa]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}

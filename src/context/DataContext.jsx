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

// productos creados por empresa
const keyProductosCreados = (empresaId) => `productosCreados:${empresaId}`;
const getProductosCreados = (empresaId) =>
  JSON.parse(localStorage.getItem(keyProductosCreados(empresaId)) || "[]");
const setProductosCreados = (empresaId, arr) =>
  localStorage.setItem(keyProductosCreados(empresaId), JSON.stringify(arr));

// índices de productos base eliminados por empresa
const keyProductosBaseEliminados = (empresaId) =>
  `productosBaseEliminados:${empresaId}`;
const getProductosBaseEliminados = (empresaId) =>
  JSON.parse(
    localStorage.getItem(keyProductosBaseEliminados(empresaId)) || "[]"
  );
const setProductosBaseEliminados = (empresaId, arr) =>
  localStorage.setItem(
    keyProductosBaseEliminados(empresaId),
    JSON.stringify(arr)
  );

const Ctx = createContext(null);

export function DataProvider({ children }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const creadas = JSON.parse(localStorage.getItem(C_CREATED) || "[]");
      const eliminadas = JSON.parse(localStorage.getItem(C_REMOVED) || "[]");

      // base seed sin empresas eliminadas
      const base = seed.filter((e) => !eliminadas.includes(e.id));

      // fusionar y aplicar productos creados + eliminaciones de base, pero
      // exponiendo a la UI SOLO una lista unificada `productos`
      const merged = [...base, ...creadas]
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
        .map((e) => {
          const creados = getProductosCreados(e.id); // productos añadidos por admin
          const elimBaseIdxs = getProductosBaseEliminados(e.id); // índices base eliminados

          const baseProductos = Array.isArray(e.productos) ? e.productos : [];
          const baseFiltrado = baseProductos.filter(
            (_, idx) => !elimBaseIdxs.includes(idx)
          );

          // Lista FINAL que ve la UI:
          const productos = [...baseFiltrado, ...creados];

          // Guardamos metadatos solo internos para mapear índices en eliminaciones
          const _meta = {
            baseLengthOriginal: baseProductos.length,
            elimBaseIdxs,
            creadosLength: creados.length,
          };

          return { ...e, productos, _meta };
        });

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
      // limpiar productos creados y eliminaciones de base
      localStorage.removeItem(keyProductosCreados(id));
      localStorage.removeItem(keyProductosBaseEliminados(id));
      load();
    },
    [load]
  );

  const crearProducto = useCallback(
    (empresaId, producto) => {
      const actuales = getProductosCreados(empresaId);
      setProductosCreados(empresaId, [producto, ...actuales]);
      load();
    },
    [load]
  );

  /**
   * Elimina un producto por su índice en la lista UNIFICADA que ve la UI.
   * Si cae en la parte "base visible", mapea a índice real del base y lo marca eliminado.
   * Si cae en la parte "creados", elimina del arreglo de creados por (uiIndex - baseVisiblesCount).
   */
  const eliminarProducto = useCallback(
    (empresaId, uiIndex) => {
      // Necesitamos reconstruir el contexto de esa empresa para mapear indices correctamente.
      // Usamos la misma lógica que en load().
      const baseEmpresaSeed = [...seed]; // copia para buscar
      const empresaSeed = baseEmpresaSeed.find((e) => e.id === empresaId) || {
        productos: [],
      };
      const baseOriginal = Array.isArray(empresaSeed.productos)
        ? empresaSeed.productos
        : [];

      const elimBaseIdxs = getProductosBaseEliminados(empresaId);
      const creados = getProductosCreados(empresaId);

      const baseFiltrado = baseOriginal.filter(
        (_, idx) => !elimBaseIdxs.includes(idx)
      );
      const baseVisiblesCount = baseFiltrado.length;

      if (uiIndex < baseVisiblesCount) {
        // Mapear índice de UI (en base filtrado) al índice real del base original
        // Estrategia: recorrer índices reales y contar los que NO están eliminados
        let count = 0;
        let realIdx = -1;
        for (let i = 0; i < baseOriginal.length; i++) {
          if (!elimBaseIdxs.includes(i)) {
            if (count === uiIndex) {
              realIdx = i;
              break;
            }
            count++;
          }
        }
        if (realIdx >= 0) {
          const nuevos = [...elimBaseIdxs, realIdx];
          setProductosBaseEliminados(empresaId, Array.from(new Set(nuevos)));
        }
      } else {
        // Es un producto "creado": índice relativo
        const createdIndex = uiIndex - baseVisiblesCount;
        if (createdIndex >= 0 && createdIndex < creados.length) {
          const nuevos = [...creados];
          nuevos.splice(createdIndex, 1);
          setProductosCreados(empresaId, nuevos);
        }
      }
      load();
    },
    [load]
  );

  const value = useMemo(
    () => ({
      empresas,
      loading,
      crearEmpresa,
      eliminarEmpresa,
      crearProducto,
      eliminarProducto, // <-- ¡UNIFICADO!
    }),
    [
      empresas,
      loading,
      crearEmpresa,
      eliminarEmpresa,
      crearProducto,
      eliminarProducto,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}

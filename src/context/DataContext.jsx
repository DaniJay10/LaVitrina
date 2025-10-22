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

// productos base EDITADOS por empresa (mapa indiceBase -> productoEditado)
const keyProductosBaseEditados = (empresaId) =>
  `productosBaseEditados:${empresaId}`;
const getProductosBaseEditados = (empresaId) =>
  JSON.parse(localStorage.getItem(keyProductosBaseEditados(empresaId)) || "{}");
const setProductosBaseEditados = (empresaId, obj) =>
  localStorage.setItem(
    keyProductosBaseEditados(empresaId),
    JSON.stringify(obj)
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

      const base = seed.filter((e) => !eliminadas.includes(e.id));

      const merged = [...base, ...creadas]
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
        .map((e) => {
          const creados = getProductosCreados(e.id);
          const elimBaseIdxs = getProductosBaseEliminados(e.id);
          const baseEdits = getProductosBaseEditados(e.id); // { [idxReal]: productoEditado }

          const baseOriginal = Array.isArray(e.productos) ? e.productos : [];

          // construye base visible aplicando eliminados y ediciones
          const baseVisibles = baseOriginal
            .map((p, idx) => ({ p, idx }))
            .filter(({ idx }) => !elimBaseIdxs.includes(idx))
            .map(({ p, idx }) => (baseEdits[idx] ? baseEdits[idx] : p));

          const productos = [...baseVisibles, ...creados];

          // meta interna para mapear índices UI
          const _meta = {
            baseOriginalLen: baseOriginal.length,
            elimBaseIdxs,
            baseEdits, // objeto {idxReal: productoEditado}
            creadosLen: creados.length,
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
      // limpiar productos por empresa
      localStorage.removeItem(keyProductosCreados(id));
      localStorage.removeItem(keyProductosBaseEliminados(id));
      localStorage.removeItem(keyProductosBaseEditados(id));
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

  const eliminarProducto = useCallback(
    (empresaId, uiIndex) => {
      // Reconstruir contexto de indices
      const empresaSeed = seed.find((e) => e.id === empresaId) || {
        productos: [],
      };
      const baseOriginal = Array.isArray(empresaSeed.productos)
        ? empresaSeed.productos
        : [];
      const elimBaseIdxs = getProductosBaseEliminados(empresaId);
      const creados = getProductosCreados(empresaId);

      // base visibles = baseOriginal sin eliminados (ediciones no cambian la cantidad)
      const baseVisiblesCount = baseOriginal.filter(
        (_, idx) => !elimBaseIdxs.includes(idx)
      ).length;

      if (uiIndex < baseVisiblesCount) {
        // mapear uiIndex -> índice real de base
        let count = 0,
          realIdx = -1;
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
          const nuevos = Array.from(new Set([...elimBaseIdxs, realIdx]));
          setProductosBaseEliminados(empresaId, nuevos);
        }
      } else {
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

  const actualizarProducto = useCallback(
    (empresaId, uiIndex, producto) => {
      const empresaSeed = seed.find((e) => e.id === empresaId) || {
        productos: [],
      };
      const baseOriginal = Array.isArray(empresaSeed.productos)
        ? empresaSeed.productos
        : [];
      const elimBaseIdxs = getProductosBaseEliminados(empresaId);
      const creados = getProductosCreados(empresaId);
      const baseEdits = getProductosBaseEditados(empresaId);

      const baseVisiblesCount = baseOriginal.filter(
        (_, idx) => !elimBaseIdxs.includes(idx)
      ).length;

      if (uiIndex < baseVisiblesCount) {
        // editar un producto del base → guardamos la edición en el mapa (sin duplicar)
        let count = 0,
          realIdx = -1;
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
          const nuevoMapa = { ...baseEdits, [realIdx]: producto };
          setProductosBaseEditados(empresaId, nuevoMapa);
        }
      } else {
        // editar un producto creado → lo reemplazamos en su arreglo
        const createdIndex = uiIndex - baseVisiblesCount;
        if (createdIndex >= 0 && createdIndex < creados.length) {
          const nuevos = [...creados];
          nuevos[createdIndex] = producto;
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
      eliminarProducto,
      actualizarProducto, // <-- NUEVO
    }),
    [
      empresas,
      loading,
      crearEmpresa,
      eliminarEmpresa,
      crearProducto,
      eliminarProducto,
      actualizarProducto,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}

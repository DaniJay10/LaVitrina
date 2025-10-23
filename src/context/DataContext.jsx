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

/* ----------------- EMPRESA OVERRIDES (aplican a TODAS) ----------------- */
const K_OVERRIDE = "empresasOverride"; // { [id]: { ...camposEditados } }
const getOverrides = () => JSON.parse(localStorage.getItem(K_OVERRIDE) || "{}");
const setOverrides = (obj) =>
  localStorage.setItem(K_OVERRIDE, JSON.stringify(obj));

/* ----------------- PRODUCTOS (creados / eliminados / editados) ----------------- */
const keyProductosCreados = (empresaId) => `productosCreados:${empresaId}`;
const getProductosCreados = (empresaId) =>
  JSON.parse(localStorage.getItem(keyProductosCreados(empresaId)) || "[]");
const setProductosCreados = (empresaId, arr) =>
  localStorage.setItem(keyProductosCreados(empresaId), JSON.stringify(arr));

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

const keyProductosBaseEditados = (empresaId) =>
  `productosBaseEditados:${empresaId}`;
const getProductosBaseEditados = (empresaId) =>
  JSON.parse(localStorage.getItem(keyProductosBaseEditados(empresaId)) || "{}");
const setProductosBaseEditados = (empresaId, obj) =>
  localStorage.setItem(
    keyProductosBaseEditados(empresaId),
    JSON.stringify(obj)
  );

/* ----------------- CONTEXTO ----------------- */
const Ctx = createContext(null);

export function DataProvider({ children }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const creadas = JSON.parse(localStorage.getItem(C_CREATED) || "[]");
      const eliminadas = JSON.parse(localStorage.getItem(C_REMOVED) || "[]");
      const overrides = getOverrides();

      // 1) Base seed sin eliminadas
      const base = seed.filter((e) => !eliminadas.includes(e.id));

      // 2) Fusionar base + creadas
      const mergedRaw = [...base, ...creadas].sort(
        (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
      );

      // 3) Aplicar OVERRIDES por ID (aplican a todas, seed o creadas)
      const mergedOver = mergedRaw.map((e) =>
        overrides[e.id] ? { ...e, ...overrides[e.id] } : e
      );

      // 4) Construir productos finales (base filtrado/ediciones + creados)
      const merged = mergedOver.map((e) => {
        const creados = getProductosCreados(e.id);
        const elimBaseIdxs = getProductosBaseEliminados(e.id);
        const baseEdits = getProductosBaseEditados(e.id);

        const baseOriginal = Array.isArray(e.productos) ? e.productos : [];
        const baseVisibles = baseOriginal
          .map((p, idx) => ({ p, idx }))
          .filter(({ idx }) => !elimBaseIdxs.includes(idx))
          .map(({ p, idx }) => (baseEdits[idx] ? baseEdits[idx] : p));

        const productos = [...baseVisibles, ...creados];

        const _meta = {
          baseOriginalLen: baseOriginal.length,
          elimBaseIdxs,
          baseEdits,
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

  /* ----------------- EMPRESAS: crear/editar/eliminar ----------------- */

  const crearEmpresa = useCallback(
    (e) => {
      const creadas = JSON.parse(localStorage.getItem(C_CREATED) || "[]");
      localStorage.setItem(C_CREATED, JSON.stringify([e, ...creadas]));
      load();
    },
    [load]
  );

  // ✅ EDITAR CUALQUIER EMPRESA (seed o creada): guardamos override por ID
  const actualizarEmpresa = useCallback(
    (empresaActualizada) => {
      const overrides = getOverrides();
      const prev = overrides[empresaActualizada.id] || {};
      // Nunca tocamos productos aquí
      overrides[empresaActualizada.id] = {
        ...prev,
        nombre: empresaActualizada.nombre,
        categoria: empresaActualizada.categoria,
        descripcion: empresaActualizada.descripcion,
        direccion: empresaActualizada.direccion,
        imagenUrl: empresaActualizada.imagenUrl,
        // fechaRegistro no se toca; mantiene la original
      };
      setOverrides(overrides);
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
      // limpiar productos y override
      localStorage.removeItem(keyProductosCreados(id));
      localStorage.removeItem(keyProductosBaseEliminados(id));
      localStorage.removeItem(keyProductosBaseEditados(id));
      const overrides = getOverrides();
      if (overrides[id]) {
        delete overrides[id];
        setOverrides(overrides);
      }
      load();
    },
    [load]
  );

  /* ----------------- PRODUCTOS: crear/eliminar/editar ----------------- */

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
      const empresaSeed = seed.find((e) => e.id === empresaId) || {
        productos: [],
      };
      const baseOriginal = Array.isArray(empresaSeed.productos)
        ? empresaSeed.productos
        : [];
      const elimBaseIdxs = getProductosBaseEliminados(empresaId);
      const creados = getProductosCreados(empresaId);

      const baseVisiblesCount = baseOriginal.filter(
        (_, idx) => !elimBaseIdxs.includes(idx)
      ).length;

      if (uiIndex < baseVisiblesCount) {
        // mapear al índice real del base
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
      actualizarEmpresa, // <- edita cualquiera (seed o creada)
      eliminarEmpresa,
      crearProducto,
      eliminarProducto,
      actualizarProducto,
    }),
    [
      empresas,
      loading,
      crearEmpresa,
      actualizarEmpresa,
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

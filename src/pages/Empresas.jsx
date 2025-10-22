import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useData } from "../context/DataContext";
import EmpresaCard from "../components/EmpresaCard";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Empresas() {
  const { empresas, loading } = useData();
  const q = useQuery();

  const cat = q.get("cat") || "";
  const qtext = q.get("q") || "";

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    );
  }

  const filtered = useMemo(() => {
    let list = empresas;
    if (cat)
      list = list.filter(
        (e) => e.categoria.toLowerCase() === cat.toLowerCase()
      );
    if (qtext)
      list = list.filter((e) =>
        e.nombre.toLowerCase().includes(qtext.toLowerCase())
      );
    return list;
  }, [empresas, cat, qtext]);

  return (
    <section className="container my-3">
      <h1 className="h3">{cat ? `Categoría: ${cat}` : "Empresas"}</h1>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          text="Prueba otra categoría o búsqueda."
        />
      ) : (
        <div className="row g-3">
          {filtered.map((e) => (
            <div key={e.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <EmpresaCard empresa={e} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

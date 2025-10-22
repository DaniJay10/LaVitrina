import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";
import EmpresaCard from "../components/EmpresaCard";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Empresas() {
  const { empresas } = useData();
  const q = useQuery();

  const cat = q.get("cat") || "";
  const qtext = q.get("q") || "";

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
        <p className="text-muted">Sin resultados.</p>
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

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
  const cat = q.get("cat");

  const list = useMemo(() => {
    if (!cat) return empresas;
    return empresas.filter(
      (e) => e.categoria.toLowerCase() === cat.toLowerCase()
    );
  }, [empresas, cat]);

  return (
    <section>
      <h1>{cat ? `Categoría: ${cat}` : "Empresas"}</h1>
      {list.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No hay empresas para esta categoría.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {list.map((e) => (
            <EmpresaCard key={e.id} empresa={e} />
          ))}
        </div>
      )}
    </section>
  );
}

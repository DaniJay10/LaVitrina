import EmptyState from "../components/EmptyState";
import { useData } from "../context/DataContext";
import EmpresaCard from "../components/EmpresaCard";

export default function Home() {
  const { empresas, loading } = useData();

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    );
  }

  const novedades = empresas.slice(0, 6);

  return (
    <section className="container my-3">
      <h1 className="h3">Últimas novedades</h1>

      {novedades.length === 0 ? (
        <EmptyState
          title="Aún no hay empresas"
          text="Agrega la primera desde «Nueva empresa»."
        />
      ) : (
        <div className="row g-3">
          {novedades.map((e) => (
            <div key={e.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <EmpresaCard empresa={e} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

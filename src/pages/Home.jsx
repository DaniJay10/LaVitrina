import { useData } from "../context/DataContext";
import EmpresaCard from "../components/EmpresaCard";

export default function Home() {
  const { empresas } = useData();
  const novedades = empresas.slice(0, 6); // top 6

  return (
    <section>
      <h1>Últimas novedades</h1>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {novedades.map((e) => (
          <EmpresaCard key={e.id} empresa={e} />
        ))}
      </div>
    </section>
  );
}

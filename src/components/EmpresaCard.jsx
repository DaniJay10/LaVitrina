import { Link } from "react-router-dom";

export default function EmpresaCard({ empresa }) {
  return (
    <article
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <h3 style={{ margin: 0 }}>{empresa.nombre}</h3>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{empresa.categoria}</span>
      </div>
      <p style={{ margin: 0, opacity: 0.85 }}>{empresa.descripcion}</p>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
        📍 {empresa.direccion}
      </p>
      <div style={{ marginTop: 8 }}>
        <Link
          to={`/empresa/${empresa.id}`}
          style={{
            fontSize: 14,
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Ver catálogo
        </Link>
      </div>
    </article>
  );
}

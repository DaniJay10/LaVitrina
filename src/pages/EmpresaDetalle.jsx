import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function EmpresaDetalle() {
  const { id } = useParams();
  const { empresas, eliminarEmpresa } = useData();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const empresa = empresas.find((e) => e.id === id);
  if (!empresa) {
    return (
      <section>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          ← Regresar
        </button>
        <h1>Empresa no encontrada</h1>
        <p style={{ opacity: 0.7 }}>Verifica el enlace.</p>
      </section>
    );
  }

  const onDelete = () => {
    if (confirm("¿Eliminar esta empresa?")) {
      eliminarEmpresa(empresa.id);
      navigate("/empresas");
    }
  };

  return (
    <section>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ← Regresar
        </button>
        {isAdmin && (
          <button
            onClick={onDelete}
            style={{
              padding: "8px 12px",
              border: "1px solid #f1c0c0",
              background: "#ffecec",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Eliminar
          </button>
        )}
      </div>

      <h1>{empresa.nombre}</h1>
      <p style={{ opacity: 0.7 }}>
        {empresa.categoria} ·{" "}
        <span role="img" aria-label="pin">
          📍
        </span>{" "}
        {empresa.direccion}
      </p>
      <p>{empresa.descripcion}</p>

      <h2>Catálogo</h2>
      {empresa.productos?.length ? (
        <ul>
          {empresa.productos.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      ) : (
        <p style={{ opacity: 0.7 }}>Sin productos cargados aún.</p>
      )}
    </section>
  );
}

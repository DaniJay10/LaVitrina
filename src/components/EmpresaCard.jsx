import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function EmpresaCard({ empresa }) {
  const { isAdmin } = useAuth();
  const { eliminarEmpresa } = useData();

  const onDelete = () => {
    if (confirm("¿Eliminar esta empresa?")) eliminarEmpresa(empresa.id);
  };

  return (
    <article className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-baseline">
          <h3 className="h6 m-0">{empresa.nombre}</h3>
          <span className="text-muted small">{empresa.categoria}</span>
        </div>

        <p className="mb-1">{empresa.descripcion}</p>
        <p className="text-muted small mb-3">📍 {empresa.direccion}</p>

        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/empresa/${empresa.id}`}
            className="btn btn-outline-secondary btn-sm"
          >
            Ver catálogo
          </Link>
          {isAdmin && (
            <button
              onClick={onDelete}
              className="btn btn-outline-danger btn-sm"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const IMAGE_FIT = "contain"; // en lugar de 'cover'
const IMAGE_RATIO_CLASS = "ratio-4x3";

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
          <span className="badge text-bg-light">{empresa.categoria}</span>
        </div>

        <p className="mb-1 mt-2">{empresa.descripcion}</p>
        <p className="text-muted small mb-2">📍 {empresa.direccion}</p>

        {empresa.imagenUrl && (
          <div className="mb-3 position-relative" style={{ height: 160 }}>
            <img
              src={empresa.imagenUrl}
              alt={`Imagen de ${empresa.nombre}`}
              className="w-100 h-100 rounded"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {empresa.destacada && (
              <span className="badge text-bg-warning position-absolute top-0 end-0 m-2">
                Destacada
              </span>
            )}
          </div>
        )}

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

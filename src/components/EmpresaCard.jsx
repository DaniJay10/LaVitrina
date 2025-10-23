import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "./ConfirmModal";

export default function EmpresaCard({ empresa }) {
  const { isAdmin } = useAuth();
  const { eliminarEmpresa } = useData();
  const { toast } = useToast();

  const doDelete = () => {
    eliminarEmpresa(empresa.id);
    toast("Empresa eliminada", "danger");
  };

  const modalId = `delEmp-${empresa.id}`;

  return (
    <article className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-baseline">
          <h3 className="h6 m-0">{empresa.nombre}</h3>
          <span className="badge text-bg-light">{empresa.categoria}</span>
        </div>

        {empresa.destacada && (
          <span className="badge text-bg-warning mt-2 align-self-start">
            Destacada
          </span>
        )}

        <p className="mb-1 mt-2">{empresa.descripcion}</p>
        <p className="text-muted small mb-2">📍 {empresa.direccion}</p>

        {/* Imagen con alto fijo (opción B que elegiste) */}
        {empresa.imagenUrl && (
          <div className="mb-3 position-relative" style={{ height: 160 }}>
            <img
              src={empresa.imagenUrl}
              alt={`Imagen de ${empresa.nombre}`}
              className="w-100 h-100 rounded"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
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
              className="btn btn-danger btn-sm"
              onClick={() => window.__confirm_modals?.[modalId]?.open()}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <ConfirmModal
          id={modalId}
          title="Eliminar empresa"
          message="Se quitará esta empresa y su catálogo."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={doDelete}
        />
      )}
    </article>
  );
}

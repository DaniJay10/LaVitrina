import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { useRef, useState } from "react";

export default function AdminProductos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresas, eliminarProducto } = useData();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  if (!isAdmin) {
    return (
      <section className="container my-3">
        <h1 className="h4">No autorizado</h1>
      </section>
    );
  }

  const empresa = empresas.find((e) => e.id === id);
  if (!empresa) {
    return (
      <section className="container my-3">
        <h1 className="h4">Empresa no encontrada</h1>
        <button
          className="btn btn-outline-secondary mt-2"
          onClick={() => navigate("/")}
        >
          ← Regresar
        </button>
      </section>
    );
  }

  const askDelete = (uiIndex) => {
    setPendingDeleteIndex(uiIndex);
    window.__confirm_modals?.adminDelete?.open();
  };

  const doDelete = () => {
    if (pendingDeleteIndex == null) return;
    eliminarProducto(empresa.id, pendingDeleteIndex);
    setPendingDeleteIndex(null);
    toast("Producto eliminado", "danger");
  };

  return (
    <section className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
          >
            ← Regresar
          </button>
          <Link
            to={`/empresa/${empresa.id}`}
            className="btn btn-outline-secondary"
          >
            Ver empresa
          </Link>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/admin/empresa/${empresa.id}/productos/nuevo`)
            }
          >
            Agregar producto
          </button>
        </div>
      </div>

      <h1 className="h4 mb-2">Catálogo — {empresa.nombre}</h1>

      {!empresa.productos || empresa.productos.length === 0 ? (
        <p className="text-muted">Aún no hay productos.</p>
      ) : (
        <div className="row g-3">
          {empresa.productos.map((p, uiIndex) => (
            <div key={uiIndex} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="position-relative">
                <ProductCard producto={p} />
                <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => askDelete(uiIndex)}
                    aria-label={`Eliminar ${p.nombre}`}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      navigate(
                        `/admin/empresa/${empresa.id}/productos/${uiIndex}/editar`
                      )
                    }
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        id="adminDelete"
        title="Eliminar producto"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={doDelete}
      />
    </section>
  );
}

import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

export default function AdminProductos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresas } = useData();
  const { isAdmin } = useAuth();

  const empresa = empresas.find((e) => e.id === id);

  if (!isAdmin) {
    return (
      <section className="container my-3">
        <h1 className="h4">No autorizado</h1>
      </section>
    );
  }

  if (!empresa) {
    return (
      <section className="container my-3">
        <h1 className="h4">Empresa no encontrada</h1>
        <button
          className="btn btn-outline-secondary mt-2"
          onClick={() => navigate(-1)}
        >
          ← Regresar
        </button>
      </section>
    );
  }

  return (
    <section className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
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
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(`/admin/empresa/${empresa.id}/productos/nuevo`)
          }
        >
          Agregar producto
        </button>
      </div>

      <h1 className="h4 mb-2">Productos de {empresa.nombre}</h1>

      {empresa.productos && empresa.productos.length > 0 ? (
        <div className="row g-3 mt-1">
          {empresa.productos.map((p, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">Aún no hay productos.</p>
      )}
    </section>
  );
}

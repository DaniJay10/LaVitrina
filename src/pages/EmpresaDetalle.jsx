import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

export default function EmpresaDetalle() {
  const { id } = useParams();
  const { empresas, eliminarEmpresa } = useData();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const openDeleteModal = () => {
    window.__confirm_modals?.delEmpresa?.open();
  };

  const confirmDelete = () => {
    eliminarEmpresa(empresa.id);
    toast("Empresa eliminada", "danger");
    navigate("/empresas");
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
          <>
            <button
              onClick={openDeleteModal}
              style={{
                padding: "8px 12px",
                border: "1px solid #f1c0c0",
                background: "#ffecec",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Eliminar Empresa
            </button>

            <Link
              to={`/admin/empresa/${empresa.id}/productos`}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Gestionar productos
            </Link>
          </>
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
      {empresa.productos && empresa.productos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            marginTop: 8,
          }}
        >
          {empresa.productos.map((p, i) => (
            <ProductCard key={i} producto={p} />
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.7 }}>Sin productos cargados aún.</p>
      )}

      <ConfirmModal
        id="delEmpresa"
        title="Eliminar empresa"
        message="Se quitará esta empresa y su catálogo."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
      />
    </section>
  );
}

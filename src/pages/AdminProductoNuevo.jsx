import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

function normalizeImg(url) {
  const v = (url || "").trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/"))
    return v;
  return "/" + v;
}

export default function AdminProductoNuevo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { empresas, crearProducto } = useData();

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
          onClick={() => navigate(-1)}
        >
          ← Regresar
        </button>
      </section>
    );
  }

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    imagenUrl: "",
  });
  const [touched, setTouched] = useState({});

  const onChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const onBlur = (k) => setTouched((prev) => ({ ...prev, [k]: true }));

  const normalizedPreview = useMemo(
    () => normalizeImg(form.imagenUrl),
    [form.imagenUrl]
  );

  const errors = useMemo(() => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (form.precio === "" || isNaN(Number(form.precio)))
      e.precio = "Ingrese un número";
    if (form.imagenUrl) {
      const n = normalizeImg(form.imagenUrl);
      if (!/^https?:\/\//i.test(n) && !n.startsWith("/")) {
        e.imagenUrl = "Use URL externa o archivo en /public (ej: /foto.jpg)";
      }
    }
    return e;
  }, [form]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (Object.keys(errors).length) {
      setTouched({ nombre: true, precio: true, imagenUrl: true });
      return;
    }
    const producto = {
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      imagenUrl: form.imagenUrl ? normalizeImg(form.imagenUrl) : "",
    };
    crearProducto(empresa.id, producto);
    navigate(`/admin/empresa/${empresa.id}/productos`);
  };

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
            to={`/admin/empresa/${empresa.id}/productos`}
            className="btn btn-outline-secondary"
          >
            Ver productos
          </Link>
        </div>
      </div>

      <h1 className="h4">Agregar producto — {empresa.nombre}</h1>

      <form onSubmit={onSubmit} className="row g-3 mt-1" noValidate>
        <div className="col-12 col-md-6">
          <label className="form-label">Nombre *</label>
          <input
            className={`form-control ${
              touched.nombre && errors.nombre ? "is-invalid" : ""
            }`}
            value={form.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
            onBlur={() => onBlur("nombre")}
          />
          {touched.nombre && errors.nombre && (
            <div className="invalid-feedback">{errors.nombre}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Precio *</label>
          <input
            className={`form-control ${
              touched.precio && errors.precio ? "is-invalid" : ""
            }`}
            value={form.precio}
            onChange={(e) => onChange("precio", e.target.value)}
            onBlur={() => onBlur("precio")}
            placeholder="Ej: 45900"
            inputMode="numeric"
          />
          {touched.precio && errors.precio && (
            <div className="invalid-feedback">{errors.precio}</div>
          )}
        </div>

        <div className="col-12 col-md-8">
          <label className="form-label">Imagen (URL o archivo en public)</label>
          <input
            className={`form-control ${
              touched.imagenUrl && errors.imagenUrl ? "is-invalid" : ""
            }`}
            placeholder="https://...  o  producto.jpg"
            value={form.imagenUrl}
            onChange={(e) => onChange("imagenUrl", e.target.value)}
            onBlur={() => onBlur("imagenUrl")}
          />
          {touched.imagenUrl && errors.imagenUrl && (
            <div className="invalid-feedback">{errors.imagenUrl}</div>
          )}
          <div className="form-text">
            Puedes escribir solo el nombre del archivo (p.ej.{" "}
            <code>producto.jpg</code>) y asumirá <code>/producto.jpg</code>.
          </div>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Vista previa</label>
          <div
            className="border rounded d-flex align-items-center justify-content-center bg-light"
            style={{ height: 140 }}
          >
            {normalizedPreview ? (
              <img
                src={normalizedPreview}
                alt="Vista previa"
                className="h-100"
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.opacity = 0.3;
                }}
              />
            ) : (
              <span className="text-muted small">Sin imagen</span>
            )}
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </section>
  );
}

import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const CATS = ["Deporte", "Gastronomía", "Maquillaje", "Artesanias"];

function normalizeImg(url) {
  const v = (url || "").trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/"))
    return v;
  return "/" + v;
}

export default function AdminEmpresaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { empresas, actualizarEmpresa } = useData();
  const { toast } = useToast();

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

  const [form, setForm] = useState({
    nombre: empresa.nombre || "",
    categoria: empresa.categoria || CATS[0],
    descripcion: empresa.descripcion || "",
    direccion: empresa.direccion || "",
    imagenUrl: empresa.imagenUrl || "",
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
    if (!form.descripcion.trim()) e.descripcion = "Requerido";
    if (form.imagenUrl) {
      const n = normalizeImg(form.imagenUrl);
      if (!/^https?:\/\//i.test(n) && !n.startsWith("/")) {
        e.imagenUrl =
          "Use una URL externa o un archivo en /public (ej: /foto.jpg)";
      }
    }
    return e;
  }, [form]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (Object.keys(errors).length) {
      setTouched({ nombre: true, descripcion: true, imagenUrl: true });
      return;
    }
    const actualizada = {
      id: empresa.id,
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      descripcion: form.descripcion.trim(),
      direccion: form.direccion.trim(),
      imagenUrl: form.imagenUrl ? normalizeImg(form.imagenUrl) : undefined,
      // NO tocamos productos aquí.
    };
    actualizarEmpresa(actualizada);
    toast("Empresa actualizada");
    navigate(`/empresa/${empresa.id}`);
  };

  return (
    <section className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/empresa/${empresa.id}`)}
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
      </div>

      <h1 className="h4">Editar empresa</h1>

      <form onSubmit={onSubmit} className="row g-3">
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
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={form.categoria}
            onChange={(e) => onChange("categoria", e.target.value)}
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Descripción *</label>
          <textarea
            className={`form-control ${
              touched.descripcion && errors.descripcion ? "is-invalid" : ""
            }`}
            rows={3}
            value={form.descripcion}
            onChange={(e) => onChange("descripcion", e.target.value)}
            onBlur={() => onBlur("descripcion")}
          />
          {touched.descripcion && errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion}</div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input
            className="form-control"
            value={form.direccion}
            onChange={(e) => onChange("direccion", e.target.value)}
          />
        </div>

        <div className="col-12 col-md-8">
          <label className="form-label">Imagen (URL o archivo en public)</label>
          <input
            className={`form-control ${
              touched.imagenUrl && errors.imagenUrl ? "is-invalid" : ""
            }`}
            placeholder="https://...  o  coffee.jpg"
            value={form.imagenUrl}
            onChange={(e) => onChange("imagenUrl", e.target.value)}
            onBlur={() => onBlur("imagenUrl")}
          />
          {touched.imagenUrl && errors.imagenUrl && (
            <div className="invalid-feedback">{errors.imagenUrl}</div>
          )}
          <div className="form-text">
            Puedes escribir dirección URL (p.ej. <code>https://…</code>) o
            archivo de <code>/public</code> (p.ej. <code>coffee.jpg</code>). Si
            escribes solo el nombre, se asume <code>/nombre</code>.
          </div>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Vista previa</label>
          <div
            className="border rounded d-flex align-items-center justify-content-center bg-light"
            style={{ height: 160 }}
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
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  );
}

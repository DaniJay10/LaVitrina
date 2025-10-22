import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const CATS = ["Deporte", "Gastronomía", "Maquillaje", "Artesanias"];

function uuid() {
  return "e-" + Math.random().toString(36).slice(2, 9);
}
function normalizeImg(url) {
  const v = (url || "").trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/"))
    return v;
  return "/" + v;
}

export default function AdminEmpresaForm() {
  const { isAdmin } = useAuth();
  const { crearEmpresa } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    categoria: CATS[0],
    descripcion: "",
    direccion: "",
    imagenUrl: "",
  });
  const [touched, setTouched] = useState({});

  if (!isAdmin) {
    return (
      <section className="container my-3">
        <h1 className="h4">No autorizado</h1>
        <p className="text-muted">Inicia sesión como administrador.</p>
      </section>
    );
  }

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
    const nueva = {
      id: uuid(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      descripcion: form.descripcion.trim(),
      direccion: form.direccion.trim(),
      productos: [], // se gestionan aparte
      fechaRegistro: new Date().toISOString(),
      imagenUrl: form.imagenUrl ? normalizeImg(form.imagenUrl) : undefined,
    };
    crearEmpresa(nueva);
    toast("Empresa creada");
    navigate("/");
  };

  return (
    <section className="container my-3">
      <h1 className="h4">Nueva empresa</h1>

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

        {/* Dirección ocupa todo el ancho */}
        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input
            className="form-control"
            value={form.direccion}
            onChange={(e) => onChange("direccion", e.target.value)}
          />
        </div>

        {/* Imagen (8 columnas) + Preview (4 columnas) lado a lado */}
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
            Crear
          </button>
        </div>
      </form>
    </section>
  );
}

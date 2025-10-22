import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const CATS = ["Deporte", "Comida", "Maquillaje", "Artesanias"];

function uuid() {
  return "e-" + Math.random().toString(36).slice(2, 9);
}

export default function AdminEmpresaForm() {
  const { isAdmin } = useAuth();
  const { crearEmpresa } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    categoria: CATS[0],
    descripcion: "",
    direccion: "",
    productosTxt: "",
  });

  if (!isAdmin) {
    return (
      <section>
        <h1>No autorizado</h1>
        <p>Inicia sesión como admin.</p>
      </section>
    );
  }

  const onChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.descripcion.trim()) return;
    const productos = form.productosTxt
      ? form.productosTxt
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const nueva = {
      id: uuid(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      descripcion: form.descripcion.trim(),
      direccion: form.direccion.trim(),
      productos,
      fechaRegistro: new Date().toISOString(),
    };
    crearEmpresa(nueva);
    navigate("/");
  };

  return (
    <section>
      <h1>Nueva empresa</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 520 }}
      >
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />
        <select
          value={form.categoria}
          onChange={(e) => onChange("categoria", e.target.value)}
        >
          {CATS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Descripción"
          rows={3}
          value={form.descripcion}
          onChange={(e) => onChange("descripcion", e.target.value)}
        />
        <input
          placeholder="Dirección"
          value={form.direccion}
          onChange={(e) => onChange("direccion", e.target.value)}
        />
        <input
          placeholder="Productos (separados por coma)"
          value={form.productosTxt}
          onChange={(e) => onChange("productosTxt", e.target.value)}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Crear
        </button>
      </form>
    </section>
  );
}

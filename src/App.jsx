import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import EmpresaDetalle from "./pages/EmpresaDetalle";
import Login from "./pages/Login";
import AdminEmpresaForm from "./pages/AdminEmpresaForm";
import Navbar from "./components/Navbar";
import AdminProductos from "./pages/AdminProductos";
import AdminProductoNuevo from "./pages/AdminProductoNuevo";
import AdminProductoEditar from "./pages/AdminProductoEditar";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresa/:id" element={<EmpresaDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/empresas/nueva" element={<AdminEmpresaForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/admin/empresa/:id/productos"
            element={<AdminProductos />}
          />
          <Route
            path="/admin/empresa/:id/productos/nuevo"
            element={<AdminProductoNuevo />}
          />
          <Route
            path="/admin/empresa/:id/productos/:uiIndex/editar"
            element={<AdminProductoEditar />}
          />
        </Routes>
      </main>
      <footer
        style={{ textAlign: "center", padding: "24px 12px", opacity: 0.7 }}
      >
        <small>Proyecto escolar de marketing – Hecho con React</small>
      </footer>
    </div>
  );
}

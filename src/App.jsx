import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import EmpresaDetalle from "./pages/EmpresaDetalle";
import Login from "./pages/Login";
import AdminEmpresaForm from "./pages/AdminEmpresaForm";
import Navbar from "./components/Navbar";
import AdminProductos from "./pages/AdminProductos";

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
        </Routes>
      </main>
      <footer
        style={{ textAlign: "center", padding: "24px 12px", opacity: 0.7 }}
      >
        <small>
          Proyecto escolar de marketing – Hecho con React + Vite.{" "}
          <Link to="/empresas">Ver empresas</Link>
        </small>
      </footer>
    </div>
  );
}

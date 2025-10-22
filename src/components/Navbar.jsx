import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import CategoryPills from "./CategoryPills";

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const cat = params.get("cat") || "";

  const applySearch = () => {
    const p = new URLSearchParams();
    if (cat) p.set("cat", cat);
    if (text) p.set("q", text);
    navigate({ pathname: "/empresas", search: p.toString() });
  };

  return (
    <header className="border-bottom">
      <nav className="container py-3">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <Link to="/" className="fw-bold fs-5 text-decoration-none">
            La Vitrina
          </Link>

          <div className="d-flex gap-2">
            {isAdmin && (
              <NavLink
                to="/admin/empresas/nueva"
                className="btn btn-outline-secondary"
              >
                Nueva empresa
              </NavLink>
            )}
            {!isAdmin ? (
              <NavLink to="/login" className="btn btn-outline-secondary">
                Iniciar sesión
              </NavLink>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn btn-outline-secondary"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mt-3">
          <CategoryPills />
          <div className="ms-auto d-flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
              placeholder="Buscar por nombre…"
              className="form-control"
              style={{ width: 260 }}
            />
            <button onClick={applySearch} className="btn btn-outline-secondary">
              Buscar
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

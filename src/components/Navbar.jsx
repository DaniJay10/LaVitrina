import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// Categorías fijas
const CATEGORIAS = ["Deporte", "Comida", "Maquillaje", "Artesanias"];

export default function Navbar() {
  const linkStyle = {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 8,
  };
  const active = { background: "#efefef" };

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const goToCat = (cat) => {
    setOpen(false);
    navigate(`/empresas?cat=${encodeURIComponent(cat)}`);
  };

  return (
    <header style={{ borderBottom: "1px solid #eee" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
        }}
      >
        <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
          La Vitrina
        </Link>

        <div
          style={{ display: "flex", gap: 8, position: "relative" }}
          ref={ref}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? active : {}),
            })}
          >
            Inicio
          </NavLink>

          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              ...linkStyle,
              border: "1px solid #e5e5e5",
              background: "#fff",
              cursor: "pointer",
            }}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            Categoría ▾
          </button>

          {open && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: 44,
                left: 92,
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                minWidth: 180,
                padding: 8,
                zIndex: 20,
              }}
            >
              {CATEGORIAS.map((c) => (
                <button
                  key={c}
                  onClick={() => goToCat(c)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f7f7f7")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <NavLink
            to="/login"
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? active : {}),
            })}
          >
            Iniciar sesión
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

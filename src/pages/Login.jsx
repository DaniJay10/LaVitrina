import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { isAdmin, login, logout } = useAuth();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const ok = await login(u, p);
    if (ok) navigate("/");
    else setErr("Credenciales inválidas");
  };

  if (isAdmin) {
    return (
      <section>
        <h1>Sesión iniciada</h1>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>Iniciar sesión</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 320 }}
      >
        <input
          placeholder="Usuario"
          value={u}
          onChange={(e) => setU(e.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={p}
          onChange={(e) => setP(e.target.value)}
        />
        {err && <div style={{ color: "crimson", fontSize: 14 }}>{err}</div>}
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
      <p style={{ opacity: 0.6, fontSize: 12, marginTop: 8 }}>
        Demo: admin / 1234
      </p>
    </section>
  );
}

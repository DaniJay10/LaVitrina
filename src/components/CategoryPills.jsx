import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CATS = ["Deporte", "Comida", "Maquillaje", "Artesanias"];

export default function CategoryPills() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const active = params.get("cat");

  const baseBtn = {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  };

  const go = (cat) => {
    const p = new URLSearchParams(search);
    if (cat) p.set("cat", cat);
    else p.delete("cat");
    navigate({ pathname: "/empresas", search: p.toString() });
  };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        onClick={() => go(null)}
        style={{ ...baseBtn, ...(active ? {} : { background: "#efefef" }) }}
      >
        Todas
      </button>
      {CATS.map((c) => (
        <button
          key={c}
          onClick={() => go(c)}
          style={{
            ...baseBtn,
            ...(active === c ? { background: "#efefef" } : {}),
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

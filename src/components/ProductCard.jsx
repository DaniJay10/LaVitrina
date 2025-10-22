export default function ProductCard({ producto }) {
  return (
    <article
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 160,
          borderRadius: 8,
          overflow: "hidden",
          background: "#f8f9fa",
        }}
      >
        <img
          src={producto.imagenUrl}
          alt={producto.nombre}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            backgroundColor: "#fff",
          }}
        />
      </div>
      <h3 style={{ margin: 0, fontSize: 14 }}>{producto.nombre}</h3>
      <div style={{ marginTop: "auto", opacity: 0.8, fontSize: 13 }}>
        {typeof producto.precio === "number"
          ? producto.precio.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })
          : producto.precio}
      </div>
    </article>
  );
}

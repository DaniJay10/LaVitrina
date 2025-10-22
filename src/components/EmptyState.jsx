export default function EmptyState({
  title = "Sin resultados",
  text = "Intenta cambiar los filtros o agregar una empresa.",
}) {
  return (
    <div className="text-center text-muted my-5">
      <div className="display-6 mb-2">🗂️</div>
      <h2 className="h5">{title}</h2>
      <p className="mb-0">{text}</p>
    </div>
  );
}

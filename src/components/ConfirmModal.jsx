import { useEffect, useRef } from "react";

export default function ConfirmModal({
  id = "confirmModal",
  title = "Confirmar",
  message = "¿Seguro?",
  confirmText = "Sí",
  cancelText = "Cancelar",
  onConfirm,
}) {
  const ref = useRef(null);

  useEffect(() => {
    // Inicialización manual mínima para el modal Bootstrap
    // (sin usar JS de Bootstrap; solo clases y atributos)
  }, []);

  const close = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("show");
    el.style.display = "none";
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  };

  const open = () => {
    const el = ref.current;
    if (!el) return;
    el.style.display = "block";
    setTimeout(() => el.classList.add("show"), 10);
    document.body.classList.add("modal-open");
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    document.body.appendChild(backdrop);
  };

  // Exponer open/close en window para ser llamado desde el padre por id
  useEffect(() => {
    const api = { open, close };
    window.__confirm_modals = window.__confirm_modals || {};
    window.__confirm_modals[id] = api;
    return () => {
      delete window.__confirm_modals[id];
    };
  }, [id]);

  return (
    <div
      ref={ref}
      id={id}
      className="modal fade"
      tabIndex="-1"
      style={{ display: "none" }}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-6">{title}</h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={close}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={close}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onConfirm?.();
                close();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

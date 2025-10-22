import { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(null);

export function FlashProvider({ children }) {
  const [flash, setFlash] = useState(null);

  const show = useCallback((type, msg) => {
    setFlash({ type, msg });
    setTimeout(() => setFlash(null), 2000);
  }, []);

  return <Ctx.Provider value={{ flash, show }}>{children}</Ctx.Provider>;
}

export function useFlash() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFlash debe usarse dentro de <FlashProvider>");
  return ctx;
}

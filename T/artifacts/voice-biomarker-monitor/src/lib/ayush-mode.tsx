import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type MedicalMode = "allopathic" | "ayush";

interface AyushModeContextValue {
  mode: MedicalMode;
  setMode: (mode: MedicalMode) => void;
  toggleMode: () => void;
}

const AyushModeContext = createContext<AyushModeContextValue>({
  mode: "allopathic",
  setMode: () => {},
  toggleMode: () => {},
});

export function AyushModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MedicalMode>(() => {
    if (typeof window === "undefined") return "allopathic";
    return (localStorage.getItem("voxara-medical-mode") as MedicalMode) ?? "allopathic";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "ayush") {
      root.classList.add("ayush");
      root.classList.remove("allopathic");
    } else {
      root.classList.add("allopathic");
      root.classList.remove("ayush");
    }
    localStorage.setItem("voxara-medical-mode", mode);
  }, [mode]);

  const setMode = (m: MedicalMode) => setModeState(m);
  const toggleMode = () => setModeState((m) => (m === "allopathic" ? "ayush" : "allopathic"));

  return (
    <AyushModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </AyushModeContext.Provider>
  );
}

export function useAyushMode() {
  return useContext(AyushModeContext);
}

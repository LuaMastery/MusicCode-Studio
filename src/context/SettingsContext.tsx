/**
 * SettingsContext — preferências globais (cor de destaque).
 * Paleta minimalista e refinada; violeta por padrão.
 */
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Accent {
  id: string;
  name: string;
  hex: string;
  text: string;
  bg: string;
  ring: string;
  border: string;
  gradient: string;
}

const ACCENTS: Accent[] = [
  { id: "violet",  name: "Violeta",  hex: "#8b5cf6", text: "text-violet-400",  bg: "bg-violet-500/10",  ring: "ring-violet-500/40",  border: "border-violet-500/30",  gradient: "from-violet-500 to-violet-700" },
  { id: "indigo",  name: "Índigo",   hex: "#6366f1", text: "text-indigo-400",  bg: "bg-indigo-500/10",  ring: "ring-indigo-500/40",  border: "border-indigo-500/30",  gradient: "from-indigo-500 to-indigo-700" },
  { id: "blue",    name: "Azul",     hex: "#3b82f6", text: "text-blue-400",    bg: "bg-blue-500/10",    ring: "ring-blue-500/40",    border: "border-blue-500/30",    gradient: "from-blue-500 to-blue-700" },
  { id: "emerald", name: "Esmeralda",hex: "#10b981", text: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/40", border: "border-emerald-500/30", gradient: "from-emerald-500 to-emerald-700" },
  { id: "rose",    name: "Rosa",     hex: "#f43f5e", text: "text-rose-400",    bg: "bg-rose-500/10",    ring: "ring-rose-500/40",    border: "border-rose-500/30",    gradient: "from-rose-500 to-rose-700" },
];

interface SettingsValue {
  accent: Accent;
  accents: Accent[];
  setAccent: (id: string) => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [accentId, setAccentId] = useState("violet");
  const accent = ACCENTS.find((a) => a.id === accentId) ?? ACCENTS[0];
  return (
    <SettingsContext.Provider value={{ accent, accents: ACCENTS, setAccent: setAccentId }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro de SettingsProvider");
  return ctx;
}

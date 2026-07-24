/**
 * SettingsContext — preferências globais (cor de destaque, idioma).
 * Mantido enxuto; a prioridade do app é o som.
 */
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Accent {
  id: string;
  name: string;
  gradient: string;
  text: string;
  ring: string;
  bg: string;
}

const ACCENTS: Accent[] = [
  { id: "violet", name: "Violeta", gradient: "from-violet-500 to-fuchsia-500", text: "text-violet-400", ring: "ring-violet-500", bg: "bg-violet-500/10" },
  { id: "cyan", name: "Ciano", gradient: "from-cyan-500 to-blue-500", text: "text-cyan-400", ring: "ring-cyan-500", bg: "bg-cyan-500/10" },
  { id: "emerald", name: "Esmeralda", gradient: "from-emerald-500 to-teal-500", text: "text-emerald-400", ring: "ring-emerald-500", bg: "bg-emerald-500/10" },
  { id: "rose", name: "Rosa", gradient: "from-rose-500 to-pink-500", text: "text-rose-400", ring: "ring-rose-500", bg: "bg-rose-500/10" },
  { id: "amber", name: "Âmbar", gradient: "from-amber-500 to-orange-500", text: "text-amber-400", ring: "ring-amber-500", bg: "bg-amber-500/10" },
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
    <SettingsContext.Provider
      value={{ accent, accents: ACCENTS, setAccent: setAccentId }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro de SettingsProvider");
  return ctx;
}

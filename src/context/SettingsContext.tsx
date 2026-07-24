/**
 * SettingsContext — preferências globais de design + estado da gaveta de ajustes.
 * Tudo é persistido em localStorage, então o usuário configura "o quanto quiser".
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BgType = "none" | "particles" | "waves" | "aurora";

export interface Accent {
  id: string;
  name: string;
  hex: string;
}

const PRESETS: Accent[] = [
  { id: "violet",  name: "Violeta",   hex: "#8b5cf6" },
  { id: "indigo",  name: "Índigo",    hex: "#6366f1" },
  { id: "blue",    name: "Azul",      hex: "#3b82f6" },
  { id: "cyan",    name: "Ciano",     hex: "#06b6d4" },
  { id: "emerald", name: "Esmeralda", hex: "#10b981" },
  { id: "rose",    name: "Rosa",      hex: "#f43f5e" },
  { id: "amber",   name: "Âmbar",     hex: "#f59e0b" },
];

interface Settings {
  accentId: string;
  customAccent: string | null;
  bgType: BgType;
  bgEnabled: boolean;
  bgSpeed: number;          // 0.3 .. 2
  reduceMotion: boolean;
  editorFontSize: number;   // 11 .. 20
  autoSave: boolean;
  sfxEnabled: boolean;
  sfxVolume: number;        // 0 .. 1
}

const LS_KEY = "musiccode.settings.v1";

const DEFAULTS: Settings = {
  accentId: "violet",
  customAccent: null,
  bgType: "particles",
  bgEnabled: true,
  bgSpeed: 1,
  reduceMotion: false,
  editorFontSize: 13,
  autoSave: false,
  sfxEnabled: true,
  sfxVolume: 0.4,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULTS;
  }
}

interface SettingsValue {
  settings: Settings;
  update: (partial: Partial<Settings>) => void;
  reset: () => void;
  presets: Accent[];
  accent: Accent;        // resolvido (custom ou preset)
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch { /* */ }
  }, [settings]);

  const update = (partial: Partial<Settings>) => setSettings((s) => ({ ...s, ...partial }));
  const reset = () => setSettings(DEFAULTS);

  const accent = useMemo<Accent>(() => {
    const preset = PRESETS.find((a) => a.id === settings.accentId) ?? PRESETS[0];
    return { ...preset, hex: settings.customAccent || preset.hex };
  }, [settings.accentId, settings.customAccent]);

  return (
    <Ctx.Provider value={{
      settings, update, reset, presets: PRESETS, accent,
      drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings deve ser usado dentro de SettingsProvider");
  return ctx;
}

/**
 * useHtmlInstruments — gerencia os HTMLs criados pelo usuário (salvos no navegador).
 * Eles aparecem na galeria do Studio HTML junto com os instrumentos embutidos.
 */
import { useCallback, useState } from "react";

export interface HtmlInstrument {
  id: string;
  name: string;
  icon: string;
  code: string;
  createdAt: number;
}

const LS_KEY = "musiccode.htmlinstruments.v1";

function uid(): string {
  return "h:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function load(): HtmlInstrument[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.code === "string")
      .map((x) => ({
        id: String(x.id ?? uid()),
        name: String(x.name ?? "Sem nome"),
        icon: String(x.icon ?? "📦"),
        code: x.code,
        createdAt: Number(x.createdAt ?? Date.now()),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

function persist(list: HtmlInstrument[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    /* armazenamento cheio */
  }
}

export function useHtmlInstruments() {
  const [instruments, setInstruments] = useState<HtmlInstrument[]>(load);

  const create = useCallback((name: string, code: string, icon = "📦"): HtmlInstrument => {
    const ins: HtmlInstrument = { id: uid(), name: name.trim() || "Meu HTML", icon, code, createdAt: Date.now() };
    setInstruments((prev) => {
      const next = [ins, ...prev];
      persist(next);
      return next;
    });
    return ins;
  }, []);

  const update = useCallback((id: string, patch: Partial<Pick<HtmlInstrument, "name" | "code" | "icon">>) => {
    setInstruments((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, ...patch } : x));
      persist(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setInstruments((prev) => {
      const next = prev.filter((x) => x.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { instruments, create, update, remove };
}

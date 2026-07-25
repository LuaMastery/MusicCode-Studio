/**
 * useHtmlInstruments — gerencia os HTMLs criados pelo usuário (salvos no navegador).
 * Campos: nome, ícone, descrição, imagem (miniatura), permite-cópia e visibilidade
 * (privado/público). Aparecem na galeria do Studio HTML.
 */
import { useCallback, useState } from "react";

export type Visibility = "private" | "public";

export interface HtmlInstrument {
  id: string;
  name: string;
  icon: string;
  description?: string;
  image?: string | null;     // data URL da miniatura
  code: string;
  copyable: boolean;          // se outros podem copiar o código
  visibility: Visibility;
  createdAt: number;
}

const LS_KEY = "musiccode.htmlinstruments.v1";

function uid(): string {
  return "h:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function normalize(x: Partial<HtmlInstrument>, fallbackId?: string): HtmlInstrument {
  return {
    id: String(x.id ?? fallbackId ?? uid()),
    name: String(x.name ?? "Sem nome"),
    icon: String(x.icon ?? "📦"),
    description: x.description ? String(x.description) : undefined,
    image: x.image ?? null,
    code: typeof x.code === "string" ? x.code : "",
    copyable: x.copyable !== false,
    visibility: x.visibility === "public" ? "public" : "private",
    createdAt: Number(x.createdAt ?? Date.now()),
  };
}

function load(): HtmlInstrument[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.code === "string")
      .map((x) => normalize(x))
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

export interface NewInstrument {
  name: string;
  code: string;
  icon?: string;
  description?: string;
  image?: string | null;
  copyable?: boolean;
  visibility?: Visibility;
}

export function useHtmlInstruments() {
  const [instruments, setInstruments] = useState<HtmlInstrument[]>(load);

  const create = useCallback((data: NewInstrument): HtmlInstrument => {
    const ins: HtmlInstrument = normalize({
      name: data.name, code: data.code, icon: data.icon, description: data.description,
      image: data.image, copyable: data.copyable, visibility: data.visibility,
      createdAt: Date.now(),
    });
    setInstruments((prev) => {
      const next = [ins, ...prev];
      persist(next);
      return next;
    });
    return ins;
  }, []);

  const update = useCallback((id: string, patch: Partial<NewInstrument>) => {
    setInstruments((prev) => {
      const next = prev.map((x) => (x.id === id ? normalize({ ...x, ...patch }, x.id) : x));
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

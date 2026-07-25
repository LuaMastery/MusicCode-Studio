/**
 * useSharedInstruments — HTMLs importados via código de compartilhamento
 * (publicados por outros usuários). Aparecem na aba "HTMLs públicos".
 */
import { useCallback, useState } from "react";

export interface SharedInstrument {
  id: string;
  name: string;
  icon: string;
  description?: string;
  code: string;
  copyable: boolean;
  importedAt: number;
}

const LS_KEY = "musiccode.importedhtml.v1";

function uid(): string {
  return "s:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function load(): SharedInstrument[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.code === "string")
      .map((x) => ({
        id: String(x.id ?? uid()),
        name: String(x.name ?? "HTML"),
        icon: String(x.icon ?? "📦"),
        description: x.description ? String(x.description) : undefined,
        code: x.code,
        copyable: x.copyable !== false,
        importedAt: Number(x.importedAt ?? Date.now()),
      }))
      .sort((a, b) => b.importedAt - a.importedAt);
  } catch {
    return [];
  }
}

function persist(list: SharedInstrument[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    /* */
  }
}

export function useSharedInstruments() {
  const [shared, setShared] = useState<SharedInstrument[]>(load);

  const add = useCallback((data: { name: string; icon: string; description?: string; code: string; copyable: boolean }): SharedInstrument => {
    const ins: SharedInstrument = {
      id: uid(),
      name: data.name,
      icon: data.icon,
      description: data.description,
      code: data.code,
      copyable: data.copyable,
      importedAt: Date.now(),
    };
    setShared((prev) => {
      const next = [ins, ...prev];
      persist(next);
      return next;
    });
    return ins;
  }, []);

  const remove = useCallback((id: string) => {
    setShared((prev) => {
      const next = prev.filter((x) => x.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { shared, add, remove };
}

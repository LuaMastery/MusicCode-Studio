/**
 * useMusicFiles — gerencia arquivos de música do usuário (como o explorador do VS Code).
 *
 * - Exemplos (templates embutidos): abertos/escritos na sessão, não persistidos.
 * - Arquivos do usuário: criados, renomeados, salvos e persistidos em localStorage.
 * - Detecta arquivos "não salvos" (dirty) comparando com o conteúdo salvo.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { TEMPLATES } from "../data/templates";

export interface MusicFile {
  id: string;
  name: string;
  code: string;
  kind: "example" | "user";
  icon?: string;
}

const LS_FILES = "musiccode.userfiles.v1";
const LS_ACTIVE = "musiccode.activefile.v1";

const STARTER = `// Nova música 🎵
bpm(120)
synth("piano")

play("C4");  sleep(1)
play("E4");  sleep(1)
play("G4");  sleep(1)
`;

function uid(): string {
  return "u:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadUserFiles(): MusicFile[] {
  try {
    const raw = localStorage.getItem(LS_FILES);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((f) => f && typeof f.id === "string" && typeof f.code === "string")
      .map((f) => ({ id: f.id, name: String(f.name ?? "sem-titulo"), code: f.code, kind: "user" as const, icon: "📝" }));
  } catch {
    return [];
  }
}

function persistUserFiles(files: MusicFile[]): void {
  try {
    const data = files
      .filter((f) => f.kind === "user")
      .map((f) => ({ id: f.id, name: f.name, code: f.code }));
    localStorage.setItem(LS_FILES, JSON.stringify(data));
  } catch {
    /* storage cheio ou indisponível */
  }
}

export function useMusicFiles(autoSave: boolean) {
  const exampleFiles = useMemo<MusicFile[]>(
    () => TEMPLATES.map((t) => ({ id: "ex:" + t.id, name: t.id, code: t.code, kind: "example", icon: t.icon })),
    []
  );

  const [files, setFiles] = useState<MusicFile[]>(() => [...loadUserFiles(), ...exampleFiles]);
  const [activeId, setActiveId] = useState<string>(() => {
    try {
      return localStorage.getItem(LS_ACTIVE) ?? exampleFiles[0]?.id ?? "ex:" + TEMPLATES[0].id;
    } catch {
      return "ex:" + TEMPLATES[0].id;
    }
  });
  const [savedCodes, setSavedCodes] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    loadUserFiles().forEach((f) => (m[f.id] = f.code));
    return m;
  });

  // Salvamento automático: persiste arquivos do usuário sempre que mudarem.
  useEffect(() => {
    if (!autoSave) return;
    persistUserFiles(files);
    setSavedCodes((prev) => {
      const m = { ...prev };
      files.filter((f) => f.kind === "user").forEach((f) => (m[f.id] = f.code));
      return m;
    });
  }, [files, autoSave]);

  const active = files.find((f) => f.id === activeId) ?? files[0] ?? exampleFiles[0];

  const dirtyIds = useMemo(() => {
    const s = new Set<string>();
    for (const f of files) {
      const base = f.kind === "example"
        ? TEMPLATES.find((t) => "ex:" + t.id === f.id)?.code ?? f.code
        : savedCodes[f.id] ?? f.code;
      if (f.code !== base) s.add(f.id);
    }
    return s;
  }, [files, savedCodes]);

  const open = useCallback((id: string) => {
    setActiveId(id);
    try { localStorage.setItem(LS_ACTIVE, id); } catch { /* */ }
  }, []);

  const updateCode = useCallback((code: string) => {
    setFiles((prev) => prev.map((f) => (f.id === activeId ? { ...f, code } : f)));
  }, [activeId]);

  const createFile = useCallback((name?: string) => {
    const id = uid();
    const base = (name?.trim() || "").replace(/\.js$/i, "");
    // garante nome único
    let nm = base || "sem-titulo";
    let n = 2;
    const existing = new Set(files.map((f) => f.name));
    while (existing.has(nm)) nm = `${base || "sem-titulo"}-${n++}`;
    const file: MusicFile = { id, name: nm, code: STARTER, kind: "user", icon: "📝" };
    setFiles((prev) => {
      const next = [file, ...prev];
      persistUserFiles(next);
      return next;
    });
    setSavedCodes((m) => ({ ...m, [id]: STARTER }));
    open(id);
    return file;
  }, [files, open]);

  const save = useCallback(() => {
    if (!active) return;
    if (active.kind === "user") {
      setFiles((prev) => { persistUserFiles(prev); return prev; });
      setSavedCodes((m) => ({ ...m, [active.id]: active.code }));
    } else {
      // exemplos: "Salvar como" -> cria cópia do usuário
      const id = uid();
      const file: MusicFile = { id, name: `${active.name}-copia`, code: active.code, kind: "user", icon: "📝" };
      setFiles((prev) => { const next = [file, ...prev]; persistUserFiles(next); return next; });
      setSavedCodes((m) => ({ ...m, [id]: active.code }));
      open(id);
    }
  }, [active, open]);

  const resetActive = useCallback(() => {
    if (active?.kind !== "example") return;
    const tpl = TEMPLATES.find((t) => "ex:" + t.id === active.id);
    if (!tpl) return;
    setFiles((prev) => prev.map((f) => (f.id === active.id ? { ...f, code: tpl.code } : f)));
  }, [active]);

  const rename = useCallback((id: string, name: string) => {
    const nm = name.trim().replace(/\.js$/i, "");
    if (!nm) return;
    setFiles((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, name: nm } : f));
      persistUserFiles(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      persistUserFiles(next);
      return next;
    });
    setSavedCodes((m) => { const n = { ...m }; delete n[id]; return n; });
    if (activeId === id) {
      const remaining = files.filter((f) => f.id !== id);
      open(remaining[0]?.id ?? exampleFiles[0].id);
    }
  }, [activeId, files, exampleFiles, open]);

  const duplicate = useCallback((id: string) => {
    const src = files.find((f) => f.id === id);
    if (!src) return;
    const newId = uid();
    const file: MusicFile = { id: newId, name: `${src.name}-copia`, code: src.code, kind: "user", icon: "📝" };
    setFiles((prev) => { const next = [file, ...prev]; persistUserFiles(next); return next; });
    setSavedCodes((m) => ({ ...m, [newId]: src.code }));
    open(newId);
  }, [files, open]);

  const clearUserFiles = useCallback(() => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.kind !== "user");
      persistUserFiles(next);
      return next;
    });
    setSavedCodes({});
    if (active?.kind === "user") open(exampleFiles[0].id);
  }, [active, exampleFiles, open]);

  const userFiles = files.filter((f) => f.kind === "user");

  return {
    files, userFiles, exampleFiles, active, activeId, dirtyIds,
    open, updateCode, createFile, save, resetActive, rename, remove, duplicate, clearUserFiles,
  };
}

/**
 * SearchPanel — busca em todos os arquivos (find-in-files), estilo VS Code.
 */
import { useMemo, useState } from "react";
import { Search, CaseSensitive } from "lucide-react";
import type { MusicFile } from "../hooks/useMusicFiles";

interface Props {
  files: MusicFile[];
  onOpen: (f: MusicFile) => void;
}

interface Match {
  file: MusicFile;
  line: number;
  text: string;
}

export function SearchPanel({ files, onOpen }: Props) {
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const results = useMemo<{ file: MusicFile; matches: Match[] }[]>(() => {
    if (!query.trim()) return [];
    const q = caseSensitive ? query : query.toLowerCase();
    const out: { file: MusicFile; matches: Match[] }[] = [];
    for (const f of files) {
      const lines = f.code.split("\n");
      const ms: Match[] = [];
      lines.forEach((ln, i) => {
        const hay = caseSensitive ? ln : ln.toLowerCase();
        if (hay.includes(q)) ms.push({ file: f, line: i + 1, text: ln.trim() });
      });
      if (ms.length) out.push({ file: f, matches: ms });
    }
    return out;
  }, [query, caseSensitive, files]);

  const total = results.reduce((a, r) => a + r.matches.length, 0);

  return (
    <div className="w-60 bg-[#131319] shrink-0 flex flex-col border-r border-black/40">
      <div className="h-9 flex items-center px-3 text-[11px] font-bold tracking-widest text-[#bbbbbb] uppercase shrink-0">
        Buscar
      </div>

      <div className="px-2 pb-2 flex items-center gap-1">
        <div className="flex-1 flex items-center bg-[#1a1a22] rounded px-2">
          <Search size={13} className="text-[#858585]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nos arquivos..."
            className="flex-1 bg-transparent text-white text-[12px] py-1.5 px-1.5 outline-none"
          />
        </div>
        <button
          title="Diferenciar maiúsculas"
          onClick={() => setCaseSensitive((c) => !c)}
          className={`p-1.5 rounded ${caseSensitive ? "bg-[#7c5cff] text-white" : "text-[#858585] hover:bg-white/10"}`}
        >
          <CaseSensitive size={14} />
        </button>
      </div>

      <div className="px-3 pb-1 text-[11px] text-[#858585] shrink-0">
        {query.trim() ? `${total} resultado(s) em ${results.length} arquivo(s)` : "Digite para buscar em todos os arquivos."}
      </div>

      <div className="flex-1 overflow-auto">
        {results.map(({ file, matches }) => (
          <div key={file.id} className="mb-1">
            <div className="px-3 py-0.5 text-[11px] font-bold text-[#cccccc] uppercase tracking-wide truncate">
              {file.name}.js <span className="text-[#858585] font-normal normal-case">({matches.length})</span>
            </div>
            {matches.map((m, i) => (
              <button
                key={i}
                onClick={() => onOpen(file)}
                className="w-full text-left flex gap-2 pl-5 pr-2 py-[3px] text-[12px] text-[#a0a0a0] hover:bg-[#1a1a22]"
              >
                <span className="text-[#858585] shrink-0">{m.line}</span>
                <span className="truncate font-mono">{m.text}</span>
              </button>
            ))}
          </div>
        ))}
        {query.trim() && total === 0 && (
          <div className="px-3 py-2 text-[12px] text-[#6b6b6b] italic">Nenhum resultado.</div>
        )}
      </div>
    </div>
  );
}

/**
 * Explorer — barra lateral com a lista de "arquivos" (templates/exemplos).
 */
import { ChevronDown, FileCode2, Play } from "lucide-react";
import type { Template } from "../data/templates";

interface Props {
  templates: Template[];
  selectedId: string;
  onSelect: (t: Template) => void;
  onRun: () => void;
}

export function Explorer({ templates, selectedId, onSelect, onRun }: Props) {
  return (
    <div className="w-60 bg-[#252526] shrink-0 flex flex-col border-r border-black/40">
      <div className="h-9 flex items-center px-4 text-[11px] font-bold tracking-widest text-[#bbbbbb] uppercase shrink-0">
        Explorador
      </div>

      <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#cccccc] shrink-0">
        <ChevronDown size={14} />
        <span className="uppercase tracking-wide">MusicCode Studio</span>
      </div>

      <div className="flex-1 overflow-auto">
        {templates.map((t) => {
          const isActive = t.id === selectedId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`relative w-full flex items-center gap-1.5 pl-5 pr-2 py-[3px] text-[13px] text-left transition-colors ${
                isActive ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"
              }`}
            >
              {isActive && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#007acc]" />}
              <FileCode2 size={15} className="text-[#519aba] shrink-0" />
              <span className="truncate">{t.id}.js</span>
            </button>
          );
        })}
      </div>

      {/* Rodapé: dica */}
      <button
        onClick={onRun}
        className="m-2 flex items-center justify-center gap-2 py-2 rounded text-[12px] font-bold text-white bg-[#0e639c] hover:bg-[#1177bb] transition-colors shrink-0"
      >
        <Play size={13} fill="currentColor" /> Executar
      </button>
    </div>
  );
}

/**
 * ConsolePanel — mostra os logs (print/puts) e erros da execução.
 */
import { useEffect, useRef } from "react";
import { Terminal, Trash2 } from "lucide-react";

interface Props {
  lines: string[];
  onClear: () => void;
}

export function ConsolePanel({ lines, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117] flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/10">
        <Terminal size={14} className="text-emerald-400" />
        <span className="text-xs font-bold text-gray-300">Console</span>
        <span className="text-[10px] text-gray-600">{lines.length} mensagens</span>
        <button
          onClick={onClear}
          className="ml-auto flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Trash2 size={12} /> Limpar
        </button>
      </div>
      <div className="p-4 font-mono text-xs overflow-auto custom-scroll" style={{ height: 180 }}>
        {lines.length === 0 ? (
          <div className="text-gray-700">› Os logs de print() aparecem aqui...</div>
        ) : (
          lines.map((l, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-words ${
                l.startsWith("❌") ? "text-red-400" : "text-emerald-300"
              }`}
            >
              › {l}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

/**
 * CodeEditor — editor de código simples com numeração de linhas,
 * suporte a Tab e tema escuro. Foco em confiabilidade (som primeiro).
 */
import { useMemo, useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  filename?: string;
  accent?: string;
  minHeight?: number;
}

export function CodeEditor({ value, onChange, filename = "codigo.js", accent = "#a855f7", minHeight = 460 }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = useMemo(() => value.split("\n").length, [value]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0d1117] flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-gray-500 font-mono">{filename}</span>
        <span
          className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{ color: accent, borderColor: `${accent}55`, background: `${accent}1a` }}
        >
          ✏️ editável
        </span>
      </div>
      <div className="flex" style={{ minHeight }}>
        <div
          className="select-none text-right py-4 px-3 text-xs font-mono text-gray-600 bg-[#0d1117] border-r border-white/5 overflow-hidden"
          style={{ minWidth: 44 }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ height: "1.6em", lineHeight: "1.6em" }}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          className="flex-1 w-full bg-[#0d1117] text-gray-100 font-mono text-sm p-4 resize-none outline-none leading-[1.6] custom-scroll"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}

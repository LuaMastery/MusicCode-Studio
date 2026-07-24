/**
 * CodeEditor — editor estilo VS Code.
 * Realce de sintaxe via pano de fundo (<pre>) sobre um <textarea> transparente,
 * com gutter de numeração de linhas e cursor (Ln, Col) rastreado.
 *
 * - language="js"  → realce de sintaxe JavaScript (tema Dark+)
 * - language="text"→ texto puro (para HTML/outros)
 * - minHeight      → quando informado, usa altura fixa (caso contrário preenche o container)
 */
import { useMemo, useRef } from "react";
import { highlightJS } from "../utils/highlight";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onCursor?: (ln: number, col: number) => void;
  fontSize?: number;
  language?: "js" | "text";
  minHeight?: number;
}

const FONT_STACK = '"Menlo", "Monaco", "Consolas", "Courier New", monospace';

function escapePlain(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function CodeEditor({ value, onChange, onCursor, fontSize = 13, language = "js", minHeight }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const lineHeight = Math.round(fontSize * 1.5);
  const html = useMemo(
    () => (language === "js" ? highlightJS(value) : escapePlain(value)) + "\n",
    [value, language]
  );

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  const handleCursor = () => {
    const ta = taRef.current;
    if (!ta || !onCursor) return;
    const upto = ta.value.slice(0, ta.selectionStart);
    const parts = upto.split("\n");
    onCursor(parts.length, parts[parts.length - 1].length + 1);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
        syncScroll();
        handleCursor();
      });
    }
  };

  const shared = {
    fontFamily: FONT_STACK,
    fontSize,
    lineHeight: `${lineHeight}px`,
    tabSize: 2,
    margin: 0,
    border: 0,
    whiteSpace: "pre" as const,
  };

  const rootStyle = minHeight ? { height: minHeight } : undefined;
  const rootClass = minHeight ? "flex bg-[#1e1e1e]" : "flex flex-1 min-h-0 bg-[#1e1e1e]";

  return (
    <div className={rootClass} style={rootStyle}>
      {/* Gutter */}
      <div
        ref={gutterRef}
        className="overflow-hidden select-none bg-[#1e1e1e] text-right text-[#858585] shrink-0"
        style={{ width: 56, paddingTop: 12, paddingBottom: 12, paddingRight: 12, ...shared }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} style={{ height: lineHeight }}>{i + 1}</div>
        ))}
      </div>

      {/* Código */}
      <div className="relative flex-1 min-w-0">
        <pre
          ref={preRef}
          aria-hidden
          className="absolute inset-0 overflow-hidden m-0 pointer-events-none"
          style={{ ...shared, padding: "12px 16px", color: "#d4d4d4" }}
        >
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); syncScroll(); handleCursor(); }}
          onScroll={syncScroll}
          onKeyDown={handleKey}
          onKeyUp={handleCursor}
          onClick={handleCursor}
          onSelect={handleCursor}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          className="absolute inset-0 w-full h-full resize-none outline-none bg-transparent overflow-auto"
          style={{ ...shared, padding: "12px 16px", color: "transparent", caretColor: "#aeafad", WebkitTextFillColor: "transparent" }}
        />
      </div>
    </div>
  );
}

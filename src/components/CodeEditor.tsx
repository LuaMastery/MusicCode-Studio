import { useState, useCallback } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check, Download, Eye, EyeOff, Maximize2 } from "lucide-react";
import { Template } from "../data/templates";

interface Props {
  template: Template | null;
  code: string;
  onChange: (code: string) => void;
  onPreview: () => void;
}

const langMap: Record<string, string> = {
  lua: "lua",
  java: "java",
  html: "xml",
};

export default function CodeEditor({ template, code, onChange, onPreview }: Props) {
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleDownload = useCallback(() => {
    if (!template) return;
    const ext = template.language === "html" ? "html" : template.language === "java" ? "java" : "lua";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, template]);

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1a2e] rounded-2xl border border-white/10 min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎵</div>
          <p className="text-gray-500 text-lg font-medium">Selecione um template</p>
          <p className="text-gray-600 text-sm mt-1">Escolha um template na lista ao lado</p>
        </div>
      </div>
    );
  }

  const lang = langMap[template.language] || "plaintext";

  return (
    <div className="flex-1 flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-[#0d1117] min-h-[400px]">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Dots de janela */}
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-500 font-mono">
            {template.id}.{template.language === "html" ? "html" : template.language === "java" ? "java" : "lua"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {template.language === "html" && (
            <button
              onClick={onPreview}
              className="flex items-center gap-1.5 text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 px-3 py-1.5 rounded-full transition-colors"
            >
              <Eye size={12} />
              Preview
            </button>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            title="Alternar edição"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
              editMode
                ? "bg-purple-500/30 text-purple-300"
                : "bg-white/5 hover:bg-white/10 text-gray-400"
            }`}
          >
            {editMode ? <EyeOff size={12} /> : <Maximize2 size={12} />}
            {editMode ? "Highlight" : "Editar"}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors"
          >
            <Download size={12} />
            Baixar
          </button>
        </div>
      </div>

      {/* Editor / Highlight */}
      <div className="flex-1 overflow-auto">
        {editMode ? (
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full min-h-[460px] bg-[#0d1117] text-green-300 font-mono text-sm p-5 resize-none outline-none leading-relaxed"
            spellCheck={false}
          />
        ) : (
          <SyntaxHighlighter
            language={lang}
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: "20px",
              background: "#0d1117",
              fontSize: "13px",
              lineHeight: "1.7",
              minHeight: "460px",
            }}
            showLineNumbers
            lineNumberStyle={{ color: "#3d4451", fontSize: "11px" }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}

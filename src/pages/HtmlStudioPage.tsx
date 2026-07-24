/**
 * HtmlStudioPage — estúdio HTML minimalista.
 * Escreve HTML + Web Audio API e executa num preview isolado.
 */
import { useState } from "react";
import { Globe, Play, Copy, Check, Download, Code2, Eye } from "lucide-react";
import { CodeEditor } from "../components/CodeEditor";
import { HTML_EXAMPLES, type HtmlExample } from "../data/examples";
import { useSettings } from "../context/SettingsContext";

export function HtmlStudioPage() {
  const { accent } = useSettings();
  const [selected, setSelected] = useState<HtmlExample>(HTML_EXAMPLES[0]);
  const [code, setCode] = useState<string>(HTML_EXAMPLES[0].code);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const select = (t: HtmlExample) => { setSelected(t); setCode(t.code); setPreview(false); };
  const handleCopy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${selected.id}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-2">
        <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${accent.hex}1a` }}>
          <Globe size={18} style={{ color: accent.hex }} />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Studio HTML</h1>
      </div>
      <p className="text-muted text-sm mb-8">HTML + Web Audio API, com preview ao vivo num iframe isolado.</p>

      {/* Pílulas de exemplos */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 custom-scroll">
        {HTML_EXAMPLES.map((t) => (
          <button
            key={t.id}
            onClick={() => select(t)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
              selected.id === t.id
                ? "text-white"
                : "text-muted border-line hover:text-white hover:bg-white/[0.03]"
            }`}
            style={selected.id === t.id ? { borderColor: `${accent.hex}66`, background: `${accent.hex}1a` } : undefined}
          >
            <span>{t.icon}</span> {t.name}
          </button>
        ))}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex gap-1 bg-card border border-line rounded-lg p-0.5">
          <button
            onClick={() => setPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${!preview ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}
          >
            <Code2 size={13} /> Código
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${preview ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}
          >
            <Eye size={13} /> Preview
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-[12px] text-muted hover:text-white border border-line rounded-lg px-3 py-1.5">
            {copied ? <Check size={13} style={{ color: accent.hex }} /> : <Copy size={13} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 text-[12px] text-muted hover:text-white border border-line rounded-lg px-3 py-1.5">
            <Download size={13} /> .html
          </button>
          <button
            onClick={() => { setPreview(true); setRunKey((k) => k + 1); }}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-white rounded-lg px-3.5 py-1.5"
            style={{ background: accent.hex }}
          >
            <Play size={13} fill="currentColor" /> Executar
          </button>
        </div>
      </div>

      {!preview ? (
        <div className="rounded-xl border border-line overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-9 border-b border-line bg-card/50">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="ml-2 text-[11px] text-faint font-mono">{selected.id}.html</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${accent.hex}40`, color: accent.hex, background: `${accent.hex}14` }}>HTML</span>
          </div>
          <CodeEditor value={code} onChange={setCode} language="text" minHeight={500} />
        </div>
      ) : (
        <div className="rounded-xl border border-line overflow-hidden bg-white">
          <div className="flex items-center gap-2 px-4 h-9 border-b border-line bg-card/50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent.hex }} />
            <span className="ml-2 text-[11px] font-mono" style={{ color: accent.hex }}>▶ Preview — {selected.name}</span>
          </div>
          <iframe key={runKey} srcDoc={code} title="preview" sandbox="allow-scripts" className="w-full bg-white" style={{ height: 500, border: "none" }} />
        </div>
      )}
    </div>
  );
}

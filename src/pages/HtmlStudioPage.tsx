/**
 * HtmlStudioPage — galeria de instrumentos musicais interativos.
 * O usuário escolhe um instrumento e INTERAGE para criar música (sem programar).
 */
import { useState } from "react";
import { Globe, ArrowLeft, Code2, Eye, Play, Maximize2 } from "lucide-react";
import { HTML_EXAMPLES, type HtmlExample } from "../data/examples";
import { useSettings } from "../context/SettingsContext";

export function HtmlStudioPage() {
  const { accent } = useSettings();
  const [selected, setSelected] = useState<HtmlExample | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const open = (ex: HtmlExample) => {
    setSelected(ex);
    setShowCode(false);
    setRunKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  };
  const back = () => setSelected(null);

  // ── VISUALIZADOR (instrumento aberto) ───────────────────────────────────────
  if (selected) {
    return (
      <div className="flex flex-col relative z-10" style={{ height: "calc(100vh - 3.5rem)" }}>
        <div className="flex items-center gap-3 px-4 h-12 border-b border-line bg-card/60 backdrop-blur shrink-0">
          <button data-sfx="close" onClick={back} className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-white">
            <ArrowLeft size={15} /> Voltar
          </button>
          <span className="text-lg">{selected.icon}</span>
          <span className="text-[14px] font-bold text-white">{selected.name}</span>

          <div className="ml-auto flex items-center gap-1 bg-ink border border-line rounded-lg p-0.5">
            <button onClick={() => setShowCode(false)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all ${!showCode ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}>
              <Eye size={13} /> Interagir
            </button>
            <button onClick={() => setShowCode(true)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all ${showCode ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}>
              <Code2 size={13} /> Código
            </button>
          </div>
          <button data-sfx="open" onClick={() => setRunKey((k) => k + 1)} title="Reiniciar" className="flex items-center gap-1.5 text-[12px] font-medium text-white px-3 py-1.5 rounded-lg" style={{ background: accent.hex }}>
            <Play size={12} fill="currentColor" /> Reiniciar
          </button>
        </div>

        <div className="flex-1 min-h-0 bg-ink">
          {showCode ? (
            <pre className="h-full overflow-auto p-5 text-[12px] font-mono text-[#c4c4cc] leading-relaxed"><code>{selected.code}</code></pre>
          ) : (
            <iframe key={runKey} srcDoc={selected.code} title={selected.name} sandbox="allow-scripts" className="w-full h-full border-none" />
          )}
        </div>
      </div>
    );
  }

  // ── GALERIA ────────────────────────────────────────────────────────────────
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-5 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent.hex}1a` }}>
          <Globe size={20} style={{ color: accent.hex }} />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Studio HTML</h1>
      </div>
      <p className="text-muted text-sm mb-10 max-w-xl">
        Uma coleção de instrumentos musicais interativos. Escolha um e <span className="text-white">crie sua música interagindo</span> — sem precisar programar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HTML_EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            data-sfx="open"
            onClick={() => open(ex)}
            className="group text-left rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-[#16161d]"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" style={{ background: `${ex.color}1f` }}>
                {ex.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-white">{ex.name}</div>
                <div className="text-[11px] text-faint">Interativo</div>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={12} /> Abrir
              </span>
            </div>
            <p className="text-[12.5px] text-muted leading-relaxed mb-3">{ex.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {ex.tags.map((t) => (
                <span key={t} className="text-[10px] text-faint border border-line rounded-full px-2 py-0.5">{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

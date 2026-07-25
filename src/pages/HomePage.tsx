/**
 * HomePage — landing minimalista e elegante.
 */
import { ArrowRight, Sparkles } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { highlightJS } from "../utils/highlight";
import type { Page } from "../App";

const SNIPPET = `bpm(120)
synth("piano")

play("C4");  sleep(1)
play("E4");  sleep(1)
play(["G4", "C5"])   // acorde`;

export function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  const { accent } = useSettings();

  return (
    <div className="relative overflow-hidden">
      {/* glow de fundo */}
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-[0.18] animate-pulseGlow"
        style={{ background: accent.hex }}
      />

      <div className="relative max-w-3xl mx-auto px-5 pt-24 pb-20 md:pt-32">
        {/* Pill */}
        <div className="flex justify-center mb-7">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-muted border border-line rounded-full px-3.5 py-1.5 bg-card/60 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent.hex }} />
            Música · Código
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.02] text-white mb-6">
          Crie músicas<br />com <span style={{ color: accent.hex }}>código</span>.
        </h1>

        <p className="text-center text-muted text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed">
          Um studio minimalista para compor e ouvir música — programe em JavaScript
          ou crie som interagindo com os instrumentos em HTML.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <button
            onClick={() => navigate("studio")}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:scale-[1.03] active:scale-95"
            style={{ background: accent.hex, boxShadow: `0 8px 30px -8px ${accent.hex}` }}
          >
            Abrir o Studio
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigate("html")}
            className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white/90 border border-line hover:bg-white/[0.04] transition-colors"
          >
            Ver Studio HTML
          </button>
        </div>

        {/* Preview de código */}
        <div className="rounded-2xl border border-line bg-panel overflow-hidden shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 px-4 h-9 border-b border-line bg-card/50">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="ml-2 text-[11px] text-faint font-mono">melodia.js</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-muted">
              <Sparkles size={11} style={{ color: accent.hex }} /> executa no navegador
            </span>
          </div>
          <pre className="p-5 text-[13px] font-mono leading-[1.7] overflow-x-auto">
            <code dangerouslySetInnerHTML={{ __html: highlightJS(SNIPPET) }} />
          </pre>
        </div>
      </div>

      {/* Linguagens */}
      <div className="relative max-w-3xl mx-auto px-5 pb-24">
        <h2 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-faint mb-8">
          Linguagens
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: "JS", name: "JavaScript", ready: true, page: "studio" as Page },
            { icon: "<>", name: "HTML", ready: true, page: "html" as Page },
            { icon: "Lua", name: "Lua", ready: false },
            { icon: "Py", name: "Python", ready: false },
            { icon: "Jv", name: "Java", ready: false },
          ].map((l) => (
            <button
              key={l.name}
              disabled={!l.ready}
              onClick={() => l.ready && navigate(l.page!)}
              className={`group rounded-xl border border-line p-4 text-center transition-all ${
                l.ready ? "hover:border-white/20 hover:bg-white/[0.03] cursor-pointer" : "opacity-40 cursor-default"
              }`}
            >
              <div
                className="mx-auto w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono mb-2"
                style={l.ready ? { background: `${accent.hex}1a`, color: accent.hex } : { background: "rgba(255,255,255,0.04)", color: "#8a8a96" }}
              >
                {l.icon}
              </div>
              <div className="text-[12px] font-medium text-white">{l.name}</div>
              <div className="text-[10px] text-faint mt-0.5">{l.ready ? "Disponível" : "Em breve"}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * HtmlStudioPage — o estúdio HTML.
 * O usuário escreve HTML+JS (Web Audio API direto) e vê/executa num iframe.
 */
import { useState } from "react";
import { Globe, Play, X, Copy, Check, Download, Code2, Eye } from "lucide-react";
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

  const selectExample = (t: HtmlExample) => {
    setSelected(t);
    setCode(t.code);
    setPreview(false);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-lg`}>
          <Globe size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">🌐 Studio HTML</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Escreva HTML + Web Audio API e execute ao vivo num preview isolado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── SIDEBAR ── */}
        <aside className="lg:col-span-3 space-y-2">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
            📋 Exemplos HTML
          </h2>
          {HTML_EXAMPLES.map((t) => (
            <button
              key={t.id}
              onClick={() => selectExample(t)}
              className={`w-full text-left rounded-xl border p-3 transition-all ${
                selected.id === t.id
                  ? "border-white/30 bg-white/10"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.icon}</span>
                <span className={`text-sm font-bold ${selected.id === t.id ? "text-white" : "text-gray-200"}`}>
                  {t.name}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{t.description}</p>
            </button>
          ))}
        </aside>

        {/* ── PRINCIPAL ── */}
        <main className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{selected.icon}</span> {selected.name}
              </h2>
              <p className="text-xs text-gray-500">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-2 rounded-lg transition-colors">
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-2 rounded-lg transition-colors">
                <Download size={13} /> .html
              </button>
              <button
                onClick={() => { setPreview(true); setRunKey((k) => k + 1); }}
                className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-bold transition-colors bg-gradient-to-r ${accent.gradient} text-white`}
              >
                <Play size={13} fill="currentColor" /> Executar
              </button>
            </div>
          </div>

          {/* Tabs Código / Preview */}
          <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 w-fit border border-white/10">
            <button
              onClick={() => setPreview(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${!preview ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Code2 size={13} /> Código
            </button>
            <button
              onClick={() => setPreview(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${preview ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Eye size={13} /> Preview
            </button>
          </div>

          {!preview ? (
            <CodeEditor value={code} onChange={setCode} filename={`${selected.id}.html`} accent="#ec4899" minHeight={520} />
          ) : (
            <div className="rounded-2xl border border-emerald-500/20 overflow-hidden bg-white">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-emerald-500/20">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-emerald-400 font-mono font-bold">▶ Preview ao vivo — {selected.name}</span>
                <button onClick={() => setPreview(false)} className="ml-auto flex items-center gap-1 text-[11px] text-gray-400 hover:text-white">
                  <X size={12} /> Fechar
                </button>
              </div>
              <iframe
                key={runKey}
                srcDoc={code}
                title="preview"
                sandbox="allow-scripts"
                className="w-full bg-white"
                style={{ height: 520, border: "none" }}
              />
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <h3 className="text-sm font-bold text-white mb-3">💡 Dicas da Web Audio API</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                ["AudioContext", "O motor de áudio. Crie um para começar."],
                ["OscillatorNode", "Gera tons: sine, square, sawtooth, triangle."],
                ["GainNode", "Controla o volume e envelopes."],
                ["AnalyserNode", "Dados de frequência para visualização."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-lg border border-pink-500/15 bg-pink-500/5 p-3">
                  <div className="font-mono font-bold text-pink-400 mb-1">{t}</div>
                  <div className="text-gray-500 leading-snug">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

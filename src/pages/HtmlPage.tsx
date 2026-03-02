import { useState } from "react";
import { Globe, Download, Copy, Check, Play, X } from "lucide-react";
import { htmlTemplates } from "../data/templates";
import AudioPlayer from "../components/AudioPlayer";

export default function HtmlPage() {
  const [selected, setSelected] = useState(htmlTemplates[0]);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(htmlTemplates[0].code);
  const [preview, setPreview] = useState(false);

  const handleSelect = (t: typeof htmlTemplates[0]) => {
    setSelected(t);
    setCode(t.code);
    setCopied(false);
    setPreview(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selected.id + ".html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg">
          <Globe size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">🌐 HTML Musical</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Música no navegador com Web Audio API — execute diretamente no browser
          </p>
        </div>
      </div>

      {/* Info bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Templates", value: htmlTemplates.length, color: "text-pink-400" },
          { label: "API", value: "Web Audio", color: "text-rose-400" },
          { label: "Execução", value: "Browser", color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/3 border border-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── SIDEBAR ── */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            📋 Templates Disponíveis
          </h2>
          {htmlTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-150
                ${selected.id === t.id
                  ? "border-pink-500/50 bg-pink-500/10 shadow-md shadow-pink-900/20"
                  : "border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.preview?.split(" ")[0] ?? "🎵"}</span>
                <span className={`text-sm font-bold ${selected.id === t.id ? "text-pink-300" : "text-white"}`}>
                  {t.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full">
                  {t.preview}
                </span>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                  ▶ executável
                </span>
              </div>
            </button>
          ))}

          {/* Dica */}
          <div className="mt-4 rounded-xl border border-pink-500/20 bg-pink-500/5 p-4">
            <h3 className="text-xs font-bold text-pink-400 mb-2">💡 Como usar</h3>
            <ul className="text-xs text-gray-500 space-y-1 leading-relaxed">
              <li>• Clique em <span className="text-pink-300 font-semibold">▶ Executar</span> para ver ao vivo</li>
              <li>• Baixe o <code className="text-pink-300">.html</code> e abra no navegador</li>
              <li>• Funciona em qualquer browser moderno</li>
              <li>• Permite microfone para o Visualizador</li>
            </ul>
          </div>
        </div>

        {/* ── EDITOR + PREVIEW ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">{selected.name}</h2>
              <p className="text-xs text-gray-500">{selected.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 text-xs bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={13} />
                Baixar .html
              </button>
              <button
                onClick={() => setPreview(!preview)}
                className={`flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-colors font-bold
                  ${preview
                    ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300"
                    : "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300"
                  }`}
              >
                {preview ? <><X size={13} /> Fechar</> : <><Play size={13} /> Executar</>}
              </button>
            </div>
          </div>

          {/* Reprodutor de Som */}
          <AudioPlayer code={code} mode="html" templateId={selected.id} />

          {/* Tabs: Editor / Preview */}
          <div className="flex gap-1 bg-white/3 rounded-xl p-1 w-fit border border-white/5">
            <button
              onClick={() => setPreview(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${!preview ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              📝 Código
            </button>
            <button
              onClick={() => setPreview(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${preview ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              ▶ Preview
            </button>
          </div>

          {!preview ? (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-[#0d1117] flex flex-col flex-1">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/8">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-gray-500 font-mono">{selected.id}.html</span>
                <span className="ml-auto text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
                  🌐 HTML
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full bg-[#0d1117] text-pink-200 font-mono text-sm p-5 resize-none outline-none leading-relaxed"
                style={{ minHeight: 480 }}
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-green-500/20 overflow-hidden bg-white flex-1" style={{ minHeight: 520 }}>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-green-500/20">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-green-400 font-mono font-bold">▶ Preview ao vivo — {selected.name}</span>
              </div>
              <iframe
                srcDoc={code}
                className="w-full"
                style={{ height: 480, border: "none" }}
                title="preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── WEB AUDIO API REFERÊNCIA ── */}
      <div className="mt-10 rounded-2xl border border-white/5 bg-white/2 p-6">
        <h2 className="text-base font-bold text-white mb-4">🎧 Web Audio API — Conceitos-chave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "AudioContext", desc: "Motor principal do áudio. Tudo começa aqui.", color: "text-pink-400", bg: "bg-pink-500/5 border-pink-500/20" },
            { title: "OscillatorNode", desc: "Gera tons (sine, square, sawtooth, triangle).", color: "text-rose-400", bg: "bg-rose-500/5 border-rose-500/20" },
            { title: "GainNode", desc: "Controla o volume de um sinal de áudio.", color: "text-purple-400", bg: "bg-purple-500/5 border-purple-500/20" },
            { title: "AnalyserNode", desc: "Analisa frequências em tempo real para visualização.", color: "text-cyan-400", bg: "bg-cyan-500/5 border-cyan-500/20" },
          ].map((n) => (
            <div key={n.title} className={`rounded-xl border p-4 ${n.bg}`}>
              <div className={`text-sm font-mono font-bold ${n.color} mb-2`}>{n.title}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

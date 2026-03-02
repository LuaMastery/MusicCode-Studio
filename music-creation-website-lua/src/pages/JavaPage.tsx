import { useState } from "react";
import { Coffee, Download, Copy, Check } from "lucide-react";
import { javaTemplates } from "../data/templates";
import AudioPlayer from "../components/AudioPlayer";

export default function JavaPage() {
  const [selected, setSelected] = useState(javaTemplates[0]);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(javaTemplates[0].code);

  const handleSelect = (t: typeof javaTemplates[0]) => {
    setSelected(t);
    setCode(t.code);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selected.id + ".java";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-yellow-600 flex items-center justify-center shadow-lg">
          <Coffee size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">☕ Java Musical</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Síntese de áudio avançada com javax.sound e MIDI no Java
          </p>
        </div>
      </div>

      {/* Info bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Templates", value: javaTemplates.length, color: "text-orange-400" },
          { label: "API", value: "MIDI", color: "text-yellow-400" },
          { label: "Execução", value: "JVM", color: "text-gray-400" },
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
          {javaTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-150
                ${selected.id === t.id
                  ? "border-orange-500/50 bg-orange-500/10 shadow-md shadow-orange-900/20"
                  : "border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.preview?.split(" ")[0] ?? "🎵"}</span>
                <span className={`text-sm font-bold ${selected.id === t.id ? "text-orange-300" : "text-white"}`}>
                  {t.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
              <div className="mt-2">
                <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  {t.preview}
                </span>
              </div>
            </button>
          ))}

          {/* Dica */}
          <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
            <h3 className="text-xs font-bold text-orange-400 mb-2">💡 Como usar</h3>
            <ul className="text-xs text-gray-500 space-y-1 leading-relaxed">
              <li>• Salve o código como <code className="text-orange-300">NomeClasse.java</code></li>
              <li>• Compile: <code className="text-orange-300">javac Arquivo.java</code></li>
              <li>• Execute: <code className="text-orange-300">java Arquivo</code></li>
              <li>• Requer Java 17+ para switch expressions</li>
            </ul>
          </div>

          {/* Notas MIDI */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <h3 className="text-xs font-bold text-gray-400 mb-3">🎹 Notas MIDI</h3>
            <div className="grid grid-cols-2 gap-1">
              {[
                ["C4 = 60", "D4 = 62"],
                ["E4 = 64", "F4 = 65"],
                ["G4 = 67", "A4 = 69"],
                ["B4 = 71", "C5 = 72"],
              ].map(([a, b], i) => (
                <div key={i} className="contents">
                  <span className="text-xs font-mono text-orange-300">{a}</span>
                  <span className="text-xs font-mono text-orange-300">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EDITOR ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">{selected.name}</h2>
              <p className="text-xs text-gray-500">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 text-xs bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={13} />
                Baixar .java
              </button>
            </div>
          </div>

          {/* Reprodutor de Som */}
          <AudioPlayer code={code} mode="java" templateId={selected.id} />

          <div className="rounded-2xl border border-white/8 overflow-hidden bg-[#0d1117] flex flex-col flex-1">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/8">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-gray-500 font-mono">{selected.id}.java</span>
              <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                ☕ Java
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-[#0d1117] text-orange-200 font-mono text-sm p-5 resize-none outline-none leading-relaxed"
              style={{ minHeight: 480 }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* ── APIS JAVA ── */}
      <div className="mt-10 rounded-2xl border border-white/5 bg-white/2 p-6">
        <h2 className="text-base font-bold text-white mb-4">📦 APIs Java para Música</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "javax.sound.sampled",
              desc: "Captura, processa e toca áudio sampled (PCM). Ideal para gerar ondas senoidais.",
              color: "text-orange-400",
              bg: "bg-orange-500/5 border-orange-500/20",
            },
            {
              title: "javax.sound.midi",
              desc: "Interface MIDI completa: Sequencer, Synthesizer, canais e eventos de nota.",
              color: "text-yellow-400",
              bg: "bg-yellow-500/5 border-yellow-500/20",
            },
            {
              title: "javax.swing",
              desc: "GUI para criar pianos interativos e interfaces visuais para seus instrumentos.",
              color: "text-cyan-400",
              bg: "bg-cyan-500/5 border-cyan-500/20",
            },
          ].map((api) => (
            <div key={api.title} className={`rounded-xl border p-4 ${api.bg}`}>
              <div className={`text-sm font-mono font-bold ${api.color} mb-2`}>{api.title}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{api.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

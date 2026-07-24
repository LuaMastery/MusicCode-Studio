/**
 * StudioPage — o estúdio JavaScript.
 * Aqui o usuário escreve código usando a API musical e aperta Tocar para ouvir.
 */
import { useEffect, useState } from "react";
import { Code2, Copy, Check, Download, RotateCcw } from "lucide-react";
import { CodeEditor } from "../components/CodeEditor";
import { ConsolePanel } from "../components/ConsolePanel";
import { Visualizer } from "../components/Visualizer";
import { TransportBar } from "../components/TransportBar";
import { TEMPLATES, type Template } from "../data/templates";
import { engine } from "../engine/engine";
import { runCode, stopAll } from "../engine/runner";
import { useSettings } from "../context/SettingsContext";

function formatArg(a: unknown): string {
  if (typeof a === "string") return a;
  if (a === null || a === undefined) return String(a);
  if (typeof a === "object") {
    try { return JSON.stringify(a); } catch { return String(a); }
  }
  return String(a);
}

export function StudioPage() {
  const { accent } = useSettings();
  const [selected, setSelected] = useState<Template>(TEMPLATES[0]);
  const [code, setCode] = useState<string>(TEMPLATES[0].code);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.8);
  const [lines, setLines] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    engine.setBpm(bpm);
  }, [bpm]);
  useEffect(() => {
    engine.setVolume(volume);
  }, [volume]);

  const selectTemplate = (t: Template) => {
    stopAll();
    setPlaying(false);
    setSelected(t);
    setCode(t.code);
    setLines([]);
  };

  const handlePlay = async () => {
    if (playing) return;
    setLines([]);
    engine.setBpm(bpm);
    engine.setVolume(volume);
    await runCode(code, {
      onLog: (...args: unknown[]) =>
        setLines((prev) => [...prev, args.map(formatArg).join("  ")]),
      onPlayingChange: setPlaying,
    });
  };

  const handleStop = () => {
    stopAll();
    setPlaying(false);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.id}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCode(selected.code);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-lg`}>
          <Code2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">🎹 Studio JavaScript</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Escreva código, aperte <span className={accent.text + " font-semibold"}>Tocar</span> e ouça sua música em tempo real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── SIDEBAR: templates ── */}
        <aside className="lg:col-span-3 space-y-2">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
            📋 Exemplos
          </h2>
          <div className="space-y-2 lg:max-h-[640px] lg:overflow-auto custom-scroll lg:pr-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
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
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] bg-white/5 text-gray-500 border border-white/10 px-1.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── PRINCIPAL ── */}
        <main className="lg:col-span-9 space-y-4">
          {/* Barra de ações */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{selected.icon}</span> {selected.name}
              </h2>
              <p className="text-xs text-gray-500">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-2 rounded-lg transition-colors">
                <RotateCcw size={13} /> Restaurar
              </button>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-2 rounded-lg transition-colors">
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-2 rounded-lg transition-colors">
                <Download size={13} /> .js
              </button>
            </div>
          </div>

          <TransportBar
            playing={playing}
            onPlay={handlePlay}
            onStop={handleStop}
            bpm={bpm}
            onBpmChange={setBpm}
            volume={volume}
            onVolumeChange={setVolume}
            accentGradient={accent.gradient}
          />

          <CodeEditor value={code} onChange={setCode} filename={`${selected.id}.js`} accent="#fbbf24" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConsolePanel lines={lines} onClear={() => setLines([])} />
            <Visualizer active={playing} accent="#a855f7" />
          </div>
        </main>
      </div>
    </div>
  );
}

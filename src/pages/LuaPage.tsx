import { useState } from "react";
import { Moon, Download, Copy, Check } from "lucide-react";
import { luaTemplates } from "../data/templates";
import AudioPlayer from "../components/AudioPlayer";

export default function LuaPage() {
  const [selected, setSelected] = useState(luaTemplates[0]);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(luaTemplates[0].code);

  const handleSelect = (t: typeof luaTemplates[0]) => {
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
    a.download = selected.id + ".lua";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
          <Moon size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">🌙 Lua Musical</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Crie melodias, ritmos e escalas usando a linguagem de script Lua
          </p>
        </div>
      </div>

      {/* Info bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Templates", value: luaTemplates.length, color: "text-blue-400" },
          { label: "Tipo", value: "Script", color: "text-cyan-400" },
          { label: "Execução", value: "Local", color: "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/3 border border-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── SIDEBAR: lista de templates ── */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            📋 Templates Disponíveis
          </h2>
          {luaTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-150
                ${selected.id === t.id
                  ? "border-blue-500/50 bg-blue-500/10 shadow-md shadow-blue-900/20"
                  : "border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.preview?.split(" ")[0] ?? "🎵"}</span>
                <span className={`text-sm font-bold ${selected.id === t.id ? "text-blue-300" : "text-white"}`}>
                  {t.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
              <div className="mt-2">
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  {t.preview}
                </span>
              </div>
            </button>
          ))}

          {/* Dica */}
          <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <h3 className="text-xs font-bold text-yellow-400 mb-2">💡 Como usar</h3>
            <ul className="text-xs text-gray-500 space-y-1 leading-relaxed">
              <li>• Copie o código e salve como <code className="text-yellow-300">.lua</code></li>
              <li>• Instale o Lua: <code className="text-yellow-300">lua.org</code></li>
              <li>• Execute: <code className="text-yellow-300">lua arquivo.lua</code></li>
            </ul>
          </div>
        </div>

        {/* ── EDITOR ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Barra de ações */}
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
                className="flex items-center gap-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={13} />
                Baixar .lua
              </button>
            </div>
          </div>

          {/* Reprodutor de Som */}
          <AudioPlayer code={code} mode="lua" templateId={selected.id} />

          {/* Janela de código */}
          <div className="rounded-2xl border border-white/8 overflow-hidden bg-[#0d1117] flex flex-col flex-1">
            {/* Barra estilo editor */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/8">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-gray-500 font-mono">{selected.id}.lua</span>
              <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                🌙 Lua
              </span>
            </div>
            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-[#0d1117] text-blue-200 font-mono text-sm p-5 resize-none outline-none leading-relaxed"
              style={{ minHeight: 480 }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* ── REFERÊNCIA MUSICAL ── */}
      <div className="mt-10 rounded-2xl border border-white/5 bg-white/2 p-6">
        <h2 className="text-base font-bold text-white mb-4">🎼 Referência: Frequências das Notas (Oitava 4)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            { nota: "Dó (C)", freq: "261.63", cor: "text-red-400" },
            { nota: "Ré (D)", freq: "293.66", cor: "text-orange-400" },
            { nota: "Mi (E)", freq: "329.63", cor: "text-yellow-400" },
            { nota: "Fá (F)", freq: "349.23", cor: "text-green-400" },
            { nota: "Sol (G)", freq: "392.00", cor: "text-cyan-400" },
            { nota: "Lá (A)", freq: "440.00", cor: "text-blue-400" },
            { nota: "Si (B)", freq: "493.88", cor: "text-purple-400" },
          ].map((n) => (
            <div key={n.nota} className="bg-white/3 rounded-xl p-3 text-center border border-white/5">
              <div className={`text-sm font-black ${n.cor}`}>{n.nota}</div>
              <div className="text-xs text-gray-500 mt-1 font-mono">{n.freq} Hz</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

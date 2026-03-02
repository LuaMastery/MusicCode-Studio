import { useState } from "react";
import { PenSquare, Download, Copy, Check, Play, X, Trash2 } from "lucide-react";
import type { Language } from "../data/templates";
import AudioPlayer from "../components/AudioPlayer";

const LANGS: { id: Language; label: string; emoji: string; ext: string; color: string; active: string; placeholder: string }[] = [
  {
    id: "lua",
    label: "Lua",
    emoji: "🌙",
    ext: "lua",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    active: "from-blue-600 to-cyan-600",
    placeholder: `-- 🌙 Meu código Lua
-- Defina notas e toque sua música!

local notas = {
  Do  = 261.63,
  Re  = 293.66,
  Mi  = 329.63,
  Sol = 392.00,
  La  = 440.00,
}

-- Sequência da melodia
local melodia = { "Do", "Re", "Mi", "Sol", "La" }

for _, n in ipairs(melodia) do
  print("🎵 Tocando: " .. n .. " (" .. notas[n] .. " Hz)")
end`,
  },
  {
    id: "java",
    label: "Java",
    emoji: "☕",
    ext: "java",
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    active: "from-orange-600 to-yellow-600",
    placeholder: `// ☕ Meu código Java
import javax.sound.midi.*;

public class MinhaMusica {
    public static void main(String[] args) throws Exception {
        Synthesizer synth = MidiSystem.getSynthesizer();
        synth.open();

        MidiChannel canal = synth.getChannels()[0];
        canal.programChange(0); // Piano Acústico

        // Toca Dó Ré Mi Fá Sol
        int[] notas = {60, 62, 64, 65, 67};
        for (int nota : notas) {
            canal.noteOn(nota, 90);
            Thread.sleep(400);
            canal.noteOff(nota);
        }

        synth.close();
        System.out.println("✅ Concluído!");
    }
}`,
  },
  {
    id: "html",
    label: "HTML",
    emoji: "🌐",
    ext: "html",
    color: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    active: "from-pink-600 to-rose-600",
    placeholder: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🎵 Minha Música</title>
  <style>
    body { background:#0a0a14; color:white; font-family:sans-serif;
           display:flex; flex-direction:column; align-items:center;
           justify-content:center; height:100vh; gap:20px; }
    button { padding:14px 32px; font-size:18px; border:none;
             border-radius:50px; cursor:pointer;
             background:linear-gradient(135deg,#7c3aed,#ec4899);
             color:white; font-weight:bold; }
    button:hover { opacity:0.85; }
  </style>
</head>
<body>
  <h1>🎵 Minha Música</h1>
  <button onclick="tocar()">▶ Tocar Nota</button>

  <script>
    const ctx = new AudioContext();

    function tocar() {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 440; // Lá (A4)
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    }
  </script>
</body>
</html>`,
  },
];

const SNIPPETS: { lang: Language; label: string; desc: string; code: string }[] = [
  {
    lang: "lua",
    label: "🌙 Nota Lua",
    desc: "Toca uma nota simples",
    code: `local freq = 440 -- Lá (A4)
local duracao = 0.5
print(string.format("🎵 %.2f Hz por %.1fs", freq, duracao))
local t = os.clock()
while os.clock() - t < duracao do end`,
  },
  {
    lang: "java",
    label: "☕ Nota Java",
    desc: "Toca via MIDI",
    code: `MidiChannel canal = synth.getChannels()[0];
canal.noteOn(69, 100); // Lá (A4)
Thread.sleep(500);
canal.noteOff(69);`,
  },
  {
    lang: "html",
    label: "🌐 Nota HTML",
    desc: "Web Audio API",
    code: `const ctx = new AudioContext();
const osc = ctx.createOscillator();
osc.frequency.value = 440; // Lá
osc.connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.5);`,
  },
  {
    lang: "lua",
    label: "🌙 Escala Lua",
    desc: "Dó Maior",
    code: `local escala = {261.63,293.66,329.63,349.23,392,440,493.88}
for i, freq in ipairs(escala) do
  print("Nota " .. i .. ": " .. freq .. " Hz")
end`,
  },
  {
    lang: "java",
    label: "☕ Acorde Java",
    desc: "Acorde de Dó",
    code: `// Acorde de Dó Maior (C E G)
int[] acorde = {60, 64, 67};
for (int n : acorde) canal.noteOn(n, 80);
Thread.sleep(1000);
for (int n : acorde) canal.noteOff(n);`,
  },
  {
    lang: "html",
    label: "🌐 Oscilador",
    desc: "Com envelope ADSR",
    code: `const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = "sawtooth";
osc.frequency.value = 220;
gain.gain.setValueAtTime(0, ctx.currentTime);
gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
osc.connect(gain); gain.connect(ctx.destination);
osc.start(); osc.stop(ctx.currentTime + 1);`,
  },
];

export default function EditorPage() {
  const [lang, setLang] = useState<Language>("html");
  const [code, setCode] = useState(LANGS.find((l) => l.id === "html")!.placeholder);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);

  const currentLang = LANGS.find((l) => l.id === lang)!;

  const handleLangChange = (l: Language) => {
    setLang(l);
    setCode(LANGS.find((x) => x.id === l)!.placeholder);
    setCopied(false);
    setPreview(false);
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
    a.download = `minha-musica.${currentLang.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addSnippet = (s: typeof SNIPPETS[0]) => {
    setLang(s.lang);
    setCode((prev) => (prev.trim() ? prev + "\n\n" + s.code : s.code));
    setPreview(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
          <PenSquare size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">✏️ Meu Código</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Editor livre — escreva, teste e baixe seu código musical
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── SIDEBAR ── */}
        <div className="space-y-5">

          {/* Seletor de linguagem */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              🗂️ Linguagem
            </h2>
            <div className="flex flex-col gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLangChange(l.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all
                    ${lang === l.id
                      ? `bg-gradient-to-r ${l.active} text-white shadow-md border-transparent`
                      : `${l.color} hover:bg-white/5 hover:text-white`
                    }`}
                >
                  <span className="text-base">{l.emoji}</span>
                  {l.label}
                  <span className="ml-auto text-xs opacity-60 font-mono">.{l.ext}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Snippets */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              ⚡ Snippets Rápidos
            </h2>
            <div className="space-y-2">
              {SNIPPETS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => addSnippet(s)}
                  className="w-full text-left bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 rounded-xl p-3 transition-all"
                >
                  <div className="text-xs font-bold text-white mb-0.5">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dica */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <h3 className="text-xs font-bold text-green-400 mb-2">💡 Dica</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Selecione <span className="text-pink-300 font-semibold">HTML</span> e clique em{" "}
              <span className="text-green-300 font-semibold">▶ Executar</span> para ver o resultado ao vivo no browser!
            </p>
          </div>
        </div>

        {/* ── EDITOR PRINCIPAL ── */}
        <div className="lg:col-span-3 flex flex-col gap-3">

          {/* Barra de ações */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${currentLang.color}`}>
                {currentLang.emoji} {currentLang.label}
              </span>
              <span className="text-xs text-gray-600 font-mono">minha-musica.{currentLang.ext}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { setCode(""); setPreview(false); }}
                className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={12} />
                Limpar
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-2 rounded-lg transition-colors"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-lg transition-colors"
              >
                <Download size={12} />
                Baixar
              </button>
              {lang === "html" && (
                <button
                  onClick={() => setPreview(!preview)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors font-bold
                    ${preview
                      ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300"
                      : "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300"
                    }`}
                >
                  {preview ? <><X size={12} /> Fechar</> : <><Play size={12} /> Executar</>}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          {lang === "html" && (
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
          )}

          {/* Reprodutor de Som */}
          <AudioPlayer code={code} mode={lang} templateId={`editor-${lang}`} />

          {/* Editor / Preview */}
          {!preview || lang !== "html" ? (
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-[#0d1117] flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/8">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-gray-500 font-mono">
                  minha-musica.{currentLang.ext}
                </span>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${currentLang.color}`}>
                  {currentLang.emoji} {currentLang.label}
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`flex-1 w-full bg-[#0d1117] font-mono text-sm p-5 resize-none outline-none leading-relaxed
                  ${lang === "lua" ? "text-blue-200" : lang === "java" ? "text-orange-200" : "text-pink-200"}`}
                style={{ minHeight: 540 }}
                spellCheck={false}
                placeholder={currentLang.placeholder}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-green-500/20 overflow-hidden bg-white" style={{ minHeight: 580 }}>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-green-500/20">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-green-400 font-mono font-bold">▶ Preview ao vivo</span>
              </div>
              <iframe
                srcDoc={code}
                className="w-full"
                style={{ height: 540, border: "none" }}
                title="editor-preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

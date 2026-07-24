/**
 * HomePage — landing page do MusicCode Studio.
 */
import { Music2, Zap, Code2, Globe, ArrowRight, Sparkles, Smartphone } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import type { Page } from "../App";

const ACTIVE_LANGS = [
  { icon: "🟨", name: "JavaScript", desc: "Studio com API musical (play, sleep, tambor...)", page: "studio" as Page, color: "from-yellow-500 to-amber-500", border: "border-yellow-500/30", ready: true },
  { icon: "🌐", name: "HTML", desc: "Web Audio API direto com preview ao vivo", page: "html" as Page, color: "from-pink-500 to-rose-500", border: "border-pink-500/30", ready: true },
];

const COMING_LANGS = [
  { icon: "🌙", name: "Lua", desc: "Em breve" },
  { icon: "🐍", name: "Python", desc: "Em breve" },
  { icon: "☕", name: "Java", desc: "Em breve" },
];

export function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  const { accent } = useSettings();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      {/* HERO */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-semibold text-gray-300 mb-6 tracking-widest uppercase`}>
          <Zap size={12} className={accent.text} /> Música + Código = Arte
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
          Crie Músicas com{" "}
          <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
            Programação
          </span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Um studio no navegador (e no celular!) para compor, sintetizar e ouvir música
          usando código. Comece com{" "}
          <span className="text-yellow-400 font-semibold">JavaScript</span> e{" "}
          <span className="text-pink-400 font-semibold">HTML</span> — é só escrever e apertar tocar.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("studio")}
            className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base bg-gradient-to-r ${accent.gradient} text-white shadow-xl hover:opacity-90 active:scale-95 transition-all`}
          >
            <Code2 size={18} /> Começar a criar
          </button>
          <button
            onClick={() => navigate("html")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
          >
            <Globe size={18} /> Ver Studio HTML
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600 flex-wrap">
          <span className="flex items-center gap-1"><Smartphone size={12} /> Site + App (Capacitor)</span>
          <span className="flex items-center gap-1"><Music2 size={12} /> Web Audio API</span>
          <span className="flex items-center gap-1"><Sparkles size={12} /> API estilo Sonic Pi</span>
        </div>
      </div>

      {/* LINGUAGENS */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-white text-center mb-2">🎵 Linguagens</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Disponíveis agora — mais chegando em breve.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {ACTIVE_LANGS.map((l) => (
            <button
              key={l.name}
              onClick={() => navigate(l.page)}
              className={`text-left rounded-2xl p-6 border ${l.border} bg-gradient-to-br ${l.color} bg-opacity-10 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{l.icon}</span>
                <div>
                  <div className="text-lg font-black text-white">{l.name}</div>
                  <div className="text-[11px] text-emerald-300 font-semibold">✓ Disponível agora</div>
                </div>
                <ArrowRight size={18} className="ml-auto text-white/70" />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{l.desc}</p>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {COMING_LANGS.map((l) => (
            <div key={l.name} className="rounded-2xl p-4 border border-white/5 bg-white/[0.02] text-center opacity-60">
              <div className="text-2xl mb-1">{l.icon}</div>
              <div className="text-sm font-bold text-white">{l.name}</div>
              <div className="text-[10px] text-gray-500">{l.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-white text-center mb-8">🚀 Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: "01", icon: "✍️", title: "Escolha um exemplo", desc: "Comece com um template pronto (melodia, bateria, arpejo...) no Studio JavaScript." },
            { n: "02", icon: "🎛️", title: "Edite e ajuste", desc: "Mude notas, BPM, sintetizadores e adicione tambores. Tudo com código simples." },
            { n: "03", icon: "▶️", title: "Aperte Tocar", desc: "Ouça sua música em tempo real, visualize as frequências e veja os logs no console." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center flex flex-col items-center gap-2">
              <div className="text-4xl">{s.icon}</div>
              <div className={`text-xs font-black uppercase tracking-widest ${accent.text}`}>Passo {s.n}</div>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLO DE CÓDIGO */}
      <section className="mb-16">
        <div className="rounded-3xl border border-white/10 bg-[#0d1117] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#161b22] border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-gray-500 font-mono">melodia.js</span>
          </div>
          <pre className="p-6 text-sm font-mono text-gray-300 overflow-auto leading-relaxed"><code><span className="text-purple-400">bpm</span>(<span className="text-amber-300">120</span>)
<span className="text-purple-400">synth</span>(<span className="text-emerald-400">"piano"</span>)

<span className="text-purple-400">play</span>(<span className="text-emerald-400">"C4"</span>);  <span className="text-purple-400">sleep</span>(<span className="text-amber-300">1</span>)
<span className="text-purple-400">play</span>(<span className="text-emerald-400">"E4"</span>);  <span className="text-purple-400">sleep</span>(<span className="text-amber-300">1</span>)
<span className="text-purple-400">play</span>([<span className="text-emerald-400">"G4"</span>, <span className="text-emerald-400">"C5"</span>])  <span className="text-sky-400">// acorde!</span></code></pre>
        </div>
        <p className="text-center text-xs text-gray-600 mt-3">Assim é simples: <span className="text-yellow-400">play()</span> toca, <span className="text-yellow-400">sleep()</span> espera, e um array vira acorde.</p>
      </section>

      {/* CTA FINAL */}
      <section className="text-center">
        <div className={`rounded-3xl bg-gradient-to-br ${accent.gradient} p-10`}>
          <h2 className="text-3xl font-black text-white mb-3">Pronto para compor? 🎶</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Abra o Studio e crie sua primeira música com código em segundos.</p>
          <button
            onClick={() => navigate("studio")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base bg-white text-gray-900 hover:scale-105 active:scale-95 transition-all"
          >
            <Music2 size={18} /> Abrir o Studio
          </button>
        </div>
      </section>
    </div>
  );
}

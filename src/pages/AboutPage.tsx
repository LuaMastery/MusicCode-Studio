/**
 * AboutPage — sobre o projeto + referência da API musical.
 */
import { BookOpen, Github, Smartphone } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import type { Page } from "../App";

const API_REF: { fn: string; sig: string; desc: string; cls: string }[] = [
  { fn: "play", sig: 'play("C4")  ·  play(["C4","E4","G4"])', desc: "Toca uma nota. Com array vira acorde (simultâneo).", cls: "text-yellow-400" },
  { fn: "sleep", sig: "sleep(1)  ·  await sleep(0.5)", desc: "Espera N batidas. Use await dentro de loops.", cls: "text-amber-400" },
  { fn: "tambor", sig: 'tambor("bumbo")  ·  tambor("caixa")', desc: "Percussão: bumbo, caixa, chimbal, palma, tom, prato.", cls: "text-rose-400" },
  { fn: "synth", sig: 'synth("piano")', desc: "Sintetizador: piano, pluck, bass, pad, fm, prophet, sine...", cls: "text-violet-400" },
  { fn: "bpm", sig: "bpm(120)", desc: "Define o andamento (batidas por minuto).", cls: "text-cyan-400" },
  { fn: "volume", sig: "volume(0.8)", desc: "Volume principal de 0 a 1.", cls: "text-emerald-400" },
  { fn: "sequencia", sig: 'sequencia(["C4","D4","E4"], 0.5)', desc: "Distribui notas no tempo (escada) avançando o cursor.", cls: "text-sky-400" },
  { fn: "escala", sig: 'escala("C4", "major")', desc: "Devolve as notas de uma escala (maior, menor, blues...).", cls: "text-teal-400" },
  { fn: "acordeNotas", sig: 'acordeNotas("C4", "major")', desc: "Devolve as notas de um acorde (sem tocar).", cls: "text-fuchsia-400" },
  { fn: "repetir", sig: "await repetir(4, async i => { ... })", desc: "Repete uma função N vezes.", cls: "text-orange-400" },
  { fn: "escolher", sig: "escolher([1,2,3])", desc: "Escolhe um elemento aleatório do array.", cls: "text-lime-400" },
  { fn: "print", sig: 'print("olá")', desc: "Mostra uma mensagem no console.", cls: "text-gray-300" },
];

export function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  const { accent } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-lg`}>
          <BookOpen size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">📚 Sobre & Referência</h1>
          <p className="text-gray-400 text-sm mt-0.5">Tudo sobre o MusicCode Studio e sua API musical.</p>
        </div>
      </div>

      {/* Sobre */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">O que é o MusicCode Studio?</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-3">
          É uma plataforma para <span className="text-white font-semibold">criar música usando código</span>.
          Inspirado em ferramentas como o <span className={accent.text + " font-semibold"}>Sonic Pi</span>, ele
          transforma JavaScript (e em breve Lua, Python e Java) em som — com um motor de áudio próprio
          construído sobre a <span className="text-white font-semibold">Web Audio API</span>.
        </p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Funciona como <span className="text-white font-semibold">site</span> e também pode virar um
          <span className="text-white font-semibold"> aplicativo nativo</span> (Android/iOS) graças ao
          <span className="text-white font-semibold"> Capacitor</span>, reaproveitando exatamente o mesmo código.
        </p>
      </section>

      {/* Referência da API */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1">🎹 Referência da API musical</h2>
        <p className="text-xs text-gray-500 mb-5">Funções disponíveis no Studio JavaScript (com aliases em português e inglês).</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {API_REF.map((a) => (
            <div key={a.fn} className="rounded-xl border border-white/5 bg-black/30 p-4">
              <div className={`font-mono font-bold text-sm ${a.cls} mb-1`}>{a.fn}()</div>
              <div className="font-mono text-[11px] text-gray-500 mb-2 break-all">{a.sig}</div>
              <div className="text-xs text-gray-400 leading-snug">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* App nativo */}
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Virar aplicativo (Capacitor)</h2>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed mb-3">
          O mesmo projeto pode ser empacotado como app nativo. Após <code className="text-emerald-300">npm run build</code>:
        </p>
        <pre className="text-xs font-mono text-gray-300 bg-black/40 rounded-xl p-4 overflow-auto"><code>{`npx cap sync
npx cap add android   # ou: npx cap add ios
npx cap open android  # abre no Android Studio para gerar o APK`}</code></pre>
        <p className="text-xs text-gray-500 mt-2">Veja instruções completas no arquivo <code className="text-emerald-300">DEPLOY.md</code>.</p>
      </section>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => navigate("studio")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${accent.gradient}`}
        >
          Abrir o Studio
        </button>
        <a
          href="https://github.com/LuaMastery/MusicCode-Studio"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
        >
          <Github size={16} /> Ver no GitHub
        </a>
      </div>
    </div>
  );
}

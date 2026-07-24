/**
 * AboutPage — sobre o projeto + referência da API, minimalista.
 */
import { ArrowRight, Smartphone } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import type { Page } from "../App";

const API_REF: { fn: string; sig: string; desc: string }[] = [
  { fn: "play", sig: 'play("C4") · play(["C4","E4","G4"])', desc: "Nota ou acorde (array vira acorde)." },
  { fn: "sleep", sig: "await sleep(1)", desc: "Espera N batidas (use await em loops)." },
  { fn: "tambor", sig: 'tambor("bumbo")', desc: "bumbo, caixa, chimbal, palma, tom." },
  { fn: "synth", sig: 'synth("piano")', desc: "piano, pluck, bass, pad, fm, prophet..." },
  { fn: "bpm", sig: "bpm(120)", desc: "Define o andamento." },
  { fn: "sequencia", sig: "sequencia([...], 0.5)", desc: "Notas em escada." },
  { fn: "escala", sig: 'escala("C4","major")', desc: "Notas de uma escala." },
  { fn: "repetir", sig: "await repetir(4, async i => {})", desc: "Repete N vezes." },
  { fn: "escolher", sig: "escolher([1,2,3])", desc: "Elemento aleatório." },
  { fn: "print", sig: 'print("olá")', desc: "Mostra no terminal." },
];

export function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  const { accent } = useSettings();

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Sobre & Referência</h1>
      <p className="text-muted leading-relaxed mb-12 max-w-2xl">
        O MusicCode Studio é uma plataforma para <span className="text-white">criar música usando código</span>.
        Inspirado no <span style={{ color: accent.hex }}>Sonic Pi</span>, transforma JavaScript e HTML em som —
        com um motor de áudio próprio sobre a Web Audio API. Funciona como site e como app nativo (Capacitor).
      </p>

      {/* API */}
      <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-faint mb-4">Referência da API musical</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-14">
        {API_REF.map((a) => (
          <div key={a.fn} className="rounded-xl border border-line bg-card p-4">
            <div className="font-mono font-semibold text-[13px] mb-1" style={{ color: accent.hex }}>{a.fn}()</div>
            <div className="font-mono text-[11px] text-faint mb-2 break-all">{a.sig}</div>
            <div className="text-[12px] text-muted leading-snug">{a.desc}</div>
          </div>
        ))}
      </div>

      {/* App nativo */}
      <div className="rounded-2xl border border-line bg-card p-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={17} style={{ color: accent.hex }} />
          <h2 className="text-base font-bold text-white">Virar aplicativo</h2>
        </div>
        <p className="text-[13px] text-muted mb-3">O mesmo projeto vira um app Android/iOS via Capacitor. Após o build:</p>
        <pre className="text-[12px] font-mono text-[#c4c4cc] bg-ink rounded-lg p-4 overflow-x-auto border border-line"><code>{`npm run build
npx cap add android && npx cap sync
npx cap open android   # gera o APK`}</code></pre>
      </div>

      <button
        onClick={() => navigate("studio")}
        className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:scale-[1.03]"
        style={{ background: accent.hex }}
      >
        Abrir o Studio <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

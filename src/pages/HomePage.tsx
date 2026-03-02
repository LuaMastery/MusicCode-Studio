import { Moon, Coffee, Globe, PenSquare, Music2, Zap, Star } from "lucide-react";
import type { Page } from "../App";

interface Props {
  navigate: (p: Page) => void;
}

const CARDS = [
  {
    id: "lua" as Page,
    emoji: "🌙",
    icon: <Moon size={22} />,
    title: "Lua",
    subtitle: "Scripting Musical",
    description: "Crie melodias, ritmos e escalas musicais usando a linguagem Lua. Veja o código em ação com templates prontos.",
    color: "from-blue-600 to-cyan-600",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    features: ["Melodias com frequências", "Ritmos e BPM", "Escalas musicais"],
    count: 3,
  },
  {
    id: "java" as Page,
    emoji: "☕",
    icon: <Coffee size={22} />,
    title: "Java",
    subtitle: "Síntese Avançada",
    description: "Utilize a API de som do Java para sintetizar tons, criar sequenciadores MIDI e pianos interativos.",
    color: "from-orange-600 to-yellow-600",
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "text-orange-300 bg-orange-500/15 border-orange-500/30",
    features: ["javax.sound.sampled", "MIDI Sequencer", "Piano Virtual Swing"],
    count: 3,
  },
  {
    id: "html" as Page,
    emoji: "🌐",
    icon: <Globe size={22} />,
    title: "HTML",
    subtitle: "Música no Navegador",
    description: "Use a Web Audio API para criar pianos interativos, visualizadores de música e beat makers direto no browser.",
    color: "from-pink-600 to-rose-600",
    border: "border-pink-500/30",
    bg: "bg-pink-500/5",
    badge: "text-pink-300 bg-pink-500/15 border-pink-500/30",
    features: ["Piano interativo", "Visualizador de áudio", "Beat Maker 16-steps"],
    count: 3,
  },
  {
    id: "editor" as Page,
    emoji: "✏️",
    icon: <PenSquare size={22} />,
    title: "Meu Código",
    subtitle: "Editor Livre",
    description: "Escreva seu próprio código musical em Lua, Java ou HTML. Execute previews de HTML e baixe seus arquivos.",
    color: "from-green-600 to-emerald-600",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "text-green-300 bg-green-500/15 border-green-500/30",
    features: ["Editor de código livre", "Preview ao vivo (HTML)", "Download do arquivo"],
    count: null,
  },
];

const STATS = [
  { label: "Templates", value: "9", icon: <Star size={16} />, color: "text-yellow-400" },
  { label: "Linguagens", value: "3", icon: <Music2 size={16} />, color: "text-purple-400" },
  { label: "Web Audio", value: "API", icon: <Zap size={16} />, color: "text-pink-400" },
];

export default function HomePage({ navigate }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* ── HERO ── */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-300 mb-6 tracking-widest uppercase">
          <Zap size={12} />
          Música + Código = Arte
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
          Crie Músicas com{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Programação
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Explore três linguagens diferentes — <span className="text-blue-400 font-semibold">Lua</span>,{" "}
          <span className="text-orange-400 font-semibold">Java</span> e{" "}
          <span className="text-pink-400 font-semibold">HTML</span> — para compor,
          sintetizar e visualizar música de formas únicas.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 flex-wrap">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={s.color}>{s.icon}</span>
              <span className="text-2xl font-black text-white">{s.value}</span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CARDS DE LINGUAGEM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        {CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => navigate(card.id)}
            className={`text-left group rounded-2xl border ${card.border} ${card.bg} p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-900/20`}
          >
            {/* Topo */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                {card.icon}
              </div>
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full border ${card.badge}`}>
                {card.count !== null ? `${card.count} templates` : "Editor livre"}
              </div>
            </div>

            {/* Título */}
            <div className="mb-1 flex items-center gap-2">
              <span className="text-2xl font-black text-white">{card.emoji} {card.title}</span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{card.subtitle}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{card.description}</p>

            {/* Features */}
            <ul className="space-y-1.5">
              {card.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className={`mt-5 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r ${card.color} group-hover:underline`}>
              Explorar →
            </div>
          </button>
        ))}
      </div>

      {/* ── COMO FUNCIONA ── */}
      <div className="rounded-2xl border border-white/5 bg-white/2 p-8">
        <h2 className="text-xl font-black text-white mb-8 text-center">
          🎯 Como Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Escolha a Linguagem",
              desc: "Selecione entre Lua, Java ou HTML conforme o que quer criar.",
              icon: "🎯",
            },
            {
              step: "02",
              title: "Explore os Templates",
              desc: "Cada linguagem tem templates prontos e comentados para você estudar e modificar.",
              icon: "📋",
            },
            {
              step: "03",
              title: "Execute ou Baixe",
              desc: "Templates HTML rodam diretamente no browser. Lua e Java podem ser baixados e executados localmente.",
              icon: "🚀",
            },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-3">
              <div className="text-4xl">{s.icon}</div>
              <div className="text-xs font-black text-purple-500 tracking-widest">PASSO {s.step}</div>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

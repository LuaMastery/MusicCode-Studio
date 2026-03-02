import { BookOpen, Music, Zap, Globe } from "lucide-react";

const tips = [
  {
    icon: <Music size={16} className="text-purple-400" />,
    title: "Lua para Música",
    text: "Lua é leve e perfeita para scripts musicais. Use tabelas para sequências, funções para instrumentos e os.clock() para tempo.",
  },
  {
    icon: <Zap size={16} className="text-orange-400" />,
    title: "Java Sound API",
    text: "Java oferece javax.sound.midi e javax.sound.sampled para síntese e MIDI. Ideal para aplicações musicais robustas.",
  },
  {
    icon: <Globe size={16} className="text-pink-400" />,
    title: "Web Audio API",
    text: "No HTML, use AudioContext, OscillatorNode e AnalyserNode para criar e visualizar sons diretamente no browser.",
  },
  {
    icon: <BookOpen size={16} className="text-blue-400" />,
    title: "Teoria Musical em Código",
    text: "Frequências: Lá = 440 Hz. Cada oitava dobra a frequência. Use 2^(n/12) para calcular qualquer semitom.",
  },
];

export default function InfoPanel() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
        💡 Dicas Rápidas
      </h3>
      {tips.map((tip, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-purple-500/30 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1.5">
            {tip.icon}
            <span className="text-xs font-bold text-white">{tip.title}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{tip.text}</p>
        </div>
      ))}

      {/* Tabela de frequências */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Music size={13} className="text-purple-400" />
          Frequências (Hz)
        </h4>
        <div className="grid grid-cols-2 gap-1">
          {[
            ["Dó (C4)", "261.63"],
            ["Ré (D4)", "293.66"],
            ["Mi (E4)", "329.63"],
            ["Fá (F4)", "349.23"],
            ["Sol (G4)", "392.00"],
            ["Lá (A4)", "440.00"],
            ["Si (B4)", "493.88"],
            ["Dó (C5)", "523.25"],
          ].map(([nota, freq]) => (
            <div key={nota} className="flex justify-between text-xs">
              <span className="text-gray-400">{nota}</span>
              <span className="text-purple-300 font-mono">{freq}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

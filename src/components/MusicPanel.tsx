/**
 * MusicPanel — biblioteca de instrumentos e trechos musicais.
 * - ▶ faz uma audição rápida (toca o som na hora)
 * - clique no nome insere o código no editor (no cursor)
 */
import { useState } from "react";
import { Play, ChevronDown } from "lucide-react";
import { engine, noteToFreq } from "../engine/engine";
import { SYNTHS, DRUMS, resolveSynth, resolveDrum, scheduleVoice } from "../engine/instruments";

interface Props {
  onInsert: (code: string) => void;
}

function auditionSynth(name: string) {
  engine.ensure();
  void engine.resume();
  const id = resolveSynth(name);
  scheduleVoice(SYNTHS[id], { freq: noteToFreq("C4"), time: engine.now + 0.02, duration: 0.5, amp: 0.6 });
}

function auditionDrum(name: string) {
  engine.ensure();
  void engine.resume();
  const id = resolveDrum(name);
  scheduleVoice(DRUMS[id], { freq: 200, time: engine.now + 0.02, duration: 0.3, amp: 0.8 });
}

const SYNTH_LIST: { id: string; label: string }[] = [
  { id: "piano", label: "Piano" }, { id: "pluck", label: "Pluck (guitarra)" },
  { id: "bass", label: "Baixo" }, { id: "pad", label: "Pad (ambiente)" },
  { id: "fm", label: "FM (sino)" }, { id: "prophet", label: "Prophet (lead)" },
  { id: "sine", label: "Seno" }, { id: "square", label: "Quadrada" },
  { id: "saw", label: "Dente-de-serra" }, { id: "triangle", label: "Triângulo" },
];

const DRUM_LIST: { id: string; label: string }[] = [
  { id: "bumbo", label: "Bumbo (kick)" }, { id: "caixa", label: "Caixa (snare)" },
  { id: "chimbal", label: "Chimbal (hihat)" }, { id: "palma", label: "Palma (clap)" },
  { id: "tom", label: "Tom" }, { id: "prato", label: "Prato (open hat)" },
];

const SNIPPETS: { label: string; code: string }[] = [
  { label: "Acorde Dó maior", code: 'play(["C4","E4","G4"]);\n' },
  { label: "Escala maior", code: 'escala("C4", "major")\n' },
  { label: "Escala pentatônica", code: 'escala("C4", "major_pentatonic")\n' },
  { label: "Arpejo", code: 'sequencia(["C4","E4","G4","C5"], 0.5);\n' },
  { label: "Loop de bateria", code: 'await repetir(4, async () => {\n  tambor("bumbo");  sleep(0.5)\n  tambor("caixa");  sleep(0.5)\n})\n' },
  { label: "Bloco BPM/Synth", code: 'bpm(120)\nsynth("piano")\n' },
];

export function MusicPanel({ onInsert }: Props) {
  const [section, setSection] = useState<"synth" | "drum" | "snip">("synth");

  return (
    <div className="w-60 bg-[#131319] shrink-0 flex flex-col border-r border-black/40">
      <div className="h-9 flex items-center px-3 text-[11px] font-bold tracking-widest text-[#bbbbbb] uppercase shrink-0">
        Música
      </div>

      {/* Abas internas */}
      <div className="flex border-b border-black/30 shrink-0">
        {([["synth", "Sintetizadores"], ["drum", "Tambores"], ["snip", "Trechos"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              section === id ? "text-white border-b-2 border-[#8b5cf6]" : "text-[#858585] hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {section === "synth" && SYNTH_LIST.map((s) => (
          <Item
            key={s.id}
            label={s.label}
            mono={`synth("${s.id}")`}
            onPlay={() => auditionSynth(s.id)}
            onInsert={() => onInsert(`synth("${s.id}")\n`)}
          />
        ))}

        {section === "drum" && DRUM_LIST.map((d) => (
          <Item
            key={d.id}
            label={d.label}
            mono={`tambor("${d.id}")`}
            onPlay={() => auditionDrum(d.id)}
            onInsert={() => onInsert(`tambor("${d.id}");\n`)}
          />
        ))}

        {section === "snip" && (
          <div className="py-1">
            <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#cccccc]">
              <ChevronDown size={14} /><span className="uppercase tracking-wide">Inserir trecho</span>
            </div>
            {SNIPPETS.map((s) => (
              <button
                key={s.label}
                onClick={() => onInsert(s.code)}
                className="w-full text-left px-3 py-1.5 text-[12px] text-[#cccccc] hover:bg-[#1a1a22]"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Item({ label, mono, onPlay, onInsert }: { label: string; mono: string; onPlay: () => void; onInsert: () => void }) {
  return (
    <div className="group flex items-center gap-1 px-2 py-1 hover:bg-[#1a1a22]">
      <button
        data-sfx="none"
        title="Ouvir"
        onClick={onPlay}
        className="w-6 h-6 flex items-center justify-center rounded bg-[#7c5cff] hover:bg-[#6d4df0] text-white shrink-0"
      >
        <Play size={11} fill="currentColor" />
      </button>
      <button onClick={onInsert} className="flex-1 text-left min-w-0" title="Inserir no editor">
        <div className="text-[12px] text-[#dcdcaa] font-mono truncate">{mono}</div>
        <div className="text-[10px] text-[#858585] truncate">{label}</div>
      </button>
    </div>
  );
}

/**
 * StatusBar — barra azul inferior estilo VS Code (informações de status).
 */
import { Music2, Bell } from "lucide-react";

interface Props {
  synth: string;
  bpm: number;
  playing: boolean;
  ln: number;
  col: number;
}

export function StatusBar({ synth, bpm, playing, ln, col }: Props) {
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center text-[12px] shrink-0 select-none">
      <div className="flex items-center gap-1.5 px-3 h-full hover:bg-white/15 transition-colors">
        <Music2 size={13} /> MusicCode Studio
      </div>
      <div className="flex items-center gap-1.5 px-3 h-full hover:bg-white/15 transition-colors">
        <span className="opacity-80">🎹</span> {synth}
      </div>
      <div className="flex items-center gap-1.5 px-3 h-full hover:bg-white/15 transition-colors">
        <span className="opacity-80">⏱</span> {bpm} BPM
      </div>

      <div className="ml-auto flex items-center">
        <div className="flex items-center gap-1.5 px-3 h-full hover:bg-white/15 transition-colors">
          {playing ? "● Executando" : "○ Pronto"}
        </div>
        <div className="px-3 h-full flex items-center hover:bg-white/15 transition-colors">
          Ln {ln}, Col {col}
        </div>
        <div className="px-3 h-full flex items-center hover:bg-white/15 transition-colors">Espaços: 2</div>
        <div className="px-3 h-full flex items-center hover:bg-white/15 transition-colors">UTF-8</div>
        <div className="px-3 h-full flex items-center hover:bg-white/15 transition-colors">JavaScript</div>
        <div className="px-2 h-full flex items-center hover:bg-white/15 transition-colors">
          <Bell size={13} />
        </div>
      </div>
    </div>
  );
}

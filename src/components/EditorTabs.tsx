/**
 * EditorTabs — barra de abas do editor + controles de execução (Play/BPM/Volume/Save).
 */
import { Play, Square, Circle, Volume2, RotateCcw, Save } from "lucide-react";

interface Props {
  filename: string;
  icon: string;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
  bpm: number;
  onBpmChange: (v: number) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  onSave: () => void;
  onReset: () => void;
  isExample: boolean;
  dirty: boolean;
}

export function EditorTabs({
  filename, icon, playing, onPlay, onStop, bpm, onBpmChange, volume, onVolumeChange,
  onSave, onReset, isExample, dirty,
}: Props) {
  return (
    <div className="bg-[#252526] border-b border-black/40 flex items-stretch shrink-0">
      {/* Aba ativa */}
      <div className="flex items-center gap-2 pl-3 pr-4 py-2 bg-[#1e1e1e] border-r border-black/40 border-t-2 border-t-[#007acc] -mb-px">
        <span>{icon}</span>
        <span className="text-[13px] text-white">{filename}</span>
        {dirty && <span className="w-1.5 h-1.5 rounded-full bg-white" title="Não salvo" />}
        <div className="flex items-center gap-1 ml-1">
          <button onClick={onSave} title="Salvar (Ctrl+S)" className="text-[#858585] hover:text-white">
            <Save size={13} />
          </button>
          {isExample && dirty && (
            <button onClick={onReset} title="Restaurar exemplo" className="text-[#858585] hover:text-white">
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Controles à direita */}
      <div className="ml-auto flex items-center gap-3 px-3">
        <div className="flex items-center gap-1.5 text-[12px] text-[#cccccc]">
          <span className="text-[#858585]">BPM</span>
          <input
            type="number"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-12 bg-[#3c3c3c] text-center text-white text-[12px] py-0.5 px-1 rounded border border-[#464647] outline-none focus:border-[#007acc]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Volume2 size={14} className="text-[#858585]" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-20 accent-[#007acc]"
          />
        </div>

        <button
          onClick={playing ? onStop : onPlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-bold text-white transition-colors ${
            playing ? "bg-[#a1260d] hover:bg-[#c43319]" : "bg-[#0e639c] hover:bg-[#1177bb]"
          }`}
        >
          {playing ? <><Square size={12} fill="currentColor" /> Parar</> : <><Play size={12} fill="currentColor" /> Executar</>}
        </button>

        <span className={`flex items-center gap-1 text-[11px] ${playing ? "text-[#4ec9b0]" : "text-[#858585]"}`}>
          <Circle size={8} fill="currentColor" stroke="none" />
          {playing ? "Rodando" : "Parado"}
        </span>
      </div>
    </div>
  );
}

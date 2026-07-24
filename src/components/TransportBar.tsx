/**
 * TransportBar — controles de execução: Play/Stop, BPM, Volume.
 */
import { Play, Square, Gauge, Volume2 } from "lucide-react";

interface Props {
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
  bpm: number;
  onBpmChange: (v: number) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  accentGradient: string;
}

export function TransportBar({
  playing, onPlay, onStop, bpm, onBpmChange, volume, onVolumeChange, accentGradient,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <button
        onClick={playing ? onStop : onPlay}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white shadow-lg transition-all active:scale-95 ${
          playing
            ? "bg-red-500/90 hover:bg-red-500 shadow-red-900/40"
            : `bg-gradient-to-r ${accentGradient} hover:opacity-90 shadow-purple-900/40`
        }`}
      >
        {playing ? <><Square size={16} fill="currentColor" /> Parar</> : <><Play size={16} fill="currentColor" /> Tocar</>}
      </button>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/5">
        <Gauge size={15} className="text-gray-400" />
        <input
          type="number"
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-14 bg-transparent text-center text-sm font-bold text-white outline-none"
        />
        <span className="text-[11px] text-gray-500 -ml-1">BPM</span>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/5 flex-1 min-w-[160px]">
        <Volume2 size={15} className="text-gray-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="flex-1 accent-violet-500"
        />
        <span className="text-[11px] text-gray-500 w-8 text-right">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}

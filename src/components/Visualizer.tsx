/**
 * Visualizer — barras de frequência em tempo real, lendo o AnalyserNode do motor.
 * Modo `bare` renderiza só o canvas (para incorporar no painel do IDE).
 */
import { useEffect, useRef } from "react";
import { engine } from "../engine/engine";

interface Props {
  active: boolean;
  accent?: string;
  bare?: boolean;
}

export function Visualizer({ active, accent = "#007acc", bare = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const w = (canvas.width = canvas.clientWidth * devicePixelRatio);
      const h = (canvas.height = canvas.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);

      const analyser = engine.analyser;
      if (!analyser) { drawIdle(ctx, w, h, accent); return; }
      const bins = analyser.frequencyBinCount;
      const data = new Uint8Array(bins);
      analyser.getByteFrequencyData(data);

      const bars = bare ? 64 : 48;
      const step = Math.floor(bins / bars / 2) || 1;
      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j] ?? 0;
        const v = sum / step / 255;
        const bh = Math.max(2 * devicePixelRatio, v * h * 0.92);
        const hue = 200 + (i / bars) * 80;
        ctx.fillStyle = `hsl(${hue}, 85%, ${50 + v * 20}%)`;
        ctx.fillRect(i * bw, h - bh, bw - 2 * devicePixelRatio, bh);
      }
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [accent, bare]);

  if (bare) {
    return <canvas ref={canvasRef} className="w-full h-full block" />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/10">
        <span className="text-xs font-bold text-gray-300">🌈 Visualizador</span>
        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${active ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" : "text-gray-600 bg-white/5 border border-white/10"}`}>
          {active ? "● ao vivo" : "○ parado"}
        </span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 150, display: "block" }} />
    </div>
  );
}

function drawIdle(ctx: CanvasRenderingContext2D, w: number, h: number, accent: string) {
  ctx.fillStyle = `${accent}22`;
  const bars = 48;
  const bw = w / bars;
  for (let i = 0; i < bars; i++) {
    const bh = (Math.sin(i * 0.4) * 0.5 + 0.5) * h * 0.08 + h * 0.02;
    ctx.fillRect(i * bw, h - bh, bw - 2, bh);
  }
}

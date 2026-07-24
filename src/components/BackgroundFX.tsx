/**
 * BackgroundFX — animação de fundo em canvas (sutil e elegante).
 * Modos: particles (constelação) · waves (ondas de áudio) · aurora (blob suave).
 * Respeita ativar/desativar, velocidade, cor de destaque e movimento reduzido.
 */
import { useEffect, useRef } from "react";
import { useSettings } from "../context/SettingsContext";

export function BackgroundFX() {
  const { accent, settings } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const enabled = settings.bgEnabled && settings.bgType !== "none";

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const color = accent.hex;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const speed = settings.reduceMotion ? 0 : settings.bgSpeed;

    // ── particles (constelação) ──────────────────────────────────────────────
    if (settings.bgType === "particles") {
      const N = Math.min(70, Math.floor((w * h) / 22000));
      const pts = Array.from({ length: N }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          p.x += p.vx * speed; p.y += p.vy * speed;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        }
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 16000) {
              const a = (1 - d2 / 16000) * 0.14;
              ctx.strokeStyle = hexA(color, a);
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
            }
          }
        }
        for (const p of pts) {
          ctx.fillStyle = hexA(color, 0.55);
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
        }
        if (speed > 0) raf = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── waves (ondas de áudio) ───────────────────────────────────────────────
    if (settings.bgType === "waves") {
      const layers = 4;
      let t = 0;
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        for (let l = 0; l < layers; l++) {
          const amp = 26 + l * 12;
          const yBase = h * (0.5 + (l - layers / 2) * 0.12);
          const alpha = 0.10 + (layers - l) * 0.03;
          ctx.beginPath();
          ctx.moveTo(0, yBase);
          for (let x = 0; x <= w; x += 8) {
            const y = yBase + Math.sin((x * 0.006) + t + l) * amp * Math.sin(x * 0.0015 + t * 0.5);
            ctx.lineTo(x, y);
          }
          ctx.strokeStyle = hexA(color, alpha);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        t += 0.012 * speed;
        if (speed > 0) raf = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── aurora (blobs suaves) ────────────────────────────────────────────────
    if (settings.bgType === "aurora") {
      const blobs = Array.from({ length: 4 }, (_, i) => ({
        r: 220 + Math.random() * 180,
        phase: Math.random() * Math.PI * 2,
        cx: 0.2 + Math.random() * 0.6,
        cy: 0.2 + Math.random() * 0.6,
        sx: 0.3 + Math.random() * 0.4,
        sy: 0.3 + Math.random() * 0.4,
        i,
      }));
      let t = 0;
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (const b of blobs) {
          const x = w * (b.cx + Math.cos(t * b.sx + b.phase) * 0.18);
          const y = h * (b.cy + Math.sin(t * b.sy + b.phase) * 0.18);
          const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
          g.addColorStop(0, hexA(color, 0.16));
          g.addColorStop(1, hexA(color, 0));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        t += 0.004 * speed;
        if (speed > 0) raf = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, settings.bgType, settings.bgSpeed, settings.reduceMotion, accent.hex]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: settings.reduceMotion ? 0.5 : 0.85 }}
      aria-hidden
    />
  );
}

/** hex + alpha → rgba string. */
function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

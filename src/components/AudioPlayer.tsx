import { useState, useRef, useEffect } from "react";
import { Play, Square, Volume2, VolumeX, Music } from "lucide-react";
import ConsolePanel, { useConsole } from "./ConsolePanel";

export type AudioPlayerMode = "lua" | "java" | "html" | "javascript" | "python";

interface Props {
  code: string;
  mode: AudioPlayerMode;
  templateId?: string;
}

// ─── Mapa de notas ────────────────────────────────────────────────────────────
const NOTE_NAMES: Record<number, string> = {
  261.63: "Dó (C4)",  293.66: "Ré (D4)",  329.63: "Mi (E4)",
  349.23: "Fá (F4)",  392.0:  "Sol (G4)", 440.0:  "Lá (A4)",
  493.88: "Si (B4)",  523.25: "Dó (C5)",  587.33: "Ré (D5)",
  659.25: "Mi (E5)",  698.46: "Fá (F5)",  783.99: "Sol (G5)",
  880.0:  "Lá (A5)",
};

function freqName(f: number) {
  return NOTE_NAMES[f] ?? `${f.toFixed(2)} Hz`;
}

// ─── Parser Lua ───────────────────────────────────────────────────────────────
function parseLua(code: string): { notes: Array<{ freq: number; duration: number }>; warnings: string[] } {
  const noteMap: Record<string, number> = {
    Do: 261.63, Re: 293.66, Mi: 329.63, Fa: 349.23,
    Sol: 392.0, La: 440.0,  Si: 493.88, Do2: 523.25,
    C: 261.63,  D: 293.66,  E: 329.63,  F: 349.23,
    G: 392.0,   A: 440.0,   B: 493.88,
  };
  const notes: Array<{ freq: number; duration: number }> = [];
  const warnings: string[] = [];

  // Pattern: { nota = "X", duracao = Y }
  const melodyRgx = /nota\s*=\s*["'](\w+)["'].*?duracao\s*=\s*([\d.]+)/gs;
  let m;
  while ((m = melodyRgx.exec(code)) !== null) {
    const noteName = m[1];
    if (!(noteName in noteMap)) {
      warnings.push(`Nota desconhecida: "${noteName}"`);
      continue;
    }
    const duration = parseFloat(m[2]) * 0.6 + 0.1;
    notes.push({ freq: noteMap[noteName], duration });
  }

  // Fallback: raw frequencies
  if (notes.length === 0) {
    const freqRgx = /(\d{2,3}\.\d{2})/g;
    const found = new Set<number>();
    while ((m = freqRgx.exec(code)) !== null) {
      const f = parseFloat(m[1]);
      if (f >= 60 && f <= 2000 && !found.has(f)) {
        found.add(f);
        notes.push({ freq: f, duration: 0.4 });
        if (notes.length >= 16) break;
      }
    }
    if (notes.length > 0) warnings.push("Frequências brutas detectadas no código.");
  }

  // Fallback final: escala cromática demo
  if (notes.length === 0) {
    warnings.push("Nenhuma nota ou frequência encontrada. Tocando escala de demonstração.");
    [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25].forEach((freq) =>
      notes.push({ freq, duration: 0.4 })
    );
  }

  return { notes, warnings };
}

// ─── Parser Java ──────────────────────────────────────────────────────────────
function parseJava(code: string): { notes: Array<{ freq: number; duration: number }>; warnings: string[] } {
  const noteMap: Record<string, number> = {
    DO: 261.63, RE: 293.66, MI: 329.63, FA: 349.23,
    SOL: 392.0, LA: 440.0,  SI: 493.88, DO2: 523.25, PAUSA: 0,
  };
  const notes: Array<{ freq: number; duration: number }> = [];
  const warnings: string[] = [];

  // Nota.XX enum pattern
  const rgx = /Nota\.(\w+)/g;
  let m;
  while ((m = rgx.exec(code)) !== null) {
    const n = m[1];
    if (!(n in noteMap)) {
      warnings.push(`Enum desconhecido: Nota.${n}`);
      continue;
    }
    if (noteMap[n] > 0) notes.push({ freq: noteMap[n], duration: 0.4 });
  }

  // noteOn(X, velocity) pattern
  if (notes.length === 0) {
    const midiRgx = /noteOn\s*\(\s*(\d+)\s*,/g;
    const midiMap: Record<number, number> = {
      60: 261.63, 62: 293.66, 64: 329.63, 65: 349.23,
      67: 392.0,  69: 440.0,  71: 493.88, 72: 523.25,
    };
    while ((m = midiRgx.exec(code)) !== null) {
      const midi = parseInt(m[1]);
      if (midi in midiMap) {
        notes.push({ freq: midiMap[midi], duration: 0.4 });
      } else {
        // Calcular frequência a partir do número MIDI
        const freq = 440 * Math.pow(2, (midi - 69) / 12);
        notes.push({ freq: parseFloat(freq.toFixed(2)), duration: 0.4 });
        warnings.push(`MIDI ${midi} convertido para ${freq.toFixed(2)} Hz`);
      }
    }
  }

  if (notes.length === 0) {
    const fallback = parseLua(code);
    if (fallback.warnings.length) warnings.push(...fallback.warnings);
    return { notes: fallback.notes, warnings };
  }

  return { notes, warnings };
}

// ─── Parser JavaScript ────────────────────────────────────────────────────────
function parseJavaScript(code: string): { notes: Array<{ freq: number; duration: number }>; warnings: string[] } {
  const notes: Array<{ freq: number; duration: number }> = [];
  const warnings: string[] = [];

  const noteMap: Record<string, number> = {
    Do: 261.63, Re: 293.66, Mi: 329.63, Fa: 349.23,
    Sol: 392.0, La: 440.0, Si: 493.88, Do2: 523.25,
  };

  // notas["Do"] or notas.Do pattern
  const notasRgx = /notas[\[.][\["']?(\w+)["'\]]?/g;
  let m;
  while ((m = notasRgx.exec(code)) !== null) {
    const n = m[1];
    if (n in noteMap) {
      notes.push({ freq: noteMap[n], duration: 0.45 });
    }
  }

  // melodia array: ["Do", 0.4] or ("Do", 0.5)
  if (notes.length === 0) {
    const melRgx = /["'](\w+)["']\s*,\s*([\d.]+)/g;
    while ((m = melRgx.exec(code)) !== null) {
      const name = m[1];
      const dur = parseFloat(m[2]);
      if (name in noteMap && dur > 0 && dur < 5) {
        notes.push({ freq: noteMap[name], duration: dur * 0.6 + 0.1 });
      }
    }
  }

  // frequency.value = X
  if (notes.length === 0) {
    const freqRgx = /frequency\.value\s*=\s*([\d.]+)/g;
    while ((m = freqRgx.exec(code)) !== null) {
      const f = parseFloat(m[1]);
      if (f >= 60 && f <= 2000) notes.push({ freq: f, duration: 0.5 });
    }
  }

  // acordes: freqs array literal [261.63, 329.63, 392.00]
  if (notes.length === 0) {
    const acRgx = /freqs\s*:\s*\[([\d.,\s]+)\]/g;
    while ((m = acRgx.exec(code)) !== null) {
      const freqs = m[1].split(",").map(Number).filter(f => f >= 60 && f <= 2000);
      freqs.forEach(f => notes.push({ freq: f, duration: 1.0 }));
    }
  }

  if (notes.length === 0) {
    warnings.push("Nenhuma nota detectada no código JavaScript. Usando escala de demonstração.");
    [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 261.63].forEach(f =>
      notes.push({ freq: f, duration: 0.4 })
    );
  }

  return { notes, warnings };
}

// ─── Parser Python ────────────────────────────────────────────────────────────
function parsePython(code: string): { notes: Array<{ freq: number; duration: number }>; warnings: string[] } {
  const notes: Array<{ freq: number; duration: number }> = [];
  const warnings: string[] = [];

  const noteMap: Record<string, number> = {
    Do: 261.63, Re: 293.66, Mi: 329.63, Fa: 349.23,
    Sol: 392.0, La: 440.0, Si: 493.88, Do2: 523.25,
    C: 261.63, D: 293.66, E: 329.63, F: 349.23,
    G: 392.0, A: 440.0, B: 493.88,
  };

  // melodia tuple: ("Do", 0.4)
  const melRgx = /\(\s*["'](\w+)["']\s*,\s*([\d.]+)\s*\)/g;
  let m;
  while ((m = melRgx.exec(code)) !== null) {
    const name = m[1];
    const dur = parseFloat(m[2]);
    if (name in noteMap && dur > 0 && dur < 5) {
      notes.push({ freq: noteMap[name], duration: dur * 0.6 + 0.1 });
    }
  }

  // notas dict: "Do": 261.63
  if (notes.length === 0) {
    const dictRgx = /["'](\w+)["']\s*:\s*([\d.]+)/g;
    while ((m = dictRgx.exec(code)) !== null) {
      const freq = parseFloat(m[2]);
      if (freq >= 60 && freq <= 2000) {
        notes.push({ freq, duration: 0.4 });
        if (notes.length >= 16) break;
      }
    }
    if (notes.length > 0) warnings.push("Dicionário de frequências detectado.");
  }

  // frequência raw: 261.63 or similar
  if (notes.length === 0) {
    const freqRgx = /([\d]{2,3}\.[\d]{2})/g;
    while ((m = freqRgx.exec(code)) !== null) {
      const f = parseFloat(m[1]);
      if (f >= 60 && f <= 2000) {
        notes.push({ freq: f, duration: 0.4 });
        if (notes.length >= 16) break;
      }
    }
  }

  if (notes.length === 0) {
    warnings.push("Nenhuma nota detectada no código Python. Usando escala de demonstração.");
    [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25].forEach(f =>
      notes.push({ freq: f, duration: 0.35 })
    );
  }

  return { notes, warnings };
}

// ─── Drum pattern ─────────────────────────────────────────────────────────────
function buildDrumFunctions(ctx: AudioContext) {
  const playKick = (when: number) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, when);
    osc.frequency.exponentialRampToValueAtTime(0.01, when + 0.3);
    g.gain.setValueAtTime(1, when);
    g.gain.exponentialRampToValueAtTime(0.01, when + 0.3);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(when); osc.stop(when + 0.3);
  };

  const playSnare = (when: number) => {
    const bufSrc = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, when);
    g.gain.exponentialRampToValueAtTime(0.01, when + 0.15);
    bufSrc.buffer = buf; bufSrc.connect(g); g.connect(ctx.destination);
    bufSrc.start(when);
  };

  const playHihat = (when: number) => {
    const bufSrc = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const filt = ctx.createBiquadFilter();
    filt.type = "highpass"; filt.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.3, when);
    g.gain.exponentialRampToValueAtTime(0.01, when + 0.04);
    bufSrc.buffer = buf; bufSrc.connect(filt); filt.connect(g); g.connect(ctx.destination);
    bufSrc.start(when);
  };

  return { playKick, playSnare, playHihat };
}

// ─── Sequência de notas com Web Audio API ─────────────────────────────────────
async function playSequence(
  notes: Array<{ freq: number; duration: number }>,
  ctx: AudioContext,
  volume: number,
  onNote: (name: string, index: number) => void,
  stopRef: React.MutableRefObject<boolean>
) {
  let time = ctx.currentTime + 0.05;

  for (let i = 0; i < notes.length; i++) {
    if (stopRef.current) break;
    const { freq, duration } = notes[i];

    if (freq > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * 0.4, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    }

    const delay = Math.max(0, (time - ctx.currentTime) * 1000);
    await new Promise<void>((resolve) => setTimeout(() => {
      if (!stopRef.current) onNote(freqName(freq), i);
      resolve();
    }, delay));

    time += duration + 0.04;
    await new Promise<void>((resolve) => setTimeout(resolve, duration * 1000 + 40));
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AudioPlayer({ code, mode, templateId }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted]         = useState(false);
  const [volume, setVolume]       = useState(0.8);
  const [progress, setProgress]   = useState(0);
  const [currentNote, setCurrentNote] = useState("—");

  const audioCtxRef  = useRef<AudioContext | null>(null);
  const stopRef      = useRef(false);
  const progressRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const console = useConsole();

  const isDrum = !!(templateId?.includes("drum") || templateId?.includes("rhythm") || templateId?.includes("beat"));
  const isHtml = mode === "html";

  const accentColor =
    mode === "lua"        ? "blue" :
    mode === "java"       ? "orange" :
    mode === "javascript" ? "yellow" :
    mode === "python"     ? "green" : "pink";

  const gradFrom =
    mode === "lua"        ? "from-blue-600 to-cyan-600" :
    mode === "java"       ? "from-orange-500 to-yellow-500" :
    mode === "javascript" ? "from-yellow-500 to-amber-400" :
    mode === "python"     ? "from-green-500 to-emerald-400" :
    "from-pink-600 to-rose-500";

  const textAccent =
    mode === "lua"        ? "text-blue-400" :
    mode === "java"       ? "text-orange-400" :
    mode === "javascript" ? "text-yellow-400" :
    mode === "python"     ? "text-green-400" : "text-pink-400";

  const borderColor =
    mode === "lua"        ? "border-blue-500/30" :
    mode === "java"       ? "border-orange-500/30" :
    mode === "javascript" ? "border-yellow-500/30" :
    mode === "python"     ? "border-green-500/30" : "border-pink-500/30";

  const bgColor =
    mode === "lua"        ? "bg-blue-500/5" :
    mode === "java"       ? "bg-orange-500/5" :
    mode === "javascript" ? "bg-yellow-500/5" :
    mode === "python"     ? "bg-green-500/5" : "bg-pink-500/5";

  useEffect(() => {
    return () => {
      stopRef.current = true;
      if (progressRef.current) clearInterval(progressRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const getAudioCtx = async (): Promise<AudioContext> => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    return ctx;
  };

  const startProgressBar = (totalMs: number) => {
    setProgress(0);
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += 100;
      setProgress(Math.min((elapsed / totalMs) * 100, 99));
    }, 100);
  };

  const finishProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 800);
  };

  // ── PLAY ──
  const handlePlay = async () => {
    if (isPlaying) return;
    stopRef.current = false;
    console.clearLogs();

    // Verificar se há código
    if (!code || code.trim().length === 0) {
      console.error("Nenhum código encontrado no editor.", "EMPTY_CODE");
      return;
    }

    console.info(`▶ Iniciando reprodução — modo: ${mode.toUpperCase()}`);

    // HTML
    if (isHtml) {
      console.info("Modo HTML detectado.");
      console.info("Use a aba ▶ Preview acima para executar o código HTML com áudio.");
      console.warn("O áudio HTML não pode ser reproduzido diretamente neste player.", "HTML_PREVIEW_ONLY");
      return;
    }

    // Verificar suporte ao AudioContext
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      console.error("Seu navegador não suporta Web Audio API.", "AUDIO_CONTEXT_NOT_SUPPORTED");
      return;
    }

    try {
      const ctx = await getAudioCtx();
      console.success("AudioContext iniciado com sucesso.");
      console.info(`Taxa de amostragem: ${ctx.sampleRate} Hz`);

      // ── DRUM ──
      if (isDrum) {
        console.info("🥁 Modo bateria detectado.");
        console.info("Padrão: Kick (beats 1,3) | Snare (beats 2,4) | Hi-Hat (todos)");
        console.info("BPM: 128 — 2 compassos de 16 passos");

        setIsPlaying(true);
        const bpm = 128;
        const step = 60 / bpm / 4;
        const totalSteps = 32;
        const totalMs = totalSteps * step * 1000 + 300;
        startProgressBar(totalMs);

        const pattern = [
          [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
          [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
          [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        ];
        const names = ["💥 Kick", "🔔 Snare", "🎵 Hi-Hat"];
        const { playKick, playSnare, playHihat } = buildDrumFunctions(ctx);
        let startTime = ctx.currentTime + 0.1;

        for (let i = 0; i < totalSteps; i++) {
          const s = i % 16;
          const when = startTime + i * step;
          if (pattern[0][s]) playKick(when);
          if (pattern[1][s]) playSnare(when);
          if (pattern[2][s]) playHihat(when);
        }

        pattern.forEach((row, ri) => {
          const active = row.filter(Boolean).length;
          console.info(`${names[ri]}: ${active} batidas agendadas`);
        });

        setTimeout(() => {
          if (!stopRef.current) {
            setIsPlaying(false);
            setCurrentNote("—");
            finishProgress();
            console.success("✅ Padrão de bateria finalizado com sucesso!");
          }
        }, totalMs);

        return;
      }

      // ── MELODIA ──
      const parseResult =
        mode === "lua"        ? parseLua(code) :
        mode === "java"       ? parseJava(code) :
        mode === "javascript" ? parseJavaScript(code) :
        mode === "python"     ? parsePython(code) :
        parseLua(code);
      const { notes, warnings } = parseResult;

      // Mostrar avisos do parser
      warnings.forEach((w) => console.warn(w));

      if (notes.length === 0) {
        console.error("Nenhuma nota musical encontrada no código.", "NO_NOTES_FOUND");
        console.info("Dica: Use padrões como { nota = \"Do\", duracao = 0.5 } (Lua) ou Nota.DO (Java).");
        return;
      }

      console.info(`🎵 ${notes.length} nota(s) detectada(s) para reprodução.`);
      notes.forEach((n, i) => {
        console.info(`  Nota ${i + 1}: ${freqName(n.freq)} — duração: ${n.duration.toFixed(2)}s`);
      });

      const totalMs = notes.reduce((s, n) => s + (n.duration + 0.04) * 1000, 0);
      startProgressBar(totalMs);
      setIsPlaying(true);
      console.info("▶ Reproduzindo...");

      await playSequence(
        notes,
        ctx,
        muted ? 0 : volume,
        (name, index) => {
          setCurrentNote(name);
          console.success(`♪ [${index + 1}/${notes.length}] ${name}`);
        },
        stopRef
      );

      if (!stopRef.current) {
        setCurrentNote("—");
        setIsPlaying(false);
        finishProgress();
        console.success("✅ Reprodução concluída com sucesso!");
      }

    } catch (err: any) {
      setIsPlaying(false);
      finishProgress();

      const msg = err?.message ?? String(err);
      const name = err?.name ?? "UnknownError";

      if (name === "NotAllowedError") {
        console.error("Permissão de áudio negada pelo navegador.", "NOT_ALLOWED_ERROR");
        console.info("Dica: Clique na página antes de reproduzir para desbloquear o áudio.");
      } else if (name === "NotSupportedError") {
        console.error("Formato de áudio não suportado.", "NOT_SUPPORTED_ERROR");
      } else if (msg.includes("suspended")) {
        console.error("AudioContext está suspenso. Tente clicar na página primeiro.", "AUDIO_SUSPENDED");
      } else {
        console.error(`Erro inesperado: ${msg}`, name);
      }

      window.console.error("[AudioPlayer]", err);
    }
  };

  // ── STOP ──
  const handleStop = () => {
    stopRef.current = true;
    setIsPlaying(false);
    setCurrentNote("—");
    finishProgress();
    if (progressRef.current) clearInterval(progressRef.current);

    try {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      console.warn("⏹ Reprodução interrompida pelo usuário.");
    } catch (err: any) {
      console.error(`Erro ao parar AudioContext: ${err?.message}`, err?.name ?? "StopError");
    }
  };

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} p-5 mt-4`}>

      {/* Título */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradFrom} flex items-center justify-center`}>
          <Music size={14} className="text-white" />
        </div>
        <h3 className="text-sm font-bold text-white">🔊 Reprodutor de Som</h3>
        {isHtml && (
          <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full ml-auto">
            Use a aba ▶ Preview
          </span>
        )}
      </div>

      {!isHtml ? (
        <>
          {/* Nota atual + Volume */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Barras equalizador */}
              <div className="flex items-end gap-[3px] h-8">
                {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full bg-gradient-to-t ${gradFrom} transition-all duration-150`}
                    style={{
                      height: isPlaying ? `${h * 100}%` : "20%",
                      opacity: isPlaying ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="text-xs text-gray-500">Nota atual</div>
                <div className={`text-base font-black ${textAccent} font-mono`}>{currentNote}</div>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={() => setMuted(!muted)} className="text-gray-400 hover:text-white transition-colors">
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                className="w-20 accent-purple-500"
              />
              <span className="text-xs text-gray-500 w-8 text-right">{Math.round((muted ? 0 : volume) * 100)}%</span>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradFrom} rounded-full transition-all duration-100`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                ${isPlaying
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : `bg-gradient-to-r ${gradFrom} text-white shadow-lg hover:opacity-90 active:scale-95`
                }`}
            >
              <Play size={15} fill={isPlaying ? "none" : "currentColor"} />
              {isPlaying ? "Reproduzindo..." : "▶ Reproduzir"}
            </button>

            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                ${!isPlaying
                  ? "bg-white/3 text-gray-600 cursor-not-allowed"
                  : "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 active:scale-95"
                }`}
            >
              <Square size={14} fill={!isPlaying ? "none" : "currentColor"} />
              Parar
            </button>

            {isDrum && (
              <span className="text-xs text-gray-500 ml-auto">🥁 BPM 128</span>
            )}
          </div>

          {/* ── Console Panel ── */}
          <ConsolePanel
            logs={console.logs}
            onClear={console.clearLogs}
            accentColor={accentColor}
          />
        </>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">
            Os templates HTML têm áudio embutido. Use a aba{" "}
            <span className="text-pink-400 font-semibold">▶ Preview</span> acima do editor para executar o código.
          </p>

          {/* Console para HTML também */}
          <ConsolePanel
            logs={console.logs}
            onClear={console.clearLogs}
            accentColor="pink"
          />
        </>
      )}
    </div>
  );
}

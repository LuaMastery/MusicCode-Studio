/**
 * engine.ts — Núcleo do motor de áudio do Sonora.
 *
 * Tudo é construído sobre a Web Audio API. Esta classe é um singleton que:
 *  - mantém um AudioContext (criado sob demanda, após um gesto do usuário)
 *  - expõe um "cursor" de tempo (em segundos do AudioContext) usado pela API musical
 *  - rastreia as "vozes" ativas para que possam ser cortadas no Stop
 *  - fornece um AnalyserNode para o visualizador
 */

export const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

/** Erro especial lançado quando o usuário pede para parar a execução. */
export class AbortRun extends Error {
  constructor() {
    super("__ABORT__");
    this.name = "AbortRun";
  }
}

/** Converte um nome de nota (ex.: "C4", "F#5", "A3") ou frequência em Hz. */
export function noteToFreq(note: string | number): number {
  if (typeof note === "number") return note;

  const raw = String(note).trim();
  const asNum = Number(raw);
  if (!Number.isNaN(asNum) && raw !== "") return asNum;

  const m = raw.match(/^([A-Ga-g])([#b]?)(-?\d)?$/);
  if (!m) throw new Error(`Nota inválida: "${note}"`);

  const letter = m[1].toUpperCase();
  const accidental = m[2];
  const octave = m[3] ? parseInt(m[3], 10) : 4;

  let semitone = NOTE_NAMES.indexOf(letter);
  if (accidental === "#") semitone += 1;
  if (accidental === "b") semitone -= 1;

  // Número MIDI: C4 = 60, A4 = 69.  (oitava + 1) * 12 + semitom.
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Uma "voz" é qualquer nó de áudio que pode ser interrompido. */
export interface Voice {
  stop: (when?: number) => void;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private comp!: DynamicsCompressorNode;
  analyser!: AnalyserNode;

  /** Tempo absoluto (em segundos do AudioContext) onde a próxima nota será agendada. */
  cursor = 0;
  /** Duração de 1 batida, em segundos. Default = 120 BPM (0.5s). */
  beatDuration = 0.5;
  /** Volume principal 0..1. */
  volume = 0.8;

  running = false;
  stopRequested = false;

  private voices = new Set<Voice>();

  /** Cria o AudioContext (preguiçosamente — deve ocorrer após um gesto do usuário). */
  ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const g = globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = g.AudioContext || g.webkitAudioContext;
    if (!Ctor) throw new Error("Web Audio API não disponível neste ambiente.");
    this.ctx = new Ctor();

    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;

    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -10;
    this.comp.knee.value = 24;
    this.comp.ratio.value = 4;
    this.comp.attack.value = 0.004;
    this.comp.release.value = 0.18;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.82;

    this.master.connect(this.comp);
    this.comp.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    return this.ctx;
  }

  get context(): AudioContext {
    return this.ensure();
  }

  /** Nó de destino onde os instrumentos se conectam (o master). */
  get bus(): AudioNode {
    return this.master;
  }

  get now(): number {
    return this.context.currentTime;
  }

  async resume(): Promise<void> {
    this.ensure();
    if (this.ctx!.state === "suspended") {
      try {
        await this.ctx!.resume();
      } catch {
        /* ignore */
      }
    }
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master) {
      this.master.gain.setTargetAtTime(this.volume, this.now, 0.015);
    }
  }

  setBpm(bpm: number): void {
    this.beatDuration = 60 / Math.max(1, bpm);
  }

  track(voice: Voice): Voice {
    this.voices.add(voice);
    return voice;
  }

  untrack(voice: Voice): void {
    this.voices.delete(voice);
  }

  /** Inicia uma execução: reseta o cursor levemente à frente do "agora". */
  startRun(): void {
    this.ensure();
    this.stopRequested = false;
    this.running = true;
    this.cursor = this.now + 0.06;
  }

  /** Para tudo: cancela o agendamento e corta as vozes ativas. */
  requestStop(): void {
    this.stopRequested = true;
    this.running = false;
    const t = this.now + 0.02;
    for (const v of this.voices) {
      try {
        v.stop(t);
      } catch {
        /* ignore */
      }
    }
    this.voices.clear();
  }

  isStopped(): boolean {
    return this.stopRequested;
  }
}

/** Instância singleton compartilhada por todo o app. */
export const engine = new AudioEngine();

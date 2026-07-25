/**
 * instruments.ts — Vozes sonoras construídas com a Web Audio API.
 *
 * Cada instrumento é uma função que recebe parâmetros de nota e retorna uma
 * Voice (algo que pode ser interrompido). Todos se conectam ao "bus" do motor.
 */

import { engine, type Voice } from "./engine";

export type SynthId =
  | "sine"
  | "square"
  | "saw"
  | "triangle"
  | "piano"
  | "pluck"
  | "bass"
  | "pad"
  | "fm"
  | "prophet";

export type DrumId = "kick" | "snare" | "hihat" | "openhat" | "clap" | "tom";

export interface NoteParams {
  ctx: AudioContext;
  dest: AudioNode;
  freq: number;
  time: number; // tempo absoluto do AudioContext
  duration: number; // duração em segundos
  amp: number; // 0..1
  pan?: number; // -1..1
  cutoff?: number; // Hz (filtro passa-baixas)
}

/** Mapa de nomes amigáveis (pt + en) -> id canônico de sintetizador. */
export const SYNTH_ALIASES: Record<string, SynthId> = {
  // ids
  sine: "sine", square: "square", saw: "saw", triangle: "triangle",
  piano: "piano", pluck: "pluck", bass: "bass", pad: "pad", fm: "fm", prophet: "prophet",
  // aliases
  onda: "sine", quadrada: "square", dente: "saw", triangulo: "triangle",
  triângulo: "triangle", baixo: "bass", sino: "fm", chumbo: "prophet",
  sawtooth: "saw",
};

export const DRUM_ALIASES: Record<string, DrumId> = {
  kick: "kick", snare: "snare", hihat: "hihat", openhat: "openhat", clap: "clap", tom: "tom",
  // português
  bumbo: "kick", grave: "kick", caixa: "snare", chimbal: "hihat", prato: "openhat",
  palma: "clap", tom1: "tom",
  hat: "hihat", closedhat: "hihat",
};

/** Cria e conecta um oscilador simples com envelope de ganho exponencial. */
function basicOsc(type: OscillatorType) {
  return ({ ctx, dest, freq, time, duration, amp, pan, cutoff }: NoteParams): Voice => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    const end = time + duration;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    let tail: AudioNode = gain;
    if (cutoff) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = cutoff;
      gain.connect(lp);
      tail = lp;
    }
    let final: AudioNode = tail;
    if (pan !== undefined) {
      const p = ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      tail.connect(p);
      final = p;
    }
    final.connect(dest);

    osc.connect(gain);
    osc.start(time);
    osc.stop(end + 0.05);

    return {
      stop: (when) => {
        const t = when ?? ctx.currentTime;
        try {
          gain.gain.cancelScheduledValues(t);
          gain.gain.setTargetAtTime(0.0001, t, 0.025);
          osc.stop(t + 0.12);
        } catch {
          /* ignore */
        }
      },
    };
  };
}

/** "Piano": triângulo + senoide com decaimento rápido e harmônico. */
function pianoVoice({ ctx, dest, freq, time, duration, amp, pan }: NoteParams): Voice {
  const fundamental = basicOsc("triangle")({ ctx, dest: ctx.createGain(), freq, time, duration, amp: amp * 0.9, pan });
  // harmônico superior para dar brilho
  basicOsc("sine")({ ctx, dest, freq: freq * 2, time, duration: duration * 0.4, amp: amp * 0.25, pan });
  return fundamental;
}

/** "Pluck": dente-de-serra curto com filtro fechando (estilo guitarra dedilhada). */
function pluckVoice({ ctx, dest, freq, time, duration, amp, pan }: NoteParams): Voice {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, time);
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(freq * 8, time);
  lp.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.5), time + duration);
  lp.Q.value = 4;

  const end = time + duration;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(lp);
  lp.connect(gain);
  let out: AudioNode = gain;
  if (pan !== undefined) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    gain.connect(p);
    out = p;
  }
  out.connect(dest);
  osc.start(time);
  osc.stop(end + 0.05);

  return {
    stop: (when) => {
      const t = when ?? ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setTargetAtTime(0.0001, t, 0.02);
        osc.stop(t + 0.1);
      } catch {
        /* ignore */
      }
    },
  };
}

/** "Bass": dente-de-serra grave por filtro passa-baixas. */
function bassVoice({ ctx, dest, freq, time, duration, amp, pan }: NoteParams): Voice {
  return basicOsc("sawtooth")({
    ctx, dest, freq, time, duration, amp: amp * 0.9, pan,
    cutoff: freq * 4,
  });
}

/** "Pad": senoide com ataque e release lentos (textura ambiente). */
function padVoice({ ctx, dest, freq, time, duration, amp, pan }: NoteParams): Voice {
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc2.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, time);
  osc2.frequency.setValueAtTime(freq * 1.005, time); // leve descompassamento (chorus)

  const end = time + duration;
  const atk = Math.min(0.4, duration * 0.3);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(Math.max(0.0002, amp * 0.5), time + atk);
  gain.gain.setValueAtTime(Math.max(0.0002, amp * 0.5), end - Math.min(0.4, duration * 0.4));
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(gain);
  osc2.connect(gain);
  let out: AudioNode = gain;
  if (pan !== undefined) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    gain.connect(p);
    out = p;
  }
  out.connect(dest);
  osc.start(time);
  osc2.start(time);
  osc.stop(end + 0.05);
  osc2.stop(end + 0.05);

  return {
    stop: (when) => {
      const t = when ?? ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setTargetAtTime(0.0001, t, 0.05);
        osc.stop(t + 0.2);
        osc2.stop(t + 0.2);
      } catch {
        /* ignore */
      }
    },
  };
}

/** "FM": síntese por modulação de frequência (sino/metal). */
function fmVoice({ ctx, dest, freq, time, duration, amp, pan }: NoteParams): Voice {
  const carrier = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();
  const gain = ctx.createGain();
  carrier.type = "sine";
  mod.type = "sine";
  carrier.frequency.setValueAtTime(freq, time);
  mod.frequency.setValueAtTime(freq * 2, time);
  modGain.gain.setValueAtTime(freq * 3, time);
  modGain.gain.exponentialRampToValueAtTime(freq * 0.4, time + duration * 0.6);
  mod.connect(modGain);
  modGain.connect(carrier.frequency);

  const end = time + duration;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  carrier.connect(gain);
  let out: AudioNode = gain;
  if (pan !== undefined) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    gain.connect(p);
    out = p;
  }
  out.connect(dest);

  carrier.start(time);
  mod.start(time);
  carrier.stop(end + 0.05);
  mod.stop(end + 0.05);

  return {
    stop: (when) => {
      const t = when ?? ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setTargetAtTime(0.0001, t, 0.03);
        carrier.stop(t + 0.15);
        mod.stop(t + 0.15);
      } catch {
        /* ignore */
      }
    },
  };
}

/** "Prophet": dois osciladores dessintonizados por filtro (lead analógico). */
function prophetVoice({ ctx, dest, freq, time, duration, amp, pan }: NoteParams): Voice {
  const a = ctx.createOscillator();
  const b = ctx.createOscillator();
  const gain = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  a.type = "sawtooth";
  b.type = "sawtooth";
  a.frequency.setValueAtTime(freq, time);
  b.frequency.setValueAtTime(freq * 1.01, time);
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(freq * 6, time);
  lp.frequency.exponentialRampToValueAtTime(Math.max(300, freq * 2), time + duration);
  lp.Q.value = 6;

  const end = time + duration;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp * 0.6), time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  a.connect(lp);
  b.connect(lp);
  lp.connect(gain);
  let out: AudioNode = gain;
  if (pan !== undefined) {
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    gain.connect(p);
    out = p;
  }
  out.connect(dest);
  a.start(time);
  b.start(time);
  a.stop(end + 0.05);
  b.stop(end + 0.05);

  return {
    stop: (when) => {
      const t = when ?? ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setTargetAtTime(0.0001, t, 0.03);
        a.stop(t + 0.15);
        b.stop(t + 0.15);
      } catch {
        /* ignore */
      }
    },
  };
}

export const SYNTHS: Record<SynthId, (p: NoteParams) => Voice> = {
  sine: basicOsc("sine"),
  square: basicOsc("square"),
  saw: basicOsc("sawtooth"),
  triangle: basicOsc("triangle"),
  piano: pianoVoice,
  pluck: pluckVoice,
  bass: bassVoice,
  pad: padVoice,
  fm: fmVoice,
  prophet: prophetVoice,
};

/** Resolve um nome de sintetizador (alias inclusivo). */
export function resolveSynth(name?: string): SynthId {
  if (!name) return "piano";
  const id = SYNTH_ALIASES[name.toLowerCase().trim()];
  if (!id) throw new Error(`Sintetizador desconhecido: "${name}". Válidos: ${Object.keys(SYNTH_ALIASES).join(", ")}`);
  return id;
}

// ─── BATERIA ────────────────────────────────────────────────────────────────

let noiseCache: AudioBuffer | null = null;
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseCache && noiseCache.sampleRate === ctx.sampleRate) return noiseCache;
  const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseCache = buf;
  return buf;
}

function kickVoice({ ctx, dest, time, amp }: NoteParams): Voice {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(160, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  gain.gain.setValueAtTime(Math.max(0.05, amp), time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.24);
  return { stop: (w) => { try { osc.stop(w ?? ctx.currentTime); } catch { /* */ } } };
}

function snareVoice({ ctx, dest, time, amp }: NoteParams): Voice {
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx);
  const nf = ctx.createBiquadFilter();
  nf.type = "highpass";
  nf.frequency.value = 1400;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(Math.max(0.05, amp * 0.7), time);
  ng.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
  noise.connect(nf);
  nf.connect(ng);
  ng.connect(dest);

  const osc = ctx.createOscillator();
  const og = ctx.createGain();
  osc.frequency.setValueAtTime(190, time);
  og.gain.setValueAtTime(Math.max(0.05, amp * 0.5), time);
  og.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
  osc.connect(og);
  og.connect(dest);

  noise.start(time);
  osc.start(time);
  noise.stop(time + 0.2);
  osc.stop(time + 0.14);
  return { stop: () => { try { noise.stop(); osc.stop(); } catch { /* */ } } };
}

function hatVoice(open: boolean) {
  return ({ ctx, dest, time, amp }: NoteParams): Voice => {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    const dur = open ? 0.3 : 0.05;
    g.gain.setValueAtTime(Math.max(0.03, amp * 0.5), time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    noise.connect(hp);
    hp.connect(g);
    g.connect(dest);
    noise.start(time);
    noise.stop(time + dur + 0.02);
    return { stop: () => { try { noise.stop(); } catch { /* */ } } };
  };
}

function clapVoice({ ctx, dest, time, amp }: NoteParams): Voice {
  const g = ctx.createGain();
  g.connect(dest);
  const bursts = [0, 0.012, 0.024, 0.04];
  bursts.forEach((b, i) => {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1500;
    bp.Q.value = 0.7;
    const bg = ctx.createGain();
    const last = i === bursts.length - 1;
    bg.gain.setValueAtTime(Math.max(0.04, amp * 0.5), time + b);
    bg.gain.exponentialRampToValueAtTime(0.0001, time + b + (last ? 0.18 : 0.03));
    noise.connect(bp);
    bp.connect(bg);
    bg.connect(dest);
    noise.start(time + b);
    noise.stop(time + b + 0.2);
  });
  return { stop: () => {} };
}

function tomVoice({ ctx, dest, freq, time, amp }: NoteParams): Voice {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(Math.max(80, freq), time);
  osc.frequency.exponentialRampToValueAtTime(Math.max(50, freq * 0.5), time + 0.2);
  gain.gain.setValueAtTime(Math.max(0.05, amp), time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.27);
  return { stop: (w) => { try { osc.stop(w ?? ctx.currentTime); } catch { /* */ } } };
}

export const DRUMS: Record<DrumId, (p: NoteParams) => Voice> = {
  kick: kickVoice,
  snare: snareVoice,
  hihat: hatVoice(false),
  openhat: hatVoice(true),
  clap: clapVoice,
  tom: tomVoice,
};

export function resolveDrum(name?: string): DrumId {
  if (!name) return "kick";
  const id = DRUM_ALIASES[name.toLowerCase().trim()];
  if (!id) throw new Error(`Tambor desconhecido: "${name}". Válidos: ${Object.keys(DRUM_ALIASES).join(", ")}`);
  return id;
}

/** Toca uma voz de instrumento agendada no tempo dado e a registra no motor. */
export function scheduleVoice(
  inst: (p: NoteParams) => Voice,
  p: Omit<NoteParams, "ctx" | "dest">
): Voice {
  const ctx = engine.context;
  const dest = engine.bus;
  const voice = inst({ ctx, dest, ...p });
  engine.track(voice);
  // limpa do conjunto quando o som terminar (heurística simples)
  setTimeout(() => engine.untrack(voice), (p.duration + 0.2) * 1000 + 50);
  return voice;
}

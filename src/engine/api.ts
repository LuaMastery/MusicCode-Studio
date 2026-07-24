/**
 * api.ts — A API musical pública do MusicCode Studio (estilo Sonic Pi).
 *
 * O usuário escreve JavaScript chamando estas funções e ouve música:
 *
 *   play("C4")                 // toca uma nota
 *   play(["C4","E4","G4"])     // toca um acorde (array = simultâneo)
 *   sleep(1)                   // espera 1 batida
 *   tambor("bumbo")            // percussão
 *   bpm(120)                   // define o andamento
 *   synth("piano")             // escolhe o sintetizador
 *   escala("C4","major")       // devolve as notas de uma escala
 */

import { engine, noteToFreq, AbortRun, type Voice } from "./engine";
import {
  SYNTHS, resolveSynth, DRUMS, resolveDrum, scheduleVoice, type SynthId,
} from "./instruments";
import { scale as scaleNotes, chord as chordNotes } from "./scales";

export interface PlayOptions {
  synth?: string;     // nome do sintetizador
  dur?: number;       // duração em batidas (slot rítmico)
  amp?: number;       // volume da nota 0..1
  pan?: number;       // balanço -1..1
  cutoff?: number;    // filtro passa-baixas (Hz)
  release?: number;   // tempo extra de ressonância (batidas)
  freq?: number;      // frequência base (usado por tambores como o tom)
}

export interface ApiCallbacks {
  log: (...args: unknown[]) => void;
}

type Note = string | number;

/** Garante que o cursor não fique no passado. */
function bumpCursor(): number {
  if (engine.cursor < engine.now + 0.03) {
    engine.cursor = engine.now + 0.03;
  }
  return engine.cursor;
}

export function buildApi(cb: ApiCallbacks) {
  let defaultSynth: SynthId = "piano";
  let defaultAmp = 0.6;

  function scheduleNote(note: Note, opts: PlayOptions, time: number): void {
    const synthId = resolveSynth(opts.synth ?? defaultSynth);
    const inst = SYNTHS[synthId];
    const freq = noteToFreq(note);
    const durBeats = opts.dur ?? 1;
    const release = opts.release ?? 0;
    const duration = (durBeats + release) * engine.beatDuration;
    const voice: Voice = scheduleVoice(inst, {
      freq, time, duration,
      amp: opts.amp ?? defaultAmp,
      pan: opts.pan, cutoff: opts.cutoff,
    });
    void voice;
  }

  /** Toca uma nota. Se receber um array, toca como acorde (simultâneo). */
  function play(note: Note | Note[], opts: PlayOptions = {}): void {
    const time = bumpCursor();
    if (Array.isArray(note)) {
      for (const n of note) scheduleNote(n, opts, time);
    } else {
      scheduleNote(note, opts, time);
    }
  }

  /** Toca um acorde (alias de play com array). */
  function acorde(notes: Note[], opts: PlayOptions = {}): void {
    play(notes, opts);
  }

  /** Toca uma sequência em escada a partir do cursor (avança o cursor). */
  function sequencia(notes: Note[], gap: number = 0.5, opts: PlayOptions = {}): void {
    let t = bumpCursor();
    for (const n of notes) {
      scheduleNote(n, opts, t);
      t += gap * engine.beatDuration;
    }
    engine.cursor = t;
  }

  /** Toca um tambor/percussão. */
  function tambor(name: string, opts: PlayOptions = {}): void {
    const id = resolveDrum(name);
    const inst = DRUMS[id];
    const time = bumpCursor();
    scheduleVoice(inst, {
      freq: opts.freq ?? 200, time, duration: 0.3,
      amp: opts.amp ?? defaultAmp, pan: opts.pan,
    });
  }

  /** Percussão em sequência a partir do cursor. */
  function sequenciaTambor(names: string[], gap: number = 0.5, opts: PlayOptions = {}): void {
    let t = bumpCursor();
    for (const n of names) {
      const id = resolveDrum(n);
      scheduleVoice(DRUMS[id], {
        freq: opts.freq ?? 200, time: t, duration: 0.3,
        amp: opts.amp ?? defaultAmp, pan: opts.pan,
      });
      t += gap * engine.beatDuration;
    }
    engine.cursor = t;
  }

  /** Define o sintetizador padrão. */
  function synth(name: string): void {
    defaultSynth = resolveSynth(name);
  }

  function use_synth(name: string): void { synth(name); }
  function sintetizador(name: string): void { synth(name); }

  /** Define o andamento (BPM). */
  function bpm(value: number): void {
    engine.setBpm(value);
  }
  function use_bpm(value: number): void { bpm(value); }
  function tempo(value: number): void { bpm(value); }

  /** Define o volume principal (0..1). */
  function volume(v: number): void { engine.setVolume(v); }
  function use_volume(v: number): void { volume(v); }

  /** Espera N batidas (e cede a thread — use em loops: await sleep(1)). */
  function sleep(beats: number = 1): Promise<void> {
    engine.cursor += beats * engine.beatDuration;
    const delayMs = Math.max(0, (engine.cursor - engine.now) * 1000);
    return new Promise<void>((resolve, reject) => {
      if (engine.stopRequested) return reject(new AbortRun());
      setTimeout(() => {
        if (engine.stopRequested) reject(new AbortRun());
        else resolve();
      }, delayMs);
    });
  }
  function dormir(beats: number = 1): Promise<void> { return sleep(beats); }
  function esperar(beats: number = 1): Promise<void> { return sleep(beats); }
  function pausa(beats: number = 1): Promise<void> { return sleep(beats); }

  /** Devolve as notas de uma escala. */
  function escala(root: string, mode: string = "major", octaves = 1): string[] {
    return scaleNotes(root, mode, octaves);
  }
  function scale(root: string, mode = "major", octaves = 1): string[] {
    return scaleNotes(root, mode, octaves);
  }

  /** Devolve as notas de um acorde (sem tocar). */
  function acordeNotas(root: string, quality = "major"): string[] {
    return chordNotes(root, quality);
  }
  function chordNames(root: string, quality = "major"): string[] {
    return chordNotes(root, quality);
  }

  /** Frequência (Hz) de uma nota. */
  function frequencia(note: Note): number { return noteToFreq(note); }

  /** Repete uma função N vezes (awaitável). */
  async function repetir(n: number, fn: (i: number) => unknown): Promise<void> {
    for (let i = 0; i < n; i++) await fn(i);
  }
  async function times(n: number, fn: (i: number) => unknown): Promise<void> { await repetir(n, fn); }

  /** Escolhe um elemento aleatório do array. */
  function escolher<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function choose<T>(arr: T[]): T { return escolher(arr); }

  /** Número aleatório entre min e max. */
  function aleatorio(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
  function randint(min: number, max: number): number {
    return Math.floor(aleatorio(min, max + 1));
  }

  /** Imprime no console do studio. */
  function print(...args: unknown[]): void { cb.log(...args); }
  function log(...args: unknown[]): void { cb.log(...args); }
  function puts(...args: unknown[]): void { cb.log(...args); }

  /** Para a execução. */
  function parar(): void { engine.requestStop(); }
  function stop(): void { engine.requestStop(); }

  return {
    // notas e acordes
    play, nota: play, acorde, playChord: acorde,
    sequencia, sequence: sequencia, melodia: sequencia,
    // percussão
    tambor, drum: tambor, percussao: tambor,
    sequenciaTambor, drumSeq: sequenciaTambor,
    // configuração
    synth, use_synth, sintetizador, setSynth: synth,
    bpm, use_bpm, tempo, setBpm: bpm,
    volume, use_volume, setVolume: volume,
    // tempo
    sleep, dormir, esperar, pausa, wait: sleep, rest: sleep,
    // teoria
    escala, scale, acordeNotas, chordNames,
    frequencia, noteToFreq: frequencia, freq: frequencia,
    // utilidades
    repetir, times, escolher, choose, aleatorio, randint, random: aleatorio,
    // console / controle
    print, log, puts, parar, stop,
    // acesso ao motor (avançado)
    notaParaFreq: frequencia,
  };
}

export type MusicApi = ReturnType<typeof buildApi>;

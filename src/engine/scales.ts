/**
 * scales.ts — Teoria musical auxiliar.
 * Gera escalas e acordes a partir de uma tônica.
 */

import { NOTE_NAMES } from "./engine";

export type Mode =
  | "major" | "minor" | "major_pentatonic" | "minor_pentatonic"
  | "blues" | "chromatic" | "dorian" | "mixolydian";

const MODE_SEMITONES: Record<Mode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  major_pentatonic: [0, 2, 4, 7, 9],
  minor_pentatonic: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

const MODE_ALIASES: Record<string, Mode> = {
  major: "major", maior: "major", ionian: "major", jonio: "major",
  minor: "minor", menor: "minor", aeolian: "minor", eolio: "minor",
  major_pentatonic: "major_pentatonic", pentatonic_major: "major_pentatonic",
  menor_pentatonica: "minor_pentatonic", minor_pentatonic: "minor_pentatonic",
  blues: "blues", cromatica: "chromatic", chromatic: "chromatic",
  dorian: "dorian", mixolydian: "mixolydian", mixolidio: "mixolydian",
};

/** Analisa "C4" -> { letter: "C", octave: 4 }. */
function parseNote(note: string): { letter: string; octave: number; accidental: string } {
  const m = note.trim().match(/^([A-Ga-g])([#b]?)(-?\d)?$/);
  if (!m) throw new Error(`Nota inválida: "${note}"`);
  return { letter: m[1].toUpperCase(), accidental: m[2] ?? "", octave: m[3] ? parseInt(m[3], 10) : 4 };
}

/** Sobe uma nota em N semitons, ajustando nome e oitava. */
function transposeSemitones(note: string, semis: number): string {
  const { letter, accidental, octave } = parseNote(note);
  let idx = NOTE_NAMES.indexOf(letter);
  if (accidental === "#") idx += 1;
  if (accidental === "b") idx -= 1;
  let total = idx + semis;
  let oct = octave;
  while (total >= 12) { total -= 12; oct += 1; }
  while (total < 0) { total += 12; oct -= 1; }
  return NOTE_NAMES[((total % 12) + 12) % 12] + oct;
}

export function resolveMode(mode?: string): Mode {
  if (!mode) return "major";
  const m = MODE_ALIASES[mode.toLowerCase().trim()];
  if (!m) throw new Error(`Modo/escala desconhecido: "${mode}". Válidos: ${Object.keys(MODE_ALIASES).join(", ")}`);
  return m;
}

/**
 * Retorna as notas de uma escala.
 *  escala("C4", "major")       -> ["C4","D4","E4","F4","G4","A4","B4","C5"]
 *  escala("A3", "minor", 2)    -> duas oitavas
 */
export function scale(root: string, mode: string = "major", octaves = 1): string[] {
  const semis = MODE_SEMITONES[resolveMode(mode)];
  const out: string[] = [];
  for (let o = 0; o < octaves; o++) {
    for (const s of semis) out.push(transposeSemitones(root, s + o * 12));
  }
  // nota final (tônica da próxima oitava)
  out.push(transposeSemitones(root, 12 * octaves));
  return out;
}

/** Acordes comuns a partir de uma fundamental. */
const CHORD_FORMULAS: Record<string, number[]> = {
  major: [0, 4, 7], maj: [0, 4, 7], maior: [0, 4, 7],
  minor: [0, 3, 7], min: [0, 3, 7], menor: [0, 3, 7],
  dim: [0, 3, 6], diminuto: [0, 3, 6],
  aug: [0, 4, 8], aumentado: [0, 4, 8],
  maj7: [0, 4, 7, 11], "7": [0, 4, 7, 10], m7: [0, 3, 7, 10],
  sus4: [0, 5, 7], sus2: [0, 2, 7],
};

export function chord(root: string, quality: string = "major"): string[] {
  const formula = CHORD_FORMULAS[quality.toLowerCase().trim()];
  if (!formula) throw new Error(`Tipo de acorde desconhecido: "${quality}". Válidos: ${Object.keys(CHORD_FORMULAS).join(", ")}`);
  return formula.map((s) => transposeSemitones(root, s));
}

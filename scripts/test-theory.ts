// Teste rápido da teoria musical (notas/escalas/acordes).
import { noteToFreq } from "../src/engine/engine";
import { scale, chord } from "../src/engine/scales";

function assert(cond, msg) {
  if (!cond) { console.error("❌ FALHOU:", msg); process.exitCode = 1; }
  else console.log("✅", msg);
}

const round = (x) => Math.round(x * 100) / 100;

// A4 = 440 Hz
assert(round(noteToFreq("A4")) === 440, `A4 = 440 Hz (got ${round(noteToFreq("A4"))})`);
// C4 ≈ 261.63
assert(round(noteToFreq("C4")) === 261.63, `C4 ≈ 261.63 (got ${round(noteToFreq("C4"))})`);
// número passado = frequência direta
assert(noteToFreq(300) === 300, "número vira frequência direta");
// freq de string numérica
assert(noteToFreq("440") === 440, "string '440' vira 440 Hz");

// Escala maior de Dó: C D E F G A B C
const maj = scale("C4", "major");
assert(
  JSON.stringify(maj) === JSON.stringify(["C4","D4","E4","F4","G4","A4","B4","C5"]),
  "escala maior de Dó = " + JSON.stringify(maj),
);

// Pentatônica maior
const penta = scale("C4", "major_pentatonic");
assert(penta.length === 6, "pentatônica maior tem 5 notas + tônica (6)");

// Acorde maior de Dó: C E G
const cMaj = chord("C4", "major");
assert(
  JSON.stringify(cMaj) === JSON.stringify(["C4","E4","G4"]),
  "acorde Dó maior = " + JSON.stringify(cMaj),
);

// Acorde menor: C Eb G
const cMin = chord("C4", "minor");
assert(cMin[1] === "D#4", "acorde Dó menor tem Eb (D#4), got " + cMin[1]);

console.log("\n🎵 Todos os testes de teoria passaram!");

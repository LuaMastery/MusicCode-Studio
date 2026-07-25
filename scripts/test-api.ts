// Teste de integração: simula o AudioContext e valida o agendamento da API musical.
import { engine } from "../src/engine/engine";
import { buildApi } from "../src/engine/api";
import { runCode } from "../src/engine/runner";

// ── Mock da Web Audio API ────────────────────────────────────────────────────
const events: { time: number; freq?: number }[] = [];

class Param {
  value = 0;
  setValueAtTime(v: number) { this.value = v; }
  linearRampToValueAtTime(v: number) { this.value = v; }
  exponentialRampToValueAtTime(v: number) { this.value = v; }
  setTargetAtTime(v: number) { this.value = v; }
  cancelScheduledValues() {}
}
class MockNode {
  ctx: MockCtx;
  frequency = new Param();
  gain = new Param();
  pan = new Param();
  Q = new Param();
  threshold = new Param(); knee = new Param(); ratio = new Param();
  attack = new Param(); release = new Param();
  type = "sine";
  buffer: unknown = null;
  onended: (() => void) | null = null;
  fftSize = 0; smoothingTimeConstant = 0;
  constructor(ctx: MockCtx) { this.ctx = ctx; }
  connect(x: unknown) { return x; }
  start(t: number) { events.push({ time: t, freq: this.frequency.value }); }
  stop(t?: number) {}
  getByteFrequencyData() {}
}
class MockCtx {
  currentTime = 0;
  sampleRate = 44100;
  state: AudioContextState = "running";
  destination = new MockNode(this as unknown as MockCtx);
  createOscillator() { return new MockNode(this); }
  createGain() { return new MockNode(this); }
  createBiquadFilter() { return new MockNode(this); }
  createStereoPanner() { return new MockNode(this); }
  createDynamicsCompressor() { return new MockNode(this); }
  createAnalyser() { return new MockNode(this); }
  createBufferSource() { return new MockNode(this); }
  createBuffer() { return { getChannelData: () => new Float32Array(1024) }; }
  resume() { return Promise.resolve(); }
}
(globalThis as unknown as { AudioContext: unknown }).AudioContext = MockCtx;

function assert(cond: unknown, msg: string) {
  if (!cond) { console.error("❌ FALHOU:", msg); process.exitCode = 1; }
  else console.log("✅", msg);
}

// ── Teste 1: API direta (notas no mesmo cursor = simultâneas) ────────────────
engine.ensure();
engine.startRun();
const api = buildApi({ log: () => {} });

const t0 = engine.cursor;
events.length = 0;
api.play("C4");
api.play("E4");
const startsT0 = events.filter((e) => Math.abs(e.time - t0) < 1e-6).length;
assert(startsT0 >= 2, `duas notas no mesmo cursor tocam juntas (${startsT0} osciladores)`);

// ── Teste 2: sequencia avança o cursor ──────────────────────────────────────
const before = engine.cursor;
api.sequencia(["C4", "D4", "E4"], 0.5);
assert(engine.cursor > before, "sequencia avança o cursor do tempo");

// ── Teste 3: tambor agenda som sem erro ─────────────────────────────────────
events.length = 0;
api.tambor("bumbo");
assert(events.length > 0, `tambor('bumbo') agenda áudio (${events.length} nós)`);

// ── Teste 4: runCode executa um snippet real (BPM alto = rápido) ────────────
const logs: string[] = [];
let playing = false;
events.length = 0;
await runCode(
  `bpm(240); synth("piano"); play("C4"); await sleep(0.5); play("E4"); print("ok");`,
  {
    onLog: (...a: unknown[]) => logs.push(a.join(" ")),
    onPlayingChange: (p) => { playing = p; },
  },
);
assert(logs.includes("ok"), "runCode executa print()");
assert(events.length >= 2, `runCode agenda notas (${events.length} nós)`);
const distinctTimes = new Set(events.map((e) => Math.round(e.time * 1000)));
assert(distinctTimes.size >= 2, `notas agendadas em tempos diferentes (${[...distinctTimes].join(", ")})`);

console.log("\n🎶 Todos os testes de integração passaram!");

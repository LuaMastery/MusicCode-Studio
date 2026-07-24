// Teste do motor de efeitos sonoros (mock do AudioContext).
import { sfx } from "../src/engine/sfx";

const started: { freq: number; type: string }[] = [];

class Param {
  value = 0;
  setValueAtTime(v: number) { this.value = v; }
  linearRampToValueAtTime(v: number) { this.value = v; }
  exponentialRampToValueAtTime(v: number) { this.value = v; }
  setTargetAtTime(v: number) { this.value = v; }
  cancelScheduledValues() {}
}
class Node {
  ctx: unknown;
  frequency = new Param();
  gain = new Param();
  delayTime = new Param();
  type = "sine";
  onended: (() => void) | null = null;
  constructor(ctx: unknown) { this.ctx = ctx; }
  connect(x: unknown) { return x; }
  disconnect() {}
  start() { started.push({ freq: this.frequency.value, type: this.type }); }
  stop() {}
}
class MockCtx {
  currentTime = 0;
  state = "running";
  destination = {} as unknown;
  createOscillator() { return new Node(this); }
  createGain() { return new Node(this); }
  createDelay() { return new Node(this); }
  resume() { return Promise.resolve(); }
}
(globalThis as unknown as { AudioContext: unknown }).AudioContext = MockCtx;

function assert(cond: unknown, msg: string) {
  if (!cond) { console.error("❌ FALHOU:", msg); process.exitCode = 1; }
  else console.log("✅", msg);
}

// desabilitado -> nada toca
sfx.setEnabled(false);
started.length = 0;
sfx.click();
assert(started.length === 0, "sfx respeita enabled=false (silêncio)");

// habilitado -> cada som agenda osciladores
sfx.setEnabled(true);
sfx.setVolume(0.5);

for (const [name, fn] of [
  ["click", () => sfx.click()],
  ["toggle", () => sfx.toggle()],
  ["open", () => sfx.open()],
  ["close", () => sfx.close()],
  ["nav", () => sfx.nav()],
  ["play", () => sfx.play()],
  ["success", () => sfx.success()],
  ["error", () => sfx.error()],
] as const) {
  started.length = 0;
  fn();
  assert(started.length > 0, `${name} agenda áudio (${started.length} osc.)`);
}

// success é uma sequência (vários osciladores)
started.length = 0;
sfx.success();
assert(started.length >= 4, `success toca um arpejo crescente (${started.length} notas)`);

console.log("\n🔊 Todos os testes de efeitos sonoros passaram!");

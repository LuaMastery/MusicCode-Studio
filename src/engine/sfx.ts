/**
 * sfx.ts — Efeitos sonoros de interface (UI), sintetizados via Web Audio API.
 * Sons curtos, suaves e "satisfatórios" para cliques, toggles, painéis, etc.
 * Tem contexto próprio, volume independente e um eco sutil para dar "corpo".
 */

type ToneOpts = {
  freq?: number;
  glideTo?: number;
  dur?: number;
  type?: OscillatorType;
  amp?: number;
  attack?: number;
  when?: number;
  send?: number; // quanto do sinal vai pro eco (0..1)
};

class SfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private delay: DelayNode | null = null;
  enabled = true;
  volume = 0.4;

  private ensure(): void {
    if (this.ctx) return;
    const g = globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = g.AudioContext || g.webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();

    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.ctx.destination);

    // eco sutil (espaço / "satisfação")
    this.delay = this.ctx.createDelay(1.0);
    this.delay.delayTime.value = 0.12;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.16;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.22;
    this.delay.connect(fb);
    fb.connect(this.delay);
    this.delay.connect(wet);
    wet.connect(this.master);
  }

  setEnabled(v: boolean): void { this.enabled = v; }
  setVolume(v: number): void {
    this.volume = v;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
  }

  private tone(o: ToneOpts): void {
    if (!this.enabled) return;
    this.ensure();
    if (!this.ctx || !this.master || !this.delay) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();

    const {
      freq = 600, glideTo, dur = 0.12, type = "sine",
      amp = 0.25, attack = 0.004, when = 0, send = 0.3,
    } = o;
    const t0 = this.ctx.currentTime + when;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), t0 + dur);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(amp, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);
    g.connect(this.master);
    if (send > 0) {
      const s = this.ctx.createGain();
      s.gain.value = send;
      g.connect(s);
      s.connect(this.delay);
    }

    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
    osc.onended = () => { try { g.disconnect(); } catch { /* */ } };
  }

  // ── Sons ───────────────────────────────────────────────────────────────────
  click(): void {
    this.tone({ freq: 540, dur: 0.08, amp: 0.22, type: "sine" });
    this.tone({ freq: 1080, dur: 0.04, amp: 0.06, type: "sine", send: 0.1 });
  }

  hover(): void {
    this.tone({ freq: 1500, dur: 0.03, amp: 0.04, send: 0 });
  }

  toggle(): void {
    this.tone({ freq: 620, dur: 0.06, amp: 0.18 });
    this.tone({ freq: 930, dur: 0.08, amp: 0.18, when: 0.05 });
  }

  open(): void {
    this.tone({ freq: 320, glideTo: 880, dur: 0.18, amp: 0.2, type: "sine" });
    this.tone({ freq: 660, dur: 0.12, amp: 0.08, when: 0.04, send: 0.15 });
  }

  close(): void {
    this.tone({ freq: 880, glideTo: 320, dur: 0.16, amp: 0.18, type: "sine" });
  }

  nav(): void {
    this.tone({ freq: 720, dur: 0.06, amp: 0.15 });
    this.tone({ freq: 1080, dur: 0.05, amp: 0.1, when: 0.03, send: 0.15 });
  }

  play(): void {
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((f, i) => this.tone({ freq: f, dur: 0.14, amp: 0.2, when: i * 0.06, send: 0.25 }));
  }

  success(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => this.tone({ freq: f, dur: 0.18, amp: 0.2, when: i * 0.07, send: 0.3 }));
  }

  error(): void {
    this.tone({ freq: 400, glideTo: 280, dur: 0.18, amp: 0.2, type: "sine" });
    this.tone({ freq: 200, dur: 0.16, amp: 0.12, when: 0.04, send: 0.1 });
  }
}

export const sfx = new SfxEngine();

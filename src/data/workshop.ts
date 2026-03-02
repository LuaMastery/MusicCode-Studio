// ─── Tipos ────────────────────────────────────────────────────────────────────
export type LangId =
  | "lua"
  | "java"
  | "html"
  | "javascript"
  | "python"
  | "ruby"
  | "csharp"
  | "kotlin";

export type ExtStatus = "installed" | "available" | "deprecated";

export interface Extension {
  id: LangId;
  name: string;
  fullName: string;
  version: string;
  author: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  gradient: string;
  border: string;
  bg: string;
  badge: string;
  status: ExtStatus;
  featured: boolean;
  tags: string[];
  features: string[];
  size: string;
  downloads: string;
  rating: number;
  deprecated?: boolean;
  deprecatedReason?: string;
  templates?: WorkshopTemplate[];
}

export interface WorkshopTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  audioMode: "lua" | "java" | "html" | "javascript" | "python";
}

// ─── Templates Lua ────────────────────────────────────────────────────────────
const luaTemplates: WorkshopTemplate[] = [
  {
    id: "lua-melody",
    name: "🎵 Melodia Simples",
    description: "Sequência de notas com frequências Hz",
    audioMode: "lua",
    code: `-- 🎵 MusicCode Studio — Melodia em Lua
local notas = {
  Do=261.63, Re=293.66, Mi=329.63,
  Fa=349.23, Sol=392.00, La=440.00,
  Si=493.88, Do2=523.25,
}

local melodia = {
  {nota="Do",  duracao=0.5},{nota="Re",  duracao=0.5},
  {nota="Mi",  duracao=0.5},{nota="Fa",  duracao=0.5},
  {nota="Sol", duracao=1.0},{nota="Sol", duracao=1.0},
  {nota="La",  duracao=0.5},{nota="La",  duracao=0.5},
  {nota="La",  duracao=0.5},{nota="La",  duracao=0.5},
  {nota="Sol", duracao=2.0},
}

function tocarNota(freq, duracao)
  print(string.format("🎵 %.2f Hz — %.1fs", freq, duracao))
  local t = os.clock()
  while os.clock() - t < duracao do end
end

print("🎶 Tocando melodia...")
for _, p in ipairs(melodia) do
  tocarNota(notas[p.nota], p.duracao)
end
print("✅ Concluído!")`,
  },
  {
    id: "lua-rhythm",
    name: "🥁 Gerador de Ritmo",
    description: "Padrões de batida com BPM controlável",
    audioMode: "lua",
    code: `-- 🥁 Gerador de Ritmo em Lua
local bateria = {
  kick="💥 KICK", snare="🔔 SNARE",
  hihat="🎵 HI-HAT", pausa="   ----",
}
local padrao = {
  {1,0,1},{0,0,1},{0,1,1},{0,0,1},
  {1,0,1},{1,0,0},{0,1,1},{0,0,1},
}
local BPM = 120
local spb = 60 / BPM / 2

function tocarPadrao(reps)
  print(string.format("🎶 BPM: %d", BPM))
  for r=1,reps do
    print(string.format("🔄 Repetição %d/%d", r, reps))
    for i,beat in ipairs(padrao) do
      local l = string.format("  Beat %d: ", i)
      if beat[1]==1 then l=l..bateria.kick.." " end
      if beat[2]==1 then l=l..bateria.snare.." " end
      if beat[3]==1 then l=l..bateria.hihat.." " end
      print(l)
      local t=os.clock() while os.clock()-t<spb do end
    end
  end
  print("✅ Ritmo finalizado!")
end

tocarPadrao(2)`,
  },
  {
    id: "lua-scales",
    name: "🎼 Escalas Musicais",
    description: "Maior, menor, pentatônica e blues",
    audioMode: "lua",
    code: `-- 🎼 Escalas Musicais em Lua
local BASE = {C=261.63,D=293.66,E=329.63,F=349.23,G=392.00,A=440.00,B=493.88}
local escalas = {
  maior={0,2,4,5,7,9,11,12},
  menor={0,2,3,5,7,8,10,12},
  pentatonica={0,2,4,7,9,12},
  blues={0,3,5,6,7,10,12},
}
function semitom(base, s)
  return base * (2^(s/12))
end
function tocarEscala(nota, tipo)
  local freq = BASE[nota]
  print(string.format("\\n🎵 Escala %s %s:", nota, tipo))
  for i, s in ipairs(escalas[tipo]) do
    local f = semitom(freq, s)
    print(string.format("  Nota %d | %.2f Hz", i, f))
    local t=os.clock() while os.clock()-t<0.3 do end
  end
end
tocarEscala("C","maior")
tocarEscala("A","menor")
tocarEscala("G","pentatonica")
print("\\n✅ Escalas concluídas!")`,
  },
];

// ─── Templates Java ───────────────────────────────────────────────────────────
const javaTemplates: WorkshopTemplate[] = [
  {
    id: "java-synth",
    name: "🔊 Sintetizador Java",
    description: "Gera tons com javax.sound.sampled",
    audioMode: "java",
    code: `// 🎵 Sintetizador — Java Sound API
import javax.sound.sampled.*;
import java.util.*;

public class Synth {
  static final int SR = 44100;

  enum Nota {
    DO(261.63), RE(293.66), MI(329.63),
    FA(349.23), SOL(392.00), LA(440.00),
    SI(493.88), DO2(523.25), PAUSA(0);
    final double f;
    Nota(double f){this.f=f;}
  }

  static byte[] onda(double freq, int ms) {
    int n = SR*ms/1000;
    byte[] b = new byte[n];
    for(int i=0;i<n;i++)
      b[i]=(byte)(Math.sin(2*Math.PI*freq*i/SR)*80);
    return b;
  }

  static void tocar(Nota nota, int ms) throws Exception {
    System.out.printf("🎵 %-5s | %.2f Hz%n", nota.name(), nota.f);
    if(nota==Nota.PAUSA){Thread.sleep(ms);return;}
    AudioFormat fmt=new AudioFormat(SR,8,1,true,false);
    SourceDataLine l=AudioSystem.getSourceDataLine(fmt);
    l.open(fmt);l.start();
    l.write(onda(nota.f,ms),0,onda(nota.f,ms).length);
    l.drain();l.close();
  }

  public static void main(String[] a) throws Exception {
    System.out.println("🎶 Java Synth!");
    Nota[] seq={Nota.MI,Nota.MI,Nota.FA,Nota.SOL,
                Nota.SOL,Nota.FA,Nota.MI,Nota.RE,
                Nota.DO,Nota.DO,Nota.RE,Nota.MI};
    for(Nota n:seq) tocar(n,400);
    System.out.println("✅ Concluído!");
  }
}`,
  },
  {
    id: "java-drum",
    name: "🥁 Drum Machine MIDI",
    description: "Sequenciador de bateria com MIDI",
    audioMode: "java",
    code: `// 🥁 Drum Machine — Java MIDI
import javax.sound.midi.*;

public class DrumMachine {
  static final int KICK=36,SNARE=38,HIHAT=42,CLAP=39;
  static final int BPM=128;
  static Track track;

  static void nota(int inst, int tick, int vel) throws Exception {
    ShortMessage on=new ShortMessage();
    on.setMessage(ShortMessage.NOTE_ON,9,inst,vel);
    track.add(new MidiEvent(on,tick));
    ShortMessage off=new ShortMessage();
    off.setMessage(ShortMessage.NOTE_OFF,9,inst,0);
    track.add(new MidiEvent(off,tick+10));
    String nm=inst==KICK?"💥 KICK":inst==SNARE?"🔔 SNARE":
               inst==HIHAT?"🎵 HIHAT":"👏 CLAP";
    System.out.printf("  tick %3d | %s (vel:%d)%n",tick,nm,vel);
  }

  public static void main(String[] a) throws Exception {
    System.out.println("🥁 Drum Machine — BPM: "+BPM);
    Sequencer sq=MidiSystem.getSequencer();sq.open();
    Sequence seq=new Sequence(Sequence.PPQ,4,1);
    track=seq.createTrack();

    nota(KICK,0,127); nota(HIHAT,0,90);
    nota(HIHAT,2,70); nota(SNARE,4,120);
    nota(HIHAT,4,90); nota(HIHAT,6,70);
    nota(KICK,8,127); nota(HIHAT,8,90);
    nota(SNARE,12,120);nota(HIHAT,12,90);

    sq.setSequence(seq);sq.setTempoInBPM(BPM);
    sq.setLoopCount(3);sq.start();
    System.out.println("▶️ Tocando 3x...");
    Thread.sleep(7000);sq.stop();sq.close();
    System.out.println("⏹ Finalizado!");
  }
}`,
  },
  {
    id: "java-piano",
    name: "🎹 Piano Virtual",
    description: "Piano interativo com Java Swing + MIDI",
    audioMode: "java",
    code: `// 🎹 Piano Virtual — Java Swing + MIDI
import javax.sound.midi.*;
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;

public class Piano extends JFrame {
  static MidiChannel ch;
  static final Map<Character,Integer> MAP=new LinkedHashMap<>(){{
    put('a',60);put('s',62);put('d',64);put('f',65);
    put('g',67);put('h',69);put('j',71);put('k',72);
    put('w',61);put('e',63);put('t',66);put('y',68);put('u',70);
  }};
  static final String[] NMS={"Dó","Dó#","Ré","Ré#","Mi","Fá","Fá#","Sol","Sol#","Lá","Lá#","Si"};

  public Piano() throws Exception {
    super("🎹 Piano — MusicCode");
    Synthesizer sy=MidiSystem.getSynthesizer();sy.open();
    ch=sy.getChannels()[0];ch.programChange(0);
    JTextArea log=new JTextArea(5,40);
    log.setBackground(new Color(20,20,35));
    log.setForeground(new Color(100,255,150));
    log.setFont(new Font("Monospaced",Font.PLAIN,12));
    log.setEditable(false);
    JLabel info=new JLabel("<html><center>Teclas: A S D F G H J K · W E T Y U</center></html>",0);
    info.setForeground(Color.WHITE);info.setBackground(new Color(30,30,50));
    info.setOpaque(true);
    add(info,BorderLayout.NORTH);add(new JScrollPane(log),BorderLayout.SOUTH);
    addKeyListener(new KeyAdapter(){
      public void keyPressed(KeyEvent e){
        char c=Character.toLowerCase(e.getKeyChar());
        if(MAP.containsKey(c)){
          int n=MAP.get(c);ch.noteOn(n,100);
          log.append("🎵 "+NMS[n%12]+" (MIDI:"+n+")\\n");
          log.setCaretPosition(log.getDocument().getLength());
        }
      }
      public void keyReleased(KeyEvent e){
        char c=Character.toLowerCase(e.getKeyChar());
        if(MAP.containsKey(c))ch.noteOff(MAP.get(c));
      }
    });
    setSize(700,350);setDefaultCloseOperation(EXIT_ON_CLOSE);
    setLocationRelativeTo(null);setVisible(true);requestFocus();
  }

  public static void main(String[] a) throws Exception {
    System.out.println("🎹 Iniciando Piano Virtual...");
    SwingUtilities.invokeLater(()->{
      try{new Piano();}catch(Exception ex){ex.printStackTrace();}
    });
  }
}`,
  },
];

// ─── Templates HTML ───────────────────────────────────────────────────────────
const htmlTemplates: WorkshopTemplate[] = [
  {
    id: "html-piano",
    name: "🎹 Piano Interativo",
    description: "Piano completo no navegador com Web Audio API",
    audioMode: "html",
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🎹 Piano</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);
      min-height:100vh;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      font-family:'Segoe UI',sans-serif;color:white}
    h1{font-size:2rem;margin-bottom:8px;text-align:center}
    p{color:#aaa;margin-bottom:24px;text-align:center;font-size:14px}
    .piano{display:flex;position:relative;border-radius:12px;
      box-shadow:0 20px 60px rgba(0,0,0,.8)}
    .key{position:relative;display:flex;align-items:flex-end;
      justify-content:center;padding-bottom:10px;font-size:10px;
      font-weight:bold;cursor:pointer;user-select:none;
      border-radius:0 0 8px 8px;transition:all 0.05s}
    .white{width:56px;height:190px;background:linear-gradient(to bottom,#f5f5f5,#fff);
      border:1px solid #ccc;color:#555;z-index:1}
    .white:hover,.white.active{background:linear-gradient(to bottom,#ddf,#ccf);transform:translateY(2px)}
    .black{width:36px;height:120px;background:linear-gradient(to bottom,#222,#444);
      color:#aaa;z-index:2;margin:0 -18px;box-shadow:2px 4px 12px rgba(0,0,0,.6)}
    .black:hover,.black.active{background:linear-gradient(to bottom,#5b3fff,#9b59ff);transform:translateY(2px)}
    .note-display{margin-top:24px;font-size:2rem;color:#a78bfa;font-weight:bold;
      letter-spacing:6px;min-height:52px;text-align:center}
  </style>
</head>
<body>
  <h1>🎹 Piano Web</h1>
  <p>Clique nas teclas ou use: A S D F G H J K (brancas) · W E T Y U (pretas)</p>
  <div class="piano" id="piano"></div>
  <div class="note-display" id="nd">♪</div>
<script>
  const AC=window.AudioContext||window.webkitAudioContext, ctx=new AC();
  const notes=[
    {n:"Dó",f:261.63,t:"a",c:"white"},{n:"Dó#",f:277.18,t:"w",c:"black"},
    {n:"Ré",f:293.66,t:"s",c:"white"},{n:"Ré#",f:311.13,t:"e",c:"black"},
    {n:"Mi",f:329.63,t:"d",c:"white"},
    {n:"Fá",f:349.23,t:"f",c:"white"},{n:"Fá#",f:369.99,t:"t",c:"black"},
    {n:"Sol",f:392.00,t:"g",c:"white"},{n:"Sol#",f:415.30,t:"y",c:"black"},
    {n:"Lá",f:440.00,t:"h",c:"white"},{n:"Lá#",f:466.16,t:"u",c:"black"},
    {n:"Si",f:493.88,t:"j",c:"white"},
    {n:"Dó2",f:523.25,t:"k",c:"white"},
  ];
  const oscs={},nd=document.getElementById("nd"),piano=document.getElementById("piano");
  function on(no){
    if(oscs[no.n])return;
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type="triangle";o.frequency.value=no.f;
    g.gain.setValueAtTime(0.4,ctx.currentTime);
    o.connect(g);g.connect(ctx.destination);o.start();
    oscs[no.n]={o,g};nd.textContent="♪ "+no.n;
    document.getElementById("k"+no.n).classList.add("active");
  }
  function off(no){
    if(!oscs[no.n])return;
    const {o,g}=oscs[no.n];
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.25);
    o.stop(ctx.currentTime+0.25);delete oscs[no.n];
    nd.textContent="♪";
    document.getElementById("k"+no.n).classList.remove("active");
  }
  notes.forEach(no=>{
    const k=document.createElement("div");
    k.id="k"+no.n;k.className="key "+no.c;
    k.innerHTML="<span>"+no.t.toUpperCase()+"</span>";
    k.onmousedown=()=>on(no);k.onmouseup=()=>off(no);k.onmouseleave=()=>off(no);
    k.ontouchstart=e=>{e.preventDefault();on(no)};
    k.ontouchend=e=>{e.preventDefault();off(no)};
    piano.appendChild(k);
  });
  const map={};notes.forEach(n=>map[n.t]=n);
  document.onkeydown=e=>{const n=map[e.key.toLowerCase()];if(n)on(n)};
  document.onkeyup=e=>{const n=map[e.key.toLowerCase()];if(n)off(n)};
</script>
</body></html>`,
  },
  {
    id: "html-beatmaker",
    name: "🥁 Beat Maker",
    description: "Sequenciador de 16 passos com 6 instrumentos",
    audioMode: "html",
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🥁 Beat Maker</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0d0d1a;font-family:'Segoe UI',sans-serif;color:white;
      display:flex;flex-direction:column;align-items:center;padding:28px 16px;min-height:100vh}
    h1{color:#a78bfa;font-size:1.6rem;margin-bottom:4px}
    p{color:#555;font-size:12px;margin-bottom:20px}
    .ctrl{display:flex;gap:10px;align-items:center;margin-bottom:20px;flex-wrap:wrap;justify-content:center}
    button{padding:9px 20px;border:none;border-radius:50px;font-weight:bold;cursor:pointer;font-size:13px}
    #play{background:linear-gradient(135deg,#7c3aed,#a855f7);color:white}
    #stop{background:linear-gradient(135deg,#dc2626,#ef4444);color:white}
    #clear{background:#1e1e2e;color:#aaa}
    .bw{display:flex;align-items:center;gap:6px;color:#aaa;font-size:13px}
    input[type=range]{accent-color:#a855f7}
    .seq{display:flex;flex-direction:column;gap:7px;width:100%;max-width:740px}
    .track{display:flex;align-items:center;gap:7px}
    .tname{width:68px;font-size:11px;color:#666;text-align:right}
    .steps{display:flex;gap:4px;flex-wrap:wrap}
    .step{width:36px;height:36px;border-radius:7px;background:#1a1a2e;
      border:2px solid #2a2a4a;cursor:pointer;transition:all .1s}
    .step:hover{border-color:#7c3aed}
    .step.on{border-color:#a78bfa}
    .step.playing{box-shadow:0 0 10px currentColor}
    .step.g4{margin-left:8px}
  </style>
</head>
<body>
  <h1>🥁 Beat Maker</h1>
  <p>Clique nos quadrados para ativar as batidas | 16 passos por compasso</p>
  <div class="ctrl">
    <button id="play">▶ Play</button>
    <button id="stop">⏹ Stop</button>
    <button id="clear">🗑 Limpar</button>
    <div class="bw">BPM: <span id="bv">120</span>
      <input type="range" min="60" max="200" value="120" id="bpm"></div>
  </div>
  <div class="seq" id="seq"></div>
<script>
  const ctx=new(window.AudioContext||window.webkitAudioContext)();
  const STEPS=16;
  const tracks=[
    {n:"Kick",cor:"#7c3aed",t:"kick"},
    {n:"Snare",cor:"#ec4899",t:"snare"},
    {n:"Hi-Hat",cor:"#f59e0b",t:"hihat"},
    {n:"Tom",cor:"#3b82f6",t:"tom"},
    {n:"Clap",cor:"#ef4444",t:"clap"},
    {n:"Open HH",cor:"#10b981",t:"openHH"},
  ];
  const state=tracks.map(()=>Array(STEPS).fill(false));
  function sound(t,w=ctx.currentTime){
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    if(t==="kick"){
      o.type="sine";o.frequency.setValueAtTime(150,w);
      o.frequency.exponentialRampToValueAtTime(.01,w+.3);
      g.gain.setValueAtTime(.9,w);g.gain.exponentialRampToValueAtTime(.01,w+.3);
      o.start(w);o.stop(w+.3);
    } else if(t==="snare"||t==="clap"){
      const bs=ctx.createBufferSource(),buf=ctx.createBuffer(1,ctx.sampleRate*.15,ctx.sampleRate);
      const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      bs.buffer=buf;bs.connect(g);g.gain.setValueAtTime(.5,w);
      g.gain.exponentialRampToValueAtTime(.01,w+.15);bs.start(w);
    } else if(t==="hihat"||t==="openHH"){
      const dur=t==="openHH"?.25:.05;
      const bs=ctx.createBufferSource(),buf=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate);
      const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      const f=ctx.createBiquadFilter();f.type="highpass";f.frequency.value=5000;
      bs.buffer=buf;bs.connect(f);f.connect(g);
      g.gain.setValueAtTime(.35,w);g.gain.exponentialRampToValueAtTime(.01,w+dur);bs.start(w);
    } else {
      o.type="triangle";o.frequency.value=120;
      g.gain.setValueAtTime(.6,w);g.gain.exponentialRampToValueAtTime(.01,w+.2);
      o.start(w);o.stop(w+.2);
    }
  }
  const seq=document.getElementById("seq");
  const els=tracks.map((tr,fi)=>{
    const row=document.createElement("div");row.className="track";
    const nm=document.createElement("div");nm.className="tname";nm.textContent=tr.n;row.appendChild(nm);
    const steps=document.createElement("div");steps.className="steps";
    const es=[];
    for(let s=0;s<STEPS;s++){
      const el=document.createElement("div");
      el.className="step"+(s%4===0&&s>0?" g4":"");
      el.style.color=tr.cor;
      el.onclick=()=>{
        state[fi][s]=!state[fi][s];el.classList.toggle("on",state[fi][s]);
        el.style.background=state[fi][s]?tr.cor:"";el.style.borderColor=state[fi][s]?tr.cor:"";
      };
      steps.appendChild(el);es.push(el);
    }
    row.appendChild(steps);seq.appendChild(row);return es;
  });
  let step=0,iv=null;
  function tick(){
    els.forEach(e=>e.forEach(x=>x.classList.remove("playing")));
    tracks.forEach((tr,fi)=>{
      els[fi][step].classList.add("playing");
      if(state[fi][step])sound(tr.t);
    });
    step=(step+1)%STEPS;
  }
  const bpmI=document.getElementById("bpm"),bv=document.getElementById("bv");
  document.getElementById("play").onclick=()=>{
    if(iv)clearInterval(iv);step=0;
    iv=setInterval(tick,(60/parseInt(bpmI.value)/4)*1000);
  };
  document.getElementById("stop").onclick=()=>{
    clearInterval(iv);iv=null;step=0;
    els.forEach(e=>e.forEach(x=>x.classList.remove("playing")));
  };
  document.getElementById("clear").onclick=()=>{
    state.forEach(r=>r.fill(false));
    els.forEach(e=>e.forEach(x=>{x.classList.remove("on","playing");x.style.background=x.style.borderColor="";}));
  };
  bpmI.oninput=()=>{bv.textContent=bpmI.value;if(iv){clearInterval(iv);iv=setInterval(tick,(60/parseInt(bpmI.value)/4)*1000);}};
</script>
</body></html>`,
  },
  {
    id: "html-visualizer",
    name: "🌈 Visualizador de Áudio",
    description: "Visualizador em tempo real com Canvas e Web Audio",
    audioMode: "html",
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🌈 Visualizador</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a0f;display:flex;flex-direction:column;align-items:center;
      justify-content:center;min-height:100vh;font-family:'Segoe UI',sans-serif;color:white}
    h1{font-size:1.6rem;color:#a78bfa;margin-bottom:4px}
    p{color:#555;font-size:12px;margin-bottom:18px}
    canvas{border-radius:14px;box-shadow:0 0 40px rgba(167,139,250,.3)}
    .ctrl{margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
    button{padding:9px 20px;border:none;border-radius:50px;font-weight:bold;
      cursor:pointer;font-size:13px;transition:all .2s}
    #bMic{background:linear-gradient(135deg,#7c3aed,#a855f7);color:white}
    #bDemo{background:linear-gradient(135deg,#059669,#10b981);color:white}
    #bStop{background:linear-gradient(135deg,#dc2626,#ef4444);color:white}
    .mb{background:#1e1e2e;color:#888;padding:7px 14px;border-radius:20px;font-size:12px}
    .mb.on{background:#7c3aed;color:white}
    button:hover{opacity:.85;transform:scale(1.04)}
  </style>
</head>
<body>
  <h1>🌈 Visualizador Musical</h1>
  <p>Ative o microfone ou use a demo</p>
  <canvas id="c" width="680" height="280"></canvas>
  <div class="ctrl">
    <button id="bMic">🎤 Microfone</button>
    <button id="bDemo">🎵 Demo</button>
    <button id="bStop">⏹ Parar</button>
    <button class="mb on" data-m="bars">📊 Barras</button>
    <button class="mb" data-m="wave">〰️ Onda</button>
    <button class="mb" data-m="circle">🔵 Círculo</button>
  </div>
<script>
  const canvas=document.getElementById("c"),cx=canvas.getContext("2d");
  let aid,an,da,ac,mode="bars";
  function setup(stream){
    ac=new(window.AudioContext||window.webkitAudioContext)();
    an=ac.createAnalyser();an.fftSize=256;da=new Uint8Array(an.frequencyBinCount);
    const src=ac.createMediaStreamSource(stream);src.connect(an);draw();
  }
  function demo(){
    ac=new(window.AudioContext||window.webkitAudioContext)();
    an=ac.createAnalyser();an.fftSize=256;da=new Uint8Array(an.frequencyBinCount);
    const o=ac.createOscillator(),g=ac.createGain();
    o.type="sawtooth";o.frequency.value=220;g.gain.value=0.3;
    o.connect(g);g.connect(an);g.connect(ac.destination);o.start();
    let t=0;setInterval(()=>{o.frequency.value=220+Math.sin(t)*80+Math.sin(t*2.3)*40;t+=.1;},50);
    draw();
  }
  const cols=["#7c3aed","#a855f7","#ec4899","#f59e0b","#10b981","#3b82f6"];
  function draw(){
    aid=requestAnimationFrame(draw);if(!an)return;
    an.getByteFrequencyData(da);
    cx.fillStyle="rgba(10,10,15,.2)";cx.fillRect(0,0,680,280);
    const N=da.length,W=680,H=280;
    if(mode==="bars"){
      const bw=W/N;
      for(let i=0;i<N;i++){
        const v=da[i]/255,h=v*H;
        const gr=cx.createLinearGradient(0,H,0,H-h);
        gr.addColorStop(0,"#7c3aed");gr.addColorStop(1,"#ec4899");
        cx.fillStyle=gr;cx.fillRect(i*bw,H-h,bw-1,h);
      }
    } else if(mode==="wave"){
      an.getByteTimeDomainData(da);
      cx.beginPath();cx.lineWidth=2;cx.strokeStyle="#a855f7";
      const sw=W/N;let x=0;
      for(let i=0;i<N;i++){const v=da[i]/128,y=(v*H)/2;i?cx.lineTo(x,y):cx.moveTo(x,y);x+=sw;}
      cx.lineTo(W,H/2);cx.stroke();
    } else {
      const ox=W/2,oy=H/2,r=70;
      for(let i=0;i<N;i++){
        const a=(i/N)*Math.PI*2,amp=(da[i]/255)*90;
        cx.beginPath();cx.moveTo(ox+Math.cos(a)*r,oy+Math.sin(a)*r);
        cx.lineTo(ox+Math.cos(a)*(r+amp),oy+Math.sin(a)*(r+amp));
        cx.strokeStyle=cols[i%cols.length];cx.lineWidth=2;cx.stroke();
      }
    }
  }
  document.getElementById("bMic").onclick=async()=>{
    cancelAnimationFrame(aid);if(ac)ac.close();
    const s=await navigator.mediaDevices.getUserMedia({audio:true});setup(s);
  };
  document.getElementById("bDemo").onclick=()=>{cancelAnimationFrame(aid);if(ac)ac.close();demo();};
  document.getElementById("bStop").onclick=()=>{cancelAnimationFrame(aid);if(ac)ac.close();cx.clearRect(0,0,680,280);};
  document.querySelectorAll("[data-m]").forEach(b=>{
    b.onclick=()=>{document.querySelectorAll("[data-m]").forEach(x=>x.classList.remove("on"));b.classList.add("on");mode=b.dataset.m;};
  });
</script>
</body></html>`,
  },
];

// ─── Templates JavaScript ─────────────────────────────────────────────────────
const javascriptTemplates: WorkshopTemplate[] = [
  {
    id: "js-melody",
    name: "🎵 Melodia com Web Audio",
    description: "Sequência de notas com osciladores e envelope ADSR",
    audioMode: "javascript",
    code: `// 🎵 Melodia com JavaScript + Web Audio API
const ctx = new (window.AudioContext || window.webkitAudioContext)();

// Mapa de notas (nome → frequência Hz)
const notas = {
  Do: 261.63, Re: 293.66, Mi: 329.63,
  Fa: 349.23, Sol: 392.00, La: 440.00,
  Si: 493.88, Do2: 523.25,
};

// Sequência da melodia: [nota, duração em segundos]
const melodia = [
  ["Do", 0.4], ["Mi", 0.4], ["Sol", 0.4], ["Do2", 0.8],
  ["Si", 0.4], ["La", 0.4], ["Sol", 0.8],
  ["Fa", 0.4], ["La", 0.4], ["Do2", 0.8],
  ["Mi", 0.4], ["Sol", 0.4], ["Do2", 1.2],
];

// Função para tocar uma nota com envelope
function tocarNota(freq, inicio, duracao) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;

  // Envelope ADSR
  gain.gain.setValueAtTime(0, inicio);
  gain.gain.linearRampToValueAtTime(0.5, inicio + 0.02);  // Attack
  gain.gain.exponentialRampToValueAtTime(0.3, inicio + 0.1); // Decay
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracao - 0.05); // Release

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(inicio);
  osc.stop(inicio + duracao);

  console.log(\`🎵 \${Object.keys(notas).find(k => notas[k] === freq)} | \${freq} Hz | \${duracao}s\`);
}

// Reproduzir melodia
let tempo = ctx.currentTime + 0.1;
console.log("🎶 Iniciando melodia JavaScript...");

for (const [nota, dur] of melodia) {
  tocarNota(notas[nota], tempo, dur);
  tempo += dur + 0.05;
}

console.log(\`✅ \${melodia.length} notas agendadas! Duração total: \${tempo.toFixed(1)}s\`);`,
  },
  {
    id: "js-drum",
    name: "🥁 Drum Machine JS",
    description: "Sequenciador de bateria com Web Audio API pura",
    audioMode: "javascript",
    code: `// 🥁 Drum Machine — JavaScript + Web Audio API
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const BPM = 130;
const stepTime = 60 / BPM / 4; // duração de cada passo (semicolcheia)

// ── Sintetizadores de bateria ──
function kick(when) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, when);
  osc.frequency.exponentialRampToValueAtTime(0.01, when + 0.35);
  gain.gain.setValueAtTime(1.0, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(when); osc.stop(when + 0.35);
}

function snare(when) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  gain.gain.setValueAtTime(0.6, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
  src.connect(gain); gain.connect(ctx.destination);
  src.start(when);
}

function hihat(when, open = false) {
  const dur = open ? 0.3 : 0.05;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "highpass"; filter.frequency.value = 6000;
  gain.gain.setValueAtTime(0.4, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
  src.buffer = buf; src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.start(when);
}

// ── Padrão de 16 passos ──
// 1 = ativar, 0 = silêncio
const padrao = {
  kick:  [1,0,0,0, 1,0,0,0, 1,0,1,0, 1,0,0,0],
  snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
  hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
  openH: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
};

// Agendar 2 compassos
let t = ctx.currentTime + 0.1;
console.log(\`🥁 BPM: \${BPM} | Agendando 2 compassos...\`);

for (let rep = 0; rep < 2; rep++) {
  for (let step = 0; step < 16; step++) {
    const when = t + (rep * 16 + step) * stepTime;
    if (padrao.kick[step])  kick(when);
    if (padrao.snare[step]) snare(when);
    if (padrao.hihat[step]) hihat(when);
    if (padrao.openH[step]) hihat(when, true);
  }
}

console.log(\`✅ Drum machine iniciada! Duração: \${(32 * stepTime).toFixed(1)}s\`);`,
  },
  {
    id: "js-synth",
    name: "🎹 Sintetizador com Efeitos",
    description: "Osciladores com reverb, delay e filtro passa-baixas",
    audioMode: "javascript",
    code: `// 🎹 Sintetizador com Efeitos — JavaScript Web Audio API
const ctx = new (window.AudioContext || window.webkitAudioContext)();

// ── Criar Reverb (Convolution) ──
async function criarReverb() {
  const dur = 2.5, decay = 3;
  const rate = ctx.sampleRate;
  const len = rate * dur;
  const buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  const reverb = ctx.createConvolver();
  reverb.buffer = buf;
  return reverb;
}

// ── Criar Delay ──
function criarDelay(tempo = 0.35, feedback = 0.4) {
  const delay = ctx.createDelay(2.0);
  const fb = ctx.createGain();
  delay.delayTime.value = tempo;
  fb.gain.value = feedback;
  delay.connect(fb); fb.connect(delay);
  return delay;
}

// ── Criar Filtro ──
function criarFiltro(freq = 1200, type = "lowpass") {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = 5;
  return filter;
}

// ── Tocar acorde ──
async function tocarAcorde(freqs, inicio, dur) {
  const reverb = await criarReverb();
  const delay = criarDelay(0.3, 0.35);
  const filtro = criarFiltro(800 + inicio * 200);
  const masterGain = ctx.createGain();

  reverb.connect(ctx.destination);
  delay.connect(reverb);
  filtro.connect(delay);
  masterGain.connect(filtro);
  masterGain.gain.setValueAtTime(0, inicio);
  masterGain.gain.linearRampToValueAtTime(0.15, inicio + 0.05);
  masterGain.gain.exponentialRampToValueAtTime(0.001, inicio + dur);

  freqs.forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 10; // leve detune
    osc.connect(masterGain);
    osc.start(inicio); osc.stop(inicio + dur + 0.5);
    console.log(\`  🎵 \${freq.toFixed(1)} Hz\`);
  });
}

// ── Progressão de acordes ──
const acordes = [
  { nome: "Dó Maior",   freqs: [261.63, 329.63, 392.00], dur: 1.2 },
  { nome: "Lá menor",   freqs: [220.00, 261.63, 329.63], dur: 1.2 },
  { nome: "Fá Maior",   freqs: [174.61, 220.00, 261.63], dur: 1.2 },
  { nome: "Sol Maior",  freqs: [196.00, 246.94, 293.66], dur: 1.6 },
];

(async () => {
  let t = ctx.currentTime + 0.2;
  console.log("🎹 Iniciando sintetizador com efeitos...");
  for (const ac of acordes) {
    console.log(\`🎼 \${ac.nome}:\`);
    await tocarAcorde(ac.freqs, t, ac.dur);
    t += ac.dur + 0.1;
  }
  console.log("✅ Progressão de acordes agendada!");
})();`,
  },
];

// ─── Templates Python ─────────────────────────────────────────────────────────
const pythonTemplates: WorkshopTemplate[] = [
  {
    id: "py-melody",
    name: "🎵 Melodia em Python",
    description: "Sequência de notas com frequências e duração",
    audioMode: "python",
    code: `# 🎵 Melodia Musical em Python
# MusicCode Studio — Simulador Python

# Mapa de notas (nome → frequência Hz)
notas = {
    "Do":  261.63, "Re":  293.66, "Mi":  329.63,
    "Fa":  349.23, "Sol": 392.00, "La":  440.00,
    "Si":  493.88, "Do2": 523.25, "Re2": 587.33,
}

# Sequência: lista de (nota, duração)
melodia = [
    ("Do",  0.4), ("Re",  0.4), ("Mi",  0.4), ("Fa",  0.4),
    ("Sol", 0.8), ("Sol", 0.8),
    ("La",  0.4), ("La",  0.4), ("La",  0.4), ("La",  0.4),
    ("Sol", 1.6),
    ("Fa",  0.4), ("Fa",  0.4), ("Fa",  0.4), ("Fa",  0.4),
    ("Mi",  0.8), ("Mi",  0.8),
    ("Re",  0.4), ("Re",  0.4), ("Re",  0.4), ("Re",  0.4),
    ("Do",  2.0),
]

def tocar_nota(nome, freq, duracao):
    print(f"🎵 {nome:<5} | {freq:.2f} Hz | {duracao:.1f}s")

def reproduzir_melodia(seq):
    print("🎶 Iniciando melodia...")
    total = sum(d for _, d in seq)
    for nome, dur in seq:
        freq = notas.get(nome, 0)
        if freq:
            tocar_nota(nome, freq, dur)
        else:
            print(f"⚠️  Nota desconhecida: {nome}")
    print(f"\\n✅ Concluído! {len(seq)} notas | {total:.1f}s total")

reproduzir_melodia(melodia)`,
  },
  {
    id: "py-scales",
    name: "🎼 Escalas Musicais",
    description: "Escalas maior, menor, pentatônica e blues em Python",
    audioMode: "python",
    code: `# 🎼 Escalas Musicais em Python
# MusicCode Studio — Simulador Python

import math

# Frequência base (Dó central = C4)
FREQUENCIAS_BASE = {
    "C": 261.63, "D": 293.66, "E": 329.63,
    "F": 349.23, "G": 392.00, "A": 440.00,
    "B": 493.88,
}

NOMES_PT = {
    0: "Dó", 1: "Dó#", 2: "Ré", 3: "Ré#", 4: "Mi",
    5: "Fá", 6: "Fá#", 7: "Sol", 8: "Sol#", 9: "Lá",
    10: "Lá#", 11: "Si",
}

# Intervalos das escalas em semitons
ESCALAS = {
    "Maior":      [0, 2, 4, 5, 7, 9, 11, 12],
    "Menor":      [0, 2, 3, 5, 7, 8, 10, 12],
    "Pentatônica":[0, 2, 4, 7, 9, 12],
    "Blues":      [0, 3, 5, 6, 7, 10, 12],
    "Dórica":     [0, 2, 3, 5, 7, 9, 10, 12],
}

def semitom_para_freq(base_freq, semitons):
    return base_freq * (2 ** (semitons / 12))

def tocar_escala(nota_base, nome_escala):
    base = FREQUENCIAS_BASE[nota_base]
    intervalos = ESCALAS[nome_escala]
    print(f"\\n🎼 Escala {nota_base} {nome_escala}:")
    print(f"   {'Nota':<8} {'Freq':>8}  Barra")
    print("   " + "─" * 35)
    for i, semi in enumerate(intervalos):
        freq = semitom_para_freq(base, semi)
        barra = "█" * int(freq / 30)
        nome = NOMES_PT[semi % 12]
        print(f"   {nome:<8} {freq:>7.2f} Hz  {barra}")

# Demonstrar escalas
tocar_escala("C", "Maior")
tocar_escala("A", "Menor")
tocar_escala("G", "Pentatônica")
tocar_escala("E", "Blues")

print("\\n✅ Todas as escalas processadas!")`,
  },
  {
    id: "py-rhythm",
    name: "🥁 Padrão Rítmico",
    description: "Gerador de ritmos com BPM e padrões de bateria",
    audioMode: "python",
    code: `# 🥁 Padrão Rítmico em Python
# MusicCode Studio — Simulador Python

# Configurações
BPM = 120
BEATS_POR_COMPASSO = 4
SUBDIVISOES = 4  # semicolcheias
COMPASSOS = 2

# Duração de cada passo em segundos
duracao_passo = 60 / BPM / SUBDIVISOES
total_passos = BEATS_POR_COMPASSO * SUBDIVISOES * COMPASSOS

# Instrumentos
INSTRUMENTOS = {
    "Kick":   {"emoji": "💥", "freq": 60,   "pausa": " "},
    "Snare":  {"emoji": "🔔", "freq": 200,  "pausa": " "},
    "HiHat":  {"emoji": "🎵", "freq": 8000, "pausa": "·"},
    "Clap":   {"emoji": "👏", "freq": 1200, "pausa": " "},
}

# Padrão de 16 passos (1 = ativo, 0 = silêncio)
PADRAO = {
    "Kick":  [1,0,0,0, 1,0,0,0, 1,0,1,0, 1,0,0,0],
    "Snare": [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    "HiHat": [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,1],
    "Clap":  [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
}

def formatar_grade():
    print(f"\\n🥁 Grade Rítmica — BPM: {BPM}")
    print(f"   {'Inst':<8}", end="")
    for i in range(16):
        sep = " | " if i % 4 == 0 and i > 0 else " "
        print(f"{sep}{i+1:>2}", end="")
    print()
    print("   " + "─" * 60)
    for inst, p in PADRAO.items():
        emoji = INSTRUMENTOS[inst]["emoji"]
        print(f"   {inst:<8}", end="")
        for i, ativo in enumerate(p):
            sep = " | " if i % 4 == 0 and i > 0 else " "
            char = emoji if ativo else INSTRUMENTOS[inst]["pausa"]
            print(f"{sep}{char:>2}", end="")
        total = sum(p)
        print(f"  ({total} hits)")

def reproduzir():
    formatar_grade()
    print(f"\\n▶️  Reproduzindo {COMPASSOS} compassos...")
    for rep in range(COMPASSOS):
        print(f"\\n  🔄 Compasso {rep + 1}/{COMPASSOS}:")
        for step in range(16):
            beat = (step // SUBDIVISOES) + 1
            ativos = [inst for inst, p in PADRAO.items() if p[step]]
            if ativos:
                emojis = " ".join(INSTRUMENTOS[i]["emoji"] for i in ativos)
                nomes  = " + ".join(ativos)
                print(f"    Beat {beat}.{(step % 4)+1} | {emojis} {nomes}")
    tempo_total = total_passos * duracao_passo
    print(f"\\n✅ Padrão finalizado! Duração: {tempo_total:.2f}s")

reproduzir()`,
  },
];

// ─── Extensões disponíveis no Workshop ───────────────────────────────────────
export const extensions: Extension[] = [
  // ── LUA ──
  {
    id: "lua",
    name: "Lua",
    fullName: "Lua Music Extension",
    version: "5.4.6",
    author: "Lua.org / MusicCode",
    description: "Suporte à linguagem Lua para composição de melodias, ritmos e escalas musicais.",
    longDescription: "Adiciona suporte completo à linguagem Lua para o MusicCode Studio. Com ela você pode criar melodias com frequências Hz, gerar padrões rítmicos com BPM configurável e explorar escalas musicais (maior, menor, pentatônica, blues). Inclui 3 templates comentados e player de áudio integrado.",
    icon: "🌙",
    color: "from-blue-600 to-cyan-500",
    gradient: "from-blue-500 to-cyan-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    badge: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    status: "available",
    featured: true,
    tags: ["lua", "melodia", "ritmo", "escalas", "scripting"],
    features: ["Melodias com frequências", "Ritmo com BPM", "Escalas maior/menor/pentatônica", "Player de áudio integrado", "3 templates prontos"],
    size: "12 KB",
    downloads: "48.2k",
    rating: 4.8,
    templates: luaTemplates,
  },

  // ── JAVA ──
  {
    id: "java",
    name: "Java",
    fullName: "Java Sound Extension",
    version: "17.0.2",
    author: "Oracle / MusicCode",
    description: "Suporte à linguagem Java com javax.sound, MIDI sequencer e piano virtual Swing.",
    longDescription: "Integra a poderosa Java Sound API ao MusicCode Studio. Permite criar sintetizadores de tom com ondas senoidais, sequenciadores de bateria MIDI completos e pianos virtuais interativos com Java Swing. Inclui 3 templates avançados com comentários didáticos.",
    icon: "☕",
    color: "from-orange-600 to-yellow-500",
    gradient: "from-orange-500 to-yellow-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "text-orange-300 bg-orange-500/15 border-orange-500/30",
    status: "available",
    featured: true,
    tags: ["java", "midi", "swing", "synthesizer", "drum-machine"],
    features: ["javax.sound.sampled", "MIDI Sequencer", "Piano Virtual Swing", "Síntese de ondas senoidais", "3 templates avançados"],
    size: "28 KB",
    downloads: "31.7k",
    rating: 4.6,
    templates: javaTemplates,
  },

  // ── HTML ──
  {
    id: "html",
    name: "HTML/CSS",
    fullName: "HTML Web Audio Extension",
    version: "5.0",
    author: "W3C / MusicCode",
    description: "Templates HTML com Web Audio API — roda diretamente no browser com preview ao vivo.",
    longDescription: "Adiciona templates HTML completos com Web Audio API. Todos os templates rodam diretamente no navegador com preview ao vivo. Inclui piano interativo com teclas clicáveis, visualizador de áudio em múltiplos modos e beat maker de 16 passos — tudo sem instalação de runtime externo.",
    icon: "🌐",
    color: "from-pink-600 to-rose-500",
    gradient: "from-pink-500 to-rose-400",
    border: "border-pink-500/30",
    bg: "bg-pink-500/5",
    badge: "text-pink-300 bg-pink-500/15 border-pink-500/30",
    status: "available",
    featured: true,
    tags: ["html", "css", "web-audio", "canvas", "browser"],
    features: ["Preview ao vivo no browser", "Piano Web interativo", "Visualizador Canvas", "Beat Maker 16 steps", "Sem runtime externo"],
    size: "8 KB",
    downloads: "62.4k",
    rating: 4.9,
    templates: htmlTemplates,
  },

  // ── JAVASCRIPT ──
  {
    id: "javascript",
    name: "JavaScript",
    fullName: "JavaScript Web Audio Extension",
    version: "2.0.0",
    author: "MusicCode Studio",
    description: "Criação musical com JavaScript moderno e Web Audio API — síntese, melodias e ritmos no browser.",
    longDescription: "Extensão JavaScript atualizada para o MusicCode Studio. Usa a Web Audio API moderna para síntese de som direto no navegador. Crie melodias com osciladores, efeitos de reverb, sequenciadores de bateria e muito mais — tudo em JavaScript puro, sem dependências externas.",
    icon: "⚡",
    color: "from-yellow-500 to-amber-400",
    gradient: "from-yellow-500 to-amber-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
    badge: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
    status: "available",
    featured: true,
    tags: ["javascript", "web-audio", "síntese", "melodia", "browser"],
    features: ["Web Audio API moderna", "Síntese de osciladores", "Sequenciador de bateria", "Efeitos (reverb, delay)", "3 templates prontos"],
    size: "10 KB",
    downloads: "38.5k",
    rating: 4.7,
    templates: javascriptTemplates,
  },

  // ── PYTHON ──
  {
    id: "python",
    name: "Python",
    fullName: "Python Music Extension",
    version: "2.0.0",
    author: "MusicCode Studio",
    description: "Composição musical em Python com simulação de frequências, escalas e padrões rítmicos.",
    longDescription: "Extensão Python atualizada para o MusicCode Studio. Escreva código Python para compor melodias, explorar escalas musicais e criar padrões rítmicos. O player do Studio simula a execução e reproduz o áudio diretamente no browser, sem precisar de Python instalado.",
    icon: "🐍",
    color: "from-green-500 to-emerald-400",
    gradient: "from-green-500 to-emerald-400",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "text-green-300 bg-green-500/15 border-green-500/30",
    status: "available",
    featured: true,
    tags: ["python", "melodia", "escalas", "ritmo", "scripting"],
    features: ["Simulação de execução Python", "Melodias com frequências Hz", "Escalas musicais", "Padrões rítmicos", "3 templates prontos"],
    size: "11 KB",
    downloads: "27.9k",
    rating: 4.5,
    templates: pythonTemplates,
  },

  // ── RUBY (deprecated) ──
  {
    id: "ruby",
    name: "Ruby",
    fullName: "Ruby Sonic Pi Extension",
    version: "0.7.0",
    author: "MusicCode Legacy",
    description: "Integração com Sonic Pi em Ruby — descontinuada por incompatibilidade com browser.",
    longDescription: "Tentativa de integrar o Sonic Pi (Ruby) ao MusicCode Studio. A extensão foi descontinuada pois o Sonic Pi requer um ambiente de desktop completo e não pode ser executado no browser.",
    icon: "💎",
    color: "from-red-700 to-rose-600",
    gradient: "from-red-600 to-rose-500",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "text-red-300 bg-red-500/15 border-red-500/30",
    status: "deprecated",
    featured: false,
    deprecated: true,
    deprecatedReason: "Sonic Pi requer ambiente desktop. Incompatível com browser.",
    tags: ["ruby", "sonic-pi", "legado", "deprecated"],
    features: ["Sonic Pi syntax (legado)", "Requer Sonic Pi desktop", "Apenas download de código"],
    size: "9 KB",
    downloads: "4.7k",
    rating: 2.5,
    templates: [],
  },

  // ── C# (deprecated) ──
  {
    id: "csharp",
    name: "C#",
    fullName: "C# NAudio Extension",
    version: "0.5.0",
    author: "MusicCode Legacy",
    description: "Integração com NAudio em C# — apenas Windows, descontinuada.",
    longDescription: "Extensão para criação musical com C# usando a biblioteca NAudio. Descontinuada por ser exclusiva para Windows e requerer instalação do .NET runtime.",
    icon: "⚡",
    color: "from-violet-700 to-purple-600",
    gradient: "from-violet-600 to-purple-500",
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
    badge: "text-violet-300 bg-violet-500/15 border-violet-500/30",
    status: "deprecated",
    featured: false,
    deprecated: true,
    deprecatedReason: "Exclusivo para Windows. Requer .NET runtime e NAudio.",
    tags: ["csharp", "naudio", "windows", "legado", "deprecated"],
    features: ["NAudio library (legado)", "Apenas Windows", "Requer .NET runtime"],
    size: "22 KB",
    downloads: "3.2k",
    rating: 2.8,
    templates: [],
  },

  // ── KOTLIN (deprecated) ──
  {
    id: "kotlin",
    name: "Kotlin",
    fullName: "Kotlin Android Audio Extension",
    version: "0.4.0",
    author: "MusicCode Legacy",
    description: "Extensão Kotlin para Android — incompatível com ambiente web.",
    longDescription: "Esta extensão foi desenvolvida para criar apps musicais Android com Kotlin usando a API AudioTrack. Descontinuada por ser incompatível com ambiente web.",
    icon: "🔷",
    color: "from-indigo-700 to-blue-600",
    gradient: "from-indigo-600 to-blue-500",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
    badge: "text-indigo-300 bg-indigo-500/15 border-indigo-500/30",
    status: "deprecated",
    featured: false,
    deprecated: true,
    deprecatedReason: "Focado em Android. Use Java Sound API para JVM.",
    tags: ["kotlin", "android", "audiotrack", "legado", "deprecated"],
    features: ["Android AudioTrack (legado)", "Requer Android SDK", "Incompatível com web"],
    size: "18 KB",
    downloads: "2.9k",
    rating: 2.6,
    templates: [],
  },
];

export const availableExtensions = () =>
  extensions.filter((e) => e.status === "available");

export const deprecatedExtensions = () =>
  extensions.filter((e) => e.status === "deprecated");

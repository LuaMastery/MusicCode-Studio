/**
 * examples.ts — Galeria de instrumentos musicais interativos (HTML + Web Audio).
 * Cada item é um app HTML autossuficiente que roda num iframe isolado.
 * O usuário INTERAGE (clica, arrasta) para criar música — sem programar.
 */

export interface HtmlExample {
  id: string;
  name: string;
  icon: string;
  description: string;
  tags: string[];
  color: string;
  code: string;
}

// ── CSS base compartilhado (tema minimalista + violeta) ──────────────────────
const CSS = `
*{box-sizing:border-box;font-family:Inter,system-ui,-apple-system,sans-serif}
body{margin:0;background:#0d0d12;color:#e9e9ee;min-height:100vh;display:flex;flex-direction:column}
.wrap{padding:18px;flex:1;display:flex;flex-direction:column;gap:14px;max-width:880px;margin:0 auto;width:100%}
.controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
button{cursor:pointer;border:1px solid #23232c;background:#131319;color:#e9e9ee;border-radius:10px;padding:9px 14px;font-size:13px;font-weight:600;transition:.15s}
button:hover{border-color:#3a3a45;background:#1a1a22}
button.primary{background:#8b5cf6;border-color:#8b5cf6;color:#fff}
button.primary:hover{background:#7c4df0}
label{font-size:12px;color:#8a8a96;display:flex;align-items:center;gap:6px}
select,input[type=number]{background:#131319;border:1px solid #23232c;color:#e9e9ee;border-radius:8px;padding:6px 8px;font-size:13px;outline:none}
.hint{font-size:12px;color:#6b6b76;text-align:center}
h2{font-size:18px;font-weight:700;margin:0}
.sub{font-size:12px;color:#8a8a96}
`;

// ── Motor de áudio JS compartilhado (sem regex/backticks) ────────────────────
const AUDIO = `
var AC=null;
function ac(){if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();}if(AC.state==='suspended'){AC.resume();}return AC;}
function n2f(n){n=''+n;var map={C:0,D:2,E:4,F:5,G:7,A:9,B:11};var s=map[n.charAt(0).toUpperCase()];var i=1;if(n.charAt(1)==='#'){s++;i=2;}else if(n.charAt(1)==='b'){s--;i=2;}var o=parseInt(n.slice(i),10);if(isNaN(o)){o=4;}var midi=(o+1)*12+s;return 440*Math.pow(2,(midi-69)/12);}
function tone(freq,dur,type,amp,when){var c=ac();type=type||'sine';amp=amp==null?0.2:amp;when=when||0;var t=c.currentTime+when;var o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(amp,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+0.03);}
function padnote(freq,dur,amp,when){var c=ac();when=when||0;var t=c.currentTime+when;var o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o2.type='sawtooth';o.frequency.setValueAtTime(freq,t);o2.frequency.setValueAtTime(freq*1.006,t);lp.type='lowpass';lp.frequency.value=freq*5;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(amp,t+0.4);g.gain.setValueAtTime(amp,t+dur*0.6);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(lp);o2.connect(lp);lp.connect(g).connect(c.destination);o.start(t);o2.start(t);o.stop(t+dur+0.1);o2.stop(t+dur+0.1);}
var NB=null;
function noise(c){if(!NB||NB.sampleRate!==c.sampleRate){NB=c.createBuffer(1,c.sampleRate,c.sampleRate);var d=NB.getChannelData(0);for(var i=0;i<d.length;i++){d[i]=Math.random()*2-1;}}return NB;}
function drum(name,amp){var c=ac();var t=c.currentTime;amp=amp==null?0.8:amp;
 if(name==='kick'){var o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(45,t+0.12);g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.22);o.connect(g).connect(c.destination);o.start(t);o.stop(t+0.24);}
 else if(name==='snare'){var n=c.createBufferSource();n.buffer=noise(c);var hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=1500;var g=c.createGain();g.gain.setValueAtTime(amp*0.7,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.18);n.connect(hp).connect(g).connect(c.destination);n.start(t);n.stop(t+0.2);}
 else if(name==='hihat'){var n=c.createBufferSource();n.buffer=noise(c);var hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=7000;var g=c.createGain();g.gain.setValueAtTime(amp*0.4,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.05);n.connect(hp).connect(g).connect(c.destination);n.start(t);n.stop(t+0.06);}
 else if(name==='openhat'){var n=c.createBufferSource();n.buffer=noise(c);var hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=6000;var g=c.createGain();g.gain.setValueAtTime(amp*0.35,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.3);n.connect(hp).connect(g).connect(c.destination);n.start(t);n.stop(t+0.32);}
 else if(name==='clap'){[0,0.012,0.024,0.04].forEach(function(b){var n=c.createBufferSource();n.buffer=noise(c);var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;var g=c.createGain();g.gain.setValueAtTime(amp*0.4,t+b);g.gain.exponentialRampToValueAtTime(0.0001,t+b+0.14);n.connect(bp).connect(g).connect(c.destination);n.start(t+b);n.stop(t+b+0.2);});}
 else if(name==='tom'){var o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(110,t+0.2);g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.25);o.connect(g).connect(c.destination);o.start(t);o.stop(t+0.27);}}
`;

function page(body: string, script: string, extra = "", title = "MusicCode Studio"): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>${CSS}${extra}</style></head><body>${body}<script>${AUDIO}${script}</script></body></html>`;
}

// ════════════════════════════════════════════════════════════════════════════
// 1. PIANO
// ════════════════════════════════════════════════════════════════════════════
const PIANO_BODY = `
<div class="wrap">
  <div class="controls">
    <button class="primary" id="pwr">▶ Iniciar</button>
    <label>Som <select id="w"><option value="triangle">Triângulo</option><option value="sine">Seno</option><option value="sawtooth">Serra</option><option value="square">Quadrada</option></select></label>
    <label>Oitava <select id="o"><option>3</option><option selected>4</option><option>5</option></select></label>
    <label><input type="checkbox" id="s"> Sustain</label>
  </div>
  <div class="piano" id="kb"></div>
  <div class="hint">Teclado do PC: A W S E D F T G Y H U J K · clique também funciona</div>
</div>`;
const PIANO_CSS = `
.piano{position:relative;display:flex;gap:2px;height:190px;user-select:none}
.piano .w{flex:1;background:#f4f4f8;border-radius:0 0 8px 8px;color:#444;display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px;font-size:11px;font-weight:700;cursor:pointer}
.piano .w.act{background:#8b5cf6;color:#fff}
.piano .b{position:absolute;width:6%;height:58%;background:#16161d;border-radius:0 0 6px 6px;z-index:2;cursor:pointer}
.piano .b.act{background:#a78bfa}`;
const PIANO_JS = `
var kb=document.getElementById('kb'),w=document.getElementById('w'),oSel=document.getElementById('o'),s=document.getElementById('s');
var keyMap={a:'C',w:'C#',s:'D',e:'D#',d:'E',f:'F',t:'F#',g:'G',y:'G#',h:'A',u:'A#',j:'B'};
var elByNote={};
function hit(n,el){var dur=s.checked?1.8:0.6;tone(n2f(n),dur,w.value,0.26);if(el){el.classList.add('act');setTimeout(function(){el.classList.remove('act');},140);}}
function bind(n,el){var fn=function(e){e.preventDefault();hit(n,el);};el.addEventListener('mousedown',fn);el.addEventListener('touchstart',fn,{passive:false});}
function build(){
  kb.innerHTML='';elByNote={};
  var oct=+oSel.value;var order=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var whites=0;for(var c=0;c<2;c++){for(var i=0;i<order.length;i++){if(order[i].length===1)whites++;}}
  var wPct=100/whites;var wi=0;
  for(var oc=0;oc<2;oc++){for(var i=0;i<order.length;i++){
    var note=order[i]+(oct+oc);
    if(order[i].length===1){var el=document.createElement('div');el.className='w';el.textContent=order[i];bind(note,el);kb.appendChild(el);elByNote[note]=el;wi++;}
    else{var left=wi*wPct;var elb=document.createElement('div');elb.className='b';elb.style.left='calc('+left+'% - 3%)';bind(note,elb);kb.appendChild(elb);elByNote[note]=elb;}
  }}
}
document.addEventListener('keydown',function(e){if(e.repeat)return;var m=keyMap[e.key];if(!m)return;var oct=+oSel.value;var note=(m.length>1)?(m.charAt(0)+'#'+oct):(m+oct);hit(note,elByNote[note]||null);});
oSel.onchange=build;build();
`;

// ════════════════════════════════════════════════════════════════════════════
// 2. BATERIA (Beat Maker)
// ════════════════════════════════════════════════════════════════════════════
const BEAT_BODY = `
<div class="wrap">
  <div class="controls">
    <button class="primary" id="play">▶ Tocar</button>
    <label>BPM <input type="number" id="bpm" value="110" min="60" max="200" style="width:60px"></label>
    <button id="clear">Limpar</button>
    <button id="preset">Padrão</button>
  </div>
  <div id="grid"></div>
  <div class="hint">Clique nas células para montar sua batida · 16 passos</div>
</div>`;
const BEAT_CSS = `
#grid{display:flex;flex-direction:column;gap:3px}
.brow{display:flex;gap:3px;align-items:center}
.lab{width:74px;font-size:11px;font-weight:700}
.cell{width:30px;height:30px;border-radius:6px;background:#16161d;cursor:pointer;transition:.1s}
.cell.on{background:#8b5cf6}
.cell.cur{box-shadow:0 0 0 2px #fff}`;
const BEAT_JS = `
var ROWS=[['kick','Bumbo','#ef4444'],['snare','Caixa','#f59e0b'],['hihat','Chimbal','#22d3ee'],['openhat','Prato','#a3e635'],['clap','Palma','#a855f7'],['tom','Tom','#fb7185']];
var STEPS=16;var state=ROWS.map(function(){return new Array(STEPS).fill(false);});
var grid=document.getElementById('grid'),bpmEl=document.getElementById('bpm'),playBtn=document.getElementById('play');
function defaults(){state=ROWS.map(function(){return new Array(STEPS).fill(false);});[[0,0],[0,4],[0,8],[0,12],[1,4],[1,12],[2,0],[2,2],[2,4],[2,6],[2,8],[2,10],[2,12],[2,14],[4,0],[4,8]].forEach(function(p){state[p[0]][p[1]]=true;});}
function buildGrid(){grid.innerHTML='';ROWS.forEach(function(r,ri){var row=document.createElement('div');row.className='brow';var lab=document.createElement('div');lab.className='lab';lab.style.color=r[2];lab.textContent=r[1];row.appendChild(lab);for(var i=0;i<STEPS;i++){(function(ri,i){var c=document.createElement('div');c.className='cell';c.onclick=function(){state[ri][i]=!state[ri][i];paint();};row.appendChild(c);})(ri,i);}grid.appendChild(row);});}
var step=-1,playing=false,timer=null;
function paint(){for(var ri=0;ri<ROWS.length;ri++){var cells=grid.children[ri].children;for(var i=1;i<=STEPS;i++){cells[i].className='cell'+(state[ri][i-1]?' on':'')+(i-1===step?' cur':'');}}}
function tick(){step=(step+1)%STEPS;ROWS.forEach(function(r,ri){if(state[ri][step]){drum(r[0],0.85);}});paint();}
function loop(){tick();var sd=60/(+bpmEl.value)/4;timer=setTimeout(loop,sd*1000);}
playBtn.onclick=function(){ac();playing=!playing;playBtn.textContent=playing?'⏹ Parar':'▶ Tocar';if(playing){step=-1;loop();}else{clearTimeout(timer);step=-1;paint();}};
document.getElementById('clear').onclick=function(){state=ROWS.map(function(){return new Array(STEPS).fill(false);});paint();};
document.getElementById('preset').onclick=function(){defaults();paint();};
defaults();buildGrid();paint();
`;

// ════════════════════════════════════════════════════════════════════════════
// 3. CRIADOR DE MELODIA (Piano Roll)
// ════════════════════════════════════════════════════════════════════════════
const ROLL_BODY = `
<div class="wrap">
  <div class="controls">
    <button class="primary" id="play">▶ Tocar</button>
    <label>BPM <input type="number" id="bpm" value="120" min="60" max="240" style="width:60px"></label>
    <button id="rand">🎲 Aleatório</button>
    <button id="clear">Limpar</button>
  </div>
  <div id="roll"></div>
  <div class="hint">Clique para ligar/desligar notas e crie sua melodia em loop</div>
</div>`;
const ROLL_CSS = `
#roll{display:flex;flex-direction:column;gap:3px}
.nrow{display:flex;gap:6px;align-items:center}
.nlab{font-size:10px;color:#6b6b76;width:30px;text-align:right}
.rrow{display:grid;grid-template-columns:repeat(16,1fr);gap:3px;flex:1}
.rc{aspect-ratio:1;border-radius:5px;background:#16161d;cursor:pointer;transition:.1s}
.rc.on{background:#8b5cf6}
.rc.cur{outline:2px solid #fff;outline-offset:-1px}`;
const ROLL_JS = `
var SCALE=['C5','A4','G4','E4','D4','C4','A3','G3'];var STEPS=16;
var grid=SCALE.map(function(){return new Array(STEPS).fill(false);});
[[0,0],[2,2],[3,4],[1,6],[2,8],[4,10],[0,12],[3,14]].forEach(function(p){grid[p[0]][p[1]]=true;});
var roll=document.getElementById('roll'),bpmEl=document.getElementById('bpm'),playBtn=document.getElementById('play');
function build(){roll.innerHTML='';SCALE.forEach(function(note,ri){var nrow=document.createElement('div');nrow.className='nrow';var lab=document.createElement('div');lab.className='nlab';lab.textContent=note;var row=document.createElement('div');row.className='rrow';for(var i=0;i<STEPS;i++){(function(ri,i){var c=document.createElement('div');c.className='rc';c.onclick=function(){grid[ri][i]=!grid[ri][i];paint();};row.appendChild(c);})(ri,i);}nrow.appendChild(lab);nrow.appendChild(row);roll.appendChild(nrow);});}
var step=-1,playing=false,timer=null;
function paint(){var rows=roll.querySelectorAll('.rrow');for(var ri=0;ri<SCALE.length;ri++){var cells=rows[ri].children;for(var i=0;i<STEPS;i++){cells[i].className='rc'+(grid[ri][i]?' on':'')+(i===step?' cur':'');}}}
function tick(){step=(step+1)%STEPS;SCALE.forEach(function(n,ri){if(grid[ri][step]){tone(n2f(n),0.45,'triangle',0.22);}});paint();}
function loop(){tick();var sd=60/(+bpmEl.value)/2;timer=setTimeout(loop,sd*1000);}
playBtn.onclick=function(){ac();playing=!playing;playBtn.textContent=playing?'⏹ Parar':'▶ Tocar';if(playing){step=-1;loop();}else{clearTimeout(timer);step=-1;paint();}};
document.getElementById('rand').onclick=function(){grid=SCALE.map(function(){return new Array(STEPS).fill(false);});for(var i=0;i<STEPS;i++){if(Math.random()<0.4){var r=Math.floor(Math.random()*SCALE.length);grid[r][i]=true;}}paint();};
document.getElementById('clear').onclick=function(){grid=SCALE.map(function(){return new Array(STEPS).fill(false);});paint();};
build();paint();
`;

// ════════════════════════════════════════════════════════════════════════════
// 4. LAUNCHPAD
// ════════════════════════════════════════════════════════════════════════════
const PAD_BODY = `
<div class="wrap">
  <div class="controls">
    <button class="primary" id="demo">▶ Tocar demo</button>
    <label>Som <select id="w"><option value="triangle">Triângulo</option><option value="sawtooth">Serra</option><option value="square">Quadrada</option></select></label>
  </div>
  <div class="lp" id="lp"></div>
  <div class="hint">Toque os pads para criar · segura e improvisa</div>
</div>`;
const PAD_CSS = `
.lp{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:480px;margin:0 auto;width:100%}
.pad{aspect-ratio:1;border-radius:12px;border:1px solid #23232c;background:#16161d;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;color:#6b6b76;transition:.08s}
.pad.act{transform:scale(0.96);box-shadow:0 0 24px var(--c)}`;
const PAD_JS = `
var NOTES=['C4','D4','E4','G4','A4','C5','D5','E5','G5','A5','C6','D6','E6','G6','A6','C7'];
var COLS=['#8b5cf6','#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#a855f7'];
var lp=document.getElementById('lp'),w=document.getElementById('w');
NOTES.forEach(function(n,i){var p=document.createElement('div');p.className='pad';p.style.setProperty('--c',COLS[i%COLS.length]);p.textContent=n;var fn=function(e){e.preventDefault();tone(n2f(n),0.5,w.value,0.25);p.classList.add('act');setTimeout(function(){p.classList.remove('act');},120);};p.addEventListener('mousedown',fn);p.addEventListener('touchstart',fn,{passive:false});lp.appendChild(p);});
var demoBtn=document.getElementById('demo'),demoT=null;
demoBtn.onclick=function(){ac();if(demoT){clearInterval(demoT);demoT=null;demoBtn.textContent='▶ Tocar demo';return;}demoBtn.textContent='⏹ Parar demo';var seq=[0,2,4,6,8,10,12,14,15,13,11,9,7,5,3,1];var k=0;demoT=setInterval(function(){var pads=lp.children;var i=seq[k%seq.length];pads[i].dispatchEvent(new Event('mousedown'));k++;},180);};
`;

// ════════════════════════════════════════════════════════════════════════════
// 5. GERADOR AMBIENTE (música generativa)
// ════════════════════════════════════════════════════════════════════════════
const AMB_BODY = `
<div class="wrap">
  <div class="controls">
    <button class="primary" id="play">▶ Gerar música</button>
    <label>Humor <select id="mood"><option value="maj">Feliz</option><option value="min">Melancólico</option></select></label>
    <label>Tempo <select id="tempo"><option value="60">Lento</option><option value="80" selected>Médio</option><option value="110">Vivo</option></select></label>
    <label>Notas <input type="range" id="dens" min="0" max="100" value="50"></label>
  </div>
  <div class="ambbg"></div>
  <div class="hint">A música se cria sozinha — ajuste o humor e o tempo e relaxe 🌌</div>
</div>`;
const AMB_CSS = `
.ambbg{position:fixed;inset:0;z-index:-1;background:linear-gradient(135deg,#0d0d12,#161029,#0d0d12);background-size:200% 200%;animation:amb 18s ease infinite;opacity:.9}
@keyframes amb{0%{background-position:0 0}50%{background-position:100% 100%}100%{background-position:0 0}}`;
const AMB_JS = `
var CHORDS={maj:[['C3','C4','E4','G4'],['A2','A3','C4','E4'],['F2','F3','A3','C4'],['G2','G3','B3','D4']],min:[['A2','A3','C4','E4'],['F2','F3','A3','C4'],['C3','C4','E4','G4'],['G2','G3','B3','D4']]};
var MEL={maj:['C5','D5','E5','G5','A5','C6'],min:['C5','D5','E5','G5','A5','C6']};
var playBtn=document.getElementById('play'),mood=document.getElementById('mood'),tempo=document.getElementById('tempo'),dens=document.getElementById('dens');
var on=false,ci=0,beat=0,timer=null;
function chordDur(){return 60/(+tempo.value)*4;}
function step(){var ch=CHORDS[mood.value];if(beat%4===0){var c=ch[ci%ch.length];c.forEach(function(n,i){padnote(n2f(n),chordDur(),0.05,i*0.02);});ci++;}
 var d=(+dens.value)/100;if(Math.random()<d){var pool=MEL[mood.value];tone(n2f(pool[Math.floor(Math.random()*pool.length)]),0.5,'triangle',0.12);}if(Math.random()<d*0.6){drum('hihat',0.3);}beat++;}
playBtn.onclick=function(){ac();on=!on;playBtn.textContent=on?'⏹ Parar':'▶ Gerar música';if(on){ci=0;beat=0;var bms=60/(+tempo.value)/2;step();timer=setInterval(step,bms*1000);}else{clearInterval(timer);}};
`;

// ════════════════════════════════════════════════════════════════════════════
// 6. THEREMIN
// ════════════════════════════════════════════════════════════════════════════
const THER_BODY = `
<div class="wrap">
  <div class="controls">
    <label>Som <select id="w"><option value="sine">Seno</option><option value="triangle">Triângulo</option><option value="sawtooth">Serra</option></select></label>
    <span class="sub">Pressione e arraste no campo · ← grave · → agudo</span>
  </div>
  <div class="pad" id="pad"><div class="dot" id="dot"></div></div>
  <div class="freq" id="freq">220 Hz</div>
</div>`;
const THER_CSS = `
.pad{position:relative;flex:1;min-height:320px;border:1px solid #23232c;border-radius:16px;background:radial-gradient(circle at 50% 50%,rgba(139,92,246,0.08),transparent 70%);overflow:hidden;touch-action:none}
.dot{position:absolute;left:50%;top:50%;width:26px;height:26px;border-radius:50%;background:#8b5cf6;transform:translate(-50%,-50%);box-shadow:0 0 36px #8b5cf6;pointer-events:none}
.freq{text-align:center;font-size:13px;color:#8a8a96;font-variant-numeric:tabular-nums}`;
const THER_JS = `
var pad=document.getElementById('pad'),dot=document.getElementById('dot'),freqEl=document.getElementById('freq'),w=document.getElementById('w');
var osc=null,gain=null;
function start(){ac();if(osc)return;osc=ac().createOscillator();gain=ac().createGain();gain.gain.value=0;osc.type=w.value;osc.frequency.value=220;osc.connect(gain).connect(ac().destination);osc.start();}
function stop(){if(osc){gain.gain.setTargetAtTime(0,ac().currentTime,0.03);var o=osc;osc=null;setTimeout(function(){try{o.stop();}catch(e){}},150);}}
function move(e){var r=pad.getBoundingClientRect();var x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));var y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));var f=110*Math.pow(16,x);if(osc){osc.frequency.setTargetAtTime(f,ac().currentTime,0.01);gain.gain.setTargetAtTime((1-y)*0.3,ac().currentTime,0.01);}freqEl.textContent=Math.round(f)+' Hz';dot.style.left=(x*100)+'%';dot.style.top=(y*100)+'%';}
pad.addEventListener('pointerdown',function(e){start();move(e);pad.setPointerCapture(e.pointerId);});
pad.addEventListener('pointermove',function(e){if(osc){move(e);}});
pad.addEventListener('pointerup',stop);pad.addEventListener('pointercancel',stop);pad.addEventListener('pointerleave',stop);
`;

export const HTML_EXAMPLES: HtmlExample[] = [
  {
    id: "piano", name: "Piano", icon: "🎹", color: "#8b5cf6",
    description: "Teclado completo com várias formas de onda, oitavas e sustain. Toque com mouse ou teclado.",
    tags: ["teclado", "melodia", "iniciante"], code: page(PIANO_BODY, PIANO_JS, PIANO_CSS),
  },
  {
    id: "bateria", name: "Bateria", icon: "🥁", color: "#ef4444",
    description: "Monte sua batida num sequenciador de 16 passos com 6 instrumentos sintetizados.",
    tags: ["ritmo", "sequenciador", "beat"], code: page(BEAT_BODY, BEAT_JS, BEAT_CSS),
  },
  {
    id: "melodia", name: "Criador de Melodia", icon: "🎼", color: "#10b981",
    description: "Piano roll visual: clique nas notas e crie melodias em loop, com botão aleatório.",
    tags: ["melodia", "loop", "criativo"], code: page(ROLL_BODY, ROLL_JS, ROLL_CSS),
  },
  {
    id: "launchpad", name: "Launchpad", icon: "🎛️", color: "#f59e0b",
    description: "Grade de pads coloridos para disparar notas e improvisar ao vivo, com demo automático.",
    tags: ["pads", "improviso", "ao vivo"], code: page(PAD_BODY, PAD_JS, PAD_CSS),
  },
  {
    id: "ambiente", name: "Gerador Ambiente", icon: "🌌", color: "#06b6d4",
    description: "Música que se cria sozinha — ajuste humor, tempo e densidade e relaxe.",
    tags: ["generativo", "ambiente", "auto"], code: page(AMB_BODY, AMB_JS, AMB_CSS),
  },
  {
    id: "theremin", name: "Theremin", icon: "📡", color: "#ec4899",
    description: "Instrumento expressivo: pressione e arraste para controlar afinação e volume.",
    tags: ["expressivo", "experimental"], code: page(THER_BODY, THER_JS, THER_CSS),
  },
];

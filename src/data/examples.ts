/**
 * examples.ts — Exemplos de HTML que usam a Web Audio API diretamente.
 * São documentos completos e autocontidos, exibidos num iframe.
 */

export interface HtmlExample {
  id: string;
  name: string;
  icon: string;
  description: string;
  code: string;
}

const HEAD = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  *{box-sizing:border-box;font-family:system-ui,Segoe UI,Roboto,sans-serif}
  body{margin:0;background:#0d0b1a;color:#eee;padding:18px}
  button{cursor:pointer;border:none;border-radius:10px;padding:10px 14px;
    font-weight:700;color:#fff;background:linear-gradient(135deg,#7c3aed,#a855f7)}
  .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
  label{font-size:13px;color:#aaa}
</style>
</head>
<body>`;

export const HTML_EXAMPLES: HtmlExample[] = [
  {
    id: "oscilador",
    name: "Oscilador",
    icon: "〰️",
    description: "O exemplo mais básico: um tom com a Web Audio API.",
    code: `${HEAD}
<div class="row">
  <button id="play">▶ Tocar Dó (440Hz)</button>
  <label>Volume</label>
  <input id="vol" type="range" min="0" max="1" step="0.01" value="0.3" />
</div>
<p style="color:#888;font-size:13px">Clique para criar um AudioContext e ouvir um oscilador senoidal.</p>
<script>
let ctx, osc, gain;
document.getElementById('play').onclick = () => {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  if (osc) { osc.stop(); return; }
  osc = ctx.createOscillator();
  gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  gain.gain.value = +document.getElementById('vol').value;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  document.getElementById('play').textContent = '⏹ Parar';
  osc.onended = () => { osc = null; document.getElementById('play').textContent='▶ Tocar Dó (440Hz)'; };
  setTimeout(() => { if(osc){ osc.stop(); } }, 1500);
};
document.getElementById('vol').oninput = e => { if (gain) gain.gain.value = +e.target.value; };
</script>
</body></html>`,
  },
  {
    id: "piano",
    name: "Piano Interativo",
    icon: "🎹",
    description: "Teclado clicável com teclas brancas e pretas.",
    code: `${HEAD}
<div class="row">
  <label>Forma de onda:</label>
  <select id="wave">
    <option value="sine">Seno</option>
    <option value="triangle" selected>Triângulo</option>
    <option value="square">Quadrada</option>
    <option value="sawtooth">Dente-de-serra</option>
  </select>
</div>
<div id="keys" style="display:flex;position:relative;gap:2px"></div>
<p style="color:#888;font-size:13px;margin-top:12px">Clique nas teclas ou use o teclado (A W S E D F T G ...).</p>
<script>
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const whites = ['C','D','E','F','G','A','B'];
const blacks = {'C#':1,'D#':1,'F#':1,'G#':1,'A#':1};
const order = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
let oct = 4;
const keys = document.getElementById('keys');
function noteFreq(name, o){
  const base = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}[name];
  const midi = (o+1)*12 + base;
  return 440*Math.pow(2,(midi-69)/12);
}
function play(name){
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = document.getElementById('wave').value;
  o.frequency.value = noteFreq(name, oct);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.6);
  o.connect(g).connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime+0.65);
}
order.forEach(n => {
  const b = blacks[n];
  const k = document.createElement('button');
  k.textContent = n;
  k.style.cssText = b
    ? 'position:absolute;width:24px;height:80px;background:#222;color:#eee;z-index:2'
    : 'width:34px;height:130px;background:#fff;color:#333;font-size:11px';
  k.onclick = () => play(n);
  keys.appendChild(k);
});
document.addEventListener('keydown', e=>{
  const map={a:'C',w:'C#',s:'D',e:'D#',d:'E',f:'F',t:'F#',g:'G',y:'G#',h:'A',u:'A#',j:'B'};
  if(map[e.key]) play(map[e.key]);
});
</script>
</body></html>`,
  },
  {
    id: "sequenciador",
    name: "Sequenciador 16 Passos",
    icon: "🥁",
    description: "Beat maker com 16 passos e 4 instrumentos.",
    code: `${HEAD}
<div class="row">
  <button id="play">▶ Tocar</button>
  <label>BPM</label><input id="bpm" type="number" value="120" min="60" max="200" style="width:64px"/>
</div>
<div id="grid"></div>
<script>
const ctx = new (window.AudioContext||window.webkitAudioContext)();
const rows = ['bumbo','caixa','chimbal','palma'];
const colors = {bumbo:'#ef4444',caixa:'#f59e0b',chimbal:'#22d3ee',palma:'#a855f7'};
const N = 16;
const state = rows.map(()=>Array(N).fill(false));
// padrão inicial
[0,4,8,12].forEach(i=>state[0][i]=true);
[4,12].forEach(i=>state[1][i]=true);
state[2]=state[2].map((_,i)=>true);
const grid = document.getElementById('grid');
rows.forEach((r,ri)=>{
  const line = document.createElement('div'); line.style.display='flex'; line.style.gap='3px'; line.style.marginBottom='3px';
  for(let i=0;i<N;i++){
    const b=document.createElement('div');
    b.style.cssText='width:22px;height:22px;border-radius:5px;background:#2a2440;cursor:pointer';
    b.onclick=()=>{state[ri][i]=!state[ri][i]; paint();};
    line.appendChild(b);
  }
  grid.appendChild(line);
});
function paint(){
  [...grid.children].forEach((line,ri)=>{
    [...line.children].forEach((cell,ci)=>{
      cell.style.background = state[ri][ci] ? colors[rows[ri]] : '#2a2440';
    });
  });
}
paint();
function drum(name,t){
  const g=ctx.createGain(); g.connect(ctx.destination);
  if(name==='bumbo'){const o=ctx.createOscillator();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(45,t+0.12);g.gain.setValueAtTime(0.9,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.connect(g);o.start(t);o.stop(t+0.22);}
  else if(name==='caixa'){const n=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate*0.2,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=1500;g.gain.setValueAtTime(0.6,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);n.connect(hp).connect(g);n.start(t);}
  else if(name==='chimbal'){const n=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate*0.05,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=7000;g.gain.setValueAtTime(0.3,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);n.connect(hp).connect(g);n.start(t);}
  else {const n=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate*0.2,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;g.gain.setValueAtTime(0.5,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);n.connect(bp).connect(g);n.start(t);}
}
let playing=false, step=0, timer;
document.getElementById('play').onclick=()=>{
  if(ctx.state==='suspended')ctx.resume();
  playing=!playing; document.getElementById('play').textContent=playing?'⏹ Parar':'▶ Tocar';
  if(playing){ step=0; tick(); } else { clearTimeout(timer); }
};
function tick(){
  const t=ctx.currentTime+0.05;
  rows.forEach((r,ri)=>{ if(state[ri][step]) drum(r,t); });
  step=(step+1)%N;
  const stepDur=60/(+document.getElementById('bpm').value)/4;
  timer=setTimeout(tick, stepDur*1000);
}
</script>
</body></html>`,
  },
  {
    id: "visualizador",
    name: "Visualizador de Áudio",
    icon: "🌈",
    description: "Barras de frequência reagindo ao som gerado.",
    code: `${HEAD}
<div class="row">
  <button id="play">▶ Tocar acorde</button>
</div>
<canvas id="cv" width="640" height="200" style="width:100%;background:#15122b;border-radius:12px"></canvas>
<script>
const ctx = new (window.AudioContext||window.webkitAudioContext)();
const analyser = ctx.createAnalyser();
analyser.fftSize = 256;
analyser.connect(ctx.destination);
const cv = document.getElementById('cv');
const g = cv.getContext('2d');
function loop(){
  requestAnimationFrame(loop);
  const bins = analyser.frequencyBinCount;
  const data = new Uint8Array(bins);
  analyser.getByteFrequencyData(data);
  g.clearRect(0,0,cv.width,cv.height);
  const bw = cv.width/bins;
  for(let i=0;i<bins;i++){
    const h = (data[i]/255)*cv.height;
    const hue = (i/bins)*280;
    g.fillStyle = 'hsl('+hue+',90%,55%)';
    g.fillRect(i*bw, cv.height-h, bw-1, h);
  }
}
loop();
document.getElementById('play').onclick = ()=>{
  if(ctx.state==='suspended')ctx.resume();
  [261.63, 329.63, 392.0].forEach(f=>{
    const o=ctx.createOscillator(),gn=ctx.createGain();
    o.type='triangle'; o.frequency.value=f;
    gn.gain.setValueAtTime(0.0001,ctx.currentTime);
    gn.gain.exponentialRampToValueAtTime(0.2,ctx.currentTime+0.05);
    gn.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+2);
    o.connect(gn).connect(analyser); o.start(); o.stop(ctx.currentTime+2.1);
  });
};
</script>
</body></html>`,
  },
  {
    id: "em-branco-html",
    name: "Em Branco",
    icon: "📝",
    description: "Um modelo vazio para você começar do zero.",
    code: `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<style>
  body{font-family:system-ui;background:#0d0b1a;color:#eee;padding:24px}
  button{padding:10px 14px;border:none;border-radius:10px;background:#7c3aed;color:#fff;font-weight:700}
</style>
</head>
<body>
<h1>🎹 Minha música em HTML</h1>
<button onclick="tocar()">▶ Tocar</button>
<script>
function tocar(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = 440;
  g.gain.value = 0.2;
  o.connect(g).connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
  o.stop(ctx.currentTime + 1.1);
}
</script>
</body>
</html>`,
  },
];

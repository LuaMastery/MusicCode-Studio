/**
 * community.ts — instrumentos públicos de exemplo (da "comunidade").
 * Populate a aba "HTMLs públicos" para o usuário testar o que outros publicaram.
 * (Sem backend, estes são curados; o compartilhamento real é via código/link.)
 */

export interface CommunityInstrument {
  id: string;
  name: string;
  author: string;
  icon: string;
  color: string;
  description: string;
  code: string;
}

const CSS = `*{box-sizing:border-box;font-family:Inter,system-ui,sans-serif}body{margin:0;min-height:100vh;background:#0d0d12;color:#e9e9ee;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}button{cursor:pointer;border:0;border-radius:10px;padding:11px 18px;font-size:14px;font-weight:600;background:#8b5cf6;color:#fff}button:hover{background:#7c4df0}.h{font-size:15px;color:#8a8a96}`;

function doc(body: string, script: string): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${CSS}</style></head><body>${body}<script>${script}</script></body></html>`;
}

const AC = `var C=null;function ac(){if(!C){C=new(window.AudioContext||window.webkitAudioContext)();}if(C.state==='suspended')C.resume();return C;}function n2f(n){var m={C:0,D:2,E:4,F:5,G:7,A:9,B:11};var s=m[n.charAt(0)];var o=parseInt(n.slice(1))||4;return 440*Math.pow(2,((o+1)*12+s-69)/12);}function tone(f,dur,type,amp){var c=ac();var t=c.currentTime;var o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(amp||0.2,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+0.05);}`;

export const COMMUNITY: CommunityInstrument[] = [
  {
    id: "c-chuva", name: "Chuva Sonora", author: "@lumen", icon: "🌧️", color: "#06b6d4",
    description: "Notas de uma escala pentatônica caem aleatoriamente — ambiente e relaxante.",
    code: doc(
      `<div class="h">Chuva Sonora · @lumen</div><button id="b">▶ Tocar</button>`,
      `${AC}var on=false,t=null,scale=['C5','D5','E5','G5','A5','C6','D6'];var b=document.getElementById('b');b.onclick=function(){ac();on=!on;b.textContent=on?'⏹ Parar':'▶ Tocar';if(on){loop();}else{clearInterval(t);}};function loop(){var n=scale[Math.floor(Math.random()*scale.length)];tone(n2f(n),1.2,'triangle',0.14);t=setInterval(loop,300+Math.random()*350);}`
    ),
  },
  {
    id: "c-grave", name: "Grave Pulsante", author: "@bassline", icon: "🔊", color: "#f59e0b",
    description: "Um baixo pulsante com bumbo — groove hipnótico para deixar rodando.",
    code: doc(
      `<div class="h">Grave Pulsante · @bassline</div><button id="b">▶ Tocar</button>`,
      `${AC}var on=false,t=null,b=document.getElementById('b');function kick(){var c=ac(),t=c.currentTime;var o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+0.12);g.gain.setValueAtTime(0.8,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.2);o.connect(g).connect(c.destination);o.start(t);o.stop(t+0.22);}function step(){tone(n2f('C2'),0.3,'sawtooth',0.18);kick();}b.onclick=function(){ac();on=!on;b.textContent=on?'⏹ Parar':'▶ Tocar';if(on){step();t=setInterval(step,400);}else{clearInterval(t);}};`
    ),
  },
  {
    id: "c-sinos", name: "Sinos ao Vento", author: "@aeva", icon: "🎐", color: "#ec4899",
    description: "Sinos etéreos com longa ressonância, disparados ao acaso — como vento em sino de vidro.",
    code: doc(
      `<div class="h">Sinos ao Vento · @aeva</div><button id="b">▶ Tocar</button>`,
      `${AC}var on=false,t=null,b=document.getElementById('b');var pool=['E6','G6','A6','C7','D7','E7'];function chime(){var n=pool[Math.floor(Math.random()*pool.length)];var f=n2f(n);var c=ac(),t=c.currentTime;var o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o.type='sine';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2.01;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.16,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+2.2);o.connect(g).connect(c.destination);o2.connect(g);o.start(t);o2.start(t);o.stop(t+2.3);o2.stop(t+2.3);}b.onclick=function(){ac();on=!on;b.textContent=on?'⏹ Parar':'▶ Tocar';if(on){chime();t=setInterval(chime,700+Math.random()*900);}else{clearInterval(t);}};`
    ),
  },
];

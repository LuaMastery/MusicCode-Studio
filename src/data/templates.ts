/**
 * templates.ts — Exemplos de JavaScript que usam a API musical.
 * Todos ESTES tocam música de verdade quando você aperta Play. 🎵
 */

export interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  tags: string[];
  code: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "primeira-melodia",
    name: "Primeira Melodia",
    icon: "🎵",
    description: "Sua primeira música: notas subindo e descendo.",
    tags: ["iniciante", "melodia", "piano"],
    code: `// 🎵 SUA PRIMEIRA MELODIA
// play() toca uma nota, sleep() espera uma batida.

bpm(110)
synth("piano")

// subindo a escala de Dó...
play("C4");  sleep(1)
play("E4");  sleep(1)
play("G4");  sleep(1)
play("C5");  sleep(1)

// ...e descendo de volta
play("G4");  sleep(1)
play("E4");  sleep(1)
play("D4");  sleep(1)
play("C4");  sleep(1)

print("🎵 Melodia tocada com sucesso!")
`,
  },
  {
    id: "arpejo",
    name: "Arpejo Brilhante",
    icon: "✨",
    description: "Arpejo de guitarra dedilhada em loop.",
    tags: ["arpejo", "pluck", "loop"],
    code: `// ✨ ARPEJO BRILHANTE
// repetir(n, fn) executa algo n vezes.
// escolha um sintetizador com synth().

bpm(140)
synth("pluck")

const acorde = ["C4", "E4", "G4", "C5", "G4", "E4"]

await repetir(4, async () => {
  for (const nota of acorde) {
    play(nota, { dur: 0.5, amp: 0.7 })
    await sleep(0.5)
  }
})
`,
  },
  {
    id: "groove",
    name: "Bateria & Baixo",
    icon: "🥁",
    description: "Groove de bateria com linha de baixo.",
    tags: ["bateria", "baixo", "ritmo"],
    code: `// 🥁 GROOVE DE BATERIA COM BAIXO
// tambor() toca percussão: "bumbo", "caixa", "chimbal", "palma".

bpm(100)

await repetir(4, async () => {
  tambor("bumbo")
  play("C2", { synth: "bass", dur: 0.5, amp: 0.8 })
  await sleep(0.5)

  tambor("chimbal")
  await sleep(0.5)

  tambor("caixa")
  play("C2", { synth: "bass", dur: 0.5, amp: 0.8 })
  await sleep(0.5)

  tambor("chimbal")
  await sleep(0.5)
})

print("🥁 Groove completo!")
`,
  },
  {
    id: "pad",
    name: "Acorde Ambiente",
    icon: "🌌",
    description: "Textura suave de pads (progressão de acordes).",
    tags: ["pad", "acorde", "ambiente"],
    code: `// 🌌 TEXTURA AMBIENTE COM PADS
// Passar um array para play() toca as notas simultâneas (acorde).

bpm(70)
synth("pad")

// progressão: Dó - Lá menor - Fá - Sol
play(["C3", "C4", "E4", "G4"]);  sleep(4)
play(["A2", "A3", "C4", "E4"]);  sleep(4)
play(["F2", "F3", "A3", "C4"]);  sleep(4)
play(["G2", "G3", "B3", "D4"]);  sleep(4)
`,
  },
  {
    id: "aleatorio",
    name: "Melodia Aleatória",
    icon: "🎲",
    description: "Notas escolhidas ao acaso a cada execução.",
    tags: ["aleatório", "escala", "prophet"],
    code: `// 🎲 MELODIA GERADA ALEATORIAMENTE
// escala() devolve as notas; escolher() pega uma ao acaso.

bpm(130)
synth("prophet")

const notas = escala("C4", "major", 2)

await repetir(16, async () => {
  play(escolher(notas), { dur: 0.5, amp: 0.6 })
  tambor("chimbal", { amp: 0.3 })
  await sleep(0.5)
})
`,
  },
  {
    id: "sinos",
    name: "Sinos Mágicos",
    icon: "🔔",
    description: "Sinos etéreos usando síntese FM.",
    tags: ["fm", "sequencia", "sino"],
    code: `// 🔔 SINOS COM SÍNTESE FM
// sequencia(notas, intervalo) distribui as notas no tempo.

bpm(120)
synth("fm")

const notas = ["C5", "E5", "G5", "C6", "G5", "E5", "D5", "G4"]

for (let i = 0; i < 3; i++) {
  sequencia(notas, 0.5, { dur: 0.8, amp: 0.5 })
  await sleep(0)
}
`,
  },
  {
    id: "faixa-completa",
    name: "Faixa Completa",
    icon: "🎼",
    description: "Bateria, baixo e melodia juntos (4 compassos).",
    tags: ["avançado", "loop", "completo"],
    code: `// 🎼 FAIXA COMPLETA: bateria + baixo + melodia
// Várias chamadas no mesmo cursor tocam juntas (camadas).

bpm(120)

const baixo = ["C2", "A1", "F2", "G2"]
const melodia = escala("C4", "major_pentatonic")

await repetir(4, async (m) => {
  // baixo no início do compasso, durando 4 batidas
  play(baixo[m % baixo.length], { synth: "bass", dur: 4, amp: 0.7 })

  for (let beat = 0; beat < 4; beat++) {
    // camada de bateria a cada batida
    if (beat === 0 || beat === 2) tambor("bumbo")
    if (beat === 1 || beat === 3) tambor("caixa")
    tambor("chimbal", { amp: 0.4 })

    // melodia nas batidas fortes
    if (beat === 0 || beat === 2) {
      play(escolher(melodia), { synth: "pluck", dur: 0.5, amp: 0.5 })
    }
    await sleep(1)
  }
})

print("🎼 Faixa completa executada!")
`,
  },
  {
    id: "em-branco",
    name: "Em Branco",
    icon: "📝",
    description: "Comece do zero e crie sua própria música.",
    tags: ["vazio", "criar"],
    code: `// 🎹 CRIE SUA PRÓPRIA MÚSICA
//
// Dicas da API musical:
//   play("C4")               // toca uma nota
//   play(["C4","E4","G4"])   // toca um acorde
//   sleep(1)                 // espera 1 batida (use await em loops)
//   tambor("bumbo")          // percussão: bumbo, caixa, chimbal, palma
//   synth("piano")           // sintetizador: piano, pluck, bass, pad, fm, prophet...
//   bpm(120)                 // andamento
//   escala("C4","major")     // devolve as notas de uma escala
//   repetir(4, async i => { ... })

bpm(120)
synth("piano")

play("C4"); sleep(1)
play("E4"); sleep(1)
play("G4"); sleep(1)
`,
  },
];

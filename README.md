# 🎵 MusicCode Studio

**Crie músicas usando programação.** Um studio no navegador (e no celular!) para compor,
sintetizar e ouvir música escrevendo código — com um motor de áudio próprio construído
sobre a **Web Audio API** e uma API musical inspirada no **Sonic Pi**.

> Por **Rhuan De Cillo Silva**

---

## ✨ O que tem

- 🎹 **Studio JavaScript** — escreva código e aperte *Tocar* para ouvir música em tempo real.
- 🌐 **Studio HTML** — Web Audio API direto, com preview ao vivo num iframe isolado.
- 🎚️ **API musical própria** — `play()`, `sleep()`, `tambor()`, `synth()`, `bpm()`, `escala()`...
- 🥁 **Bateria sintetizada** — bumbo, caixa, chimbal, palma, tom, prato (tudo gerado por código).
- 🌈 **Visualizador de áudio** em tempo real + console de logs.
- 📱 **Site + App nativo** — o mesmo código vira um app Android/iOS via **Capacitor**.
- 💾 **Copiar / Baixar** qualquer exemplo (`.js` ou `.html`).

Linguagens **disponíveis agora**: JavaScript e HTML.
**Em breve**: Lua, Python e Java.

---

## 🎼 A API musical (referência rápida)

Escreva no Studio JavaScript:

```js
bpm(120)
synth("piano")

play("C4")                 // toca uma nota
play(["C4", "E4", "G4"])   // array = acorde (simultâneo)
sleep(1)                   // espera 1 batida (use await em loops)

tambor("bumbo")            // bumbo, caixa, chimbal, palma, tom, prato
synth("pluck")             // piano, pluck, bass, pad, fm, prophet, sine...
escala("C4", "major")      // devolve as notas de uma escala
acordeNotas("C4", "minor") // devolve as notas de um acorde

// loop de bateria
await repetir(4, async () => {
  tambor("bumbo");  sleep(0.5)
  tambor("caixa");  sleep(0.5)
})
```

Tabela completa na página **Sobre** do app.

---

## 🚀 Como rodar

Pré-requisitos: **Node.js 18+**.

```bash
npm install        # instala dependências
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # build de produção -> dist/index.html (arquivo único)
npm run preview    # pré-visualiza o build
npm test           # roda os testes de teoria musical + integração do motor
```

> **Dica:** se o `npm run build` falhar com `Cannot find module @rollup/rollup-linux-x64-gnu`,
> é um bug conhecido do npm com dependências opcionais. Rode
> `npm i @rollup/rollup-linux-x64-gnu --no-save` (ou `npm i` de novo) e tente outra vez.

---

## 📱 Virar aplicativo nativo (Capacitor)

O mesmo projeto vira um app instalável. Pré-requisitos: **Android Studio** (Android) e/ou
**Xcode + macOS** (iOS), além do JDK.

```bash
npm run build
npm i -D @capacitor/android @capacitor/ios   # uma vez

# Android
npx cap add android
npx cap sync
npx cap open android      # abre no Android Studio -> Build -> Build APK

# iOS (somente em macOS)
npx cap add ios
npx cap sync
npx cap open ios
```

O `capacitor.config.ts` já aponta `webDir` para `dist`. Como o Vite usa `vite-plugin-singlefile`,
o `dist/index.html` é autossuficiente e funciona perfeitamente no WebView do app.

---

## 🗂️ Estrutura do projeto

```
src/
├── engine/              # 🧠 motor de áudio (o coração do projeto)
│   ├── engine.ts        #   AudioContext, escalonador, nota→frequência
│   ├── instruments.ts   #   sintetizadores + baterias sintetizadas
│   ├── scales.ts        #   escalas e acordes (teoria musical)
│   ├── api.ts           #   API pública (play, sleep, tambor, synth...)
│   └── runner.ts        #   executa o código do usuário com segurança
├── components/          # 🎛️ UI (editor, console, visualizador, transporte)
├── pages/               # 📄 Home, Studio JS, Studio HTML, Sobre
├── data/                # 📋 exemplos (templates JS + exemplos HTML)
├── context/             # ⚙️ configurações (cor de destaque)
└── App.tsx              # shell + navegação
scripts/                 # testes (teoria + integração do motor)
```

---

## 🛠️ Tecnologias

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4**
- **Web Audio API** (síntese e agendamento de áudio)
- **Capacitor** (empacotamento nativo)

## 📄 Licença

Projeto aberto para estudo e uso pessoal.

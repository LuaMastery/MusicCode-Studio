# 🎵 MusicCode Studio

> **Crie músicas com programação.** Um ambiente completo para compor, sintetizar e visualizar música usando código — diretamente no navegador, sem instalações.

**Criado por:** Rhuan De Cillo Silva  
**Versão:** 2.0.0  
**Tecnologia:** React + TypeScript + Vite + Tailwind CSS + Web Audio API

---

## 📋 Índice

1. [O que é o MusicCode Studio](#1-o-que-é-o-musiccode-studio)
2. [Como Funciona — Visão Geral](#2-como-funciona--visão-geral)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Páginas e Navegação](#4-páginas-e-navegação)
5. [O Workshop — Sistema de Extensões](#5-o-workshop--sistema-de-extensões)
6. [O Studio — Editor Unificado](#6-o-studio--editor-unificado)
7. [Linguagens Suportadas](#7-linguagens-suportadas)
8. [Player de Áudio e Console de Erros](#8-player-de-áudio-e-console-de-erros)
9. [Como Criar Músicas — Guia Prático](#9-como-criar-músicas--guia-prático)
10. [Tabela de Notas e Frequências](#10-tabela-de-notas-e-frequências)
11. [Sistema de Configurações](#11-sistema-de-configurações)
12. [Arquitetura dos Componentes](#12-arquitetura-dos-componentes)
13. [Como Rodar Localmente](#13-como-rodar-localmente)
14. [Créditos e Tecnologias](#14-créditos-e-tecnologias)

---

## 1. O que é o MusicCode Studio

O **MusicCode Studio** é uma plataforma web educacional e criativa que une **programação** e **música**. O objetivo é permitir que qualquer pessoa — programador, músico ou curioso — escreva código e ouça o resultado como som real, sintetizado diretamente no navegador.

### Pilares do projeto

| Pilar | Descrição |
|-------|-----------|
| 🎓 **Educacional** | Aprenda conceitos de áudio (frequências, notas, escalas) através de código |
| 🎨 **Criativo** | Componha melodias, ritmos e harmonias usando linguagens de programação |
| 🔬 **Experimental** | Explore síntese sonora, Web Audio API e efeitos de áudio sem sair do browser |
| 🏪 **Modular** | Instale apenas as linguagens que quiser usar, como extensões de um editor |

### Para quem é?

- 👨‍💻 Programadores que querem explorar música
- 🎵 Músicos que querem aprender programação
- 🎓 Estudantes de computação e música
- 🧪 Curiosos que querem ver como o som funciona

---

## 2. Como Funciona — Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                      MUSICCODE STUDIO                            │
│                                                                  │
│  1. WORKSHOP          2. STUDIO              3. ÁUDIO            │
│  ┌──────────────┐    ┌──────────────────┐   ┌────────────────┐  │
│  │ 📦 Extensões │ →  │ 💻 Editor Código │ → │ 🔊 Web Audio   │  │
│  │  Lua         │    │  Templates       │   │  Síntese       │  │
│  │  Java        │    │  Player          │   │  Osciladores   │  │
│  │  HTML        │    │  Console         │   │  Frequências   │  │
│  │  JavaScript  │    │  Preview HTML    │   │  Envolvente    │  │
│  │  Python      │    │  Download        │   │  ADSR          │  │
│  └──────────────┘    └──────────────────┘   └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de uso

```
Entrar no site
      │
      ▼
┌─────────────┐
│   HOME      │ ← Visão geral, linguagens disponíveis, guia rápido
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  WORKSHOP   │ ← Escolher e instalar extensões de linguagem
└──────┬──────┘
       │  instalar
       ▼
┌─────────────┐
│   STUDIO    │ ← Escrever código, escolher template
└──────┬──────┘
       │  clicar em ▶ Reproduzir
       ▼
┌─────────────┐
│   ÁUDIO     │ ← Ouvir a música + ver logs no Console
└─────────────┘
```

---

## 3. Estrutura do Projeto

```
musiccode-studio/
├── index.html                      # Entry point HTML (título do site)
├── package.json                    # Dependências do projeto
├── vite.config.ts                  # Configuração do Vite
├── tsconfig.json                   # Configuração TypeScript
├── README.md                       # Este arquivo
│
└── src/
    ├── main.tsx                    # Ponto de entrada React + SettingsProvider
    ├── App.tsx                     # App principal: navegação, header, footer
    ├── index.css                   # Estilos globais (scrollbar, animações)
    │
    ├── context/
    │   └── SettingsContext.tsx     # Estado global de configurações + traduções
    │
    ├── data/
    │   ├── templates.ts            # Templates de código (arquivo legado)
    │   └── workshop.ts             # Extensões, templates e tipos do Workshop
    │
    ├── components/
    │   ├── AudioPlayer.tsx         # Player de áudio + parsers de linguagens
    │   ├── ConsolePanel.tsx        # Console de logs e erros estilo terminal
    │   ├── CodeEditor.tsx          # Editor de código com syntax highlight
    │   ├── Header.tsx              # Cabeçalho (componente legado)
    │   ├── InfoPanel.tsx           # Painel de informações (componente legado)
    │   ├── LanguageTabs.tsx        # Abas de linguagem (componente legado)
    │   ├── PreviewModal.tsx        # Modal de preview HTML (componente legado)
    │   └── TemplateCard.tsx        # Card de template (componente legado)
    │
    └── pages/
        ├── HomePage.tsx            # (integrada no App.tsx)
        ├── WorkshopPage.tsx        # Página do Workshop (loja de extensões)
        ├── StudioPage.tsx          # Página do Studio (editor unificado)
        ├── AboutPage.tsx           # Página Sobre (informações + créditos)
        ├── SettingsPage.tsx        # Página de Configurações
        ├── LuaPage.tsx             # (página legada)
        ├── JavaPage.tsx            # (página legada)
        ├── HtmlPage.tsx            # (página legada)
        └── EditorPage.tsx          # (página legada)
```

---

## 4. Páginas e Navegação

O site possui **5 páginas** acessíveis pela barra de navegação fixa no topo:

### 🏠 Início (Home)
- Hero com chamada para ação
- Grid com as 5 linguagens disponíveis (clicável)
- Guia "Como Funciona" em 3 passos
- Grid de recursos do Studio
- CTA para o Workshop (se nenhuma extensão estiver instalada)
- Contador de extensões instaladas em tempo real

### 🏪 Workshop
- Catálogo completo de extensões
- Busca por nome ou tag
- Filtros: Todas / Instaladas / Disponíveis / Descontinuadas
- Cards com rating ⭐, downloads e tamanho
- Botão de instalação com animação de progresso
- Aviso especial para extensões descontinuadas
- Botão "Abrir no Studio" após instalar

### 🎵 Studio
- Abas para cada linguagem instalada
- Cadeado 🔒 em linguagens não instaladas (redireciona ao Workshop)
- Lista de templates à esquerda (clique para carregar)
- Editor de código central (editável)
- Player de áudio integrado
- Console de erros em tempo real
- Preview ao vivo para HTML (iframe)
- Botão de download do código

### ℹ️ Sobre
- Explicação completa do projeto
- Índice clicável com 7 seções
- Tabela de notas e frequências
- Guia de como aprender
- Como criar músicas em cada linguagem
- Créditos: **Rhuan De Cillo Silva**
- Tecnologias utilizadas

### ⚙️ Configurações
- Idioma (6 idiomas suportados)
- Aparência: tema, cor de destaque, tamanho de fonte
- Editor: font size, tabs, line numbers, word wrap
- Áudio: volume, duração das notas, auto-play
- Workshop: mostrar descontinuadas, auto-update
- Acessibilidade: alto contraste, reduzir movimento
- Salvar no localStorage + resetar para padrão

---

## 5. O Workshop — Sistema de Extensões

O Workshop é o coração do sistema de extensões do MusicCode Studio. Funciona como uma **loja de plugins** onde você baixa suporte para cada linguagem.

### Como funciona a instalação

```
Usuário clica em "Instalar"
        │
        ▼
Animação de loading (1.5 segundos)
        │
        ▼
Estado "installed" adicionado ao Set<LangId>
        │
        ▼
Botão muda para "✓ Instalada" + "Abrir no Studio"
        │
        ▼
Aba da linguagem aparece no Studio
        │
        ▼
Templates ficam disponíveis para uso
```

### Status das extensões

| Status | Descrição | Cor |
|--------|-----------|-----|
| `available` | Disponível para instalar | Verde |
| `installed` | Já instalada e pronta | Azul |
| `deprecated` | Descontinuada (aviso de incompatibilidade) | Vermelho |

### Extensões e suas versões

| Extensão | Versão | Status | Motivo (se deprecada) |
|----------|--------|--------|----------------------|
| 🌙 Lua | 5.4.6 | ✅ Disponível | — |
| ☕ Java | 17.0.2 | ✅ Disponível | — |
| 🌐 HTML/CSS | 5.0 | ✅ Disponível | — |
| ⚡ JavaScript | 2.0.0 | ✅ Disponível | — |
| 🐍 Python | 2.0.0 | ✅ Disponível | — |
| 💎 Ruby | 0.7.0 | ❌ Descontinuada | Requer Sonic Pi desktop |
| 🔷 Kotlin | 0.4.0 | ❌ Descontinuada | Requer Android SDK |
| ⚡ C# | 0.5.0 | ❌ Descontinuada | Apenas Windows + .NET |

> **Nota sobre extensões descontinuadas:** Ruby, Kotlin e C# não funcionam no browser. Foram mantidas no Workshop apenas como histórico e para usuários que queiram baixar o código e rodar localmente.

---

## 6. O Studio — Editor Unificado

O Studio é onde você realmente **cria música com código**.

### Interface do Studio

```
┌────────────────────────────────────────────────────────────────┐
│  [🌙 Lua] [☕ Java] [🌐 HTML] [⚡ JS] [🐍 Python]            │
├──────────────┬─────────────────────────────────────────────────┤
│              │                                                  │
│  TEMPLATES   │          EDITOR DE CÓDIGO                        │
│  ──────────  │  ┌────────────────────────────────────────────┐ │
│  🎵 Melodia  │  │ -- código editável aqui                    │ │
│  🥁 Ritmo    │  │                                            │ │
│  🎼 Escalas  │  │                                            │ │
│              │  └────────────────────────────────────────────┘ │
│              │                                                  │
│              │  ┌─ PLAYER ───────────────────────────────────┐ │
│              │  │ ▶ Reproduzir  ⏹ Parar  🔊 Volume          │ │
│              │  │ ████████░░░░░░  Dó — 261.63 Hz             │ │
│              │  └────────────────────────────────────────────┘ │
│              │                                                  │
│              │  ┌─ CONSOLE ──────────────────────────────────┐ │
│              │  │ [12:34:01] ✓ Iniciando reprodução...       │ │
│              │  │ [12:34:01] ℹ 8 notas detectadas            │ │
│              │  │ [12:34:01] ✓ [1/8] Dó — 261.63 Hz         │ │
│              │  │ [12:34:02] ✗ ERRO: código vazio            │ │
│              │  └────────────────────────────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────┘
```

### Funcionalidades do Studio

- **Abas por linguagem:** cada linguagem instalada tem sua aba
- **Lista de templates:** clique para carregar código no editor
- **Editor editável:** modifique o código como quiser
- **Player integrado:** botão ▶ toca o som do código atual
- **Preview HTML:** para templates HTML, aparece preview ao vivo em iframe
- **Download:** baixe o código como arquivo `.lua`, `.java`, `.html`, `.js` ou `.py`
- **Console:** veja todos os logs e erros em tempo real

---

## 7. Linguagens Suportadas

### 🌙 Lua

Lua é uma linguagem de script leve e poderosa, muito usada em jogos. No MusicCode Studio, você usa Lua para descrever melodias, ritmos e escalas musicais.

**Como o Studio interpreta Lua:**
O player analisa o código Lua em busca de nomes de notas (`Do`, `Re`, `Mi`, `Fa`, `Sol`, `La`, `Si`) e suas durações, e converte para frequências Hz.

**Templates incluídos:**
- 🎵 **Melodia Simples** — Sequência de notas com frequências Hz
- 🥁 **Gerador de Ritmo** — Padrões de batida com BPM controlável
- 🎼 **Escalas Musicais** — Maior, menor, pentatônica e blues

**Exemplo básico:**
```lua
-- Melodia em Lua
local notas = {
  Do=261.63, Re=293.66, Mi=329.63,
  Fa=349.23, Sol=392.00, La=440.00,
}

local melodia = {
  {nota="Do", duracao=0.5},
  {nota="Mi", duracao=0.5},
  {nota="Sol", duracao=1.0},
}

for _, p in ipairs(melodia) do
  print(string.format("🎵 %s — %.2f Hz", p.nota, notas[p.nota]))
end
```

---

### ☕ Java

Java é usado no Studio para demonstrar a **Java Sound API** (`javax.sound.sampled`) e a **MIDI API** (`javax.sound.midi`). O código Java não roda no browser — o player interpreta os enums de nota (`Nota.DO`, `Nota.MI`, etc.) e reproduz o áudio via Web Audio API.

**Templates incluídos:**
- 🔊 **Sintetizador Java** — Gera tons com `javax.sound.sampled`
- 🥁 **Drum Machine MIDI** — Sequenciador de bateria com MIDI
- 🎹 **Piano Virtual** — Piano interativo com Java Swing + MIDI

**Exemplo básico:**
```java
// Sintetizador Java
public class Synth {
  enum Nota {
    DO(261.63), RE(293.66), MI(329.63),
    SOL(392.00), LA(440.00);
    final double f;
    Nota(double f){ this.f = f; }
  }

  public static void main(String[] args) throws Exception {
    Nota[] melodia = { Nota.DO, Nota.MI, Nota.SOL, Nota.LA };
    for (Nota n : melodia) {
      System.out.printf("🎵 %s | %.2f Hz%n", n.name(), n.f);
    }
  }
}
```

---

### 🌐 HTML/CSS

A extensão HTML é a **mais poderosa** do Studio, pois os templates rodam **diretamente no browser** com preview ao vivo em iframe. Usa a **Web Audio API** nativa do navegador.

**Templates incluídos:**
- 🎹 **Piano Interativo** — Piano completo com teclas clicáveis e teclado
- 🥁 **Beat Maker** — Sequenciador de 16 passos com 6 instrumentos
- 🌈 **Visualizador de Áudio** — Canvas com barras, onda e modo circular

**Exemplo básico:**
```html
<!DOCTYPE html>
<html>
<body>
<script>
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.value = 440; // Lá — 440 Hz
  gain.gain.value = 0.3;
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  
  setTimeout(() => osc.stop(), 1000); // 1 segundo
</script>
</body>
</html>
```

---

### ⚡ JavaScript

JavaScript usa a **Web Audio API moderna** diretamente, com suporte a síntese avançada, efeitos (reverb, delay, filtros) e sequenciamento por tempo agendado (`AudioContext.currentTime`).

**Templates incluídos:**
- 🎵 **Melodia com Web Audio** — Osciladores com envelope ADSR
- 🥁 **Drum Machine JS** — Síntese de bateria (kick, snare, hi-hat) com buffer
- 🎹 **Sintetizador com Efeitos** — Reverb, delay e filtro passa-baixas

**Exemplo básico:**
```javascript
const ctx = new AudioContext();

// Mapa de notas
const notas = { Do: 261.63, Mi: 329.63, Sol: 392.00 };

// Tocar uma nota com envelope ADSR
function tocarNota(freq, inicio, duracao) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, inicio);
  gain.gain.linearRampToValueAtTime(0.5, inicio + 0.02);  // Attack
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(inicio);
  osc.stop(inicio + duracao + 0.1);
}

// Agendar melodia
let t = ctx.currentTime;
tocarNota(notas.Do,  t,       0.4);
tocarNota(notas.Mi,  t + 0.5, 0.4);
tocarNota(notas.Sol, t + 1.0, 0.8);
```

---

### 🐍 Python

Python no Studio funciona via **simulação**: o código Python é interpretado visualmente pelo player, que extrai as notas e durações e toca o áudio via Web Audio API. Isso significa que você pode escrever código Python real sem precisar de Python instalado.

**Templates incluídos:**
- 🎵 **Melodia em Python** — Sequência de notas com frequências e duração
- 🎼 **Escalas Musicais** — Maior, menor, pentatônica, blues, dórica
- 🥁 **Padrão Rítmico** — Gerador de ritmos com BPM e grade rítmica visual

**Exemplo básico:**
```python
# Melodia em Python — MusicCode Studio
notas = {
    "Do":  261.63, "Re":  293.66, "Mi":  329.63,
    "Fa":  349.23, "Sol": 392.00, "La":  440.00,
    "Si":  493.88,
}

melodia = [
    ("Do", 0.4), ("Mi", 0.4), ("Sol", 0.4),
    ("La", 0.8), ("Sol", 1.6),
]

def reproduzir(seq):
    print("🎶 Iniciando melodia Python...")
    for nome, dur in seq:
        freq = notas[nome]
        print(f"🎵 {nome:<5} | {freq:.2f} Hz | {dur:.1f}s")
    print("✅ Concluído!")

reproduzir(melodia)
```

---

## 8. Player de Áudio e Console de Erros

### Como o Player funciona

O player é o componente `AudioPlayer.tsx`. Ele:

1. **Lê o código** atual do editor
2. **Detecta a linguagem** (Lua, Java, HTML, JavaScript, Python)
3. **Faz o parse** das notas com parsers específicos por linguagem
4. **Sintetiza o áudio** usando a Web Audio API do navegador
5. **Exibe os logs** no Console em tempo real

### Parsers por linguagem

| Linguagem | O que o parser busca | Como toca |
|-----------|---------------------|-----------|
| **Lua** | `nota="Do"`, `nota="Re"`, etc. + `duracao=X` | Oscilador `triangle` por nota |
| **Java** | `Nota.DO`, `Nota.MI`, `Nota.SOL`, etc. | Oscilador `triangle` por nota |
| **JavaScript** | `notas.Do`, `notas.Mi`, `Do:`, `Mi:` etc. | Oscilador `triangle` por nota |
| **Python** | `"Do"`, `"Mi"`, `"Sol"` + padrão `(nome, dur)` | Oscilador `triangle` por nota |
| **HTML** | — | Renderiza em iframe (preview ao vivo) |

### Controles do Player

| Controle | Função |
|----------|--------|
| ▶ **Reproduzir** | Inicia a reprodução das notas detectadas |
| ⏹ **Parar** | Para a reprodução imediatamente |
| 🔊 **Volume** | Slider de 0% a 100% |
| 🔇 **Mudo** | Silencia sem parar a reprodução |
| **Barra de progresso** | Mostra o avanço da música |
| **Nota atual** | Exibe a nota sendo tocada agora |

### Console de Erros

O Console (`ConsolePanel.tsx`) exibe **todos os eventos** em tempo real:

#### Níveis de log

| Ícone | Nível | Cor | Quando aparece |
|-------|-------|-----|----------------|
| `✓` | **success** | Verde | Nota tocada com sucesso, operação concluída |
| `ℹ` | **info** | Azul | Informações gerais, contagem de notas, início |
| `⚠` | **warning** | Amarelo | Nota desconhecida, aviso de compatibilidade |
| `✗` | **error** | Vermelho | Erro crítico, permissão negada, código inválido |

#### Códigos de erro

| Código | Causa | Solução |
|--------|-------|---------|
| `EMPTY_CODE` | O editor está vazio | Escreva ou carregue um template |
| `AUDIO_CONTEXT_NOT_SUPPORTED` | Navegador não suporta Web Audio | Use Chrome, Firefox ou Edge moderno |
| `NOT_ALLOWED_ERROR` | Usuário não interagiu com a página primeiro | Clique em qualquer lugar e tente novamente |
| `NOT_SUPPORTED_ERROR` | Formato de áudio não suportado | Atualize o navegador |
| `AUDIO_SUSPENDED` | AudioContext suspenso pelo navegador | Interaja com a página e tente novamente |
| `NO_NOTES_FOUND` | Nenhuma nota reconhecida no código | Verifique a sintaxe e use nomes de notas válidos |

#### Funcionalidades do Console

- **Timestamp** em cada mensagem `[HH:MM:SS]`
- **Blocos de código** para erros técnicos (ex: nome do erro, stack)
- **Contadores** de erros, avisos e sucessos no cabeçalho
- **Auto-scroll** para a última mensagem
- **Copiar tudo** — copia todos os logs em texto plano
- **Limpar** — limpa o console

---

## 9. Como Criar Músicas — Guia Prático

### Passo a Passo para Iniciantes

#### 1. Acesse o Workshop
- Clique em **Workshop** na barra de navegação
- Escolha uma linguagem (recomendamos **HTML** para iniciantes)
- Clique em **Instalar**

#### 2. Abra o Studio
- Após instalar, clique em **Abrir no Studio**
- Ou acesse **Studio** pelo menu

#### 3. Carregue um Template
- Clique em um template na lista à esquerda
- O código aparece no editor

#### 4. Reproduza
- Clique em **▶ Reproduzir**
- Ouça a música e veja os logs no Console

#### 5. Edite o Código
- Modifique as notas, durações, BPM
- Clique em Reproduzir novamente para ouvir as mudanças

#### 6. Baixe
- Clique em **⬇ Download** para salvar o arquivo localmente

### Como mudar as notas

#### Em Lua:
```lua
-- Troque "Do" por qualquer nota da tabela abaixo
local melodia = {
  {nota="Do",  duracao=0.5},  -- Dó
  {nota="Mi",  duracao=0.5},  -- Mi
  {nota="Sol", duracao=1.0},  -- Sol (duração maior = nota mais longa)
}
```

#### Em Python:
```python
melodia = [
    ("Do",  0.5),   # Dó — 0.5 segundos
    ("Mi",  0.5),   # Mi
    ("Sol", 1.0),   # Sol — 1 segundo (mais longa)
    ("La",  0.5),   # Lá
    ("Do2", 2.0),   # Dó oitava acima — 2 segundos
]
```

#### Em JavaScript:
```javascript
const notas = { Do: 261.63, Mi: 329.63, Sol: 392.00 };
// Adicione mais notas conforme a tabela abaixo
```

---

## 10. Tabela de Notas e Frequências

Use estas frequências para criar suas melodias:

### Oitava Central (C4)

| Nota | Nome (PT) | Frequência | Lua/Python/Java | Símbolo |
|------|-----------|------------|-----------------|---------|
| C4 | **Dó** | 261.63 Hz | `"Do"` / `Nota.DO` | ♩ |
| D4 | **Ré** | 293.66 Hz | `"Re"` / `Nota.RE` | ♩ |
| E4 | **Mi** | 329.63 Hz | `"Mi"` / `Nota.MI` | ♩ |
| F4 | **Fá** | 349.23 Hz | `"Fa"` / `Nota.FA` | ♩ |
| G4 | **Sol** | 392.00 Hz | `"Sol"` / `Nota.SOL` | ♩ |
| A4 | **Lá** | 440.00 Hz | `"La"` / `Nota.LA` | ♩ |
| B4 | **Si** | 493.88 Hz | `"Si"` / `Nota.SI` | ♩ |
| C5 | **Dó₂** | 523.25 Hz | `"Do2"` / `Nota.DO2` | ♩ |

### Durações Musicais

| Nome | Duração (s) | Valor musical |
|------|-------------|---------------|
| Semibreve | 2.0 | ○ |
| Mínima | 1.0 | ♩ |
| Semínima | 0.5 | ♩ |
| Colcheia | 0.25 | ♪ |
| Semicolcheia | 0.125 | ♬ |

### Escalas comuns

```
Dó Maior:     Do  Re  Mi  Fa  Sol La  Si  Do2
Intervalos:    0   2   4   5   7   9   11  12  (semitons)

Lá Menor:     La  Si  Do  Re  Mi  Fa  Sol La
Intervalos:    0   2   3   5   7   8   10  12

Pentatônica:  Do  Re  Mi  Sol La  Do2
Intervalos:    0   2   4   7   9   12

Blues:        Do  Mib Mi  Fa  Sol Sib Do2
Intervalos:    0   3   4   5   7   10  12
```

---

## 11. Sistema de Configurações

As configurações são salvas no **localStorage** do navegador e aplicadas instantaneamente.

### Idiomas suportados

| Código | Idioma | Bandeira |
|--------|--------|---------|
| `pt-BR` | Português (Brasil) | 🇧🇷 |
| `en-US` | English (US) | 🇺🇸 |
| `es-ES` | Español | 🇪🇸 |
| `fr-FR` | Français | 🇫🇷 |
| `de-DE` | Deutsch | 🇩🇪 |
| `ja-JP` | 日本語 | 🇯🇵 |

### Temas disponíveis

| Tema | Fundo | Clima |
|------|-------|-------|
| `dark` | `#0a0a14` | Escuro padrão |
| `darker` | `#050508` | Ultra escuro |
| `midnight` | `#0a0f1e` | Azul meia-noite |
| `ocean` | `#051520` | Azul oceano |
| `forest` | `#050f0a` | Verde floresta |
| `sunset` | `#160810` | Roxo pôr do sol |

### Cores de destaque

`purple` · `blue` · `pink` · `emerald` · `orange` · `red` · `cyan`

### Configurações do Editor

| Opção | Padrão | Descrição |
|-------|--------|-----------|
| `editorFontSize` | 14px | Tamanho da fonte no editor |
| `lineNumbers` | true | Exibir números de linha |
| `wordWrap` | false | Quebrar linha longa |
| `autoCloseBrackets` | true | Fechar parênteses/colchetes automaticamente |
| `tabSize` | 2 | Tamanho do tab (2 ou 4 espaços) |

### Configurações de Áudio

| Opção | Padrão | Descrição |
|-------|--------|-----------|
| `defaultVolume` | 0.7 | Volume padrão (0 a 1) |
| `noteDuration` | 0.4s | Duração padrão de cada nota |
| `autoPlay` | false | Reproduzir automaticamente ao carregar template |
| `showConsoleByDefault` | false | Abrir console automaticamente |

---

## 12. Arquitetura dos Componentes

### Fluxo de dados

```
main.tsx
  └── SettingsProvider (contexto global)
        └── App.tsx (estado: page, installed, studioLang)
              ├── Header (nav fixa)
              ├── HomePage (grid de linguagens, CTAs)
              ├── WorkshopPage (extensões, instalação)
              │     └── onInstall → atualiza Set<LangId> no App
              ├── StudioPage (editor, player, console)
              │     ├── AudioPlayer (síntese Web Audio)
              │     │     └── ConsolePanel (logs em tempo real)
              │     └── iframe (preview HTML)
              ├── AboutPage (documentação do site)
              └── SettingsPage (configurações + localStorage)
```

### Comunicação entre componentes

| De | Para | Como |
|----|------|------|
| `WorkshopPage` | `App` | callback `onInstall(id)` |
| `App` | `StudioPage` | prop `installed: Set<LangId>` |
| `App` | `StudioPage` | prop `defaultLang?: LangId` |
| `StudioPage` | `WorkshopPage` | callback `onGoWorkshop()` |
| `AudioPlayer` | `ConsolePanel` | função `addLog(msg, level)` |
| `SettingsContext` | todos | hook `useSettings()` |

### Estado global (`SettingsContext`)

```typescript
interface Settings {
  language: Language;        // idioma da interface
  theme: Theme;              // tema de cores do fundo
  accentColor: AccentColor;  // cor de destaque
  fontSize: FontSize;        // tamanho da fonte geral
  animationLevel: AnimationLevel;
  compactMode: boolean;
  showBreadcrumb: boolean;
  editorFontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  autoCloseBrackets: boolean;
  tabSize: number;
  defaultVolume: number;
  autoPlay: boolean;
  showConsoleByDefault: boolean;
  noteDuration: number;
  showDeprecated: boolean;
  autoUpdate: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}
```

---

## 13. Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/musiccode-studio.git
cd musiccode-studio

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:5173
```

### Build para produção

```bash
npm run build
# Os arquivos finais ficam em dist/
```

### Variáveis de ambiente

Nenhuma variável de ambiente é necessária. O projeto funciona 100% no frontend, sem backend.

### Compatibilidade de navegadores

| Navegador | Suporte | Nota |
|-----------|---------|------|
| Chrome 90+ | ✅ Completo | Recomendado |
| Firefox 88+ | ✅ Completo | — |
| Edge 90+ | ✅ Completo | — |
| Safari 14+ | ⚠️ Parcial | Web Audio pode precisar de interação do usuário |
| Opera 76+ | ✅ Completo | — |

> **Importante:** A Web Audio API requer que o usuário interaja com a página antes de tocar qualquer som (política do navegador). Sempre clique em algum lugar da página antes de usar o player.

---

## 14. Créditos e Tecnologias

### 👨‍💻 Criador

**Rhuan De Cillo Silva**  
Criador, idealizador e desenvolvedor principal do MusicCode Studio.

---

### 🛠️ Tecnologias utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 18+ | Framework de UI |
| **TypeScript** | 5+ | Tipagem estática |
| **Vite** | 5+ | Build tool e dev server |
| **Tailwind CSS** | 3+ | Estilização utility-first |
| **Web Audio API** | Nativa | Síntese de som no browser |
| **Lucide React** | Latest | Ícones da interface |
| **localStorage** | Nativa | Persistência de configurações |

### 🎵 Conceitos de áudio utilizados

| Conceito | Descrição |
|----------|-----------|
| **Oscilador** | Gera ondas sonoras (sine, square, triangle, sawtooth) |
| **GainNode** | Controla o volume de um nó de áudio |
| **ADSR Envelope** | Attack, Decay, Sustain, Release — shaping do volume |
| **AnalyserNode** | Analisa o áudio em tempo real para visualização |
| **ConvolverNode** | Cria efeito de reverb (reverberação) |
| **DelayNode** | Cria efeito de delay (eco) |
| **BiquadFilter** | Filtros de frequência (lowpass, highpass, bandpass) |
| **BufferSource** | Reproduz amostras de áudio (usado para ruído branco nos pratos) |
| **Frequência Hz** | Frequência da onda sonora — determina o tom da nota |
| **MIDI** | Musical Instrument Digital Interface — protocolo de música digital |

---

### 📜 Licença

MIT License — sinta-se livre para usar, modificar e distribuir.

---

*MusicCode Studio — Onde a programação encontra a música. 🎵*

*Criado com ❤️ por **Rhuan De Cillo Silva***

export type Language = "lua" | "java" | "html";

export interface Template {
  id: string;
  name: string;
  description: string;
  language: Language;
  code: string;
  preview?: string;
}

export const luaTemplates: Template[] = [
  {
    id: "lua-beep",
    name: "Melodia Simples (Lua)",
    description: "Toca uma sequência de notas musicais usando frequências.",
    language: "lua",
    preview: "🎵 Dó Ré Mi Fá Sol...",
    code: `-- 🎵 MusicCode Studio - Melodia em Lua
-- Notas musicais com suas frequências (Hz)
local notas = {
  Do  = 261.63,
  Re  = 293.66,
  Mi  = 329.63,
  Fa  = 349.23,
  Sol = 392.00,
  La  = 440.00,
  Si  = 493.88,
  Do2 = 523.25,
}

-- Sequência da melodia "Dó Ré Mi"
local melodia = {
  { nota = "Do",  duracao = 0.5 },
  { nota = "Re",  duracao = 0.5 },
  { nota = "Mi",  duracao = 0.5 },
  { nota = "Fa",  duracao = 0.5 },
  { nota = "Sol", duracao = 1.0 },
  { nota = "Sol", duracao = 1.0 },
  { nota = "La",  duracao = 0.5 },
  { nota = "La",  duracao = 0.5 },
  { nota = "La",  duracao = 0.5 },
  { nota = "La",  duracao = 0.5 },
  { nota = "Sol", duracao = 2.0 },
}

-- Função para tocar uma nota
function tocarNota(freq, duracao)
  print(string.format("🎵 Tocando: %.2f Hz por %.1fs", freq, duracao))
  -- Simulação de som (em ambiente real, usaria biblioteca de áudio)
  local inicio = os.clock()
  while os.clock() - inicio < duracao do end
end

-- Toca a melodia completa
print("🎶 Iniciando melodia...")
for _, passo in ipairs(melodia) do
  local freq = notas[passo.nota]
  print("  Nota: " .. passo.nota)
  tocarNota(freq, passo.duracao)
end
print("✅ Melodia concluída!")`,
  },
  {
    id: "lua-rhythm",
    name: "Gerador de Ritmo (Lua)",
    description: "Cria padrões rítmicos com batidas e pausas.",
    language: "lua",
    preview: "🥁 Kick Hat Snare...",
    code: `-- 🥁 Gerador de Ritmo em Lua
-- Define os instrumentos de percussão
local bateria = {
  kick  = "💥 KICK",
  snare = "🔔 SNARE",
  hihat = "🎵 HI-HAT",
  pausa = "   ----",
}

-- Padrão de batida (1 = toca, 0 = silêncio)
local padrao = {
  -- [beat]  kick  snare  hihat
  { 1,     0,     1 },  -- beat 1
  { 0,     0,     1 },  -- beat 2
  { 0,     1,     1 },  -- beat 3
  { 0,     0,     1 },  -- beat 4
  { 1,     0,     1 },  -- beat 5
  { 1,     0,     0 },  -- beat 6
  { 0,     1,     1 },  -- beat 7
  { 0,     0,     1 },  -- beat 8
}

local BPM = 120
local segundosPorBeat = 60 / BPM / 2

-- Função para tocar o padrão
function tocarPadrao(repeticoes)
  print(string.format("🎶 BPM: %d | Batidas: %d", BPM, #padrao))
  print(string.rep("-", 40))
  
  for r = 1, repeticoes do
    print(string.format("🔄 Repetição %d/%d", r, repeticoes))
    for i, beat in ipairs(padrao) do
      local linha = string.format("  Beat %d: ", i)
      if beat[1] == 1 then linha = linha .. bateria.kick  .. " " end
      if beat[2] == 1 then linha = linha .. bateria.snare .. " " end
      if beat[3] == 1 then linha = linha .. bateria.hihat .. " " end
      print(linha)
      -- Aguarda o tempo do beat
      local t = os.clock()
      while os.clock() - t < segundosPorBeat do end
    end
  end
  print("✅ Ritmo finalizado!")
end

tocarPadrao(2)`,
  },
  {
    id: "lua-scale",
    name: "Escalas Musicais (Lua)",
    description: "Gera e toca escalas musicais maiores e menores.",
    language: "lua",
    preview: "🎼 Escalas Musicais",
    code: `-- 🎼 Escalas Musicais em Lua
-- Frequências base (oitava 4)
local BASE = {
  C=261.63, D=293.66, E=329.63, F=349.23,
  G=392.00, A=440.00, B=493.88
}

-- Intervalos em semitons
local escalas = {
  maior  = {0,2,4,5,7,9,11,12},
  menor  = {0,2,3,5,7,8,10,12},
  pentatonica = {0,2,4,7,9,12},
  blues  = {0,3,5,6,7,10,12},
}

local nomes = {"C","D","E","F","G","A","B"}

-- Calcula frequência por semitons acima de uma base
function semitomParaFreq(freqBase, semitons)
  return freqBase * (2 ^ (semitons / 12))
end

-- Toca e exibe uma escala
function tocarEscala(nota, tipoEscala)
  local freqBase = BASE[nota]
  local intervalos = escalas[tipoEscala]
  
  print(string.format("\\n🎵 Escala de %s %s:", nota, tipoEscala))
  print(string.rep("=", 35))
  
  for i, semitom in ipairs(intervalos) do
    local freq = semitomParaFreq(freqBase, semitom)
    print(string.format("  Nota %d | %.2f Hz | %s",
      i, freq, string.rep("█", math.floor(freq/50))))
    local t = os.clock()
    while os.clock() - t < 0.3 do end
  end
end

-- Demonstração de escalas
tocarEscala("C", "maior")
tocarEscala("A", "menor")
tocarEscala("G", "pentatonica")
tocarEscala("E", "blues")

print("\\n✅ Todas as escalas tocadas!")`,
  },
];

export const javaTemplates: Template[] = [
  {
    id: "java-tone",
    name: "Sintetizador de Tom (Java)",
    description: "Gera e toca tons usando javax.sound.sampled.",
    language: "java",
    preview: "🔊 Java Sound API",
    code: `// 🎵 MusicCode Studio - Sintetizador em Java
import javax.sound.sampled.*;
import java.util.*;

public class MusicSynth {

    static final int SAMPLE_RATE = 44100;

    // Frequências das notas (Hz)
    enum Nota {
        DO(261.63), RE(293.66), MI(329.63),
        FA(349.23), SOL(392.00), LA(440.00),
        SI(493.88), DO2(523.25), PAUSA(0);

        final double freq;
        Nota(double f) { this.freq = f; }
    }

    // Gera amostras de uma onda senoidal
    static byte[] gerarOndaSeno(double freq, int milissegundos) {
        int amostras = SAMPLE_RATE * milissegundos / 1000;
        byte[] buf = new byte[amostras];
        for (int i = 0; i < amostras; i++) {
            double angulo = 2.0 * Math.PI * freq * i / SAMPLE_RATE;
            buf[i] = (byte)(Math.sin(angulo) * 80);
        }
        return buf;
    }

    // Toca uma nota por X milissegundos
    static void tocarNota(Nota nota, int ms) throws Exception {
        System.out.printf("🎵 %-5s | %.2f Hz | %dms%n",
            nota.name(), nota.freq, ms);

        if (nota == Nota.PAUSA) {
            Thread.sleep(ms);
            return;
        }

        AudioFormat fmt = new AudioFormat(SAMPLE_RATE, 8, 1, true, false);
        SourceDataLine line = AudioSystem.getSourceDataLine(fmt);
        line.open(fmt);
        line.start();

        byte[] onda = gerarOndaSeno(nota.freq, ms);
        line.write(onda, 0, onda.length);
        line.drain();
        line.close();
    }

    public static void main(String[] args) throws Exception {
        System.out.println("🎶 Java Music Synth Iniciado!");
        System.out.println("=".repeat(40));

        // Melodia: "Ode à Alegria" (Beethoven)
        List<Nota[]> melodia = Arrays.asList(
            new Nota[]{Nota.MI, Nota.MI, Nota.FA, Nota.SOL},
            new Nota[]{Nota.SOL, Nota.FA, Nota.MI, Nota.RE},
            new Nota[]{Nota.DO, Nota.DO, Nota.RE, Nota.MI},
            new Nota[]{Nota.MI, Nota.RE, Nota.RE}
        );

        for (Nota[] compasso : melodia) {
            for (Nota nota : compasso) {
                tocarNota(nota, 400);
            }
            System.out.println("  --- compasso ---");
        }

        System.out.println("✅ Peça concluída com sucesso!");
    }
}`,
  },
  {
    id: "java-drum",
    name: "Sequenciador de Bateria (Java)",
    description: "Sequenciador de bateria usando MIDI no Java.",
    language: "java",
    preview: "🥁 MIDI Drum Machine",
    code: `// 🥁 Sequenciador de Bateria - Java MIDI
import javax.sound.midi.*;
import java.util.*;

public class DrumMachine {

    // Notas MIDI da bateria (canal 10)
    static final int KICK   = 36; // Bass Drum
    static final int SNARE  = 38; // Snare Drum
    static final int HIHAT  = 42; // Closed Hi-Hat
    static final int CLAP   = 39; // Hand Clap
    static final int CRASH  = 49; // Crash Cymbal
    static final int RIDE   = 51; // Ride Cymbal
    static final int TOM_HI = 50; // High Tom
    static final int TOM_LO = 45; // Low Tom

    static Sequencer sequencer;
    static Sequence sequence;
    static Track track;

    // BPM da música
    static final int BPM = 128;

    // Adiciona uma nota MIDI na track
    static void addNota(int instrumento, int tick, int velocity) throws Exception {
        ShortMessage noteOn = new ShortMessage();
        noteOn.setMessage(ShortMessage.NOTE_ON, 9, instrumento, velocity);
        track.add(new MidiEvent(noteOn, tick));

        ShortMessage noteOff = new ShortMessage();
        noteOff.setMessage(ShortMessage.NOTE_OFF, 9, instrumento, 0);
        track.add(new MidiEvent(noteOff, tick + 10));

        String nome = switch (instrumento) {
            case KICK   -> "💥 KICK";
            case SNARE  -> "🔔 SNARE";
            case HIHAT  -> "🎵 HI-HAT";
            case CLAP   -> "👏 CLAP";
            case CRASH  -> "💫 CRASH";
            default     -> "🎶 NOTA";
        };
        System.out.printf("  tick %3d | %s (vel:%d)%n", tick, nome, velocity);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("🥁 DrumMachine MIDI - Java");
        System.out.println("=".repeat(40));
        System.out.printf("BPM: %d%n%n", BPM);

        sequencer = MidiSystem.getSequencer();
        sequencer.open();

        // 4 ticks por beat, 2 compassos
        sequence = new Sequence(Sequence.PPQ, 4, 1);
        track = sequence.createTrack();

        System.out.println("📝 Programando padrão de bateria:");

        // Compasso 1 - Padrão básico de Rock
        addNota(KICK,   0,  127);
        addNota(HIHAT,  0,  90);
        addNota(HIHAT,  2,  70);
        addNota(SNARE,  4,  120);
        addNota(HIHAT,  4,  90);
        addNota(HIHAT,  6,  70);
        addNota(KICK,   8,  127);
        addNota(KICK,   10, 100);
        addNota(HIHAT,  8,  90);
        addNota(SNARE,  12, 120);
        addNota(HIHAT,  12, 90);
        addNota(CRASH,  14, 80);
        addNota(HIHAT,  14, 70);

        sequencer.setSequence(sequence);
        sequencer.setTempoInBPM(BPM);
        sequencer.setLoopCount(3);
        sequencer.start();

        System.out.println("\\n▶️  Reproduzindo... (3 repetições)");
        Thread.sleep(8000);

        sequencer.stop();
        sequencer.close();
        System.out.println("⏹️  Finalizado!");
    }
}`,
  },
  {
    id: "java-piano",
    name: "Piano Virtual (Java)",
    description: "Piano interativo via teclado usando Java Swing + MIDI.",
    language: "java",
    preview: "🎹 Piano Interativo",
    code: `// 🎹 Piano Virtual Interativo - Java Swing + MIDI
import javax.sound.midi.*;
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;

public class PianoVirtual extends JFrame {

    static MidiChannel canal;

    // Mapeamento tecla -> nota MIDI
    static final Map<Character, Integer> MAPA_TECLAS = new LinkedHashMap<>() {{
        put('a', 60); // Dó  (C4)
        put('s', 62); // Ré  (D4)
        put('d', 64); // Mi  (E4)
        put('f', 65); // Fá  (F4)
        put('g', 67); // Sol (G4)
        put('h', 69); // Lá  (A4)
        put('j', 71); // Si  (B4)
        put('k', 72); // Dó2 (C5)
        put('l', 74); // Ré2 (D5)
        // Teclas pretas
        put('w', 61); // Dó#
        put('e', 63); // Ré#
        put('t', 66); // Fá#
        put('y', 68); // Sol#
        put('u', 70); // Lá#
    }};

    static final String[] NOMES = {
        "Dó","Dó#","Ré","Ré#","Mi","Fá",
        "Fá#","Sol","Sol#","Lá","Lá#","Si"
    };

    public PianoVirtual() throws Exception {
        super("🎹 Piano Virtual - MusicCode Studio");

        // Inicializa sintetizador MIDI
        Synthesizer synth = MidiSystem.getSynthesizer();
        synth.open();
        canal = synth.getChannels()[0];
        canal.programChange(0); // Piano Acústico (GM 0)

        setLayout(new BorderLayout());

        // Painel de informações
        JLabel info = new JLabel(
            "<html><center>🎹 Use as teclas: A S D F G H J K L (brancas)" +
            "<br>W E T Y U (pretas) | ESC para sair</center></html>",
            SwingConstants.CENTER
        );
        info.setFont(new Font("Arial", Font.PLAIN, 14));
        info.setForeground(Color.WHITE);
        info.setBackground(new Color(30, 30, 50));
        info.setOpaque(true);
        info.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        add(info, BorderLayout.NORTH);

        // Painel do piano
        JPanel piano = criarPiano();
        add(piano, BorderLayout.CENTER);

        // Log de notas
        JTextArea log = new JTextArea(5, 40);
        log.setBackground(new Color(20, 20, 35));
        log.setForeground(new Color(100, 255, 150));
        log.setFont(new Font("Monospaced", Font.PLAIN, 12));
        log.setEditable(false);
        add(new JScrollPane(log), BorderLayout.SOUTH);

        // Listener de teclado
        addKeyListener(new KeyAdapter() {
            public void keyPressed(KeyEvent e) {
                char c = Character.toLowerCase(e.getKeyChar());
                if (e.getKeyCode() == KeyEvent.VK_ESCAPE) System.exit(0);
                if (MAPA_TECLAS.containsKey(c)) {
                    int nota = MAPA_TECLAS.get(c);
                    canal.noteOn(nota, 100);
                    String nome = NOMES[nota % 12];
                    log.append("🎵 " + nome + " (MIDI:" + nota + ") pressionada\\n");
                    log.setCaretPosition(log.getDocument().getLength());
                }
            }
            public void keyReleased(KeyEvent e) {
                char c = Character.toLowerCase(e.getKeyChar());
                if (MAPA_TECLAS.containsKey(c)) {
                    canal.noteOff(MAPA_TECLAS.get(c));
                }
            }
        });

        setBackground(new Color(30, 30, 50));
        setSize(800, 450);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setVisible(true);
        requestFocus();
    }

    JPanel criarPiano() {
        JPanel p = new JPanel(null);
        p.setBackground(new Color(20, 20, 35));
        // (Renderização simplificada - em ambiente real desenharia as teclas)
        JLabel l = new JLabel("🎹 Piano carregado! Use o teclado para tocar.",
            SwingConstants.CENTER);
        l.setBounds(0, 50, 800, 50);
        l.setForeground(Color.WHITE);
        l.setFont(new Font("Arial", Font.BOLD, 18));
        p.add(l);
        return p;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("🎹 Iniciando Piano Virtual...");
        SwingUtilities.invokeLater(() -> {
            try { new PianoVirtual(); }
            catch (Exception ex) { ex.printStackTrace(); }
        });
    }
}`,
  },
];

export const htmlTemplates: Template[] = [
  {
    id: "html-piano",
    name: "Piano Web (HTML)",
    description: "Piano interativo no navegador com Web Audio API.",
    language: "html",
    preview: "🎹 Piano no Browser",
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🎹 Piano Web - MusicCode Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', sans-serif;
      color: white;
    }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    p  { color: #aaa; margin-bottom: 30px; }

    .piano {
      display: flex;
      position: relative;
      border-radius: 12px;
      overflow: visible;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    }

    .key {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 12px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      border-radius: 0 0 8px 8px;
      transition: filter 0.05s, transform 0.05s;
    }

    .white {
      width: 60px;
      height: 200px;
      background: linear-gradient(to bottom, #f5f5f5, #fff);
      border: 1px solid #ccc;
      color: #555;
      z-index: 1;
    }
    .white:hover, .white.active {
      background: linear-gradient(to bottom, #e0f0ff, #cce5ff);
      transform: translateY(2px);
    }

    .black {
      width: 38px;
      height: 130px;
      background: linear-gradient(to bottom, #222, #444);
      color: #aaa;
      z-index: 2;
      margin: 0 -19px;
      box-shadow: 2px 4px 12px rgba(0,0,0,0.6);
    }
    .black:hover, .black.active {
      background: linear-gradient(to bottom, #5b3fff, #9b59ff);
      transform: translateY(2px);
    }

    .info {
      margin-top: 30px;
      text-align: center;
      color: #888;
      font-size: 14px;
    }
    .note-display {
      margin-top: 16px;
      font-size: 1.8rem;
      min-height: 48px;
      color: #a78bfa;
      font-weight: bold;
      letter-spacing: 4px;
    }
  </style>
</head>
<body>
  <h1>🎹 Piano Web</h1>
  <p>Clique nas teclas ou pressione: A S D F G H J K L</p>

  <div class="piano" id="piano"></div>

  <div class="note-display" id="noteDisplay">♪</div>
  <div class="info">Use o mouse ou teclado para tocar!</div>

<script>
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();

  const notas = [
    { nome: "Dó",   freq: 261.63, tecla: "a", tipo: "white" },
    { nome: "Dó#",  freq: 277.18, tecla: "w", tipo: "black" },
    { nome: "Ré",   freq: 293.66, tecla: "s", tipo: "white" },
    { nome: "Ré#",  freq: 311.13, tecla: "e", tipo: "black" },
    { nome: "Mi",   freq: 329.63, tecla: "d", tipo: "white" },
    { nome: "Fá",   freq: 349.23, tecla: "f", tipo: "white" },
    { nome: "Fá#",  freq: 369.99, tecla: "t", tipo: "black" },
    { nome: "Sol",  freq: 392.00, tecla: "g", tipo: "white" },
    { nome: "Sol#", freq: 415.30, tecla: "y", tipo: "black" },
    { nome: "Lá",   freq: 440.00, tecla: "h", tipo: "white" },
    { nome: "Lá#",  freq: 466.16, tecla: "u", tipo: "black" },
    { nome: "Si",   freq: 493.88, tecla: "j", tipo: "white" },
    { nome: "Dó2",  freq: 523.25, tecla: "k", tipo: "white" },
  ];

  const display = document.getElementById("noteDisplay");
  const piano = document.getElementById("piano");
  const osciladores = {};

  function tocarNota(nota) {
    if (osciladores[nota.nome]) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(nota.freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osciladores[nota.nome] = { osc, gain };
    display.textContent = "♪ " + nota.nome;
    document.getElementById("key-" + nota.nome).classList.add("active");
  }

  function pararNota(nota) {
    if (!osciladores[nota.nome]) return;
    const { osc, gain } = osciladores[nota.nome];
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
    delete osciladores[nota.nome];
    display.textContent = "♪";
    document.getElementById("key-" + nota.nome).classList.remove("active");
  }

  // Cria as teclas
  notas.forEach(nota => {
    const key = document.createElement("div");
    key.id = "key-" + nota.nome;
    key.className = "key " + nota.tipo;
    key.innerHTML = \`<span>\${nota.tecla.toUpperCase()}</span>\`;
    key.addEventListener("mousedown",  () => tocarNota(nota));
    key.addEventListener("mouseup",    () => pararNota(nota));
    key.addEventListener("mouseleave", () => pararNota(nota));
    key.addEventListener("touchstart", e => { e.preventDefault(); tocarNota(nota); });
    key.addEventListener("touchend",   e => { e.preventDefault(); pararNota(nota); });
    piano.appendChild(key);
  });

  // Teclado
  const mapaT = {};
  notas.forEach(n => mapaT[n.tecla] = n);

  document.addEventListener("keydown", e => {
    const n = mapaT[e.key.toLowerCase()];
    if (n) tocarNota(n);
  });
  document.addEventListener("keyup", e => {
    const n = mapaT[e.key.toLowerCase()];
    if (n) pararNota(n);
  });
</script>
</body>
</html>`,
  },
  {
    id: "html-visualizer",
    name: "Visualizador de Música (HTML)",
    description: "Visualizador de áudio em tempo real com Canvas.",
    language: "html",
    preview: "🌈 Audio Visualizer",
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🎵 Visualizador Musical - MusicCode Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0f;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
      color: white;
      overflow: hidden;
    }
    h1 { font-size: 1.8rem; margin-bottom: 6px; color: #a78bfa; }
    p { color: #666; font-size: 13px; margin-bottom: 20px; }

    canvas {
      border-radius: 16px;
      box-shadow: 0 0 40px rgba(167,139,250,0.3);
    }

    .controls {
      margin-top: 20px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    button {
      padding: 10px 24px;
      border: none;
      border-radius: 50px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }
    #btnMic {
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: white;
    }
    #btnDemo {
      background: linear-gradient(135deg, #059669, #10b981);
      color: white;
    }
    #btnStop {
      background: linear-gradient(135deg, #dc2626, #ef4444);
      color: white;
    }
    button:hover { transform: scale(1.05); opacity: 0.9; }

    .mode-btns { display: flex; gap: 8px; }
    .mode-btn {
      background: #1e1e2e;
      color: #888;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
    }
    .mode-btn.on { background: #7c3aed; color: white; }
  </style>
</head>
<body>
  <h1>🎵 Visualizador Musical</h1>
  <p>Ative o microfone ou use a demo para ver a visualização</p>

  <canvas id="canvas" width="700" height="300"></canvas>

  <div class="controls">
    <button id="btnMic">🎤 Microfone</button>
    <button id="btnDemo">🎵 Demo</button>
    <button id="btnStop">⏹ Parar</button>
    <div class="mode-btns">
      <button class="mode-btn on" data-mode="bars">📊 Barras</button>
      <button class="mode-btn" data-mode="wave">〰️ Onda</button>
      <button class="mode-btn" data-mode="circle">🔵 Círculo</button>
    </div>
  </div>

<script>
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let animId, analyser, dataArray, source, audioCtx, mode = "bars";

  function setupAnalyser(stream) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    desenhar();
  }

  function setupDemo() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Gera tom demo
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 220;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(analyser);
    gain.connect(audioCtx.destination);
    osc.start();

    // Modula a frequência para ficar interessante
    let t = 0;
    setInterval(() => {
      osc.frequency.value = 220 + Math.sin(t) * 80 + Math.sin(t*2.3)*40;
      t += 0.1;
    }, 50);

    desenhar();
  }

  const cores = ["#7c3aed","#a855f7","#ec4899","#f59e0b","#10b981","#3b82f6"];

  function desenhar() {
    animId = requestAnimationFrame(desenhar);
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "rgba(10,10,15,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const N = dataArray.length;
    const W = canvas.width, H = canvas.height;

    if (mode === "bars") {
      const bw = W / N;
      for (let i = 0; i < N; i++) {
        const v = dataArray[i] / 255;
        const h = v * H;
        const grad = ctx.createLinearGradient(0, H, 0, H - h);
        grad.addColorStop(0, "#7c3aed");
        grad.addColorStop(1, "#ec4899");
        ctx.fillStyle = grad;
        ctx.fillRect(i * bw, H - h, bw - 1, h);
      }
    } else if (mode === "wave") {
      analyser.getByteTimeDomainData(dataArray);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#a855f7";
      const sliceW = W / N;
      let x = 0;
      for (let i = 0; i < N; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * H) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceW;
      }
      ctx.lineTo(W, H / 2);
      ctx.stroke();
    } else if (mode === "circle") {
      const cx = W / 2, cy = H / 2;
      const r = 80;
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * Math.PI * 2;
        const amp = (dataArray[i] / 255) * 100;
        const x1 = cx + Math.cos(ang) * r;
        const y1 = cy + Math.sin(ang) * r;
        const x2 = cx + Math.cos(ang) * (r + amp);
        const y2 = cy + Math.sin(ang) * (r + amp);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = cores[i % cores.length];
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }

  document.getElementById("btnMic").onclick = async () => {
    cancelAnimationFrame(animId);
    if (audioCtx) audioCtx.close();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setupAnalyser(stream);
  };

  document.getElementById("btnDemo").onclick = () => {
    cancelAnimationFrame(animId);
    if (audioCtx) audioCtx.close();
    setupDemo();
  };

  document.getElementById("btnStop").onclick = () => {
    cancelAnimationFrame(animId);
    if (audioCtx) audioCtx.close();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      mode = btn.dataset.mode;
    };
  });
</script>
</body>
</html>`,
  },
  {
    id: "html-beatmaker",
    name: "Beat Maker (HTML)",
    description: "Crie beats com sequenciador interativo de 16 passos.",
    language: "html",
    preview: "🥁 Beat Sequencer",
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>🥁 Beat Maker - MusicCode Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d0d1a;
      font-family: 'Segoe UI', sans-serif;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;
      min-height: 100vh;
    }
    h1 { color: #a78bfa; font-size: 1.8rem; margin-bottom: 4px; }
    p  { color: #555; font-size: 13px; margin-bottom: 24px; }

    .controls {
      display: flex; gap: 12px; align-items: center; margin-bottom: 24px;
    }
    button {
      padding: 10px 22px; border: none; border-radius: 50px;
      font-weight: bold; cursor: pointer; font-size: 14px;
    }
    #play  { background: linear-gradient(135deg,#7c3aed,#a855f7); color:white; }
    #stop  { background: linear-gradient(135deg,#dc2626,#ef4444); color:white; }
    #clear { background: #1e1e2e; color:#aaa; }
    button:hover { opacity: 0.85; }

    .bpm-wrap { display:flex; align-items:center; gap:8px; color:#aaa; font-size:14px; }
    input[type=range] { accent-color: #a855f7; }

    .sequencer { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 760px; }

    .track {
      display: flex; align-items: center; gap: 8px;
    }
    .track-name {
      width: 70px; font-size: 12px; color: #888; text-align: right;
    }
    .steps { display: flex; gap: 5px; flex-wrap: wrap; }

    .step {
      width: 38px; height: 38px; border-radius: 8px;
      background: #1a1a2e; border: 2px solid #2a2a4a;
      cursor: pointer; transition: all 0.1s;
    }
    .step:hover { border-color: #7c3aed; }
    .step.on { background: #7c3aed; border-color: #a78bfa; }
    .step.playing { background: #ec4899 !important; box-shadow: 0 0 12px #ec4899; }

    .step.beat4  { margin-left: 10px; }

    .volume {
      width: 60px;
    }
    input[type=range].volume { width: 60px; accent-color: #7c3aed; }
  </style>
</head>
<body>
  <h1>🥁 Beat Maker</h1>
  <p>Clique nos quadrados para ativar os beats | 16 passos por compasso</p>

  <div class="controls">
    <button id="play">▶ Play</button>
    <button id="stop">⏹ Stop</button>
    <button id="clear">🗑 Limpar</button>
    <div class="bpm-wrap">
      BPM: <span id="bpmVal">120</span>
      <input type="range" min="60" max="200" value="120" id="bpm">
    </div>
  </div>

  <div class="sequencer" id="seq"></div>

<script>
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const STEPS = 16;

  const faixas = [
    { nome: "Kick",   cor: "#7c3aed", freq: 60,  tipo: "kick"   },
    { nome: "Snare",  cor: "#ec4899", freq: 200, tipo: "snare"  },
    { nome: "Hi-Hat", cor: "#f59e0b", freq: 800, tipo: "hihat"  },
    { nome: "Open HH",cor: "#10b981", freq: 600, tipo: "openHH" },
    { nome: "Tom",    cor: "#3b82f6", freq: 120, tipo: "tom"    },
    { nome: "Clap",   cor: "#ef4444", freq: 350, tipo: "clap"   },
  ];

  const state = faixas.map(() => Array(STEPS).fill(false));

  function tocarSom(tipo, vol=0.8) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(vol, ctx.currentTime);

    if (tipo === "kick") {
      osc.type = "sine"; osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } else if (tipo === "snare") {
      const n = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      n.buffer = buf;
      n.connect(gain);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      n.start(); return;
    } else if (tipo === "hihat") {
      const n = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const f = ctx.createBiquadFilter();
      f.type = "highpass"; f.frequency.value = 5000;
      n.buffer = buf; n.connect(f); f.connect(gain);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      n.start(); return;
    } else {
      osc.type = "triangle"; osc.frequency.value = 300;
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    }
  }

  // Monta a UI
  const seq = document.getElementById("seq");
  const stepEls = faixas.map((f, fi) => {
    const track = document.createElement("div");
    track.className = "track";

    const nome = document.createElement("div");
    nome.className = "track-name";
    nome.textContent = f.nome;
    track.appendChild(nome);

    const steps = document.createElement("div");
    steps.className = "steps";
    const els = [];

    for (let s = 0; s < STEPS; s++) {
      const el = document.createElement("div");
      el.className = "step" + (s % 4 === 0 && s > 0 ? " beat4" : "");
      el.style.setProperty("--cor", f.cor);
      el.onclick = () => {
        state[fi][s] = !state[fi][s];
        el.classList.toggle("on", state[fi][s]);
        el.style.background = state[fi][s] ? f.cor : "";
        el.style.borderColor = state[fi][s] ? f.cor : "";
      };
      steps.appendChild(el);
      els.push(el);
    }

    track.appendChild(steps);
    seq.appendChild(track);
    return els;
  });

  let step = 0, interval = null;

  function tick() {
    // Remove highlight anterior
    stepEls.forEach(els => els.forEach(e => e.classList.remove("playing")));

    // Toca e destaca passo atual
    faixas.forEach((f, fi) => {
      stepEls[fi][step].classList.add("playing");
      if (state[fi][step]) tocarSom(f.tipo);
    });

    step = (step + 1) % STEPS;
  }

  const bpmInput = document.getElementById("bpm");
  const bpmVal   = document.getElementById("bpmVal");

  function getBPM() { return parseInt(bpmInput.value); }

  document.getElementById("play").onclick = () => {
    if (interval) clearInterval(interval);
    step = 0;
    interval = setInterval(tick, (60 / getBPM() / 4) * 1000);
  };
  document.getElementById("stop").onclick = () => {
    clearInterval(interval); interval = null; step = 0;
    stepEls.forEach(els => els.forEach(e => e.classList.remove("playing")));
  };
  document.getElementById("clear").onclick = () => {
    state.forEach(r => r.fill(false));
    stepEls.forEach(els => els.forEach(e => {
      e.classList.remove("on","playing");
      e.style.background = e.style.borderColor = "";
    }));
  };

  bpmInput.oninput = () => {
    bpmVal.textContent = bpmInput.value;
    if (interval) {
      clearInterval(interval);
      interval = setInterval(tick, (60 / getBPM() / 4) * 1000);
    }
  };
</script>
</body>
</html>`,
  },
];

export const allTemplates = [...luaTemplates, ...javaTemplates, ...htmlTemplates];

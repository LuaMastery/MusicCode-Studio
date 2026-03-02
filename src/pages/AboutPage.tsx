import { Music2, Zap, Code2, Headphones, BookOpen, Star, Heart, Terminal, Layers, Store, Play, ChevronRight } from "lucide-react";

export default function AboutPage({ navigate }: { navigate: (p: any) => void }) {

  const SECTIONS = [
    { id: "oque", label: "O que é", icon: "🎵" },
    { id: "como", label: "Como funciona", icon: "⚙️" },
    { id: "linguagens", label: "Linguagens", icon: "💻" },
    { id: "aprender", label: "Como aprender", icon: "📖" },
    { id: "musicas", label: "Como criar músicas", icon: "🎹" },
    { id: "proposito", label: "Propósito", icon: "🚀" },
    { id: "creditos", label: "Créditos", icon: "❤️" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* ── HERO ── */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20
          rounded-full px-4 py-1.5 text-xs font-semibold text-purple-300 mb-6 tracking-widest uppercase">
          <BookOpen size={12} />
          Documentação Completa
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
          Sobre o{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            MusicCode Studio
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Tudo o que você precisa saber sobre o site, como ele funciona,
          como criar músicas com código e muito mais.
        </p>
      </div>

      {/* ── ÍNDICE ── */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-12">
        <h2 className="text-sm font-black text-purple-400 tracking-widest uppercase mb-4 flex items-center gap-2">
          <BookOpen size={14} /> Índice
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left group"
            >
              <span className="text-base">{s.icon}</span>
              <span className="group-hover:text-purple-300 transition-colors">{s.label}</span>
              <ChevronRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 1 — O QUE É
      ══════════════════════════════════════════════════════ */}
      <section id="oque" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl shadow-lg">
            🎵
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">O que é o MusicCode Studio?</h2>
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest">Visão Geral</p>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 mb-5 leading-relaxed text-gray-300">
          <p className="mb-4">
            <span className="text-white font-bold">MusicCode Studio</span> é uma plataforma web interativa que combina
            <span className="text-purple-400 font-semibold"> programação</span> com{" "}
            <span className="text-pink-400 font-semibold">música</span>. O objetivo é permitir que qualquer pessoa —
            programador ou músico — consiga criar, compor e reproduzir sons e melodias
            escrevendo código diretamente no navegador.
          </p>
          <p className="mb-4">
            Ao contrário de softwares tradicionais de música, aqui você escreve código nas linguagens
            <span className="text-blue-400 font-semibold"> Lua</span>,{" "}
            <span className="text-orange-400 font-semibold">Java</span>,{" "}
            <span className="text-pink-400 font-semibold">HTML</span>,{" "}
            <span className="text-yellow-400 font-semibold">JavaScript</span> ou{" "}
            <span className="text-green-400 font-semibold">Python</span> para definir notas, ritmos, melodias e
            efeitos sonoros — e o site interpreta esse código e reproduz o som em tempo real.
          </p>
          <p>
            É uma ferramenta de <span className="text-emerald-400 font-semibold">entretenimento e aprendizado</span>,
            ideal para quem quer entender como a música funciona matematicamente, praticar programação
            de forma criativa, ou simplesmente se divertir criando sons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🎓", title: "Educacional", desc: "Aprenda os fundamentos de síntese sonora e notação musical programando." },
            { icon: "🎨", title: "Criativo", desc: "Crie melodias únicas combinando código com teoria musical." },
            { icon: "🔬", title: "Experimental", desc: "Explore sons, frequências e ritmos de forma visual e interativa." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-white/5 bg-white/2 p-5 text-center">
              <div className="text-3xl mb-2">{c.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 2 — COMO FUNCIONA
      ══════════════════════════════════════════════════════ */}
      <section id="como" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-xl shadow-lg">
            ⚙️
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Como o Site Funciona?</h2>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Arquitetura & Fluxo</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {[
            {
              step: "01", icon: <Store size={18} />, color: "from-emerald-600 to-cyan-600",
              title: "Workshop de Extensões",
              desc: "Ao entrar no site, você acessa o Workshop — uma loja de extensões onde pode instalar suporte a diferentes linguagens de programação musical. Cada linguagem é uma extensão independente que adiciona novos templates e capacidades ao Studio.",
            },
            {
              step: "02", icon: <Layers size={18} />, color: "from-purple-600 to-pink-600",
              title: "Studio Unificado",
              desc: "Após instalar uma ou mais extensões, você acessa o Studio — um editor de código completo com abas para cada linguagem instalada. O editor tem syntax highlighting, templates prontos e um painel lateral de configurações.",
            },
            {
              step: "03", icon: <Terminal size={18} />, color: "from-orange-600 to-yellow-500",
              title: "Interpretação do Código",
              desc: "Quando você clica em Reproduzir, o site analisa o código que você escreveu, identifica as notas musicais, frequências e durações usando parsers especializados para cada linguagem, e gera os sons via Web Audio API do navegador.",
            },
            {
              step: "04", icon: <Play size={18} />, color: "from-pink-600 to-rose-500",
              title: "Reprodução & Console",
              desc: "O player toca cada nota em sequência com a duração correta, exibindo qual nota está sendo tocada, a frequência em Hz e o progresso. O console de erros exibe logs detalhados — incluindo erros, avisos e confirmações de cada nota.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 rounded-2xl border border-white/5 bg-white/2 p-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-gray-600 tracking-widest">PASSO {s.step}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <h3 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
            <Headphones size={14} /> Tecnologia por trás do som
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Todo o áudio é gerado pela <span className="text-white font-semibold">Web Audio API</span> — uma API nativa do navegador
            que permite criar osciladores, filtros, ganho de volume e muito mais. Para notas musicais,
            o site usa osciladores do tipo <code className="text-blue-300 bg-blue-500/10 px-1 rounded">sine</code>,{" "}
            <code className="text-blue-300 bg-blue-500/10 px-1 rounded">triangle</code> ou{" "}
            <code className="text-blue-300 bg-blue-500/10 px-1 rounded">square</code>, ajustando a frequência para
            cada nota (ex: Dó = 261.63 Hz, Ré = 293.66 Hz).
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 3 — LINGUAGENS
      ══════════════════════════════════════════════════════ */}
      <section id="linguagens" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-yellow-500 flex items-center justify-center text-xl shadow-lg">
            💻
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Linguagens Suportadas</h2>
            <p className="text-xs text-orange-400 font-semibold uppercase tracking-widest">Extensões do Workshop</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: "🌙", name: "Lua", color: "border-blue-500/30 bg-blue-500/5", badge: "bg-blue-500/20 text-blue-300",
              status: "Disponível",
              desc: "Lua é uma linguagem de script leve e poderosa. No MusicCode Studio, você usa variáveis e tabelas para definir notas e durações. É ideal para melodias simples e padrões rítmicos.",
              exemplo: `local notas = {"Do", "Re", "Mi", "Fa", "Sol"}\nlocal duracoes = {0.5, 0.5, 0.5, 0.5, 1.0}`,
              tags: ["Melodias", "Ritmos", "Escalas", "BPM"],
            },
            {
              icon: "☕", name: "Java", color: "border-orange-500/30 bg-orange-500/5", badge: "bg-orange-500/20 text-orange-300",
              status: "Disponível",
              desc: "Java permite síntese de áudio avançada com javax.sound.sampled e MIDI. No Studio, você usa enums de notas e sequenciadores para criar músicas completas.",
              exemplo: `Nota[] melodia = {Nota.DO, Nota.MI, Nota.SOL};\nfloat[] duracoes = {0.5f, 0.5f, 1.0f};`,
              tags: ["MIDI", "Sintetizador", "Piano Swing", "javax.sound"],
            },
            {
              icon: "🌐", name: "HTML/CSS", color: "border-pink-500/30 bg-pink-500/5", badge: "bg-pink-500/20 text-pink-300",
              status: "Disponível",
              desc: "Com HTML e Web Audio API você cria instrumentos interativos completos que rodam diretamente no navegador — pianos, beat makers, visualizadores de áudio e muito mais.",
              exemplo: `const ctx = new AudioContext();\nconst osc = ctx.createOscillator();\nosc.frequency.value = 261.63; // Dó`,
              tags: ["Web Audio API", "Piano Interativo", "Beat Maker", "Visualizador"],
            },
            {
              icon: "📜", name: "JavaScript", color: "border-yellow-500/30 bg-yellow-500/5", badge: "bg-yellow-500/20 text-yellow-300",
              status: "Disponível",
              desc: "JavaScript puro com Web Audio API para síntese de som direto no navegador. Ótimo para animações musicais, sequenciadores e efeitos em tempo real.",
              exemplo: `const notas = [261.63, 293.66, 329.63];\nnotas.forEach(freq => playNote(freq, 0.5));`,
              tags: ["Web Audio", "Síntese", "Tempo Real", "Arrays"],
            },
            {
              icon: "🐍", name: "Python", color: "border-green-500/30 bg-green-500/5", badge: "bg-green-500/20 text-green-300",
              status: "Disponível",
              desc: "Python com a biblioteca music21 ou síntese direta. O Studio interpreta padrões de notas em Python e os converte para frequências audíveis no browser.",
              exemplo: `notas = ['Do', 'Re', 'Mi', 'Sol']\nduracoes = [0.5, 0.5, 0.5, 1.0]`,
              tags: ["music21", "Síntese", "Escalas", "Algoritmos"],
            },
          ].map((l) => (
            <div key={l.name} className={`rounded-2xl border ${l.color} p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{l.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{l.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.badge}`}>{l.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {l.tags.map((t) => (
                      <span key={t} className="text-xs text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">{l.desc}</p>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <pre className="text-xs text-green-300 font-mono leading-relaxed whitespace-pre-wrap">{l.exemplo}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 4 — COMO APRENDER
      ══════════════════════════════════════════════════════ */}
      <section id="aprender" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-xl shadow-lg">
            📖
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Como Aprender a Usar o Site</h2>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">Guia para Iniciantes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              n: "1", emoji: "🏪", title: "Visite o Workshop",
              desc: "Clique em \"Workshop\" no menu. Explore as extensões disponíveis. Leia a descrição de cada linguagem para escolher com qual você quer começar. Recomendamos começar com Lua ou JavaScript.",
            },
            {
              n: "2", emoji: "⬇️", title: "Instale uma Extensão",
              desc: "Clique no botão \"Instalar\" da extensão desejada. Aguarde a instalação (levará alguns segundos). Após instalar, o botão muda para \"Abrir Studio\" e a linguagem aparece no Studio.",
            },
            {
              n: "3", emoji: "🎵", title: "Abra o Studio",
              desc: "Vá até o Studio. Selecione a aba da linguagem instalada. Você verá um editor de código com um template pronto — uma música de exemplo completa que já funciona.",
            },
            {
              n: "4", emoji: "▶️", title: "Reproduza e Ouça",
              desc: "Clique no botão verde \"▶ Reproduzir\" abaixo do editor. O player vai interpretar o código e tocar as notas! Observe o console — ele mostra cada nota que está sendo tocada.",
            },
            {
              n: "5", emoji: "✏️", title: "Edite e Experimente",
              desc: "Modifique as notas no código — troque \"Do\" por \"Sol\", mude as durações, adicione notas. Clique em Reproduzir novamente para ouvir as mudanças. Aprenda experimentando!",
            },
            {
              n: "6", emoji: "💾", title: "Baixe seu Código",
              desc: "Quando estiver satisfeito com sua música, clique no botão de download para salvar o arquivo. Você pode rodar o código Lua ou Java localmente no seu computador.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/5 bg-white/2 p-5 flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                {s.n}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>{s.emoji}</span>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h3 className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-2">
            <Star size={14} /> Dica para Iniciantes
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Não precisa saber programar para começar! Os templates já são músicas funcionais.
            Basta <span className="text-white font-semibold">trocar os nomes das notas</span> (Do, Re, Mi, Fa, Sol, La, Si)
            e os <span className="text-white font-semibold">números das durações</span> (0.5 = semínima, 1.0 = mínima, 2.0 = semibreve)
            para criar sua própria melodia. Observe o console para entender o que está acontecendo!
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 5 — COMO CRIAR MÚSICAS
      ══════════════════════════════════════════════════════ */}
      <section id="musicas" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center text-xl shadow-lg">
            🎹
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Como Criar Músicas com Código</h2>
            <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest">Teoria Musical + Código</p>
          </div>
        </div>

        {/* Tabela de notas */}
        <div className="rounded-2xl border border-white/10 bg-white/2 p-5 mb-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            🎼 Tabela de Notas e Frequências
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[
              { nome: "Dó", code: "Do", freq: "261 Hz", cor: "bg-red-500" },
              { nome: "Ré", code: "Re", freq: "294 Hz", cor: "bg-orange-500" },
              { nome: "Mi", code: "Mi", freq: "330 Hz", cor: "bg-yellow-500" },
              { nome: "Fá", code: "Fa", freq: "349 Hz", cor: "bg-green-500" },
              { nome: "Sol", code: "Sol", freq: "392 Hz", cor: "bg-blue-500" },
              { nome: "Lá", code: "La", freq: "440 Hz", cor: "bg-indigo-500" },
              { nome: "Si", code: "Si", freq: "494 Hz", cor: "bg-purple-500" },
            ].map((n) => (
              <div key={n.nome} className="text-center rounded-xl border border-white/5 bg-white/3 p-3">
                <div className={`w-6 h-6 rounded-full ${n.cor} mx-auto mb-2`} />
                <div className="text-xs font-black text-white">{n.nome}</div>
                <div className="text-xs text-gray-500 font-mono">{n.code}</div>
                <div className="text-xs text-gray-600">{n.freq}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Durações */}
        <div className="rounded-2xl border border-white/10 bg-white/2 p-5 mb-5">
          <h3 className="text-sm font-bold text-white mb-4">⏱️ Durações Musicais</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { nome: "Semibreve", valor: "2.0", equiv: "4 tempos" },
              { nome: "Mínima", valor: "1.0", equiv: "2 tempos" },
              { nome: "Semínima", valor: "0.5", equiv: "1 tempo" },
              { nome: "Colcheia", valor: "0.25", equiv: "½ tempo" },
            ].map((d) => (
              <div key={d.nome} className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
                <div className="text-xl font-black text-purple-400 mb-1">{d.valor}s</div>
                <div className="text-xs font-bold text-white">{d.nome}</div>
                <div className="text-xs text-gray-500">{d.equiv}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Exemplos por linguagem */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 size={14} className="text-purple-400" /> Exemplos Práticos por Linguagem
          </h3>

          {[
            {
              lang: "🌙 Lua", color: "border-blue-500/20 bg-blue-500/5",
              code: `-- Melodia "Ode à Alegria" em Lua
local notas = {"Mi", "Mi", "Fa", "Sol", "Sol", "Fa", "Mi", "Re"}
local duracoes = {0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5}

-- BPM = 120 (velocidade da música)
local BPM = 120

for i, nota in ipairs(notas) do
  tocarNota(nota, duracoes[i])
end`,
            },
            {
              lang: "☕ Java", color: "border-orange-500/20 bg-orange-500/5",
              code: `// Melodia em Java com enum de notas
Nota[] melodia = {
  Nota.MI, Nota.MI, Nota.FA, Nota.SOL,
  Nota.SOL, Nota.FA, Nota.MI, Nota.RE
};
float[] duracoes = {0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f, 0.5f};

Sintetizador.tocar(melodia, duracoes, 120);`,
            },
            {
              lang: "🌐 HTML / Web Audio", color: "border-pink-500/20 bg-pink-500/5",
              code: `<!-- Piano interativo em HTML -->
<script>
const ctx = new AudioContext();

function tocarNota(freq, duracao) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq; // Dó = 261.63
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracao);
  osc.start();
  osc.stop(ctx.currentTime + duracao);
}

// Tocar Dó (261.63 Hz) por 0.5 segundos
tocarNota(261.63, 0.5);
</script>`,
            },
          ].map((e) => (
            <div key={e.lang} className={`rounded-2xl border ${e.color} p-5`}>
              <h4 className="text-sm font-bold text-white mb-3">{e.lang}</h4>
              <div className="bg-black/50 rounded-xl p-4 border border-white/5">
                <pre className="text-xs text-green-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">{e.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 6 — PROPÓSITO
      ══════════════════════════════════════════════════════ */}
      <section id="proposito" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-xl shadow-lg">
            🚀
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Propósito do MusicCode Studio</h2>
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest">Missão & Visão</p>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 mb-5">
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            O <span className="text-white font-bold">MusicCode Studio</span> nasceu com um propósito claro:
            <span className="text-violet-400 font-semibold"> democratizar a criação musical através da programação</span>.
            Acreditamos que toda pessoa que sabe um pouco de código tem o potencial de criar música —
            e toda pessoa que ama música tem um motivo a mais para aprender a programar.
          </p>
          <p className="text-gray-400 leading-relaxed text-sm">
            O site é um espaço de <span className="text-white font-semibold">entretenimento criativo</span>,
            onde você pode brincar com frequências, compor melodias, testar padrões rítmicos e
            entender como o som funciona matematicamente — tudo isso diretamente no seu navegador,
            sem precisar instalar nada, sem precisar comprar equipamento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "🎓", title: "Para Estudantes", desc: "Aprenda teoria musical de forma prática. Entenda frequências, oitavas, escalas e ritmos programando.", color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
            { icon: "💻", title: "Para Programadores", desc: "Use suas habilidades de código para criar arte. Explore a interseção entre lógica e criatividade musical.", color: "border-orange-500/20 bg-orange-500/5 text-orange-400" },
            { icon: "🎸", title: "Para Músicos", desc: "Aprenda como a tecnologia reproduz os seus acordes favoritos. Entenda síntese e processamento de áudio.", color: "border-pink-500/20 bg-pink-500/5 text-pink-400" },
            { icon: "🌍", title: "Para Todos", desc: "Não importa o nível — os templates guiam iniciantes, e a flexibilidade do código desafia avançados.", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
          ].map((c) => (
            <div key={c.title} className={`rounded-2xl border p-5 ${c.color}`}>
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 7 — CRÉDITOS
      ══════════════════════════════════════════════════════ */}
      <section id="creditos" className="mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-xl shadow-lg">
            ❤️
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Créditos</h2>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest">Criador & Agradecimentos</p>
          </div>
        </div>

        {/* CARD PRINCIPAL DO CRIADOR */}
        <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-purple-500/10 p-8 mb-6 text-center relative overflow-hidden">
          {/* decoração */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500
              flex items-center justify-center text-4xl mx-auto mb-5 shadow-2xl shadow-pink-500/30
              border-4 border-white/10">
              🎵
            </div>

            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30
              rounded-full px-3 py-1 text-xs font-bold text-rose-300 mb-3">
              <Star size={10} /> CRIADOR
            </div>

            <h2 className="text-3xl font-black text-white mb-1">
              Rhuan De Cillo Silva
            </h2>
            <p className="text-purple-400 font-semibold text-sm mb-4">
              Desenvolvedor & Idealizador do MusicCode Studio
            </p>

            <div className="max-w-lg mx-auto text-sm text-gray-400 leading-relaxed mb-6">
              Apaixonado por tecnologia e música, Rhuan criou o MusicCode Studio com a visão de
              unir o mundo da programação com o universo musical. O projeto nasceu do desejo de
              tornar a criação musical acessível a todos através do código.
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {["React", "TypeScript", "Web Audio API", "Vite", "Tailwind CSS", "MIDI", "Lua", "Java"].map((t) => (
                <span key={t} className="text-xs font-bold px-3 py-1 rounded-full
                  bg-white/5 border border-white/10 text-gray-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TECNOLOGIAS */}
        <div className="rounded-2xl border border-white/10 bg-white/2 p-6 mb-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={14} className="text-yellow-400" /> Tecnologias Utilizadas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { nome: "React 18", desc: "Interface de usuário", icon: "⚛️" },
              { nome: "TypeScript", desc: "Tipagem estática", icon: "🔷" },
              { nome: "Vite", desc: "Build & Dev server", icon: "⚡" },
              { nome: "Tailwind CSS", desc: "Estilização", icon: "🎨" },
              { nome: "Web Audio API", desc: "Síntese de áudio", icon: "🔊" },
              { nome: "Lucide React", desc: "Ícones", icon: "✨" },
            ].map((t) => (
              <div key={t.nome} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/3 p-3">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="text-xs font-bold text-white">{t.nome}</div>
                  <div className="text-xs text-gray-500">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VERSÃO */}
        <div className="rounded-2xl border border-white/5 bg-white/2 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Music2 size={20} className="text-purple-400" />
            <div>
              <div className="text-sm font-bold text-white">MusicCode Studio</div>
              <div className="text-xs text-gray-500">Versão 1.0.0 · 2025</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Heart size={12} className="text-rose-400" />
            <span>Feito com amor por <span className="text-white font-bold">Rhuan De Cillo Silva</span></span>
          </div>
          <button
            onClick={() => navigate("workshop")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
              bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-all"
          >
            <Store size={12} /> Ir para o Workshop
          </button>
        </div>
      </section>

    </div>
  );
}

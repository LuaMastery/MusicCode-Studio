/**
 * BottomPanel — painel inferior estilo VS Code com abas:
 * TERMINAL (logs) · VISUAL (visualizador) · PROBLEMAS (erros) · SAÍDA (ajuda/API).
 * Estado controlado (tab + collapsed) para integração com a barra de atividades.
 */
import { Trash2, ChevronDown, ChevronUp, Terminal as TermIcon, Activity, AlertCircle, BookOpen } from "lucide-react";
import { Visualizer } from "./Visualizer";

export type PanelTab = "terminal" | "visual" | "problems" | "output";

interface Props {
  logs: string[];
  onClear: () => void;
  playing: boolean;
  tab: PanelTab;
  onTab: (t: PanelTab) => void;
  collapsed: boolean;
  onCollapsed: (c: boolean) => void;
}

export function BottomPanel({ logs, onClear, playing, tab, onTab, collapsed, onCollapsed }: Props) {
  const hasError = logs.some((l) => l.startsWith("❌"));

  const TABS: { id: PanelTab; label: string; icon: typeof TermIcon; badge?: number }[] = [
    { id: "terminal", label: "Terminal", icon: TermIcon, badge: logs.length || undefined },
    { id: "visual", label: "Visualizador", icon: Activity },
    { id: "problems", label: "Problemas", icon: AlertCircle, badge: hasError ? 1 : undefined },
    { id: "output", label: "Saída", icon: BookOpen },
  ];

  return (
    <div className="bg-[#0d0d12] border-t border-black/40 flex flex-col shrink-0" style={{ height: collapsed ? 32 : 230 }}>
      <div className="flex items-center bg-[#131319] border-b border-black/30 shrink-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { onTab(t.id); onCollapsed(false); }}
              className={`relative flex items-center gap-1.5 px-3 h-8 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                isActive ? "text-white" : "text-[#858585] hover:text-white"
              }`}
            >
              {isActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#8b5cf6]" />}
              <Icon size={13} /> {t.label}
              {t.badge ? (
                <span className="ml-0.5 bg-[#23232c] text-white text-[9px] px-1.5 rounded-full leading-tight">{t.badge}</span>
              ) : null}
            </button>
          );
        })}
        <div className="ml-auto flex items-center pr-2">
          {tab === "terminal" && (
            <button onClick={onClear} title="Limpar" className="text-[#858585] hover:text-white p-1.5">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={() => onCollapsed(!collapsed)} title={collapsed ? "Expandir" : "Recolher"} className="text-[#858585] hover:text-white p-1.5">
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 min-h-0 overflow-auto font-mono text-[12.5px] leading-relaxed custom-scroll">
          {tab === "terminal" && <Terminal logs={logs} playing={playing} />}
          {tab === "visual" && <div className="h-full p-2"><Visualizer bare active={playing} accent="#4ec9b0" /></div>}
          {tab === "problems" && <Problems logs={logs} />}
          {tab === "output" && <OutputHelp />}
        </div>
      )}
    </div>
  );
}

function Terminal({ logs, playing }: { logs: string[]; playing: boolean }) {
  return (
    <div className="p-3 text-[#cccccc]">
      <div className="text-[#6a9955]">MusicCode Studio — Terminal musical 🎵</div>
      <div className="text-[#858585] mb-2">Digite código e clique em Executar. Funções: play, sleep, tambor, synth, bpm...</div>
      {logs.map((l, i) => (
        <div key={i} className={`whitespace-pre-wrap break-words ${l.startsWith("❌") ? "text-[#f48771]" : "text-[#4ec9b0]"}`}>
          <span className="text-[#858585]">›</span> {l}
        </div>
      ))}
      <div className="text-[#dcdcaa] mt-1">
        <span className="text-[#858585]">$</span> {playing ? "executando..." : "pronto"}<span className="terminal-cursor">▍</span>
      </div>
    </div>
  );
}

function Problems({ logs }: { logs: string[] }) {
  const errors = logs.filter((l) => l.startsWith("❌"));
  if (errors.length === 0) {
    return <div className="p-4 text-[#858585]">✓ Nenhum problema foi detectado no código.</div>;
  }
  return (
    <div className="p-2">
      {errors.map((e, i) => (
        <div key={i} className="flex items-start gap-2 px-2 py-1 text-[#f48771]">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[13px]">{e}</span>
        </div>
      ))}
    </div>
  );
}

function OutputHelp() {
  const rows: [string, string, string][] = [
    ["play", 'play("C4")  ·  play(["C4","E4","G4"])', "Nota ou acorde (array)"],
    ["sleep", "await sleep(1)", "Espera N batidas"],
    ["tambor", 'tambor("bumbo")', "bumbo, caixa, chimbal, palma, tom"],
    ["synth", 'synth("piano")', "piano, pluck, bass, pad, fm, prophet"],
    ["bpm", "bpm(120)", "Andamento"],
    ["sequencia", "sequencia([...], 0.5)", "Notas em escada"],
    ["escala", 'escala("C4","major")', "Notas de uma escala"],
    ["repetir", "await repetir(4, async i=>{})", "Repete N vezes"],
    ["escolher", "escolher([1,2,3])", "Elemento aleatório"],
    ["print", 'print("olá")', "Mostra no terminal"],
  ];
  return (
    <div className="p-3 text-[#cccccc]">
      <div className="text-[#858585] mb-2 text-[11px] uppercase tracking-wide">Referência rápida da API musical</div>
      {rows.map(([fn, sig, desc]) => (
        <div key={fn} className="grid grid-cols-[90px_1fr] gap-x-3 py-0.5">
          <span className="text-[#dcdcaa]">{fn}</span>
          <span className="text-[#858585]">{sig} <span className="text-[#6a9955]">— {desc}</span></span>
        </div>
      ))}
    </div>
  );
}

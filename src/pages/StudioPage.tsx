/**
 * StudioPage — o estúdio JavaScript redesenhado como um IDE estilo VS Code.
 *
 * Layout: ActivityBar | Explorer (arquivos) | Editor (abas + código) | BottomPanel (terminal)
 *         + StatusBar azul ao fundo.
 */
import { useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { ActivityBar } from "../components/ActivityBar";
import { Explorer } from "../components/Explorer";
import { EditorTabs } from "../components/EditorTabs";
import { BottomPanel } from "../components/BottomPanel";
import { StatusBar } from "../components/StatusBar";
import { TEMPLATES, type Template } from "../data/templates";
import { engine } from "../engine/engine";
import { runCode, stopAll } from "../engine/runner";
import { SYNTH_ALIASES } from "../engine/instruments";

function formatArg(a: unknown): string {
  if (typeof a === "string") return a;
  if (a === null || a === undefined) return String(a);
  if (typeof a === "object") { try { return JSON.stringify(a); } catch { return String(a); } }
  return String(a);
}

/** Lê o sintetizador/BPM definido no código (para mostrar na barra de status). */
function readFromCode(code: string): { synth: string; bpm: number | null } {
  const synthMatch = code.match(/(?:^|[\s;])(?:synth|use_synth|sintetizador|setSynth)\(\s*['"]([^'"]+)['"]/);
  let synth = "piano";
  if (synthMatch) {
    const resolved = SYNTH_ALIASES[synthMatch[1].toLowerCase()];
    synth = resolved ?? synthMatch[1];
  }
  const bpmMatch = code.match(/(?:^|[\s;])(?:use_)?bpm\(\s*(\d+)/);
  const bpm = bpmMatch ? Number(bpmMatch[1]) : null;
  return { synth, bpm };
}

export function StudioPage() {
  const [selected, setSelected] = useState<Template>(TEMPLATES[0]);
  const [code, setCode] = useState<string>(TEMPLATES[0].code);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.8);
  const [lines, setLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });
  const [activity, setActivity] = useState("explorer");
  const [showSidebar, setShowSidebar] = useState(true);

  const parsed = readFromCode(code);
  const statusBpm = parsed.bpm ?? bpm;

  const selectTemplate = (t: Template) => {
    stopAll();
    setPlaying(false);
    setSelected(t);
    setCode(t.code);
    setLines([]);
  };

  const handlePlay = async () => {
    if (playing) return;
    setLines([]);
    engine.setBpm(statusBpm);
    engine.setVolume(volume);
    await runCode(code, {
      onLog: (...args: unknown[]) => setLines((prev) => [...prev, args.map(formatArg).join("  ")]),
      onPlayingChange: setPlaying,
    });
  };

  const handleStop = () => {
    stopAll();
    setPlaying(false);
  };

  const handleActivity = (id: string) => {
    if (id === "explorer") setShowSidebar((s) => !s);
    setActivity(id);
  };

  return (
    <div className="flex flex-col bg-[#1e1e1e] text-white overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="flex flex-1 min-h-0">
        <ActivityBar active={activity} onSelect={handleActivity} />

        {showSidebar && (
          <Explorer
            templates={TEMPLATES}
            selectedId={selected.id}
            onSelect={selectTemplate}
            onRun={handlePlay}
          />
        )}

        {/* Coluna do editor */}
        <div className="flex flex-col flex-1 min-w-0">
          <EditorTabs
            filename={`${selected.id}.js`}
            icon={selected.icon}
            playing={playing}
            onPlay={handlePlay}
            onStop={handleStop}
            bpm={bpm}
            onBpmChange={setBpm}
            volume={volume}
            onVolumeChange={setVolume}
            onReset={() => setCode(selected.code)}
          />

          <CodeEditor value={code} onChange={setCode} onCursor={(ln, col) => setCursor({ ln, col })} />
          <BottomPanel logs={lines} onClear={() => setLines([])} playing={playing} />
        </div>
      </div>

      <StatusBar synth={parsed.synth} bpm={statusBpm} playing={playing} ln={cursor.ln} col={cursor.col} />
    </div>
  );
}

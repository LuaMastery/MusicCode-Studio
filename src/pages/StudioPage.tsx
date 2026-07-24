/**
 * StudioPage — IDE estilo VS Code.
 * Barra de atividades (visões) + painel lateral (Explorador/Buscar/Música/Config)
 * + editor com abas + painel inferior (terminal) + barra de status.
 */
import { useRef, useState } from "react";
import { CodeEditor, type CodeEditorHandle } from "../components/CodeEditor";
import { ActivityBar } from "../components/ActivityBar";
import { Explorer } from "../components/Explorer";
import { SearchPanel } from "../components/SearchPanel";
import { MusicPanel } from "../components/MusicPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { EditorTabs } from "../components/EditorTabs";
import { BottomPanel, type PanelTab } from "../components/BottomPanel";
import { StatusBar } from "../components/StatusBar";
import { useMusicFiles } from "../hooks/useMusicFiles";
import { engine } from "../engine/engine";
import { runCode, stopAll } from "../engine/runner";
import { SYNTH_ALIASES } from "../engine/instruments";

type View = "explorer" | "search" | "music" | "settings";

function formatArg(a: unknown): string {
  if (typeof a === "string") return a;
  if (a === null || a === undefined) return String(a);
  if (typeof a === "object") { try { return JSON.stringify(a); } catch { return String(a); } }
  return String(a);
}

function readFromCode(code: string): { synth: string; bpm: number | null } {
  const synthMatch = code.match(/(?:^|[\s;])(?:synth|use_synth|sintetizador|setSynth)\(\s*['"]([^'"]+)['"]/);
  let synth = "piano";
  if (synthMatch) synth = SYNTH_ALIASES[synthMatch[1].toLowerCase()] ?? synthMatch[1];
  const bpmMatch = code.match(/(?:^|[\s;])(?:use_)?bpm\(\s*(\d+)/);
  return { synth, bpm: bpmMatch ? Number(bpmMatch[1]) : null };
}

export function StudioPage() {
  const store = useMusicFiles();
  const { active, activeId, userFiles, exampleFiles, dirtyIds } = store;

  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.8);
  const [lines, setLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });

  const [view, setView] = useState<View>("explorer");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeBar, setActiveBar] = useState("explorer");
  const [bottomTab, setBottomTab] = useState<PanelTab>("terminal");
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [fontSize, setFontSize] = useState(13);

  const editorRef = useRef<CodeEditorHandle>(null);

  const parsed = readFromCode(active.code);
  const statusBpm = parsed.bpm ?? bpm;

  const handleActivity = (id: string) => {
    if (id === "run") {
      setActiveBar("run");
      setBottomTab("terminal");
      setBottomCollapsed(false);
      return;
    }
    if (sidebarVisible && view === id) {
      setSidebarVisible(false);
    } else {
      setView(id as View);
      setSidebarVisible(true);
    }
    setActiveBar(id);
  };

  const handlePlay = async () => {
    if (playing) return;
    setLines([]);
    engine.setBpm(statusBpm);
    engine.setVolume(volume);
    await runCode(active.code, {
      onLog: (...args: unknown[]) => setLines((prev) => [...prev, args.map(formatArg).join("  ")]),
      onPlayingChange: setPlaying,
    });
  };

  const handleStop = () => {
    stopAll();
    setPlaying(false);
  };

  const handleInsert = (text: string) => {
    editorRef.current?.insert(text);
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col bg-[#0d0d12] text-white overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="flex flex-1 min-h-0">
        <ActivityBar active={activeBar} onSelect={handleActivity} />

        {sidebarVisible && view === "explorer" && (
          <Explorer
            userFiles={userFiles}
            examples={exampleFiles}
            activeId={activeId}
            dirtyIds={dirtyIds}
            onOpen={(f) => store.open(f.id)}
            onCreate={() => store.createFile()}
            onSave={store.save}
            onRename={store.rename}
            onDelete={store.remove}
            onDuplicate={store.duplicate}
          />
        )}
        {sidebarVisible && view === "search" && (
          <SearchPanel files={store.files} onOpen={(f) => store.open(f.id)} />
        )}
        {sidebarVisible && view === "music" && <MusicPanel onInsert={handleInsert} />}
        {sidebarVisible && view === "settings" && (
          <SettingsPanel
            autoSave={store.autoSave}
            onAutoSave={store.setAutoSave}
            fontSize={fontSize}
            onFontSize={setFontSize}
            onClearFiles={store.clearUserFiles}
          />
        )}

        {/* Coluna do editor */}
        <div className="flex flex-col flex-1 min-w-0">
          <EditorTabs
            filename={`${active.name}.js`}
            icon={active.icon ?? "📝"}
            playing={playing}
            onPlay={handlePlay}
            onStop={handleStop}
            bpm={bpm}
            onBpmChange={setBpm}
            volume={volume}
            onVolumeChange={setVolume}
            onSave={store.save}
            onReset={store.resetActive}
            isExample={active.kind === "example"}
            dirty={dirtyIds.has(activeId)}
          />

          <CodeEditor
            ref={editorRef}
            value={active.code}
            onChange={store.updateCode}
            onCursor={(ln, col) => setCursor({ ln, col })}
            onSave={store.save}
            fontSize={fontSize}
          />

          <BottomPanel
            logs={lines}
            onClear={() => setLines([])}
            playing={playing}
            tab={bottomTab}
            onTab={setBottomTab}
            collapsed={bottomCollapsed}
            onCollapsed={setBottomCollapsed}
          />
        </div>
      </div>

      <StatusBar synth={parsed.synth} bpm={statusBpm} playing={playing} ln={cursor.ln} col={cursor.col} />
    </div>
  );
}

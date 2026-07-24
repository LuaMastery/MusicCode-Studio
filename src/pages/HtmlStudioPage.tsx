/**
 * HtmlStudioPage — galeria de instrumentos interativos + criação de HTMLs do usuário.
 *
 *  - Galeria: instrumentos embutidos + HTMLs criados pelo usuário ( salvos).
 *  - Visualizador: toca o instrumento num iframe.
 *  - Editor: cria/edita HTMLs do usuário, com preview ao vivo.
 *
 *  SEGURANÇA: HTMLs do usuário rodam isolados por padrão (sandbox + CSP, sem
 *  rede/downloads/acesso ao app). O "modo sem segurança" (opt-in, com aviso)
 *  remove essas restrições.
 */
import { useState } from "react";
import { Globe, ArrowLeft, Code2, Eye, Play, Maximize2, Plus, Pencil, Trash2, ShieldAlert, Save } from "lucide-react";
import { HTML_EXAMPLES } from "../data/examples";
import { useHtmlInstruments, type HtmlInstrument } from "../hooks/useHtmlInstruments";
import { useSettings } from "../context/SettingsContext";
import { CodeEditor } from "../components/CodeEditor";
import { buildSandboxDoc, sandboxAttr, validateHtml } from "../utils/htmlSandbox";

type Mode = "gallery" | "viewer" | "editor";

interface Playable {
  id: string; name: string; icon: string; color: string;
  description: string; tags: string[]; code: string; isUser: boolean; ref?: HtmlInstrument;
}

const EMOJIS = ["📦", "🎵", "🎹", "🥁", "🎛️", "🌌", "📡", "🌊", "⚡", "🔥", "✨", "🎉"];

const STARTER_HTML = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"/>
<style>
  body{margin:0;background:#0d0d12;color:#e9e9ee;font-family:Inter,system-ui,sans-serif;
       display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:14px}
  button{padding:12px 18px;font-size:14px;border:0;border-radius:10px;background:#8b5cf6;color:#fff;cursor:pointer}
  button:hover{background:#7c4df0}
</style></head>
<body>
  <h2>Meu instrumento 🎵</h2>
  <button onclick="tocar(523.25)">▶ Dó</button>
  <button onclick="tocar(659.25)">▶ Mi</button>
  <button onclick="tocar(783.99)">▶ Sol</button>
<script>
  function tocar(f){
    var c = new (window.AudioContext||window.webkitAudioContext)();
    var o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.linearRampToValueAtTime(0.3, c.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6);
    o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.65);
  }
</script>
</body></html>`;

export function HtmlStudioPage() {
  const { accent, settings } = useSettings();
  const { instruments, create, update, remove } = useHtmlInstruments();
  const unsafe = settings.htmlUnsafeMode;

  const [mode, setMode] = useState<Mode>("gallery");
  const [viewing, setViewing] = useState<Playable | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [runKey, setRunKey] = useState(0);

  // editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eName, setEName] = useState("Meu HTML");
  const [eIcon, setEIcon] = useState("📦");
  const [eCode, setECode] = useState(STARTER_HTML);
  const [ePreview, setEPreview] = useState(false);
  const [eError, setEError] = useState<string | null>(null);

  const openViewer = (p: Playable) => {
    setViewing(p);
    setShowCode(false);
    setRunKey((k) => k + 1);
    setMode("viewer");
    window.scrollTo({ top: 0 });
  };

  const startNew = () => {
    setEditingId(null);
    setEName("Meu HTML");
    setEIcon("📦");
    setECode(STARTER_HTML);
    setEPreview(false);
    setEError(null);
    setMode("editor");
    window.scrollTo({ top: 0 });
  };

  const startEdit = (ins: HtmlInstrument) => {
    setEditingId(ins.id);
    setEName(ins.name);
    setEIcon(ins.icon);
    setECode(ins.code);
    setEPreview(false);
    setEError(null);
    setMode("editor");
    window.scrollTo({ top: 0 });
  };

  const handleSave = () => {
    const v = validateHtml(eCode);
    if (!v.ok) { setEError(v.error ?? "HTML inválido."); return; }
    if (editingId) update(editingId, { name: eName, icon: eIcon, code: eCode });
    else create(eName, eCode, eIcon);
    setMode("gallery");
  };

  // ── EDITOR ────────────────────────────────────────────────────────────────
  if (mode === "editor") {
    return (
      <div className="relative z-10 max-w-5xl mx-auto px-5 py-8">
        <div className="flex items-center gap-3 mb-5">
          <button data-sfx="close" onClick={() => setMode("gallery")} className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-white">
            <ArrowLeft size={15} /> Voltar
          </button>
          <span className="text-[15px] font-bold text-white">{editingId ? "Editar HTML" : "Criar HTML"}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5">
          {/* metadados */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-faint">Nome</label>
              <input value={eName} onChange={(e) => setEName(e.target.value)} className="mt-1 w-full bg-card border border-line rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-[var(--color-brand)]" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-faint">Ícone</label>
              <div className="mt-1 grid grid-cols-6 gap-1.5">
                {EMOJIS.map((em) => (
                  <button key={em} data-sfx="click" onClick={() => setEIcon(em)} className={`aspect-square rounded-lg text-lg flex items-center justify-center border transition-all ${eIcon === em ? "border-[var(--color-brand)] bg-white/[0.06]" : "border-line hover:bg-white/[0.03]"}`}>{em}</button>
                ))}
              </div>
            </div>
            <div className={`rounded-lg border p-3 text-[11px] leading-snug ${unsafe ? "border-amber-500/30 bg-amber-500/[0.07] text-amber-200/80" : "border-line bg-card text-muted"}`}>
              {unsafe ? "⚠️ Modo sem segurança ATIVO: rede e downloads permitidos." : "🔒 Modo seguro: rede, downloads e código remoto estão bloqueados."}
            </div>
          </div>

          {/* editor + preview */}
          <div className="flex flex-col gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-card border border-line rounded-lg p-0.5">
                <button onClick={() => setEPreview(false)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium ${!ePreview ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}><Code2 size={13} /> Código</button>
                <button onClick={() => setEPreview(true)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium ${ePreview ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}><Eye size={13} /> Preview</button>
              </div>
              <button data-sfx="success" onClick={handleSave} className="ml-auto flex items-center gap-1.5 text-[12px] font-bold text-white px-4 py-1.5 rounded-lg" style={{ background: accent.hex }}>
                <Save size={13} /> Salvar
              </button>
            </div>

            {eError && <div className="text-[12px] text-red-400">{eError}</div>}

            <div className="rounded-xl border border-line overflow-hidden" style={{ height: 460 }}>
              {ePreview ? (
                <iframe
                  key={eCode.length + (unsafe ? 1 : 0)}
                  srcDoc={buildSandboxDoc(eCode, unsafe)}
                  sandbox={sandboxAttr(unsafe)}
                  title="preview"
                  className="w-full h-full border-none bg-white"
                />
              ) : (
                <CodeEditor value={eCode} onChange={setECode} language="text" minHeight={460} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── VISUALIZADOR ──────────────────────────────────────────────────────────
  if (mode === "viewer" && viewing) {
    const srcDoc = viewing.isUser ? buildSandboxDoc(viewing.code, unsafe) : viewing.code;
    const sandbox = viewing.isUser ? sandboxAttr(unsafe) : "allow-scripts";
    return (
      <div className="flex flex-col relative z-10" style={{ height: "calc(100vh - 3.5rem)" }}>
        <div className="flex items-center gap-3 px-4 h-12 border-b border-line bg-card/60 backdrop-blur shrink-0">
          <button data-sfx="close" onClick={() => setMode("gallery")} className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-white">
            <ArrowLeft size={15} /> Voltar
          </button>
          <span className="text-lg">{viewing.icon}</span>
          <span className="text-[14px] font-bold text-white">{viewing.name}</span>
          {viewing.isUser && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-brand)] text-[var(--color-brand)] bg-[var(--color-brand)]/10">seu</span>
          )}
          {!viewing.isUser && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-line text-faint">confiável</span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {viewing.isUser && (
              <>
                <button data-sfx="click" onClick={() => startEdit(viewing.ref!)} className="flex items-center gap-1 text-[12px] text-muted hover:text-white"><Pencil size={13} /> Editar</button>
                <button data-sfx="error" onClick={() => { if (confirm("Excluir este HTML?")) { remove(viewing.ref!.id); setMode("gallery"); } }} className="flex items-center gap-1 text-[12px] text-red-400/80 hover:text-red-400"><Trash2 size={13} /></button>
              </>
            )}
            <div className="flex gap-1 bg-ink border border-line rounded-lg p-0.5">
              <button onClick={() => setShowCode(false)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium ${!showCode ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}><Eye size={13} /> Interagir</button>
              <button onClick={() => setShowCode(true)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium ${showCode ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}><Code2 size={13} /> Código</button>
            </div>
            <button data-sfx="open" onClick={() => setRunKey((k) => k + 1)} title="Reiniciar" className="flex items-center gap-1.5 text-[12px] font-medium text-white px-3 py-1.5 rounded-lg" style={{ background: accent.hex }}>
              <Play size={12} fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-ink">
          {showCode ? (
            <pre className="h-full overflow-auto p-5 text-[12px] font-mono text-[#c4c4cc] leading-relaxed"><code>{viewing.code}</code></pre>
          ) : (
            <iframe key={runKey} srcDoc={srcDoc} sandbox={sandbox} title={viewing.name} className="w-full h-full border-none" />
          )}
        </div>
      </div>
    );
  }

  // ── GALERIA ───────────────────────────────────────────────────────────────
  const userPlayables: Playable[] = instruments.map((ins) => ({
    id: ins.id, name: ins.name, icon: ins.icon, color: accent.hex,
    description: "HTML criado por você.", tags: ["personalizado"], code: ins.code, isUser: true, ref: ins,
  }));
  const builtinPlayables: Playable[] = HTML_EXAMPLES.map((ex) => ({
    id: ex.id, name: ex.name, icon: ex.icon, color: ex.color,
    description: ex.description, tags: ex.tags, code: ex.code, isUser: false,
  }));

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-5 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent.hex}1a` }}>
          <Globe size={20} style={{ color: accent.hex }} />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Studio HTML</h1>
      </div>
      <p className="text-muted text-sm mb-2 max-w-xl">
        Toque os instrumentos interagindo, ou <span className="text-white">crie o seu próprio HTML</span> personalizado para tocar no site.
      </p>

      {unsafe && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-3 mb-6 max-w-2xl">
          <ShieldAlert size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-amber-200/85 leading-snug">
            <span className="font-semibold text-amber-300">Modo sem segurança ativo.</span> Seus HTMLs personalizados têm acesso total (rede, downloads, código remoto). Use apenas com conteúdo confiável.
          </p>
        </div>
      )}

      {/* Meus HTMLs */}
      <div className="flex items-center justify-between mb-3 mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Meus HTMLs</h2>
        <button data-sfx="open" onClick={startNew} className="flex items-center gap-1.5 text-[12px] font-semibold text-white px-3 py-1.5 rounded-lg" style={{ background: accent.hex }}>
          <Plus size={14} /> Criar HTML
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {userPlayables.length === 0 ? (
          <button data-sfx="open" onClick={startNew} className="rounded-2xl border border-dashed border-line p-6 text-center text-muted hover:text-white hover:border-white/20 transition-all">
            <Plus size={22} className="mx-auto mb-2" />
            <div className="text-[13px] font-medium">Criar seu primeiro HTML</div>
            <div className="text-[11px] text-faint mt-1">Personalize o som que quiser</div>
          </button>
        ) : (
          userPlayables.map((p) => (
            <div key={p.id} className="group relative rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-1 hover:border-white/20">
              <button onClick={() => openViewer(p)} className="block w-full text-left">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${p.color}1f` }}>{p.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-white truncate">{p.name}</div>
                    <div className="text-[11px] text-faint">Personalizado</div>
                  </div>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 text-faint"><Maximize2 size={14} /></span>
                </div>
                <p className="text-[12.5px] text-muted leading-relaxed">{p.description}</p>
              </button>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button data-sfx="click" onClick={() => startEdit(p.ref!)} className="flex items-center gap-1 text-[11px] text-muted hover:text-white"><Pencil size={12} /> Editar</button>
                <button data-sfx="error" onClick={() => { if (confirm("Excluir este HTML?")) remove(p.ref!.id); }} className="flex items-center gap-1 text-[11px] text-red-400/80 hover:text-red-400"><Trash2 size={12} /> Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instrumentos embutidos */}
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">Instrumentos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {builtinPlayables.map((p) => (
          <button key={p.id} data-sfx="open" onClick={() => openViewer(p)} className="group text-left rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-[#16161d]">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" style={{ background: `${p.color}1f` }}>{p.icon}</span>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-white">{p.name}</div>
                <div className="text-[11px] text-faint">Interativo</div>
              </div>
              <span className="ml-auto opacity-0 group-hover:opacity-100 text-faint"><Maximize2 size={14} /></span>
            </div>
            <p className="text-[12.5px] text-muted leading-relaxed mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="text-[10px] text-faint border border-line rounded-full px-2 py-0.5">{t}</span>)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

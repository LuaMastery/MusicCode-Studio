/**
 * HtmlStudioPage — galeria com 3 abas: Meus HTMLs · HTMLs públicos · Instrumentos.
 *
 *  - Criar/editar HTMLs: nome, ícone, descrição, imagem própria, permissão de
 *    cópia e visibilidade (privado/público).
 *  - HTMLs públicos: instrumentos da comunidade + importados via código de
 *    compartilhamento + os que você publicou. Publicar gera um código/link.
 *  - SEGURANÇA: HTMLs de terceiros (usuário, importados, comunidade) rodam no
 *    sandbox seguro por padrão (sem rede/downloads). Modo sem segurança = opt-in.
 */
import { useEffect, useState } from "react";
import {
  Globe, ArrowLeft, Code2, Eye, Play, Maximize2, Plus, Pencil, Trash2,
  ShieldAlert, Save, Share2, Lock, Upload, X, Download,
} from "lucide-react";
import { HTML_EXAMPLES } from "../data/examples";
import { COMMUNITY } from "../data/community";
import { useHtmlInstruments, type HtmlInstrument, type Visibility } from "../hooks/useHtmlInstruments";
import { useSharedInstruments } from "../hooks/useSharedInstruments";
import { useSettings } from "../context/SettingsContext";
import { CodeEditor } from "../components/CodeEditor";
import { buildSandboxDoc, sandboxAttr, validateHtml } from "../utils/htmlSandbox";
import { fileToThumb, isProbablyImage } from "../utils/image";
import { encodeShare, decodeShare, shareLink } from "../utils/share";

type Mode = "gallery" | "viewer" | "editor";
type Tab = "mine" | "public" | "builtins";
type Source = "builtin" | "user" | "community" | "imported";

interface Playable {
  id: string; name: string; icon: string; color: string;
  description: string; tags: string[]; code: string;
  source: Source; copyable: boolean; image?: string | null;
  author?: string; ref?: HtmlInstrument;
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

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" data-sfx="toggle" onClick={() => onChange(!on)}
      className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${on ? "" : "bg-white/10"}`}
      style={on ? { background: "var(--color-brand)" } : undefined}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

export function HtmlStudioPage() {
  const { accent, settings } = useSettings();
  const unsafe = settings.htmlUnsafeMode;
  const { instruments, create, update, remove } = useHtmlInstruments();
  const { shared, add: addShared, remove: removeShared } = useSharedInstruments();

  const [mode, setMode] = useState<Mode>("gallery");
  const [tab, setTab] = useState<Tab>("mine");
  const [viewing, setViewing] = useState<Playable | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [runKey, setRunKey] = useState(0);

  // editor
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eName, setEName] = useState("Meu HTML");
  const [eIcon, setEIcon] = useState("📦");
  const [eDesc, setEDesc] = useState("");
  const [eImage, setEImage] = useState<string | null>(null);
  const [eCode, setECode] = useState(STARTER_HTML);
  const [eCopyable, setECopyable] = useState(true);
  const [eVisibility, setEVisibility] = useState<Visibility>("private");
  const [ePreview, setEPreview] = useState(false);
  const [eError, setEError] = useState<string | null>(null);

  // import + share
  const [importVal, setImportVal] = useState("");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [shareInfo, setShareInfo] = useState<{ code: string; link: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // importa automaticamente se a URL tiver #s=...
  useEffect(() => {
    if (location.hash && location.hash.includes("s=")) {
      const p = decodeShare(location.hash);
      if (p) {
        addShared({ name: p.n, icon: p.i, description: p.d, code: p.c, copyable: p.cp });
        setTab("public");
      }
      history.replaceState(null, "", location.pathname + location.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openViewer = (p: Playable) => {
    setViewing(p); setShowCode(false); setRunKey((k) => k + 1); setMode("viewer");
    window.scrollTo({ top: 0 });
  };

  const startNew = () => {
    setEditingId(null); setEName("Meu HTML"); setEIcon("📦"); setEDesc("");
    setEImage(null); setECode(STARTER_HTML); setECopyable(true); setEVisibility("private");
    setEPreview(false); setEError(null); setMode("editor"); window.scrollTo({ top: 0 });
  };
  const startEdit = (ins: HtmlInstrument) => {
    setEditingId(ins.id); setEName(ins.name); setEIcon(ins.icon); setEDesc(ins.description ?? "");
    setEImage(ins.image ?? null); setECode(ins.code); setECopyable(ins.copyable);
    setEVisibility(ins.visibility); setEPreview(false); setEError(null);
    setMode("editor"); window.scrollTo({ top: 0 });
  };

  const handleSave = () => {
    const v = validateHtml(eCode);
    if (!v.ok) { setEError(v.error ?? "HTML inválido."); return; }
    const data = { name: eName, code: eCode, icon: eIcon, description: eDesc, image: eImage, copyable: eCopyable, visibility: eVisibility };
    if (editingId) update(editingId, data); else create(data);
    setMode("gallery"); setTab("mine");
  };

  const onImg = async (file?: File) => {
    if (!file) return;
    if (!isProbablyImage(file)) { setEError("Selecione um arquivo de imagem."); return; }
    try { setEImage(await fileToThumb(file)); setEError(null); }
    catch { setEError("Não foi possível ler a imagem."); }
  };

  const doShare = (p: { name: string; icon: string; description?: string; code: string; copyable: boolean }) => {
    const code = encodeShare({ v: 1, n: p.name, i: p.icon, d: p.description, c: p.code, cp: p.copyable });
    setShareInfo({ code, link: shareLink(code) });
    setCopied(false);
  };

  const handleImport = () => {
    const p = decodeShare(importVal);
    if (!p) { setImportMsg("❌ Código ou link inválido."); return; }
    addShared({ name: p.n, icon: p.i, description: p.d, code: p.c, copyable: p.cp });
    setImportMsg(`✅ "${p.n}" importado!`);
    setImportVal("");
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

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-faint">Nome</label>
              <input value={eName} onChange={(e) => setEName(e.target.value)} className="mt-1 w-full bg-card border border-line rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-[var(--color-brand)]" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-faint">Descrição</label>
              <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} rows={2} placeholder="O que seu instrumento faz?" className="mt-1 w-full bg-card border border-line rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-[var(--color-brand)] resize-none" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-faint">Ícone</label>
              <div className="mt-1 grid grid-cols-6 gap-1.5">
                {EMOJIS.map((em) => (
                  <button key={em} data-sfx="click" onClick={() => setEIcon(em)} className={`aspect-square rounded-lg text-lg flex items-center justify-center border transition-all ${eIcon === em ? "border-[var(--color-brand)] bg-white/[0.06]" : "border-line hover:bg-white/[0.03]"}`}>{em}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-faint">Imagem</label>
              <div className="mt-1 flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[12px] text-muted hover:text-white border border-line rounded-lg px-3 py-2 cursor-pointer">
                  <Upload size={13} /> Enviar
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onImg(e.target.files?.[0])} />
                </label>
                {eImage && (
                  <img src={eImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                )}
                {eImage && (
                  <button data-sfx="click" onClick={() => setEImage(null)} className="text-muted hover:text-white"><X size={14} /></button>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-card p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[12px] text-white">Permitir copiar o código</div>
                  <div className="text-[10px] text-faint">Outros usuários podem ver o código</div>
                </div>
                <Switch on={eCopyable} onChange={setECopyable} />
              </div>
              <div className="border-t border-line pt-2.5">
                <div className="text-[12px] text-white mb-1.5">Visibilidade</div>
                <div className="flex gap-1">
                  {(["private", "public"] as Visibility[]).map((v) => (
                    <button key={v} data-sfx="click" onClick={() => setEVisibility(v)}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-medium border transition-all ${eVisibility === v ? "text-white" : "text-muted border-line"}`}
                      style={eVisibility === v ? { borderColor: "var(--color-brand)", background: "color-mix(in srgb,var(--color-brand) 14%,transparent)" } : undefined}>
                      {v === "private" ? "🔒 Privado" : "🌍 Público"}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-faint mt-1.5">{eVisibility === "private" ? "Só você vê. Ninguém mais." : "Compartilhável via código/link."}</div>
              </div>
            </div>
            <div className={`rounded-lg border p-2.5 text-[11px] leading-snug ${unsafe ? "border-amber-500/30 bg-amber-500/[0.07] text-amber-200/80" : "border-line bg-card text-muted"}`}>
              {unsafe ? "⚠️ Modo sem segurança ATIVO." : "🔒 Modo seguro: rede/downloads bloqueados."}
            </div>
          </div>

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
            <div className="rounded-xl border border-line overflow-hidden" style={{ height: 480 }}>
              {ePreview ? (
                <iframe key={eCode.length + (unsafe ? 1 : 0)} srcDoc={buildSandboxDoc(eCode, unsafe)} sandbox={sandboxAttr(unsafe)} title="preview" className="w-full h-full border-none bg-white" />
              ) : (
                <CodeEditor value={eCode} onChange={setECode} language="text" minHeight={480} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── VISUALIZADOR ──────────────────────────────────────────────────────────
  if (mode === "viewer" && viewing) {
    const needsSandbox = viewing.source !== "builtin";
    const srcDoc = needsSandbox ? buildSandboxDoc(viewing.code, unsafe) : viewing.code;
    const sandbox = needsSandbox ? sandboxAttr(unsafe) : "allow-scripts";
    const canViewCode = viewing.source === "user" || viewing.copyable;
    return (
      <div className="flex flex-col relative z-10" style={{ height: "calc(100vh - 3.5rem)" }}>
        <div className="flex items-center gap-3 px-4 h-12 border-b border-line bg-card/60 backdrop-blur shrink-0">
          <button data-sfx="close" onClick={() => setMode("gallery")} className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-white">
            <ArrowLeft size={15} /> Voltar
          </button>
          <span className="text-lg">{viewing.icon}</span>
          <span className="text-[14px] font-bold text-white">{viewing.name}</span>
          {viewing.author && <span className="text-[11px] text-faint">por {viewing.author}</span>}
          {!viewing.copyable && viewing.source !== "user" && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-line text-faint"><Lock size={10} /> código protegido</span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {viewing.source === "user" && viewing.ref && (
              <>
                <button data-sfx="click" onClick={() => startEdit(viewing.ref!)} className="flex items-center gap-1 text-[12px] text-muted hover:text-white"><Pencil size={13} /> Editar</button>
                <button data-sfx="error" onClick={() => { if (confirm("Excluir este HTML?")) { remove(viewing.ref!.id); setMode("gallery"); } }} className="flex items-center gap-1 text-[12px] text-red-400/80 hover:text-red-400"><Trash2 size={13} /></button>
                {viewing.ref.visibility === "public" && (
                  <button data-sfx="click" onClick={() => doShare({ name: viewing.ref!.name, icon: viewing.ref!.icon, description: viewing.ref!.description, code: viewing.ref!.code, copyable: viewing.ref!.copyable })} className="flex items-center gap-1 text-[12px] text-muted hover:text-white"><Share2 size={13} /> Compartilhar</button>
                )}
              </>
            )}
            {(viewing.source === "imported") && (
              <button data-sfx="error" onClick={() => { removeShared(viewing.id); setMode("gallery"); }} className="flex items-center gap-1 text-[12px] text-red-400/80 hover:text-red-400"><Trash2 size={13} /> Remover</button>
            )}
            {canViewCode && (
              <div className="flex gap-1 bg-ink border border-line rounded-lg p-0.5">
                <button onClick={() => setShowCode(false)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium ${!showCode ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}><Eye size={13} /> Interagir</button>
                <button onClick={() => setShowCode(true)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium ${showCode ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"}`}><Code2 size={13} /> Código</button>
              </div>
            )}
            <button data-sfx="open" onClick={() => setRunKey((k) => k + 1)} title="Reiniciar" className="flex items-center gap-1.5 text-[12px] font-medium text-white px-3 py-1.5 rounded-lg" style={{ background: accent.hex }}>
              <Play size={12} fill="currentColor" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-ink">
          {showCode && canViewCode ? (
            <div className="h-full flex flex-col">
              <pre className="flex-1 overflow-auto p-5 text-[12px] font-mono text-[#c4c4cc] leading-relaxed"><code>{viewing.code}</code></pre>
            </div>
          ) : !canViewCode && showCode ? (
            <div className="h-full flex items-center justify-center text-faint text-sm flex-col gap-2">
              <Lock size={28} className="text-muted" />
              O autor não permitiu copiar o código deste HTML.
            </div>
          ) : (
            <iframe key={runKey} srcDoc={srcDoc} sandbox={sandbox} title={viewing.name} className="w-full h-full border-none" />
          )}
        </div>

        {shareInfo && <ShareBox info={shareInfo} copied={copied} setCopied={setCopied} onClose={() => setShareInfo(null)} />}
      </div>
    );
  }

  // ── GALERIA ───────────────────────────────────────────────────────────────
  const userPlayables: Playable[] = instruments.map((ins) => ({
    id: ins.id, name: ins.name, icon: ins.icon, color: accent.hex, image: ins.image,
    description: ins.description || "HTML criado por você.", tags: [ins.visibility === "public" ? "público" : "privado", ins.copyable ? "copia" : "bloqueado"],
    code: ins.code, source: "user", copyable: ins.copyable, ref: ins,
  }));
  const userPublic = userPlayables.filter((p) => p.ref?.visibility === "public");
  const communityPlayables: Playable[] = COMMUNITY.map((c) => ({
    id: c.id, name: c.name, icon: c.icon, color: c.color, author: c.author,
    description: c.description, tags: ["comunidade"], code: c.code, source: "community", copyable: true,
  }));
  const importedPlayables: Playable[] = shared.map((s) => ({
    id: s.id, name: s.name, icon: s.icon, color: accent.hex, author: "importado",
    description: s.description || "Importado via código.", tags: [s.copyable ? "copia" : "bloqueado"],
    code: s.code, source: "imported", copyable: s.copyable,
  }));
  const builtinPlayables: Playable[] = HTML_EXAMPLES.map((ex) => ({
    id: ex.id, name: ex.name, icon: ex.icon, color: ex.color,
    description: ex.description, tags: ex.tags, code: ex.code, source: "builtin", copyable: true,
  }));

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "mine", label: "Meus HTMLs", count: userPlayables.length },
    { id: "public", label: "HTMLs públicos", count: COMMUNITY.length + shared.length + userPublic.length },
    { id: "builtins", label: "Instrumentos", count: builtinPlayables.length },
  ];

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-5 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent.hex}1a` }}>
          <Globe size={20} style={{ color: accent.hex }} />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Studio HTML</h1>
      </div>
      <p className="text-muted text-sm mb-3 max-w-xl">
        Toque instrumentos interagindo, crie os seus próprios HTMLs e explore o que a comunidade publicou.
      </p>

      {unsafe && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-3 mb-5 max-w-2xl">
          <ShieldAlert size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-amber-200/85 leading-snug">
            <span className="font-semibold text-amber-300">Modo sem segurança ativo.</span> HTMLs personalizados e importados têm acesso total. Use só com conteúdo confiável.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line mb-6">
        {TABS.map((t) => (
          <button key={t.id} data-sfx="nav" onClick={() => setTab(t.id)}
            className={`relative px-4 py-2.5 text-[13px] font-semibold transition-colors ${tab === t.id ? "text-white" : "text-muted hover:text-white"}`}>
            {t.label} <span className="text-faint text-[11px]">{t.count}</span>
            {tab === t.id && <span className="absolute bottom-0 left-2 right-2 h-0.5" style={{ background: accent.hex }} />}
          </button>
        ))}
      </div>

      {/* MEUS HTMLs */}
      {tab === "mine" && (
        <>
          <div className="flex justify-end mb-3">
            <button data-sfx="open" onClick={startNew} className="flex items-center gap-1.5 text-[12px] font-semibold text-white px-3 py-1.5 rounded-lg" style={{ background: accent.hex }}>
              <Plus size={14} /> Criar HTML
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlayables.length === 0 ? (
              <button data-sfx="open" onClick={startNew} className="rounded-2xl border border-dashed border-line p-8 text-center text-muted hover:text-white hover:border-white/20 transition-all col-span-full max-w-sm mx-auto">
                <Plus size={24} className="mx-auto mb-2" />
                <div className="text-[13px] font-medium">Criar seu primeiro HTML</div>
                <div className="text-[11px] text-faint mt-1">Descrição, imagem e som personalizados</div>
              </button>
            ) : userPlayables.map((p) => (
              <Card key={p.id} p={p} onOpen={() => openViewer(p)}
                actions={(
                  <>
                    <button data-sfx="click" onClick={() => startEdit(p.ref!)} className="flex items-center gap-1 text-[11px] text-muted hover:text-white"><Pencil size={12} /> Editar</button>
                    <button data-sfx="error" onClick={() => { if (confirm("Excluir este HTML?")) remove(p.ref!.id); }} className="flex items-center gap-1 text-[11px] text-red-400/80 hover:text-red-400"><Trash2 size={12} /></button>
                    {p.ref?.visibility === "public" && (
                      <button data-sfx="click" onClick={() => doShare({ name: p.ref!.name, icon: p.ref!.icon, description: p.ref!.description, code: p.ref!.code, copyable: p.ref!.copyable })} className="flex items-center gap-1 text-[11px] text-muted hover:text-white"><Share2 size={12} /> Compartilhar</button>
                    )}
                  </>
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* HTMLs PÚBLICOS */}
      {tab === "public" && (
        <div className="space-y-8">
          {/* Importar */}
          <div className="rounded-2xl border border-line bg-card p-4">
            <div className="text-[13px] font-bold text-white mb-1">Importar HTML público</div>
            <div className="text-[11px] text-faint mb-2">Cole um código ou link de compartilhamento que alguém te enviou.</div>
            <div className="flex gap-2">
              <input value={importVal} onChange={(e) => { setImportVal(e.target.value); setImportMsg(null); }} placeholder="Cole o código ou link aqui..." className="flex-1 bg-ink border border-line rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-[var(--color-brand)]" />
              <button data-sfx="success" onClick={handleImport} className="px-4 py-2 rounded-lg text-[12px] font-bold text-white" style={{ background: accent.hex }}>Importar</button>
            </div>
            {importMsg && <div className="text-[11px] mt-2" style={{ color: importMsg.startsWith("✅") ? "#4ec9b0" : "#f48771" }}>{importMsg}</div>}
          </div>

          {importedPlayables.length > 0 && (
            <Section title="Importados por você">
              {importedPlayables.map((p) => (
                <Card key={p.id} p={p} onOpen={() => openViewer(p)}
                  actions={<button data-sfx="error" onClick={() => removeShared(p.id)} className="flex items-center gap-1 text-[11px] text-red-400/80 hover:text-red-400"><Trash2 size={12} /> Remover</button>} />
              ))}
            </Section>
          )}

          {userPublic.length > 0 && (
            <Section title="Seus HTMLs públicos">
              {userPublic.map((p) => (
                <Card key={p.id} p={p} onOpen={() => openViewer(p)}
                  actions={<button data-sfx="click" onClick={() => doShare({ name: p.ref!.name, icon: p.ref!.icon, description: p.ref!.description, code: p.ref!.code, copyable: p.ref!.copyable })} className="flex items-center gap-1 text-[11px] text-muted hover:text-white"><Share2 size={12} /> Compartilhar</button>} />
              ))}
            </Section>
          )}

          <Section title="Comunidade">
            {communityPlayables.map((p) => (
              <Card key={p.id} p={p} onOpen={() => openViewer(p)} actions={<button data-sfx="success" onClick={() => addShared({ name: p.name, icon: p.icon, description: p.description, code: p.code, copyable: true })} className="flex items-center gap-1 text-[11px] text-muted hover:text-white"><Download size={12} /> Salvar</button>} />
            ))}
          </Section>
        </div>
      )}

      {/* INSTRUMENTOS */}
      {tab === "builtins" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builtinPlayables.map((p) => (
            <button key={p.id} data-sfx="open" onClick={() => openViewer(p)} className="group text-left rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-[#16161d]">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" style={{ background: `${p.color}1f` }}>{p.icon}</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-white">{p.name}</div>
                  <div className="text-[11px] text-faint">Interativo</div>
                </div>
                <Maximize2 size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-faint" />
              </div>
              <p className="text-[12.5px] text-muted leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="text-[10px] text-faint border border-line rounded-full px-2 py-0.5">{t}</span>)}</div>
            </button>
          ))}
        </div>
      )}

      {shareInfo && <ShareBox info={shareInfo} copied={copied} setCopied={setCopied} onClose={() => setShareInfo(null)} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Card({ p, onOpen, actions }: { p: Playable; onOpen: () => void; actions?: React.ReactNode }) {
  return (
    <div className="group relative rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-1 hover:border-white/20">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="flex items-center gap-3 mb-3">
          {p.image ? (
            <img src={p.image} alt="" className="w-11 h-11 rounded-xl object-cover" />
          ) : (
            <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${p.color}1f` }}>{p.icon}</span>
          )}
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-white truncate">{p.name}</div>
            <div className="text-[11px] text-faint truncate">{p.author || (p.copyable ? "personalizado" : "código protegido")}</div>
          </div>
          <Maximize2 size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-faint shrink-0" />
        </div>
        <p className="text-[12.5px] text-muted leading-relaxed line-clamp-2">{p.description}</p>
      </button>
      {actions && <div className="flex flex-wrap gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">{actions}</div>}
    </div>
  );
}

function ShareBox({ info, copied, setCopied, onClose }: { info: { code: string; link: string }; copied: boolean; setCopied: (v: boolean) => void; onClose: () => void }) {
  const copy = (text: string) => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 animate-overlayIn" data-sfx="close" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-panel p-5 shadow-2xl animate-fadeIn">
        <div className="flex items-center gap-2 mb-3">
          <Share2 size={16} style={{ color: "var(--color-brand)" }} />
          <h3 className="text-[15px] font-bold text-white">Compartilhar HTML</h3>
          <button data-sfx="close" onClick={onClose} className="ml-auto text-muted hover:text-white"><X size={16} /></button>
        </div>
        <p className="text-[12px] text-muted mb-3">Envie o <span className="text-white">código</span> ou o <span className="text-white">link</span>. Quem receber cola na aba <span className="text-white">HTMLs públicos → Importar</span>.</p>
        <label className="text-[11px] uppercase tracking-wide text-faint">Link</label>
        <div className="flex gap-2 mt-1 mb-3">
          <input readOnly value={info.link} className="flex-1 min-w-0 bg-ink border border-line rounded-lg px-2 py-1.5 text-[11px] text-white font-mono" />
          <button data-sfx="click" onClick={() => copy(info.link)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "var(--color-brand)" }}>{copied ? "✓" : "Copiar"}</button>
        </div>
        <label className="text-[11px] uppercase tracking-wide text-faint">Código</label>
        <textarea readOnly value={info.code} rows={3} className="mt-1 w-full bg-ink border border-line rounded-lg px-2 py-1.5 text-[10px] text-white font-mono resize-none" />
      </div>
    </div>
  );
}

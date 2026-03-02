import { useState, useEffect } from "react";
import { Moon, Coffee, Globe, Download, Eye, EyeOff, ChevronDown, Code2, Layers } from "lucide-react";
import AudioPlayer from "../components/AudioPlayer";
import type { LangId, WorkshopTemplate } from "../data/workshop";
import { extensions } from "../data/workshop";

interface Props {
  installed: Set<LangId>;
  defaultLang?: LangId;
  onGoWorkshop: () => void;
}

type ActiveLang = "lua" | "java" | "html" | "javascript" | "python";

const ALL_LANGS: ActiveLang[] = ["lua", "java", "html", "javascript", "python"];

const LANG_META: Record<ActiveLang, {
  icon: React.ReactNode;
  label: string;
  color: string;
  border: string;
  bg: string;
  text: string;
  audioMode: "lua" | "java" | "html" | "javascript" | "python";
  ext: string;
  mime: string;
}> = {
  lua: {
    icon: <Moon size={16} />,
    label: "Lua",
    color: "from-blue-600 to-cyan-500",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    text: "text-blue-400",
    audioMode: "lua",
    ext: "lua",
    mime: "text/plain",
  },
  java: {
    icon: <Coffee size={16} />,
    label: "Java",
    color: "from-orange-600 to-yellow-500",
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    text: "text-orange-400",
    audioMode: "java",
    ext: "java",
    mime: "text/plain",
  },
  html: {
    icon: <Globe size={16} />,
    label: "HTML",
    color: "from-pink-600 to-rose-500",
    border: "border-pink-500/30",
    bg: "bg-pink-500/5",
    text: "text-pink-400",
    audioMode: "html",
    ext: "html",
    mime: "text/html",
  },
  javascript: {
    icon: <span className="text-xs font-black leading-none">JS</span>,
    label: "JavaScript",
    color: "from-yellow-500 to-amber-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
    text: "text-yellow-400",
    audioMode: "javascript",
    ext: "js",
    mime: "text/javascript",
  },
  python: {
    icon: <span className="text-xs font-black leading-none">PY</span>,
    label: "Python",
    color: "from-green-500 to-emerald-400",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    text: "text-green-400",
    audioMode: "python",
    ext: "py",
    mime: "text/plain",
  },
};

function getTemplatesForLang(lang: ActiveLang): WorkshopTemplate[] {
  const ext = extensions.find((e) => e.id === lang);
  return ext?.templates ?? [];
}

function PreviewIframe({ code }: { code: string }) {
  const blob = new Blob([code], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  return (
    <iframe
      key={url}
      src={url}
      className="w-full h-full rounded-xl border border-white/10 bg-white"
      sandbox="allow-scripts allow-same-origin"
      title="Preview"
    />
  );
}

function EmptyStudio({ onGoWorkshop }: { onGoWorkshop: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-5">🔒</div>
      <h2 className="text-2xl font-black text-white mb-3">Nenhuma extensão instalada</h2>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">
        O Studio precisa de pelo menos uma linguagem instalada.<br />
        Vá ao <span className="text-purple-400 font-bold">Workshop</span> e instale{" "}
        <span className="text-blue-400 font-bold">Lua</span>,{" "}
        <span className="text-orange-400 font-bold">Java</span>,{" "}
        <span className="text-pink-400 font-bold">HTML</span>,{" "}
        <span className="text-yellow-400 font-bold">JavaScript</span> ou{" "}
        <span className="text-green-400 font-bold">Python</span> para começar.
      </p>
      <button
        onClick={onGoWorkshop}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base
          bg-gradient-to-r from-purple-600 to-pink-600 text-white
          hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-900/40"
      >
        <Download size={18} /> Ir para o Workshop
      </button>
    </div>
  );
}

export default function StudioPage({ installed, defaultLang, onGoWorkshop }: Props) {
  const availableLangs = ALL_LANGS.filter((l) => installed.has(l as LangId));

  const resolveDefault = (): ActiveLang | null => {
    if (defaultLang && availableLangs.includes(defaultLang as ActiveLang)) {
      return defaultLang as ActiveLang;
    }
    return availableLangs[0] ?? null;
  };

  const [activeLang, setActiveLang] = useState<ActiveLang | null>(resolveDefault);
  const [code, setCode] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<WorkshopTemplate | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);

  useEffect(() => {
    const resolved = resolveDefault();
    setActiveLang(resolved);
  }, [installed]);

  useEffect(() => {
    if (defaultLang && availableLangs.includes(defaultLang as ActiveLang)) {
      setActiveLang(defaultLang as ActiveLang);
    }
  }, [defaultLang]);

  useEffect(() => {
    if (!activeLang) return;
    const templates = getTemplatesForLang(activeLang);
    if (templates.length > 0) {
      setActiveTemplate(templates[0]);
      setCode(templates[0].code);
    } else {
      setActiveTemplate(null);
      setCode(`// Nenhum template disponível para ${activeLang}`);
    }
    setPreview(false);
  }, [activeLang]);

  if (availableLangs.length === 0 || !activeLang) {
    return <EmptyStudio onGoWorkshop={onGoWorkshop} />;
  }

  const meta = LANG_META[activeLang];
  const templates = getTemplatesForLang(activeLang);
  const isHtml = meta.audioMode === "html";

  const handleSelectTemplate = (t: WorkshopTemplate) => {
    setActiveTemplate(t);
    setCode(t.code);
    setTemplateOpen(false);
    setPreview(false);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: meta.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = activeTemplate?.name.replace(/[^a-zA-Z0-9]/g, "_") ?? "musiccode";
    a.href = url;
    a.download = `${name}.${meta.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Layers size={26} className="text-purple-400" />
            Studio
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edite, reproduza e baixe músicas criadas com código.
          </p>
        </div>
        {availableLangs.length < ALL_LANGS.length && (
          <button
            onClick={onGoWorkshop}
            className="flex items-center gap-2 text-xs font-bold text-purple-400
              bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2.5
              hover:bg-purple-500/20 transition-all"
          >
            <Download size={13} /> Instalar mais linguagens no Workshop
          </button>
        )}
      </div>

      {/* ── Seletor de linguagem ── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {ALL_LANGS.map((lang) => {
          const m = LANG_META[lang];
          const isAvail = installed.has(lang as LangId);
          return (
            <button
              key={lang}
              onClick={() => isAvail && setActiveLang(lang)}
              title={!isAvail ? `Instale ${m.label} no Workshop para usar` : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                transition-all duration-200
                ${activeLang === lang
                  ? `bg-gradient-to-r ${m.color} text-white shadow-lg`
                  : isAvail
                    ? `${m.text} hover:bg-white/5 bg-white/[0.03] border border-white/10`
                    : "text-gray-700 bg-white/[0.02] border border-white/5 cursor-not-allowed"
                }`}
            >
              {m.icon}
              {m.label}
              {!isAvail && (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full text-gray-600">🔒</span>
              )}
              {isAvail && activeLang !== lang && (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full text-gray-500">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Template selector ── */}
      {templates.length > 0 && (
        <div className="relative mb-5">
          <button
            onClick={() => setTemplateOpen(!templateOpen)}
            className={`w-full md:w-auto flex items-center justify-between gap-3
              bg-white/5 border ${meta.border} rounded-xl px-4 py-2.5
              text-sm font-semibold text-white hover:bg-white/[0.08] transition-all min-w-64`}
          >
            <div className="flex items-center gap-2">
              <Code2 size={14} className={meta.text} />
              <span>{activeTemplate?.name ?? "Selecionar template"}</span>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${templateOpen ? "rotate-180" : ""}`} />
          </button>

          {templateOpen && (
            <div className={`absolute top-full left-0 mt-2 z-30 w-80 rounded-2xl border ${meta.border}
              bg-[#0d0d1f] shadow-2xl shadow-black/60 overflow-hidden`}>
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0
                    hover:bg-white/5 transition-colors
                    ${activeTemplate?.id === t.id ? "bg-white/[0.08]" : ""}`}
                >
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Editor + Preview ── */}
      <div className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden`}>
        {/* Toolbar */}
        <div className={`flex items-center justify-between px-4 py-2.5
          bg-gradient-to-r ${meta.color} bg-opacity-20 border-b ${meta.border}`}>
          <div className="flex items-center gap-2">
            <span className={`${meta.text} flex items-center gap-1.5 text-sm font-bold`}>
              {meta.icon} {meta.label}
            </span>
            {activeTemplate && (
              <span className="text-xs text-white/60 hidden sm:inline">— {activeTemplate.name}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isHtml && (
              <button
                onClick={() => setPreview(!preview)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${preview ? "bg-white/20 text-white" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
              >
                {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                {preview ? "Editor" : "Preview"}
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[420px] relative">
          {preview && isHtml ? (
            <PreviewIframe code={code} />
          ) : (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-transparent text-sm font-mono text-gray-200
                resize-none p-4 focus:outline-none leading-relaxed"
              style={{ tabSize: 2 }}
            />
          )}
        </div>
      </div>

      {/* ── Player de Áudio + Console ── */}
      <AudioPlayer
        code={code}
        mode={meta.audioMode}
        templateId={activeTemplate?.id}
      />

      {/* ── Dicas por linguagem ── */}
      {isHtml && (
        <div className={`mt-4 rounded-xl border ${meta.border} ${meta.bg} px-4 py-3 flex items-center gap-3`}>
          <Eye size={14} className={meta.text} />
          <p className="text-xs text-gray-500">
            Para templates HTML, clique em{" "}
            <span className={`${meta.text} font-bold`}>Preview</span>{" "}
            na barra do editor para executar o código diretamente no browser.
          </p>
        </div>
      )}

      {activeLang === "javascript" && (
        <div className={`mt-4 rounded-xl border ${meta.border} ${meta.bg} px-4 py-3 flex items-center gap-3`}>
          <span className="text-yellow-400 text-sm">⚡</span>
          <p className="text-xs text-gray-500">
            O código JavaScript é interpretado pelo player via{" "}
            <span className={`${meta.text} font-bold`}>Web Audio API</span>.
            Notas detectadas automaticamente a partir do padrão <code className="text-yellow-300">notas["Do"]</code> ou arrays de melodia.
          </p>
        </div>
      )}

      {activeLang === "python" && (
        <div className={`mt-4 rounded-xl border ${meta.border} ${meta.bg} px-4 py-3 flex items-center gap-3`}>
          <span className="text-green-400 text-sm">🐍</span>
          <p className="text-xs text-gray-500">
            O código Python é <span className={`${meta.text} font-bold`}>simulado</span> pelo player —
            notas detectadas no padrão <code className="text-green-300">("Do", 0.4)</code> ou dicionários de frequência são reproduzidas via Web Audio API.
          </p>
        </div>
      )}
    </div>
  );
}

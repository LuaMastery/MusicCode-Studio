import { useState } from "react";
import { Music2, Zap, Home, Store, Layers, ChevronRight, Download, Info, Settings2 } from "lucide-react";
import WorkshopPage from "./pages/WorkshopPage";
import StudioPage from "./pages/StudioPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import { useSettings } from "./context/SettingsContext";
import type { LangId } from "./data/workshop";

export type Page = "home" | "workshop" | "studio" | "about" | "settings";

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({
  installed,
  navigate,
}: {
  installed: Set<LangId>;
  navigate: (p: Page, lang?: LangId) => void;
}) {
  const { t, accent, settings } = useSettings();

  const LANGS = [
    { icon: "🌙", name: "Lua",     id: "lua"  as LangId, desc: "Melodias, ritmos e escalas",         color: "from-blue-600 to-cyan-500",    border: "border-blue-500/20"   },
    { icon: "☕", name: "Java",    id: "java" as LangId, desc: "MIDI & Sintetizador",                 color: "from-orange-600 to-yellow-500", border: "border-orange-500/20" },
    { icon: "🌐", name: "HTML",    id: "html" as LangId, desc: "Web Audio API — preview ao vivo",     color: "from-pink-600 to-rose-500",    border: "border-pink-500/20"   },
    { icon: "🟨", name: "JavaScript", id: "javascript" as LangId, desc: "Síntese no browser",         color: "from-yellow-600 to-amber-500", border: "border-yellow-500/20" },
    { icon: "🐍", name: "Python",  id: "python" as LangId, desc: "Scripts de composição musical",    color: "from-emerald-600 to-teal-500", border: "border-emerald-500/20"},
  ];

  const installedCount = installed.size;
  const compact = settings.compactMode;

  return (
    <div className={`max-w-6xl mx-auto px-4 ${compact ? "py-6" : "py-12"}`}>

      {/* ── HERO ── */}
      <div className={`text-center ${compact ? "mb-8" : "mb-14"}`}>
        <div className={`inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20
          rounded-full px-4 py-1.5 text-xs font-semibold text-purple-300 ${compact ? "mb-3" : "mb-6"} tracking-widest uppercase`}>
          <Zap size={12} />
          Música + Código = Arte
        </div>

        <h1 className={`${compact ? "text-4xl" : "text-5xl md:text-6xl"} font-black text-white leading-tight mb-4`}>
          Crie Músicas com{" "}
          <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
            Programação
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Um studio completo para compor, sintetizar e visualizar música usando código.
          Instale extensões no <span className={`${accent.text} font-bold`}>{t("workshop")}</span> para
          começar com{" "}
          <span className="text-blue-400 font-semibold">Lua</span>,{" "}
          <span className="text-orange-400 font-semibold">Java</span>,{" "}
          <span className="text-pink-400 font-semibold">HTML</span>,{" "}
          <span className="text-yellow-400 font-semibold">JavaScript</span> ou{" "}
          <span className="text-emerald-400 font-semibold">Python</span>.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("workshop")}
            className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base
              bg-gradient-to-r ${accent.gradient} text-white shadow-xl shadow-purple-900/40
              hover:opacity-90 active:scale-95 transition-all`}
          >
            <Store size={18} /> {t("workshop")}
          </button>
          {installedCount > 0 && (
            <button
              onClick={() => navigate("studio")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base
                bg-white/5 border border-white/10 text-gray-300
                hover:bg-white/10 hover:text-white active:scale-95 transition-all"
            >
              <Layers size={18} /> {t("studio")}
            </button>
          )}
        </div>

        {installedCount > 0 ? (
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-emerald-400
            bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
            ✅ {installedCount} {installedCount === 1 ? "extensão instalada" : "extensões instaladas"}
          </div>
        ) : (
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-yellow-400
            bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5">
            ⬇️ Nenhuma extensão instalada — vá ao Workshop para começar
          </div>
        )}
      </div>

      {/* ── LINGUAGENS ── */}
      <div className={compact ? "mb-8" : "mb-14"}>
        <h2 className="text-2xl font-black text-white text-center mb-2">🎵 Linguagens Disponíveis</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Instale no Workshop para desbloquear no Studio.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {LANGS.map((l) => {
            const isInst = installed.has(l.id);
            return (
              <button
                key={l.name}
                onClick={() => navigate(isInst ? "studio" : "workshop", isInst ? l.id : undefined)}
                className={`rounded-2xl p-5 text-center transition-all hover:scale-[1.04]
                  bg-gradient-to-br ${l.color} bg-opacity-10 border ${l.border}
                  ${isInst ? "opacity-100" : "opacity-55 hover:opacity-80"}`}
              >
                <div className="text-3xl mb-2">{l.icon}</div>
                <div className="text-sm font-black text-white mb-1">{l.name}</div>
                <div className="text-[10px] text-white/60 mb-2 leading-relaxed">{l.desc}</div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block
                  ${isInst
                    ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30"
                    : "text-white/50 bg-white/10 border border-white/10"
                  }`}>
                  {isInst ? "✓ Instalada" : "⬇️ Instalar"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── COMO FUNCIONA ── */}
      <div className={compact ? "mb-8" : "mb-14"}>
        <h2 className="text-2xl font-black text-white text-center mb-8">🚀 {t("howItWorks")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: "01", icon: "🏪", title: "Abra o Workshop",         desc: "Explore as extensões disponíveis. Instale Lua, Java, HTML, JavaScript ou Python para começar a criar música." },
            { n: "02", icon: "⬇️", title: "Instale uma Linguagem",   desc: "Clique em Instalar para adicionar a linguagem ao seu Studio com templates prontos para usar." },
            { n: "03", icon: "🎵", title: "Crie no Studio",          desc: "Abra o Studio, escolha a linguagem instalada, edite o código, reproduza e ouça sua música." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center flex flex-col items-center gap-3">
              <div className="text-4xl">{s.icon}</div>
              <div className={`text-xs font-black uppercase tracking-widest ${accent.text}`}>Passo {s.n}</div>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className={compact ? "mb-8" : "mb-10"}>
        <h2 className="text-2xl font-black text-white text-center mb-2">✨ Recursos do Studio</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Disponíveis ao instalar as extensões compatíveis.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🎹", title: "Piano Interativo",      desc: "Piano completo no browser com Web Audio API (extensão HTML).",            color: "from-pink-600 to-rose-500",    border: "border-pink-500/20",    bg: "bg-pink-500/5"    },
            { icon: "🥁", title: "Beat Maker",            desc: "Sequenciador de 16 passos com 6 instrumentos e BPM ajustável.",           color: "from-purple-600 to-pink-600",  border: "border-purple-500/20",  bg: "bg-purple-500/5"  },
            { icon: "🌈", title: "Visualizador de Áudio", desc: "Visualize música em tempo real com barras, onda e modo circular.",        color: "from-blue-600 to-cyan-500",    border: "border-blue-500/20",    bg: "bg-blue-500/5"    },
            { icon: "🔊", title: "Player com Console",    desc: "Reproduza código musical com log de notas e console de erros completo.",  color: "from-orange-600 to-yellow-500",border: "border-orange-500/20",  bg: "bg-orange-500/5"  },
            { icon: "🏪", title: "Workshop de Extensões", desc: "Instale suporte a 5 linguagens musicais diferentes.",                    color: "from-emerald-600 to-green-500",border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
            { icon: "💾", title: "Download de Código",    desc: "Baixe qualquer template para rodar localmente no seu computador.",        color: "from-violet-600 to-purple-500",border: "border-violet-500/20",  bg: "bg-violet-500/5"  },
          ].map((f) => (
            <div key={f.title} className={`rounded-2xl border ${f.border} ${f.bg} p-5 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-200`}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl shrink-0 shadow-lg`}>
                {f.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      {installedCount === 0 && (
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8 text-center">
          <div className="text-4xl mb-3">🏪</div>
          <h3 className="text-xl font-black text-white mb-2">Comece pelo Workshop</h3>
          <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
            Instale Lua, Java, HTML, JavaScript ou Python para desbloquear o Studio e criar músicas com código.
          </p>
          <button
            onClick={() => navigate("workshop")}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm
              bg-gradient-to-r ${accent.gradient} text-white
              hover:opacity-90 active:scale-95 transition-all shadow-lg`}
          >
            <Download size={16} /> {t("goToWorkshop")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]           = useState<Page>("home");
  const [studioLang, setStudioLang] = useState<LangId | undefined>(undefined);
  const [installed, setInstalled] = useState<Set<LangId>>(new Set<LangId>());
  const { t, accent, settings, themeVars } = useSettings();

  const navigate = (p: Page, lang?: LangId) => {
    setPage(p);
    if (lang) setStudioLang(lang);
  };

  const handleInstall = (id: LangId) => {
    setInstalled((prev) => new Set([...prev, id]));
  };

  const NAV = [
    { id: "home"     as Page, label: t("home"),     icon: <Home size={15} />,     active: accent.gradient,                  text: "text-gray-400"   },
    { id: "workshop" as Page, label: t("workshop"),  icon: <Store size={15} />,    active: "from-emerald-600 to-cyan-600",   text: "text-emerald-400"},
    { id: "studio"   as Page, label: t("studio"),    icon: <Layers size={15} />,   active: accent.gradient,                  text: "text-purple-400" },
    { id: "about"    as Page, label: t("about"),     icon: <Info size={15} />,     active: "from-rose-600 to-pink-600",      text: "text-rose-400"   },
    { id: "settings" as Page, label: t("settings"),  icon: <Settings2 size={15} />,active: "from-slate-600 to-gray-600",    text: "text-slate-400"  },
  ];

  const currentNav = NAV.find((n) => n.id === page)!;

  // Aplicar tema dinâmico no bg do body
  const bgStyle = { backgroundColor: themeVars.bg };

  return (
    <div className="min-h-screen text-white flex flex-col" style={bgStyle}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/5 shadow-xl shadow-black/40"
        style={{ backgroundColor: themeVars.surface + "f2" }}>
        <div className={`max-w-7xl mx-auto px-4 ${settings.compactMode ? "h-12" : "h-16"} flex items-center justify-between gap-4`}>

          <button onClick={() => navigate("home")} className="flex items-center gap-3 group shrink-0">
            <div className={`${settings.compactMode ? "w-7 h-7" : "w-9 h-9"} rounded-xl bg-gradient-to-br ${accent.gradient}
              flex items-center justify-center shadow-lg`}>
              <Music2 size={settings.compactMode ? 14 : 18} className="text-white" />
            </div>
            <span className={`${settings.compactMode ? "text-base" : "text-lg"} font-black text-white tracking-tight hidden sm:block`}>
              Music<span className={accent.text}>Code</span>
              <span className="text-pink-400"> Studio</span>
            </span>
          </button>

          <nav className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-200
                  ${page === item.id
                    ? `bg-gradient-to-r ${item.active} text-white shadow-md`
                    : `${item.text} hover:bg-white/5 hover:text-white`
                  }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20
              rounded-full px-3 py-1`}>
              <Zap size={12} className={accent.text} />
              <span className={`text-xs font-bold ${accent.text} hidden sm:inline`}>
                {installed.size} {t("installed")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      {page !== "home" && settings.showBreadcrumb && (
        <div className="border-b border-white/5 px-4 py-2" style={{ backgroundColor: themeVars.surface }}>
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
            <button onClick={() => navigate("home")} className={`hover:${accent.text} transition-colors`}>
              {t("home")}
            </button>
            <ChevronRight size={12} />
            <span className={`${currentNav.text} font-semibold`}>{currentNav.label}</span>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <main className="flex-1">
        {page === "home" && <HomePage installed={installed} navigate={navigate} />}
        {page === "workshop" && (
          <WorkshopPage
            installed={installed}
            onInstall={handleInstall}
            onOpenStudio={(lang) => navigate("studio", lang)}
          />
        )}
        {page === "studio" && (
          <StudioPage
            installed={installed}
            defaultLang={studioLang}
            onGoWorkshop={() => navigate("workshop")}
          />
        )}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "settings" && <SettingsPage />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-4 py-4 text-center" style={{ backgroundColor: themeVars.surface }}>
        <p className="text-xs text-gray-600">
          🎵 <span className={`${accent.text} font-bold`}>MusicCode Studio</span>
          {installed.has("lua")        && <><span className="text-gray-700"> · </span><span className="text-blue-400">Lua</span></>}
          {installed.has("java")       && <><span className="text-gray-700"> · </span><span className="text-orange-400">Java</span></>}
          {installed.has("html")       && <><span className="text-gray-700"> · </span><span className="text-pink-400">HTML</span></>}
          {installed.has("javascript") && <><span className="text-gray-700"> · </span><span className="text-yellow-400">JavaScript</span></>}
          {installed.has("python")     && <><span className="text-gray-700"> · </span><span className="text-emerald-400">Python</span></>}
          <span className="text-gray-700"> · </span>
          Web Audio API · MIDI · Síntese de Som
          <span className="text-gray-700"> · </span>
          <span className="text-gray-500">por Rhuan De Cillo Silva</span>
        </p>
      </footer>
    </div>
  );
}

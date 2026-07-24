/**
 * App — shell minimalista do Sonora.
 * Logo + navegação + fundo animado + gaveta de aparência.
 */
import { useState } from "react";
import { Home, Code2, Globe, BookOpen, SlidersHorizontal } from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { StudioPage } from "./pages/StudioPage";
import { HtmlStudioPage } from "./pages/HtmlStudioPage";
import { AboutPage } from "./pages/AboutPage";
import { BackgroundFX } from "./components/BackgroundFX";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { Logo } from "./components/Logo";
import { useSettings } from "./context/SettingsContext";
import { useSfxGlobal } from "./hooks/useSfxGlobal";

export type Page = "home" | "studio" | "html" | "about";

export default function App() {
  const { accent, openDrawer } = useSettings();
  const [page, setPage] = useState<Page>("home");
  useSfxGlobal();

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const NAV: { id: Page; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Início", icon: Home },
    { id: "studio", label: "Studio", icon: Code2 },
    { id: "html", label: "HTML", icon: Globe },
    { id: "about", label: "Sobre", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundFX />

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink/70 border-b border-line">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-6">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 shrink-0">
            <Logo size={28} color={accent.hex} />
            <span className="font-bold text-[16px] tracking-tight text-white">Sonora</span>
          </button>

          <nav className="flex items-center gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id;
              return (
                <button
                  key={n.id}
                  data-sfx="nav"
                  onClick={() => navigate(n.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    active ? "text-white bg-white/[0.06]" : "text-muted hover:text-white"
                  }`}
                >
                  <Icon size={14} style={active ? { color: accent.hex } : undefined} />
                  <span className="hidden sm:block">{n.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            data-sfx="open"
            onClick={openDrawer}
            title="Aparência"
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-muted hover:text-white border border-line hover:bg-white/[0.04] transition-all"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:block">Aparência</span>
          </button>
        </div>
      </header>

      {/* PÁGINA */}
      <main className="flex-1 relative z-10">
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "studio" && <StudioPage />}
        {page === "html" && <HtmlStudioPage />}
        {page === "about" && <AboutPage navigate={navigate} />}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-line py-6">
        <p className="text-center text-xs text-faint">
          Sonora · Crie música com programação · feito com Web Audio API
        </p>
      </footer>

      <SettingsDrawer />
    </div>
  );
}

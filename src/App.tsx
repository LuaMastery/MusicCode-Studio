/**
 * App — shell minimalista do MusicCode Studio.
 */
import { useState } from "react";
import { Music2, Home, Code2, Globe, BookOpen } from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { StudioPage } from "./pages/StudioPage";
import { HtmlStudioPage } from "./pages/HtmlStudioPage";
import { AboutPage } from "./pages/AboutPage";
import { useSettings } from "./context/SettingsContext";

export type Page = "home" | "studio" | "html" | "about";

export default function App() {
  const { accent, accents, setAccent } = useSettings();
  const [page, setPage] = useState<Page>("home");

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
    <div className="min-h-screen flex flex-col bg-ink">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink/70 border-b border-line">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-6">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 shrink-0">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg"
              style={{ background: accent.hex, boxShadow: `0 4px 20px -4px ${accent.hex}` }}
            >
              <Music2 size={15} className="text-white" />
            </span>
            <span className="font-bold text-[15px] tracking-tight text-white">
              MusicCode<span className="text-muted"> Studio</span>
            </span>
          </button>

          <nav className="flex items-center gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id;
              return (
                <button
                  key={n.id}
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

          {/* Acentos (pontos minimalistas) */}
          <div className="ml-auto hidden md:flex items-center gap-1.5">
            {accents.map((a) => (
              <button
                key={a.id}
                title={a.name}
                onClick={() => setAccent(a.id)}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  accent.id === a.id ? "ring-2 ring-offset-2 ring-offset-ink scale-110" : "opacity-50 hover:opacity-100"
                }`}
                style={{ background: a.hex, boxShadow: accent.id === a.id ? `0 0 0 1px ${a.hex}` : undefined }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* PÁGINA */}
      <main className="flex-1">
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "studio" && <StudioPage />}
        {page === "html" && <HtmlStudioPage />}
        {page === "about" && <AboutPage navigate={navigate} />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-line py-6">
        <p className="text-center text-xs text-faint">
          MusicCode Studio · Crie música com programação · feito com Web Audio API
        </p>
      </footer>
    </div>
  );
}

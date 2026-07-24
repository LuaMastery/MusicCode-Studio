/**
 * App — shell do MusicCode Studio: navegação + seletor de cor + páginas.
 */
import { useState } from "react";
import { Music2, Home, Code2, Globe, BookOpen, Palette } from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { StudioPage } from "./pages/StudioPage";
import { HtmlStudioPage } from "./pages/HtmlStudioPage";
import { AboutPage } from "./pages/AboutPage";
import { useSettings } from "./context/SettingsContext";

export type Page = "home" | "studio" | "html" | "about";

export default function App() {
  const { accent, accents, setAccent } = useSettings();
  const [page, setPage] = useState<Page>("home");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const NAV: { id: Page; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Início", icon: Home },
    { id: "studio", label: "Studio JS", icon: Code2 },
    { id: "html", label: "Studio HTML", icon: Globe },
    { id: "about", label: "Sobre", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a14]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 shrink-0">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-lg`}>
              <Music2 size={18} className="text-white" />
            </div>
            <span className="font-black text-white text-lg hidden sm:block">
              MusicCode <span className={accent.text}>Studio</span>
            </span>
          </button>

          <nav className="flex items-center gap-1 mx-auto">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => navigate(n.id)}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden md:block">{n.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Paleta de cores */}
          <div className="relative shrink-0">
            <button
              onClick={() => setPaletteOpen((o) => !o)}
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Mudar cor"
            >
              <Palette size={16} className="text-gray-300" />
            </button>
            {paletteOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPaletteOpen(false)} />
                <div className="absolute right-0 mt-2 z-50 bg-[#12101f] border border-white/10 rounded-2xl p-3 shadow-2xl">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">Cor de destaque</div>
                  <div className="flex flex-col gap-1">
                    {accents.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { setAccent(a.id); setPaletteOpen(false); }}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-white/5 ${accent.id === a.id ? "bg-white/10" : ""}`}
                      >
                        <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${a.gradient}`} />
                        <span className="text-gray-300">{a.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
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
      <footer className="border-t border-white/10 py-6 text-center">
        <p className="text-xs text-gray-600">
          MusicCode Studio · Crie música com programação · Web Audio API + Capacitor
        </p>
      </footer>
    </div>
  );
}

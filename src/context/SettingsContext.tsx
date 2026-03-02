import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

export type Language = "pt-BR" | "en-US" | "es-ES" | "fr-FR" | "de-DE" | "ja-JP";
export type Theme = "dark" | "darker" | "midnight" | "ocean" | "forest" | "sunset";
export type FontSize = "sm" | "md" | "lg" | "xl";
export type AccentColor = "purple" | "blue" | "pink" | "emerald" | "orange" | "red" | "cyan";
export type AnimationLevel = "full" | "reduced" | "none";
export type SidebarPosition = "left" | "right";

export interface Settings {
  // Idioma
  language: Language;
  // Aparência
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  animationLevel: AnimationLevel;
  compactMode: boolean;
  showBreadcrumb: boolean;
  // Editor
  editorFontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  autoCloseBrackets: boolean;
  tabSize: number;
  // Áudio
  defaultVolume: number;
  autoPlay: boolean;
  showConsoleByDefault: boolean;
  noteDuration: number;
  // Workshop
  showDeprecated: boolean;
  autoUpdate: boolean;
  // Acessibilidade
  highContrast: boolean;
  reducedMotion: boolean;
}

const DEFAULT: Settings = {
  language: "pt-BR",
  theme: "dark",
  accentColor: "purple",
  fontSize: "md",
  animationLevel: "full",
  compactMode: false,
  showBreadcrumb: true,
  editorFontSize: 14,
  lineNumbers: true,
  wordWrap: false,
  autoCloseBrackets: true,
  tabSize: 2,
  defaultVolume: 0.7,
  autoPlay: false,
  showConsoleByDefault: false,
  noteDuration: 0.4,
  showDeprecated: true,
  autoUpdate: true,
  highContrast: false,
  reducedMotion: false,
};

// ─── Traduções ────────────────────────────────────────────────────────────────

export type TranslationKey =
  | "home" | "workshop" | "studio" | "about" | "settings"
  | "installed" | "install" | "open" | "preview" | "download"
  | "play" | "stop" | "volume" | "console" | "clear" | "copy"
  | "noExtensions" | "goToWorkshop" | "searchExtensions"
  | "available" | "deprecated" | "all" | "installedOnly"
  | "templates" | "editor" | "language" | "theme" | "appearance"
  | "audio" | "accessibility" | "save" | "reset" | "cancel"
  | "settingsTitle" | "settingsSubtitle" | "noNotes" | "error"
  | "success" | "warning" | "info" | "notes" | "start" | "howItWorks";

export const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  "pt-BR": {
    home: "Início", workshop: "Workshop", studio: "Studio", about: "Sobre", settings: "Configurações",
    installed: "instaladas", install: "Instalar", open: "Abrir", preview: "Preview", download: "Baixar",
    play: "Reproduzir", stop: "Parar", volume: "Volume", console: "Console", clear: "Limpar", copy: "Copiar",
    noExtensions: "Nenhuma extensão instalada", goToWorkshop: "Ir para o Workshop", searchExtensions: "Buscar extensões...",
    available: "Disponíveis", deprecated: "Descontinuadas", all: "Todas", installedOnly: "Instaladas",
    templates: "Templates", editor: "Editor", language: "Idioma", theme: "Tema", appearance: "Aparência",
    audio: "Áudio", accessibility: "Acessibilidade", save: "Salvar", reset: "Resetar", cancel: "Cancelar",
    settingsTitle: "Configurações", settingsSubtitle: "Personalize sua experiência no MusicCode Studio",
    noNotes: "Nenhuma nota encontrada", error: "Erro", success: "Sucesso", warning: "Aviso", info: "Info",
    notes: "Notas", start: "Começar", howItWorks: "Como Funciona",
  },
  "en-US": {
    home: "Home", workshop: "Workshop", studio: "Studio", about: "About", settings: "Settings",
    installed: "installed", install: "Install", open: "Open", preview: "Preview", download: "Download",
    play: "Play", stop: "Stop", volume: "Volume", console: "Console", clear: "Clear", copy: "Copy",
    noExtensions: "No extensions installed", goToWorkshop: "Go to Workshop", searchExtensions: "Search extensions...",
    available: "Available", deprecated: "Deprecated", all: "All", installedOnly: "Installed",
    templates: "Templates", editor: "Editor", language: "Language", theme: "Theme", appearance: "Appearance",
    audio: "Audio", accessibility: "Accessibility", save: "Save", reset: "Reset", cancel: "Cancel",
    settingsTitle: "Settings", settingsSubtitle: "Customize your MusicCode Studio experience",
    noNotes: "No notes found", error: "Error", success: "Success", warning: "Warning", info: "Info",
    notes: "Notes", start: "Get Started", howItWorks: "How It Works",
  },
  "es-ES": {
    home: "Inicio", workshop: "Taller", studio: "Estudio", about: "Acerca de", settings: "Ajustes",
    installed: "instaladas", install: "Instalar", open: "Abrir", preview: "Vista previa", download: "Descargar",
    play: "Reproducir", stop: "Detener", volume: "Volumen", console: "Consola", clear: "Limpiar", copy: "Copiar",
    noExtensions: "Ninguna extensión instalada", goToWorkshop: "Ir al Taller", searchExtensions: "Buscar extensiones...",
    available: "Disponibles", deprecated: "Obsoletas", all: "Todas", installedOnly: "Instaladas",
    templates: "Plantillas", editor: "Editor", language: "Idioma", theme: "Tema", appearance: "Apariencia",
    audio: "Audio", accessibility: "Accesibilidad", save: "Guardar", reset: "Restablecer", cancel: "Cancelar",
    settingsTitle: "Ajustes", settingsSubtitle: "Personaliza tu experiencia en MusicCode Studio",
    noNotes: "No se encontraron notas", error: "Error", success: "Éxito", warning: "Advertencia", info: "Info",
    notes: "Notas", start: "Comenzar", howItWorks: "Cómo Funciona",
  },
  "fr-FR": {
    home: "Accueil", workshop: "Atelier", studio: "Studio", about: "À propos", settings: "Paramètres",
    installed: "installées", install: "Installer", open: "Ouvrir", preview: "Aperçu", download: "Télécharger",
    play: "Jouer", stop: "Arrêter", volume: "Volume", console: "Console", clear: "Effacer", copy: "Copier",
    noExtensions: "Aucune extension installée", goToWorkshop: "Aller à l'Atelier", searchExtensions: "Rechercher des extensions...",
    available: "Disponibles", deprecated: "Obsolètes", all: "Toutes", installedOnly: "Installées",
    templates: "Modèles", editor: "Éditeur", language: "Langue", theme: "Thème", appearance: "Apparence",
    audio: "Audio", accessibility: "Accessibilité", save: "Enregistrer", reset: "Réinitialiser", cancel: "Annuler",
    settingsTitle: "Paramètres", settingsSubtitle: "Personnalisez votre expérience MusicCode Studio",
    noNotes: "Aucune note trouvée", error: "Erreur", success: "Succès", warning: "Avertissement", info: "Info",
    notes: "Notes", start: "Commencer", howItWorks: "Comment ça marche",
  },
  "de-DE": {
    home: "Start", workshop: "Werkstatt", studio: "Studio", about: "Über", settings: "Einstellungen",
    installed: "installiert", install: "Installieren", open: "Öffnen", preview: "Vorschau", download: "Herunterladen",
    play: "Abspielen", stop: "Stoppen", volume: "Lautstärke", console: "Konsole", clear: "Leeren", copy: "Kopieren",
    noExtensions: "Keine Erweiterungen installiert", goToWorkshop: "Zur Werkstatt", searchExtensions: "Erweiterungen suchen...",
    available: "Verfügbar", deprecated: "Veraltet", all: "Alle", installedOnly: "Installiert",
    templates: "Vorlagen", editor: "Editor", language: "Sprache", theme: "Thema", appearance: "Erscheinungsbild",
    audio: "Audio", accessibility: "Barrierefreiheit", save: "Speichern", reset: "Zurücksetzen", cancel: "Abbrechen",
    settingsTitle: "Einstellungen", settingsSubtitle: "Passen Sie Ihr MusicCode Studio-Erlebnis an",
    noNotes: "Keine Noten gefunden", error: "Fehler", success: "Erfolg", warning: "Warnung", info: "Info",
    notes: "Noten", start: "Loslegen", howItWorks: "Wie es funktioniert",
  },
  "ja-JP": {
    home: "ホーム", workshop: "ワークショップ", studio: "スタジオ", about: "概要", settings: "設定",
    installed: "インストール済み", install: "インストール", open: "開く", preview: "プレビュー", download: "ダウンロード",
    play: "再生", stop: "停止", volume: "音量", console: "コンソール", clear: "クリア", copy: "コピー",
    noExtensions: "拡張機能なし", goToWorkshop: "ワークショップへ", searchExtensions: "拡張機能を検索...",
    available: "利用可能", deprecated: "非推奨", all: "すべて", installedOnly: "インストール済み",
    templates: "テンプレート", editor: "エディター", language: "言語", theme: "テーマ", appearance: "外観",
    audio: "オーディオ", accessibility: "アクセシビリティ", save: "保存", reset: "リセット", cancel: "キャンセル",
    settingsTitle: "設定", settingsSubtitle: "MusicCode Studioの体験をカスタマイズ",
    noNotes: "音符が見つかりません", error: "エラー", success: "成功", warning: "警告", info: "情報",
    notes: "音符", start: "始める", howItWorks: "使い方",
  },
};

// ─── Temas ────────────────────────────────────────────────────────────────────

export const THEMES: Record<Theme, { bg: string; surface: string; border: string; label: string; preview: string }> = {
  dark:     { bg: "#0a0a14", surface: "#0d0d1f", border: "#ffffff10", label: "Escuro", preview: "bg-[#0a0a14]" },
  darker:   { bg: "#050508", surface: "#08080f", border: "#ffffff08", label: "Mais Escuro", preview: "bg-[#050508]" },
  midnight: { bg: "#0a0f1e", surface: "#0d1428", border: "#3b82f620", label: "Meia-noite", preview: "bg-[#0a0f1e]" },
  ocean:    { bg: "#051520", surface: "#071c2c", border: "#0ea5e920", label: "Oceano", preview: "bg-[#051520]" },
  forest:   { bg: "#050f0a", surface: "#071510", border: "#22c55e20", label: "Floresta", preview: "bg-[#050f0a]" },
  sunset:   { bg: "#160810", surface: "#1c0b14", border: "#f9731620", label: "Pôr do Sol", preview: "bg-[#160810]" },
};

export const ACCENT_COLORS: Record<AccentColor, { gradient: string; text: string; ring: string; label: string; hex: string }> = {
  purple:  { gradient: "from-purple-600 to-pink-600",   text: "text-purple-400",  ring: "ring-purple-500",  label: "Roxo",    hex: "#a855f7" },
  blue:    { gradient: "from-blue-600 to-cyan-500",     text: "text-blue-400",    ring: "ring-blue-500",    label: "Azul",    hex: "#3b82f6" },
  pink:    { gradient: "from-pink-600 to-rose-500",     text: "text-pink-400",    ring: "ring-pink-500",    label: "Rosa",    hex: "#ec4899" },
  emerald: { gradient: "from-emerald-600 to-teal-500",  text: "text-emerald-400", ring: "ring-emerald-500", label: "Verde",   hex: "#10b981" },
  orange:  { gradient: "from-orange-600 to-yellow-500", text: "text-orange-400",  ring: "ring-orange-500",  label: "Laranja", hex: "#f97316" },
  red:     { gradient: "from-red-600 to-rose-500",      text: "text-red-400",     ring: "ring-red-500",     label: "Vermelho",hex: "#ef4444" },
  cyan:    { gradient: "from-cyan-600 to-sky-500",      text: "text-cyan-400",    ring: "ring-cyan-500",    label: "Ciano",   hex: "#06b6d4" },
};

export const FONT_SIZES: Record<FontSize, { label: string; base: string }> = {
  sm: { label: "Pequeno", base: "text-sm" },
  md: { label: "Médio",   base: "text-base" },
  lg: { label: "Grande",  base: "text-lg" },
  xl: { label: "Extra Grande", base: "text-xl" },
};

export const LANGUAGES: Record<Language, { label: string; flag: string; nativeName: string }> = {
  "pt-BR": { label: "Português (Brasil)", flag: "🇧🇷", nativeName: "Português" },
  "en-US": { label: "English (US)",       flag: "🇺🇸", nativeName: "English" },
  "es-ES": { label: "Español",            flag: "🇪🇸", nativeName: "Español" },
  "fr-FR": { label: "Français",           flag: "🇫🇷", nativeName: "Français" },
  "de-DE": { label: "Deutsch",            flag: "🇩🇪", nativeName: "Deutsch" },
  "ja-JP": { label: "日本語",              flag: "🇯🇵", nativeName: "日本語" },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface SettingsCtx {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
  t: (key: TranslationKey) => string;
  accent: typeof ACCENT_COLORS[AccentColor];
  themeVars: typeof THEMES[Theme];
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem("musiccode-settings");
      return saved ? { ...DEFAULT, ...JSON.parse(saved) } : DEFAULT;
    } catch { return DEFAULT; }
  });

  useEffect(() => {
    localStorage.setItem("musiccode-settings", JSON.stringify(settings));
    // Aplicar font-size no root
    const sizes = { sm: "14px", md: "16px", lg: "18px", xl: "20px" };
    document.documentElement.style.fontSize = sizes[settings.fontSize];
    // Aplicar cor de destaque como CSS var
    document.documentElement.style.setProperty("--accent", ACCENT_COLORS[settings.accentColor].hex);
  }, [settings]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const reset = () => setSettings(DEFAULT);

  const t = (key: TranslationKey) =>
    TRANSLATIONS[settings.language]?.[key] ?? TRANSLATIONS["pt-BR"][key];

  const accent = ACCENT_COLORS[settings.accentColor];
  const themeVars = THEMES[settings.theme];

  return (
    <Ctx.Provider value={{ settings, update, reset, t, accent, themeVars }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
}

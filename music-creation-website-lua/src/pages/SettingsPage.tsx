import { useState } from "react";
import {
  Settings2, Globe, Palette, Type, Volume2, Layers, Eye,
  RotateCcw, Save, Check, Monitor, Zap, Music2, Code2,
  Sun, Moon, Droplets, Leaf, Sunset, ChevronRight, AlertTriangle,
} from "lucide-react";
import {
  useSettings,
  LANGUAGES, THEMES, ACCENT_COLORS, FONT_SIZES,
  type Language, type Theme, type AccentColor, type FontSize, type AnimationLevel,
} from "../context/SettingsContext";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ icon, title, subtitle, children }: {
  icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6 bg-white/[0.02]">
        <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-gray-300">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
        ${value ? "bg-[var(--accent,#a855f7)]" : "bg-white/10"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
        transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Slider({ value, min, max, step, onChange, label }: {
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; label?: string;
}) {
  return (
    <div className="flex items-center gap-3 w-52">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[var(--accent,#a855f7)]"
      />
      <span className="text-xs font-mono text-gray-400 w-10 text-right">
        {label ?? value}
      </span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { settings, update, reset, t, accent } = useSettings();
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (showResetConfirm) {
      reset();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const THEME_ICONS: Record<Theme, React.ReactNode> = {
    dark:     <Moon size={14} />,
    darker:   <Moon size={14} />,
    midnight: <Moon size={14} />,
    ocean:    <Droplets size={14} />,
    forest:   <Leaf size={14} />,
    sunset:   <Sunset size={14} />,
  };

  const ANIM_OPTIONS: { id: AnimationLevel; label: string; desc: string }[] = [
    { id: "full",    label: "Completas",  desc: "Todas as animações ativadas" },
    { id: "reduced", label: "Reduzidas",  desc: "Animações essenciais apenas" },
    { id: "none",    label: "Nenhuma",    desc: "Sem animações (melhor performance)" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* ── Cabeçalho ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${accent.gradient}
              flex items-center justify-center shadow-lg`}>
              <Settings2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{t("settingsTitle")}</h1>
              <p className="text-xs text-gray-500">{t("settingsSubtitle")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
              transition-all
              ${showResetConfirm
                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
          >
            {showResetConfirm ? <AlertTriangle size={13} /> : <RotateCcw size={13} />}
            {showResetConfirm ? "Confirmar reset?" : t("reset")}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
              transition-all shadow-lg
              ${saved
                ? "bg-emerald-600 text-white"
                : `bg-gradient-to-r ${accent.gradient} text-white hover:opacity-90 active:scale-95`
              }`}
          >
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Salvo!" : t("save")}
          </button>
        </div>
      </div>

      <div className="space-y-5">

        {/* ══ IDIOMA ══════════════════════════════════════════════════════════ */}
        <Section icon={<Globe size={18} />} title={t("language")} subtitle="Idioma da interface do Studio">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES[Language]][]).map(([id, lang]) => (
              <button
                key={id}
                onClick={() => update("language", id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm
                  transition-all hover:scale-[1.02]
                  ${settings.language === id
                    ? `border-[var(--accent,#a855f7)] bg-[var(--accent,#a855f7)]/10 text-white`
                    : "border-white/8 bg-white/3 text-gray-400 hover:border-white/20 hover:text-gray-200"
                  }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-xs truncate">{lang.nativeName}</div>
                  <div className="text-[10px] text-gray-500 truncate">{lang.label}</div>
                </div>
                {settings.language === id && (
                  <Check size={12} className="ml-auto shrink-0" style={{ color: "var(--accent, #a855f7)" }} />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ══ APARÊNCIA ═══════════════════════════════════════════════════════ */}
        <Section icon={<Palette size={18} />} title={t("appearance")} subtitle="Tema, cores e visual da interface">

          {/* Tema */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">🎨 Tema de Fundo</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([id, theme]) => (
                <button
                  key={id}
                  onClick={() => update("theme", id)}
                  title={theme.label}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs
                    transition-all hover:scale-105
                    ${settings.theme === id
                      ? "border-[var(--accent,#a855f7)] text-white"
                      : "border-white/8 text-gray-500 hover:border-white/20"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${theme.preview} border border-white/10
                    flex items-center justify-center text-gray-400`}>
                    {THEME_ICONS[id]}
                  </div>
                  <span className="text-[10px] leading-tight text-center">{theme.label}</span>
                  {settings.theme === id && (
                    <Check size={10} style={{ color: "var(--accent, #a855f7)" }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cor de destaque */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">✨ Cor de Destaque</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([id, color]) => (
                <button
                  key={id}
                  onClick={() => update("accentColor", id)}
                  title={color.label}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold
                    transition-all hover:scale-105
                    ${settings.accentColor === id
                      ? "border-white/30 text-white"
                      : "border-white/8 text-gray-400 hover:border-white/20"
                    }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${color.gradient}`} />
                  {color.label}
                  {settings.accentColor === id && <Check size={10} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho de fonte */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              <span className="flex items-center gap-1"><Type size={12} /> Tamanho de Fonte da Interface</span>
            </p>
            <div className="flex gap-2">
              {(Object.entries(FONT_SIZES) as [FontSize, typeof FONT_SIZES[FontSize]][]).map(([id, fs]) => (
                <button
                  key={id}
                  onClick={() => update("fontSize", id)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all hover:scale-105
                    ${settings.fontSize === id
                      ? "border-[var(--accent,#a855f7)] bg-[var(--accent,#a855f7)]/10 text-white"
                      : "border-white/8 text-gray-400 hover:border-white/20"
                    }`}
                >
                  <span className={fs.base === "text-sm" ? "text-xs" : fs.base === "text-lg" ? "text-base" : fs.base === "text-xl" ? "text-lg" : "text-sm"}>
                    Aa
                  </span>
                  <div className="text-[10px] mt-0.5">{fs.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Animações */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              <span className="flex items-center gap-1"><Zap size={12} /> Animações</span>
            </p>
            <div className="flex gap-2">
              {ANIM_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => update("animationLevel", opt.id)}
                  title={opt.desc}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all
                    ${settings.animationLevel === opt.id
                      ? "border-[var(--accent,#a855f7)] bg-[var(--accent,#a855f7)]/10 text-white"
                      : "border-white/8 text-gray-400 hover:border-white/20"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Row label="Modo Compacto" desc="Reduz espaçamentos e tamanho dos elementos para mais conteúdo na tela">
            <Toggle value={settings.compactMode} onChange={(v) => update("compactMode", v)} />
          </Row>
          <Row label="Mostrar Breadcrumb" desc="Exibe o caminho de navegação abaixo do cabeçalho">
            <Toggle value={settings.showBreadcrumb} onChange={(v) => update("showBreadcrumb", v)} />
          </Row>
        </Section>

        {/* ══ EDITOR ══════════════════════════════════════════════════════════ */}
        <Section icon={<Code2 size={18} />} title={t("editor")} subtitle="Configurações do editor de código">
          <Row label="Tamanho da Fonte do Editor" desc="Tamanho em pixels do texto no editor de código">
            <Slider
              value={settings.editorFontSize} min={10} max={24} step={1}
              onChange={(v) => update("editorFontSize", v)}
              label={`${settings.editorFontSize}px`}
            />
          </Row>
          <Row label="Tamanho do Tab" desc="Número de espaços por nível de indentação">
            <div className="flex gap-1">
              {[2, 4, 8].map((n) => (
                <button key={n} onClick={() => update("tabSize", n)}
                  className={`w-9 h-8 rounded-lg border text-xs font-mono font-bold transition-all
                    ${settings.tabSize === n
                      ? "border-[var(--accent,#a855f7)] bg-[var(--accent,#a855f7)]/10 text-white"
                      : "border-white/8 text-gray-400 hover:border-white/20"
                    }`}>{n}</button>
              ))}
            </div>
          </Row>
          <Row label="Números de Linha" desc="Mostrar numeração de linhas no editor">
            <Toggle value={settings.lineNumbers} onChange={(v) => update("lineNumbers", v)} />
          </Row>
          <Row label="Quebra de Linha Automática" desc="Quebrar linhas longas automaticamente">
            <Toggle value={settings.wordWrap} onChange={(v) => update("wordWrap", v)} />
          </Row>
          <Row label="Fechar Colchetes Automaticamente" desc="Inserir ) ] } automaticamente ao abrir">
            <Toggle value={settings.autoCloseBrackets} onChange={(v) => update("autoCloseBrackets", v)} />
          </Row>
        </Section>

        {/* ══ ÁUDIO ═══════════════════════════════════════════════════════════ */}
        <Section icon={<Volume2 size={18} />} title={t("audio")} subtitle="Configurações de reprodução e player">
          <Row label="Volume Padrão" desc="Volume inicial do player ao abrir um template">
            <Slider
              value={Math.round(settings.defaultVolume * 100)} min={0} max={100} step={5}
              onChange={(v) => update("defaultVolume", v / 100)}
              label={`${Math.round(settings.defaultVolume * 100)}%`}
            />
          </Row>
          <Row label="Duração das Notas" desc="Duração padrão de cada nota em segundos">
            <Slider
              value={settings.noteDuration} min={0.1} max={1.0} step={0.05}
              onChange={(v) => update("noteDuration", v)}
              label={`${settings.noteDuration.toFixed(2)}s`}
            />
          </Row>
          <Row label="Reprodução Automática" desc="Reproduzir automaticamente ao selecionar um template">
            <Toggle value={settings.autoPlay} onChange={(v) => update("autoPlay", v)} />
          </Row>
          <Row label="Console Aberto por Padrão" desc="Mostrar o console de erros aberto ao carregar o player">
            <Toggle value={settings.showConsoleByDefault} onChange={(v) => update("showConsoleByDefault", v)} />
          </Row>
        </Section>

        {/* ══ WORKSHOP ════════════════════════════════════════════════════════ */}
        <Section icon={<Layers size={18} />} title="Workshop" subtitle="Comportamento das extensões e instalações">
          <Row label="Mostrar Extensões Descontinuadas" desc="Exibir extensões antigas que não são mais mantidas">
            <Toggle value={settings.showDeprecated} onChange={(v) => update("showDeprecated", v)} />
          </Row>
          <Row label="Atualizações Automáticas" desc="Verificar atualizações de extensões automaticamente">
            <Toggle value={settings.autoUpdate} onChange={(v) => update("autoUpdate", v)} />
          </Row>
        </Section>

        {/* ══ ACESSIBILIDADE ══════════════════════════════════════════════════ */}
        <Section icon={<Eye size={18} />} title={t("accessibility")} subtitle="Opções para melhorar a acessibilidade">
          <Row label="Alto Contraste" desc="Aumentar contraste de textos e bordas para melhor legibilidade">
            <Toggle value={settings.highContrast} onChange={(v) => update("highContrast", v)} />
          </Row>
          <Row label="Reduzir Movimento" desc="Desativar animações que podem causar desconforto">
            <Toggle value={settings.reducedMotion} onChange={(v) => update("reducedMotion", v)} />
          </Row>
        </Section>

        {/* ══ INFORMAÇÕES DO SISTEMA ══════════════════════════════════════════ */}
        <Section icon={<Monitor size={18} />} title="Sistema" subtitle="Informações sobre o ambiente e versão">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Versão", value: "1.0.0" },
              { label: "Plataforma", value: "Web Browser" },
              { label: "Web Audio API", value: typeof window !== "undefined" && window.AudioContext ? "✅ Suportada" : "❌ Não suportada" },
              { label: "Armazenamento", value: "localStorage" },
              { label: "Criado por", value: "Rhuan De Cillo Silva" },
              { label: "Tecnologia", value: "React + Vite + Tailwind" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/6 bg-white/2 px-4 py-3">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-1">{item.label}</p>
                <p className="text-xs font-mono text-gray-300">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex gap-3">
            <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-yellow-400 mb-1">Dados Locais</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Todas as configurações e extensões instaladas são salvas no seu navegador (localStorage).
                Limpar os dados do navegador irá redefinir tudo para o padrão.
              </p>
            </div>
          </div>
        </Section>

        {/* ══ PREVIEW DAS CONFIGURAÇÕES ═══════════════════════════════════════ */}
        <Section icon={<Sun size={18} />} title="Preview das Configurações" subtitle="Veja como ficará a interface com as configurações atuais">
          <div className="rounded-xl overflow-hidden border border-white/8">
            {/* Mini header */}
            <div className="bg-white/5 border-b border-white/6 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${accent.gradient} flex items-center justify-center`}>
                  <Music2 size={12} className="text-white" />
                </div>
                <span className="text-xs font-bold text-white">MusicCode Studio</span>
              </div>
              <div className="flex gap-1">
                {["Início", "Workshop", "Studio"].map((n) => (
                  <div key={n} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-500">{n}</div>
                ))}
              </div>
            </div>

            {/* Mini content */}
            <div className="p-4 space-y-3">
              <div className={`h-2 w-3/4 rounded-full bg-gradient-to-r ${accent.gradient} opacity-80`} />
              <div className="h-2 w-1/2 rounded-full bg-white/10" />
              <div className="h-2 w-2/3 rounded-full bg-white/6" />

              <div className="flex gap-2 mt-4">
                <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${accent.gradient} text-white text-[10px] font-bold`}>
                  Botão Primário
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-gray-400 text-[10px]">
                  Secundário
                </div>
              </div>

              <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${accent.text}`}>
                <ChevronRight size={10} /> Cor de destaque: {ACCENT_COLORS[settings.accentColor].label}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: `var(--accent, #a855f7)` }} />
                <span className="text-[10px] text-gray-500">
                  Idioma: {LANGUAGES[settings.language].flag} {LANGUAGES[settings.language].nativeName}
                </span>
              </div>
            </div>
          </div>
        </Section>

      </div>

      {/* ── Footer de ações ── */}
      <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-white/6">
        <p className="text-xs text-gray-600">
          As configurações são salvas automaticamente no seu navegador.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all
              ${showResetConfirm
                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                : "bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <RotateCcw size={13} />
            {showResetConfirm ? "Confirmar?" : "Resetar Tudo"}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold shadow-lg
              transition-all active:scale-95
              ${saved
                ? "bg-emerald-600 text-white"
                : `bg-gradient-to-r ${accent.gradient} text-white hover:opacity-90`
              }`}
          >
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Salvo!" : "Salvar Configurações"}
          </button>
        </div>
      </div>
    </div>
  );
}

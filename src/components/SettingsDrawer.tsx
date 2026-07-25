/**
 * SettingsDrawer — gaveta lateral para personalizar TODO o design.
 * Cor de destaque (predefinidas + personalizada), animação de fundo, velocidade,
 * movimento reduzido, tamanho da fonte e salvamento automático.
 */
import { useState } from "react";
import { X, RotateCcw, ShieldAlert } from "lucide-react";
import { useSettings, type BgType } from "../context/SettingsContext";
import { UnsafeConfirmModal } from "./UnsafeConfirmModal";

const BG_OPTIONS: { id: BgType; label: string; icon: string }[] = [
  { id: "none", label: "Nenhuma", icon: "∅" },
  { id: "particles", label: "Partículas", icon: "✦" },
  { id: "waves", label: "Ondas", icon: "〜" },
  { id: "aurora", label: "Aurora", icon: "◌" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      data-sfx="toggle"
      onClick={() => onChange(!on)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${on ? "" : "bg-white/10"}`}
      style={on ? { background: "var(--color-brand)" } : undefined}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <div className="text-[13px] text-white">{title}</div>
        {desc && <div className="text-[11px] text-faint leading-snug">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export function SettingsDrawer() {
  const { settings, update, reset, presets, accent, drawerOpen, closeDrawer } = useSettings();
  const [showUnsafe, setShowUnsafe] = useState(false);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60 animate-overlayIn" data-sfx="close" onClick={closeDrawer} />

      {/* painel */}
      <aside className="relative w-[340px] max-w-[90vw] bg-panel border-l border-line h-full overflow-auto animate-slideIn shadow-2xl">
        <div className="sticky top-0 bg-panel/90 backdrop-blur border-b border-line px-5 h-14 flex items-center justify-between z-10">
          <h2 className="text-[15px] font-bold text-white">Configurações</h2>
          <button onClick={closeDrawer} data-sfx="close" className="text-muted hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-6">
          {/* Cor de destaque */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">Cor de destaque</h3>
            <div className="grid grid-cols-7 gap-2 mb-3">
              {presets.map((p) => (
                <button
                  key={p.id}
                  title={p.name}
                  onClick={() => update({ accentId: p.id, customAccent: null })}
                  className={`aspect-square rounded-lg transition-all ${settings.accentId === p.id && !settings.customAccent ? "ring-2 ring-offset-2 ring-offset-panel scale-105" : "opacity-70 hover:opacity-100"}`}
                  style={{ background: p.hex, boxShadow: settings.accentId === p.id && !settings.customAccent ? `0 0 0 1.5px ${p.hex}` : undefined }}
                />
              ))}
            </div>
            <label className="flex items-center gap-2 text-[12px] text-muted">
              <span className="shrink-0">Personalizada:</span>
              <input
                type="color"
                value={accent.hex}
                onChange={(e) => update({ customAccent: e.target.value })}
                className="w-8 h-8 rounded bg-transparent cursor-pointer border border-line"
              />
              <input
                type="text"
                value={accent.hex}
                onChange={(e) => update({ customAccent: e.target.value })}
                className="flex-1 min-w-0 bg-card border border-line rounded-lg px-2 py-1.5 text-[12px] text-white font-mono outline-none focus:border-[var(--color-brand)]"
              />
            </label>
          </section>

          {/* Fundo animado */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">Fundo animado</h3>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {BG_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => update({ bgType: o.id, bgEnabled: o.id !== "none" })}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-[11px] transition-all ${
                    settings.bgType === o.id ? "text-white" : "text-muted border-line hover:text-white"
                  }`}
                  style={settings.bgType === o.id ? { borderColor: "var(--color-brand)", background: "color-mix(in srgb, var(--color-brand) 14%, transparent)" } : undefined}
                >
                  <span className="text-[15px]">{o.icon}</span>{o.label}
                </button>
              ))}
            </div>
            <Row title="Ativar animação" desc="Mostrar o fundo animado nas páginas.">
              <Toggle on={settings.bgEnabled} onChange={(v) => update({ bgEnabled: v })} />
            </Row>
            <Row title={`Velocidade · ${settings.bgSpeed.toFixed(1)}x`}>
              <input type="range" min={0.3} max={2} step={0.1} value={settings.bgSpeed}
                onChange={(e) => update({ bgSpeed: Number(e.target.value) })}
                className="w-28 accent-[var(--color-brand)]" />
            </Row>
            <Row title="Movimento reduzido" desc="Menos animação (acessibilidade).">
              <Toggle on={settings.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
            </Row>
          </section>

          {/* Editor */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">Editor</h3>
            <Row title={`Tamanho da fonte · ${settings.editorFontSize}px`}>
              <input type="range" min={11} max={20} value={settings.editorFontSize}
                onChange={(e) => update({ editorFontSize: Number(e.target.value) })}
                className="w-28 accent-[var(--color-brand)]" />
            </Row>
          </section>

          {/* Som */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">Efeitos sonoros</h3>
            <Row title="Ativar sons da interface" desc="Cliques, painéis e transições.">
              <Toggle on={settings.sfxEnabled} onChange={(v) => update({ sfxEnabled: v })} />
            </Row>
            <Row title={`Volume · ${Math.round(settings.sfxVolume * 100)}%`}>
              <input type="range" min={0} max={1} step={0.01} value={settings.sfxVolume}
                onChange={(e) => update({ sfxVolume: Number(e.target.value) })}
                className="w-28 accent-[var(--color-brand)]" />
            </Row>
            <button
              data-sfx="success"
              className="mt-2 w-full py-2 rounded-lg text-[12px] font-medium text-white border border-line hover:bg-white/[0.04] transition-colors"
            >
              🔊 Testar som
            </button>
          </section>

          {/* Segurança HTML */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3 flex items-center gap-1.5">
              <ShieldAlert size={12} /> Segurança HTML
            </h3>
            <Row
              title="Modo sem segurança"
              desc="Permite que HTMLs personalizados usem rede, downloads e código remoto. Perigoso."
            >
              <Toggle
                on={settings.htmlUnsafeMode}
                onChange={(v) => (v ? setShowUnsafe(true) : update({ htmlUnsafeMode: false }))}
              />
            </Row>
            {settings.htmlUnsafeMode && (
              <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/[0.07] p-2.5 text-[11px] text-amber-200/80 leading-snug">
                ⚠️ Segurança desativada. HTMLs personalizados têm acesso total — use apenas com conteúdo confiável.
              </div>
            )}
          </section>

          {/* Arquivos */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint mb-3">Arquivos</h3>
            <Row title="Salvamento automático" desc="Salva suas músicas no navegador.">
              <Toggle on={settings.autoSave} onChange={(v) => update({ autoSave: v })} />
            </Row>
          </section>

          {/* Reset */}
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 text-[12px] text-muted hover:text-white"
          >
            <RotateCcw size={13} /> Restaurar padrão
          </button>
        </div>
      </aside>

      <UnsafeConfirmModal
        open={showUnsafe}
        onCancel={() => setShowUnsafe(false)}
        onConfirm={() => { update({ htmlUnsafeMode: true }); setShowUnsafe(false); }}
      />
    </div>
  );
}

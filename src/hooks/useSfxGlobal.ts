/**
 * useSfxGlobal — captura cliques/toques no documento e toca o efeito sonoro
 * correspondente. Sons são atribuídos via `data-sfx` (ou o padrão "click"
 * para botões/links). Inputs (sliders, cor, texto) são ignorados.
 */
import { useEffect } from "react";
import { sfx } from "../engine/sfx";
import { useSettings } from "../context/SettingsContext";

const SFX_MAP: Record<string, () => void> = {
  click: () => sfx.click(),
  toggle: () => sfx.toggle(),
  open: () => sfx.open(),
  close: () => sfx.close(),
  nav: () => sfx.nav(),
  play: () => sfx.play(),
  success: () => sfx.success(),
  error: () => sfx.error(),
};

export function useSfxGlobal(): void {
  const { settings } = useSettings();

  // sincroniza habilitado/volume
  useEffect(() => {
    sfx.setEnabled(settings.sfxEnabled);
    sfx.setVolume(settings.sfxVolume);
  }, [settings.sfxEnabled, settings.sfxVolume]);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest("[data-sfx], button, a, [role='button'], [role='switch']") as HTMLElement | null;
      if (!el) return;
      if (el.matches("input, select, textarea")) return;
      const type = el.getAttribute("data-sfx");
      if (type === "none") return;
      const fn = type ? SFX_MAP[type] : undefined;
      if (fn) fn();
      else sfx.click();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);
}

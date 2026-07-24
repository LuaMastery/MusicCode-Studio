/**
 * SettingsPanel — configurações do Studio (salvamento automático, fonte, limpar).
 */
import { Trash2 } from "lucide-react";

interface Props {
  autoSave: boolean;
  onAutoSave: (v: boolean) => void;
  fontSize: number;
  onFontSize: (v: number) => void;
  onClearFiles: () => void;
}

export function SettingsPanel({ autoSave, onAutoSave, fontSize, onFontSize, onClearFiles }: Props) {
  return (
    <div className="w-60 bg-[#131319] shrink-0 flex flex-col border-r border-black/40">
      <div className="h-9 flex items-center px-3 text-[11px] font-bold tracking-widest text-[#bbbbbb] uppercase shrink-0">
        Configurações
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Salvamento automático */}
        <div>
          <div className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide mb-2">Arquivos</div>
          <label className="flex items-center justify-between text-[12px] text-[#cccccc] cursor-pointer">
            <span>Salvamento automático</span>
            <button
              onClick={() => onAutoSave(!autoSave)}
              className={`relative w-9 h-5 rounded-full transition-colors ${autoSave ? "bg-[#7c5cff]" : "bg-[#5a5a5a]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${autoSave ? "left-[18px]" : "left-0.5"}`} />
            </button>
          </label>
          <p className="text-[10px] text-[#858585] mt-1">
            {autoSave ? "Suas músicas são salvas automaticamente." : "Use Ctrl+S para salvar manualmente."}
          </p>
        </div>

        {/* Tamanho da fonte */}
        <div>
          <div className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide mb-2">Editor</div>
          <label className="flex items-center justify-between text-[12px] text-[#cccccc]">
            <span>Tamanho da fonte</span>
            <span className="text-[#858585]">{fontSize}px</span>
          </label>
          <input
            type="range" min={11} max={20} value={fontSize}
            onChange={(e) => onFontSize(Number(e.target.value))}
            className="w-full mt-1 accent-[#8b5cf6]"
          />
        </div>

        {/* Zona de risco */}
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={() => { if (confirm("Apagar todos os seus arquivos? Esta ação não pode ser desfeita.")) onClearFiles(); }}
            className="flex items-center gap-2 text-[12px] text-[#f48771] hover:text-[#ff6b6b]"
          >
            <Trash2 size={14} /> Limpar meus arquivos
          </button>
        </div>
      </div>
    </div>
  );
}

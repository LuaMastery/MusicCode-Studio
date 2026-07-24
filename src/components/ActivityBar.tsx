/**
 * ActivityBar — faixa vertical de ícones à esquerda (estilo VS Code).
 * Cada ícone abre uma "visão" no painel lateral; clicar no ativo recolhe o painel.
 */
import { Files, Search, Music2, Bug, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

const ITEMS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: "explorer", icon: Files, label: "Explorador" },
  { id: "search", icon: Search, label: "Buscar" },
  { id: "music", icon: Music2, label: "Música" },
  { id: "run", icon: Bug, label: "Executar / Console" },
];

export function ActivityBar({ active, onSelect }: Props) {
  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center shrink-0 border-r border-black/40">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            title={it.label}
            onClick={() => onSelect(it.id)}
            className={`relative w-12 h-12 flex items-center justify-center transition-colors ${
              isActive ? "text-white" : "text-[#858585] hover:text-white"
            }`}
          >
            {isActive && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />}
            <Icon size={22} strokeWidth={1.5} />
          </button>
        );
      })}

      <div className="mt-auto">
        <button
          title="Configurações"
          onClick={() => onSelect("settings")}
          className={`relative w-12 h-12 flex items-center justify-center transition-colors ${
            active === "settings" ? "text-white" : "text-[#858585] hover:text-white"
          }`}
        >
          {active === "settings" && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />}
          <Settings size={22} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

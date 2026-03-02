import { Eye, Code2, Play } from "lucide-react";
import { Template } from "../data/templates";

interface Props {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

const langConfig = {
  lua:  { label: "Lua",  color: "bg-blue-500/20 text-blue-300 border-blue-500/40",  dot: "bg-blue-400"   },
  java: { label: "Java", color: "bg-orange-500/20 text-orange-300 border-orange-500/40", dot: "bg-orange-400" },
  html: { label: "HTML", color: "bg-pink-500/20 text-pink-300 border-pink-500/40",  dot: "bg-pink-400"   },
};

export default function TemplateCard({ template, isSelected, onSelect, onPreview }: Props) {
  const cfg = langConfig[template.language];

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
          : "border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/8"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-md shadow-purple-400/50" />
      )}

      {/* Preview emoji */}
      <div className="text-3xl mb-3 select-none">
        {template.preview?.split(" ")[0] || "🎵"}
      </div>

      {/* Badge de linguagem */}
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold border rounded-full px-2.5 py-0.5 mb-2 ${cfg.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </div>

      <h3 className="font-bold text-white text-sm leading-tight mb-1">{template.name}</h3>
      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{template.description}</p>

      {/* Ações */}
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="flex items-center gap-1.5 text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1.5 rounded-full transition-colors"
        >
          <Code2 size={11} />
          Editar
        </button>
        {template.language === "html" && (
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="flex items-center gap-1.5 text-xs bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 px-3 py-1.5 rounded-full transition-colors"
          >
            <Eye size={11} />
            Preview
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="flex items-center gap-1.5 text-xs bg-green-500/20 hover:bg-green-500/40 text-green-300 px-3 py-1.5 rounded-full transition-colors"
        >
          <Play size={11} />
          Usar
        </button>
      </div>
    </div>
  );
}

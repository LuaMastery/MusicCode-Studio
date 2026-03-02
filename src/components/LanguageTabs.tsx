import { Language } from "../data/templates";

interface Props {
  active: Language | "all";
  onChange: (lang: Language | "all") => void;
}

const tabs: { key: Language | "all"; label: string; emoji: string; color: string }[] = [
  { key: "all",  label: "Todos",  emoji: "🎵", color: "from-purple-500 to-pink-500" },
  { key: "lua",  label: "Lua",    emoji: "🌙", color: "from-blue-500 to-cyan-500"   },
  { key: "java", label: "Java",   emoji: "☕", color: "from-orange-500 to-amber-500" },
  { key: "html", label: "HTML",   emoji: "🌐", color: "from-pink-500 to-rose-500"   },
];

export default function LanguageTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${
            active === t.key
              ? `bg-gradient-to-r ${t.color} text-white shadow-lg scale-105`
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
          }`}
        >
          <span>{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

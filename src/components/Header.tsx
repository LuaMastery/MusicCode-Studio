import { Music2, Code2, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] border-b border-purple-900/40">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#ec4899" : "#60a5fa",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Music2 size={24} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0f0c29] animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Music<span className="text-purple-400">Code</span>{" "}
              <span className="text-pink-400">Studio</span>
            </h1>
            <p className="text-xs text-purple-300/70 tracking-widest uppercase">
              Create Music With Code
            </p>
          </div>
        </div>

        {/* Tags de linguagem */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1.5">
            <Code2 size={13} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-400">Lua</span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full px-3 py-1.5">
            <Code2 size={13} className="text-orange-400" />
            <span className="text-xs font-bold text-orange-400">Java</span>
          </div>
          <div className="flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full px-3 py-1.5">
            <Code2 size={13} className="text-pink-400" />
            <span className="text-xs font-bold text-pink-400">HTML</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-1.5">
            <Zap size={13} className="text-purple-400" />
            <span className="text-xs font-bold text-purple-400">Web Audio API</span>
          </div>
        </div>
      </div>
    </header>
  );
}

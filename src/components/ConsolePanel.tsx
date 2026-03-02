import { useEffect, useRef } from "react";
import { Terminal, Trash2, Copy, Check, AlertTriangle, XCircle, Info, CheckCircle } from "lucide-react";
import { useState } from "react";

export type LogLevel = "info" | "success" | "warning" | "error";

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  code?: string;
  timestamp: string;
}

interface Props {
  logs: LogEntry[];
  onClear: () => void;
  accentColor?: "blue" | "orange" | "pink" | "green" | "yellow";
}

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const ICONS: Record<LogLevel, { icon: React.FC<any>; color: string; bg: string; prefix: string }> = {
  info:    { icon: Info,         color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",   prefix: "ℹ" },
  success: { icon: CheckCircle,  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20", prefix: "✓" },
  warning: { icon: AlertTriangle,color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", prefix: "⚠" },
  error:   { icon: XCircle,      color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",     prefix: "✗" },
};

const ACCENT_STYLES: Record<string, { border: string; bg: string; title: string; badge: string }> = {
  blue:   { border: "border-blue-500/30",   bg: "bg-blue-950/30",   title: "text-blue-400",   badge: "bg-blue-500/20 border-blue-500/30 text-blue-300"   },
  orange: { border: "border-orange-500/30", bg: "bg-orange-950/20", title: "text-orange-400", badge: "bg-orange-500/20 border-orange-500/30 text-orange-300" },
  pink:   { border: "border-pink-500/30",   bg: "bg-pink-950/20",   title: "text-pink-400",   badge: "bg-pink-500/20 border-pink-500/30 text-pink-300"   },
  green:  { border: "border-green-500/30",  bg: "bg-green-950/20",  title: "text-green-400",  badge: "bg-green-500/20 border-green-500/30 text-green-300"  },
  yellow: { border: "border-yellow-500/30", bg: "bg-yellow-950/20", title: "text-yellow-400", badge: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300" },
};

export default function ConsolePanel({ logs, onClear, accentColor = "blue" }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const style = ACCENT_STYLES[accentColor];

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleCopyAll = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}${l.code ? `\n  Código: ${l.code}` : ""}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const errorCount  = logs.filter((l) => l.level === "error").length;
  const warnCount   = logs.filter((l) => l.level === "warning").length;
  const successCount= logs.filter((l) => l.level === "success").length;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden mt-4`}>
      
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/30 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal size={15} className={style.title} />
          <span className="text-sm font-bold text-white">Console</span>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-1.5 ml-1">
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 font-mono">
              <XCircle size={10} />
              {errorCount} erro{errorCount !== 1 ? "s" : ""}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-mono">
              <AlertTriangle size={10} />
              {warnCount} aviso{warnCount !== 1 ? "s" : ""}
            </span>
          )}
          {successCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-mono">
              <CheckCircle size={10} />
              {successCount} ok
            </span>
          )}
          {logs.length === 0 && (
            <span className="text-xs text-gray-600 font-mono">aguardando...</span>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {logs.length > 0 && (
            <>
              <button
                onClick={handleCopyAll}
                title="Copiar todos os logs"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-all"
              >
                {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={onClear}
                title="Limpar console"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Trash2 size={11} />
                Limpar
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Log area ── */}
      <div
        className="font-mono text-xs overflow-y-auto p-3 space-y-1.5"
        style={{ minHeight: "180px", maxHeight: "300px" }}
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-700">
            <Terminal size={28} className="opacity-30" />
            <span className="text-gray-600">Nenhuma saída ainda.</span>
            <span className="text-gray-700 text-[11px]">Clique em ▶ Reproduzir para iniciar.</span>
          </div>
        ) : (
          logs.map((entry) => {
            const meta = ICONS[entry.level];
            const Icon = meta.icon;
            return (
              <div
                key={entry.id}
                className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2 ${meta.bg} transition-all animate-fadeIn`}
              >
                <div className="flex items-start gap-2">
                  <Icon size={12} className={`mt-0.5 shrink-0 ${meta.color}`} />
                  <span className={`${meta.color} font-semibold flex-1 leading-relaxed break-words`}>
                    {entry.message}
                  </span>
                  <span className="text-gray-600 shrink-0 text-[10px] mt-0.5">{entry.timestamp}</span>
                </div>
                {entry.code && (
                  <div className="ml-5 mt-1 bg-black/40 rounded-md px-3 py-1.5 text-red-300 border border-red-500/20">
                    <span className="text-gray-500 text-[10px] mr-2">código:</span>
                    <span className="font-bold">{entry.code}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ── Hook para gerenciar logs ───────────────────────────────────────────────────
let _id = 0;

export function useConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const push = (level: LogLevel, message: string, code?: string) => {
    const entry: LogEntry = { id: ++_id, level, message, code, timestamp: getTime() };
    setLogs((prev) => [...prev, entry]);
  };

  return {
    logs,
    clearLogs: () => setLogs([]),
    info:    (msg: string, code?: string) => push("info",    msg, code),
    success: (msg: string, code?: string) => push("success", msg, code),
    warn:    (msg: string, code?: string) => push("warning", msg, code),
    error:   (msg: string, code?: string) => push("error",   msg, code),
  };
}

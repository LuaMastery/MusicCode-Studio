import { useState } from "react";
import {
  Download, CheckCircle2, AlertTriangle, Star,
  Package, Zap, Search, Filter, ChevronDown, ChevronUp,
  Clock, Users, HardDrive, XCircle, ArrowRight,
} from "lucide-react";
import {
  extensions, type Extension, type LangId,
} from "../data/workshop";

interface Props {
  installed: Set<LangId>;
  onInstall: (id: LangId) => void;
  onOpenStudio: (lang?: LangId) => void;
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(n) ? "text-yellow-400 fill-yellow-400" : "text-gray-700"}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{n.toFixed(1)}</span>
    </div>
  );
}

function Badge({ status }: { status: Extension["status"] }) {
  if (status === "installed")
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={11} /> Instalada
      </span>
    );
  if (status === "deprecated")
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-full">
        <AlertTriangle size={11} /> Descontinuada
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-full">
      <Package size={11} /> Disponível
    </span>
  );
}

function ExtCard({
  ext,
  isInstalled,
  onInstall,
  onOpen,
}: {
  ext: Extension;
  isInstalled: boolean;
  onInstall: () => void;
  onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const actualStatus = isInstalled ? "installed" : ext.status;

  return (
    <div
      className={`rounded-2xl border ${ext.border} ${ext.bg} p-5 flex flex-col gap-4
        transition-all duration-200 hover:shadow-lg hover:shadow-black/30
        ${ext.deprecated ? "opacity-70" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ext.color} flex items-center justify-center text-2xl shrink-0 shadow-lg`}
        >
          {ext.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-black text-white">{ext.name}</h3>
            <span className="text-xs text-gray-600 font-mono">v{ext.version}</span>
            {ext.featured && !ext.deprecated && (
              <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">
                ⭐ Destaque
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-2">{ext.description}</p>
          <Stars n={ext.rating} />
        </div>
        <Badge status={actualStatus} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
        <span className="flex items-center gap-1">
          <HardDrive size={11} /> {ext.size}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} /> {ext.downloads} downloads
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> por {ext.author}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {ext.tags.map((t) => (
          <span
            key={t}
            className={`text-xs px-2 py-0.5 rounded-full border ${ext.badge}`}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Deprecated warning */}
      {ext.deprecated && (
        <div className="flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-3">
          <AlertTriangle size={14} className="text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-yellow-400 mb-0.5">Extensão Descontinuada</p>
            <p className="text-xs text-gray-500">{ext.deprecatedReason}</p>
          </div>
        </div>
      )}

      {/* Long desc toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? "Menos detalhes" : "Mais detalhes"}
      </button>

      {expanded && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 leading-relaxed">{ext.longDescription}</p>
          <div className="grid grid-cols-1 gap-1.5">
            {ext.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${ext.color} shrink-0`} />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        {actualStatus === "installed" ? (
          <button
            onClick={onOpen}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-gradient-to-r ${ext.color} text-white font-bold text-sm
              hover:opacity-90 active:scale-95 transition-all shadow-lg`}
          >
            <ArrowRight size={15} /> Abrir no Studio
          </button>
        ) : ext.deprecated ? (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-white/5 text-gray-600 font-bold text-sm cursor-not-allowed"
          >
            <XCircle size={15} /> Descontinuada
          </button>
        ) : (
          <button
            onClick={onInstall}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-gradient-to-r ${ext.color} text-white font-bold text-sm
              hover:opacity-90 active:scale-95 transition-all shadow-lg`}
          >
            <Download size={15} /> Instalar
          </button>
        )}
      </div>
    </div>
  );
}

type FilterTab = "all" | "installed" | "available" | "deprecated";

export default function WorkshopPage({ installed, onInstall, onOpenStudio }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [installing, setInstalling] = useState<LangId | null>(null);

  const handleInstall = (id: LangId) => {
    setInstalling(id);
    setTimeout(() => {
      onInstall(id);
      setInstalling(null);
    }, 1200);
  };

  const filtered = extensions.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.tags.some((t) => t.includes(q));

    const actualStatus = installed.has(e.id) ? "installed" : e.status;
    const matchFilter =
      filter === "all" ||
      (filter === "installed" && actualStatus === "installed") ||
      (filter === "available" && actualStatus === "available") ||
      (filter === "deprecated" && actualStatus === "deprecated");

    return matchSearch && matchFilter;
  });

  const counts = {
    all: extensions.length,
    installed: extensions.filter((e) => installed.has(e.id)).length,
    available: extensions.filter((e) => !installed.has(e.id) && e.status === "available").length,
    deprecated: extensions.filter((e) => e.status === "deprecated").length,
  };

  const TABS: { id: FilterTab; label: string; color: string }[] = [
    { id: "all",        label: "Todas",          color: "from-purple-600 to-pink-600" },
    { id: "installed",  label: "Instaladas",      color: "from-emerald-600 to-green-500" },
    { id: "available",  label: "Disponíveis",     color: "from-blue-600 to-cyan-500" },
    { id: "deprecated", label: "Descontinuadas",  color: "from-yellow-600 to-amber-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Hero ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20
          rounded-full px-4 py-1.5 text-xs font-semibold text-purple-300 mb-5 tracking-widest uppercase">
          <Zap size={12} /> Workshop de Extensões
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
          🏪 Workshop
        </h1>
        <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          Instale suporte a novas linguagens de programação musical.<br />
          A linguagem <span className="text-purple-400 font-bold">MusicCode</span> já vem instalada.
          Outras estão disponíveis ou descontinuadas.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total",          value: counts.all,        color: "text-purple-400", icon: "📦" },
          { label: "Instaladas",     value: counts.installed,  color: "text-emerald-400", icon: "✅" },
          { label: "Disponíveis",    value: counts.available,  color: "text-blue-400",    icon: "⬇️" },
          { label: "Descontinuadas", value: counts.deprecated, color: "text-yellow-400",  icon: "⚠️" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Busca + Filtros ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar extensões..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5
              text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50
              focus:bg-white/8 transition-all"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-500 shrink-0" />
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all
                ${filter === t.id
                  ? `bg-gradient-to-r ${t.color} text-white shadow-md`
                  : "bg-white/5 text-gray-400 hover:bg-white/8 hover:text-white"
                }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full
                ${filter === t.id ? "bg-white/20" : "bg-white/10"}`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid de extensões ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold">Nenhuma extensão encontrada</p>
          <p className="text-sm mt-1">Tente outro termo de busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((ext) => (
            <div key={ext.id} className="relative">
              {/* Installing overlay */}
              {installing === ext.id && (
                <div className="absolute inset-0 z-10 rounded-2xl bg-black/70 flex flex-col
                  items-center justify-center gap-3 backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent
                    rounded-full animate-spin" />
                  <p className="text-sm font-bold text-purple-300">Instalando {ext.name}...</p>
                </div>
              )}
              <ExtCard
                ext={ext}
                isInstalled={installed.has(ext.id)}
                onInstall={() => handleInstall(ext.id)}
                onOpen={() => onOpenStudio(ext.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Aviso sobre deprecados ── */}
      <div className="mt-10 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-yellow-400 mb-1">Sobre Extensões Descontinuadas</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Extensões descontinuadas são versões antigas que não recebem mais atualizações e possuem
              limitações de compatibilidade com o ambiente web. Elas aparecem aqui apenas para referência
              histórica. Para a melhor experiência, use as extensões <strong className="text-white">disponíveis</strong> ou
              a linguagem <strong className="text-purple-400">MusicCode</strong> nativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Explorer — barra lateral estilo VS Code.
 * Duas seções: "MEUS ARQUIVOS" (criar/renomear/excluir/salvar) e "EXEMPLOS" (duplicar).
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileCode2, FilePlus2, Pencil, Trash2, Copy, Save, Lock } from "lucide-react";
import type { MusicFile } from "../hooks/useMusicFiles";

interface Props {
  userFiles: MusicFile[];
  examples: MusicFile[];
  activeId: string;
  dirtyIds: Set<string>;
  onOpen: (f: MusicFile) => void;
  onCreate: () => void;
  onSave: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function Explorer({
  userFiles, examples, activeId, dirtyIds,
  onOpen, onCreate, onSave, onRename, onDelete, onDuplicate,
}: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const startRename = (f: MusicFile) => {
    setRenamingId(f.id);
    setRenameValue(f.name);
  };
  const commitRename = () => {
    if (renamingId) onRename(renamingId, renameValue);
    setRenamingId(null);
  };

  return (
    <div className="w-60 bg-[#131319] shrink-0 flex flex-col border-r border-black/40">
      {/* Cabeçalho com ações */}
      <div className="h-9 flex items-center justify-between px-3 text-[11px] font-bold tracking-widest text-[#bbbbbb] uppercase shrink-0">
        <span>Explorador</span>
        <div className="flex items-center gap-0.5">
          <button title="Novo arquivo" onClick={onCreate} className="p-1 text-[#cccccc] hover:bg-white/10 rounded">
            <FilePlus2 size={14} />
          </button>
          <button title="Salvar (Ctrl+S)" onClick={onSave} className="p-1 text-[#cccccc] hover:bg-white/10 rounded">
            <Save size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* MEUS ARQUIVOS */}
        <div className="flex items-center justify-between group px-2 py-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#cccccc]">
            <ChevronDown size={14} />
            <span className="uppercase tracking-wide">Meus Arquivos</span>
          </div>
          <button title="Novo arquivo" onClick={onCreate} className="opacity-0 group-hover:opacity-100 p-1 text-[#cccccc] hover:bg-white/10 rounded">
            <FilePlus2 size={13} />
          </button>
        </div>

        {userFiles.length === 0 ? (
          <div className="px-5 pb-2 text-[11px] text-[#6b6b6b] italic">
            Nenhum arquivo. Clique em <span className="text-[#cccccc]">+</span> para criar.
          </div>
        ) : (
          userFiles.map((f) => (
            <FileRow
              key={f.id}
              file={f}
              active={f.id === activeId}
              dirty={dirtyIds.has(f.id)}
              renaming={renamingId === f.id}
              renameValue={renameValue}
              onRenameChange={setRenameValue}
              onRenameCommit={commitRename}
              onOpen={() => onOpen(f)}
              onStartRename={() => startRename(f)}
              onDelete={() => onDelete(f.id)}
            />
          ))
        )}

        {/* EXEMPLOS */}
        <div className="flex items-center gap-1 px-2 py-1 mt-1 text-[11px] font-bold text-[#cccccc]">
          <ChevronDown size={14} />
          <span className="uppercase tracking-wide">Exemplos</span>
        </div>
        {examples.map((f) => (
          <FileRow
            key={f.id}
            file={f}
            active={f.id === activeId}
            dirty={dirtyIds.has(f.id)}
            renaming={false}
            renameValue=""
            onRenameChange={() => {}}
            onRenameCommit={() => {}}
            onOpen={() => onOpen(f)}
            onStartRename={() => {}}
            onDuplicate={() => onDuplicate(f.id)}
            isExample
          />
        ))}
      </div>
    </div>
  );
}

interface RowProps {
  file: MusicFile;
  active: boolean;
  dirty: boolean;
  renaming: boolean;
  renameValue: string;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onOpen: () => void;
  onStartRename: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  isExample?: boolean;
}

function FileRow({
  file, active, dirty, renaming, renameValue, onRenameChange, onRenameCommit,
  onOpen, onStartRename, onDelete, onDuplicate, isExample,
}: RowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [renaming]);

  return (
    <div
      onClick={onOpen}
      className={`group relative flex items-center gap-1.5 pl-5 pr-2 py-[3px] text-[13px] cursor-pointer transition-colors ${
        active ? "bg-[#1e1e26] text-white" : "text-[#cccccc] hover:bg-[#1a1a22]"
      }`}
    >
      {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#8b5cf6]" />}
      {isExample ? (
        <Lock size={13} className="text-[#a78bfa] shrink-0" />
      ) : (
        <FileCode2 size={15} className="text-[#c4b5fd] shrink-0" />
      )}

      {renaming ? (
        <input
          ref={inputRef}
          value={renameValue}
          onChange={(e) => onRenameChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onBlur={onRenameCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRenameCommit();
            if (e.key === "Escape") onRenameCommit();
          }}
          className="flex-1 min-w-0 bg-[#1a1a22] text-white text-[12px] px-1 py-0.5 rounded outline-none border border-[#8b5cf6]"
        />
      ) : (
        <span className="flex-1 truncate">{file.name}.js</span>
      )}

      {dirty && !renaming && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}

      {/* Ações (hover) */}
      {!renaming && (
        <div className="hidden group-hover:flex items-center gap-0.5">
          {isExample ? (
            <button
              title="Duplicar para Meus Arquivos"
              onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}
              className="p-0.5 text-[#cccccc] hover:bg-white/15 rounded"
            >
              <Copy size={12} />
            </button>
          ) : (
            <>
              <button title="Renomear" onClick={(e) => { e.stopPropagation(); onStartRename(); }} className="p-0.5 text-[#cccccc] hover:bg-white/15 rounded">
                <Pencil size={12} />
              </button>
              <button title="Excluir" onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="p-0.5 text-[#cccccc] hover:bg-white/15 rounded">
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

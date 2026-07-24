/**
 * UnsafeConfirmModal — aviso de perigo ao desativar a segurança do HTML.
 * Inclui alerta anti-golpe: nenhum HTML/instrumento do site deve pedir isso.
 */
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsafeConfirmModal({ open, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 animate-overlayIn" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-panel p-6 shadow-2xl animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <ShieldAlert size={22} className="text-amber-400" />
          </span>
          <h2 className="text-lg font-bold text-white">Desativar a segurança do HTML?</h2>
        </div>

        <p className="text-[13px] text-muted leading-relaxed mb-4">
          No modo seguro (padrão), os HTMLs que você cria rodam <span className="text-white">isolados</span>:
          sem acesso ao aplicativo, sem rede, sem downloads e sem código remoto.
        </p>
        <p className="text-[13px] text-muted leading-relaxed mb-4">
          Ao desativar, os HTMLs personalizados passam a ter <span className="text-amber-300 font-semibold">acesso total</span> —
          podem acessar a internet, baixar arquivos, ler dados e executar código arbitrário.
          Isso é <span className="text-amber-300 font-semibold">potencialmente perigoso</span>.
        </p>

        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.07] p-3 mb-5">
          <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-red-200/90 leading-snug">
            <span className="font-bold text-red-300">Cuidado com golpes:</span> se algum HTML,
            instrumento ou "site" dentro do Sonora pedir para você{" "}
            <span className="font-semibold">desativar a segurança</span>, desconfie — pode ser golpe.
            HTMLs confiáveis não precisam disso.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            data-sfx="close"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white border border-line hover:bg-white/[0.04]"
          >
            Manter seguro
          </button>
          <button
            data-sfx="error"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white bg-red-600 hover:bg-red-500"
          >
            Entendi, desativar
          </button>
        </div>
      </div>
    </div>
  );
}

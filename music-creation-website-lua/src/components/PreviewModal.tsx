import { X, RefreshCw } from "lucide-react";
import { useRef } from "react";

interface Props {
  html: string;
  onClose: () => void;
}

export default function PreviewModal({ html, onClose }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-5xl h-[90vh] bg-[#0d0d1a] rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#161b22] border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-bold text-white">🌐 Preview ao Vivo</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors"
            >
              <RefreshCw size={12} />
              Atualizar
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-full transition-colors"
            >
              <X size={12} />
              Fechar
            </button>
          </div>
        </div>

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          srcDoc={html}
          className="flex-1 w-full bg-white"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

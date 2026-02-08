
import React from 'react';
import { X, Smartphone, Globe, Share2, QrCode } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DJ Set Manager',
          text: 'Sube tus canciones para el show aquí:',
          url: appUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(appUrl);
      alert('Link copiado al portapapeles');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative overflow-hidden border-violet-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Smartphone size={32} className="text-violet-400" />
          </div>
          
          <h2 className="text-2xl font-bold">Cómo usar en el celular</h2>
          
          <div className="space-y-4 text-left">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-violet-500 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">1</div>
              <p className="text-slate-300 text-sm">Copia el link de esta página o usa el botón de compartir abajo.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-violet-500 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">2</div>
              <p className="text-slate-300 text-sm">Envíalo a las artistas por WhatsApp o escanea este código.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-violet-500 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">3</div>
              <p className="text-slate-300 text-sm">Ellas abren el link en su celular y eligen <b>"TU CANCIÓN"</b>.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl w-40 h-40 mx-auto flex items-center justify-center shadow-lg shadow-violet-500/20">
            {/* Simple QR Mockup */}
            <QrCode size={120} className="text-slate-900" />
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleShare}
              className="w-full bg-violet-600 hover:bg-violet-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Share2 size={18} />
              COMPARTIR LINK
            </button>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">El link es el mismo para todos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

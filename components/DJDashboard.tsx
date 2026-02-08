
import React, { useState, useEffect } from 'react';
import { DancerProfile, SyncStatus } from '../types';
import { Search, ListMusic, Brain, CheckCircle, Clock, Trash2, Copy, RefreshCcw, Check, Cloud, CloudOff, Share2 } from 'lucide-react';
import { getMusicAdvice } from '../services/geminiService';
import ShareModal from './ShareModal';

interface DJDashboardProps {
  dancers: DancerProfile[];
  onDeleteDancer: (id: string) => void;
  syncStatus: SyncStatus;
}

const DJDashboard: React.FC<DJDashboardProps> = ({ dancers, onDeleteDancer, syncStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const filteredDancers = dancers.filter(d => 
    d.stageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAskAi = async () => {
    if (dancers.length === 0) return;
    setLoadingAi(true);
    setCopied(false);
    try {
      const advice = await getMusicAdvice(dancers);
      setAiAnalysis(advice);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopy = () => {
    if (aiAnalysis) {
      navigator.clipboard.writeText(aiAnalysis).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
              DJ Control
            </h1>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              syncStatus.status === 'syncing' ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {syncStatus.status === 'syncing' ? <Cloud size={12} /> : <Cloud size={12} />}
              {syncStatus.status === 'syncing' ? 'Sincronizando...' : 'En la nube'}
            </div>
          </div>
          <p className="text-slate-400 text-sm">Gestionando {dancers.length} perfiles en tiempo real</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full font-medium transition-colors border border-slate-700"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Compartir App</span>
          </button>
          <button 
            onClick={handleAskAi}
            disabled={loadingAi || dancers.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50 shadow-lg shadow-violet-900/20"
          >
            <Brain size={18} />
            {loadingAi ? '...' : 'AI Advice'}
          </button>
        </div>
      </header>

      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Buscar artista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none w-full text-slate-200 transition-all"
        />
      </div>

      {aiAnalysis && (
        <div className="glass-panel p-6 rounded-3xl border-l-4 border-violet-500 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-violet-400">
              <Brain size={20} />
              Sugerencias del Show
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <button 
                onClick={handleAskAi}
                disabled={loadingAi}
                className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition-colors"
              >
                <RefreshCcw size={14} className={loadingAi ? 'animate-spin' : ''} />
                Regenerar
              </button>
              <button onClick={() => setAiAnalysis(null)} className="text-slate-500 hover:text-white transition-colors text-2xl px-2">&times;</button>
            </div>
          </div>
          <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50 max-h-[400px] overflow-y-auto custom-scrollbar">
            {aiAnalysis}
          </div>
        </div>
      )}

      {filteredDancers.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/30 rounded-[40px] border-2 border-dashed border-slate-800">
          <ListMusic size={64} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-xl font-medium text-slate-400">No hay listas registradas.</h3>
          <p className="text-slate-600 mt-2">Usa el botón "Compartir App" para enviar el link.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDancers.map((dancer) => (
            <div key={dancer.id} className="glass-panel rounded-3xl overflow-hidden hover:border-violet-500/50 transition-all group hover:shadow-2xl hover:shadow-violet-500/5">
              <div className="bg-slate-800/30 p-5 flex justify-between items-center border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {dancer.stageName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-none mb-1">{dancer.stageName}</h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock size={10} /> ACTUALIZADO {new Date(dancer.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { if(confirm('¿Eliminar perfil?')) onDeleteDancer(dancer.id); }}
                  className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="p-5 grid grid-cols-1 gap-4">
                {dancer.sets.map((set) => (
                  <div key={set.id} className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800/30">
                    <h4 className="text-[10px] font-black text-violet-500/80 uppercase tracking-[0.2em] mb-3">Set {set.id}</h4>
                    <div className="space-y-2">
                      {set.songs.map((song, i) => (
                        <div key={song.id} className="flex flex-col">
                          <p className="text-sm font-bold text-slate-200 truncate">{song.title || 'Pendiente...'}</p>
                          <p className="text-[11px] text-slate-500 truncate">{song.artist || 'Artista no definido'}</p>
                          {i === 0 && <div className="h-px bg-slate-800/50 my-2"></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-5 pt-0">
                <button className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <CheckCircle size={16} />
                  Marcar como Tocado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};

export default DJDashboard;

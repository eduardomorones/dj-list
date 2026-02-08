
import React, { useState, useEffect } from 'react';
import { UserRole, DancerProfile, SyncStatus } from './types';
import DancerView from './components/DancerView';
import DJDashboard from './components/DJDashboard';
import { Layout, Users, Headphones, LogOut, Music, Globe } from 'lucide-react';
import { syncService } from './services/syncService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [allDancers, setAllDancers] = useState<DancerProfile[]>([]);
  const [currentDancer, setCurrentDancer] = useState<DancerProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: new Date(),
    status: 'idle'
  });

  // Inicializar y Suscribirse a cambios en tiempo real
  useEffect(() => {
    // Carga inicial
    const initialData = syncService.getAllDancers();
    setAllDancers(initialData);

    // Suscribirse (esto permite que lo que suba una bailarina aparezca al DJ en su PC)
    const unsubscribe = syncService.subscribe((newData) => {
      setAllDancers(newData);
      setSyncStatus({ lastSync: new Date(), status: 'success' });
      // Si la bailarina actual está en los datos actualizados, refrescar su perfil
      if (currentDancer) {
        const updatedSelf = newData.find(d => d.id === currentDancer.id);
        if (updatedSelf) setCurrentDancer(updatedSelf);
      }
    });

    return () => unsubscribe();
  }, [currentDancer]);

  const saveDancerProfile = async (profile: DancerProfile) => {
    setSyncStatus(prev => ({ ...prev, status: 'syncing' }));
    try {
      await syncService.saveDancer(profile);
      setCurrentDancer(profile);
      setSyncStatus({ lastSync: new Date(), status: 'success' });
      
      // Actualizar estado local inmediatamente para feedback visual
      const updated = [...allDancers];
      const index = updated.findIndex(d => d.id === profile.id);
      if (index >= 0) updated[index] = profile;
      else updated.push(profile);
      setAllDancers(updated);
    } catch (e) {
      setSyncStatus(prev => ({ ...prev, status: 'error' }));
    }
  };

  const deleteDancer = async (id: string) => {
    setSyncStatus(prev => ({ ...prev, status: 'syncing' }));
    try {
      await syncService.deleteDancer(id);
      setSyncStatus({ lastSync: new Date(), status: 'success' });
      setAllDancers(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      setSyncStatus(prev => ({ ...prev, status: 'error' }));
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950">
        <div className="glass-panel max-w-md w-full p-8 md:p-10 rounded-[40px] text-center space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-violet-600/20 rotate-3">
              <Headphones size={48} className="text-white -rotate-3" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">SET FLOW</h1>
            <p className="text-slate-400 text-sm leading-relaxed px-4">
              La plataforma para que artistas y DJs sincronicen su show sin cuadernos.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={() => setRole(UserRole.DANCER)}
              className="group w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl font-bold text-lg hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <Music size={24} className="group-hover:animate-bounce" />
              TU CANCIÓN
            </button>
            <button
              onClick={() => setRole(UserRole.DJ)}
              className="w-full py-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 border-b-4 active:border-b-0 active:translate-y-1"
            >
              <Headphones size={24} />
              SOY EL DJ
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.3em] pt-4">
            <Globe size={10} />
            Sincronización Cloud Activa
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRole(null)}>
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Headphones className="text-white" size={18} />
          </div>
          <span className="font-black text-xl tracking-tighter hidden sm:inline">SET FLOW</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {role === UserRole.DJ ? 'Control DJ' : 'Modo Artista'}
          </div>
          <button 
            onClick={() => setRole(null)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl transition-all"
            title="Cerrar"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="container mx-auto pb-24">
        {role === UserRole.DANCER ? (
          <DancerView onSave={saveDancerProfile} initialProfile={currentDancer} />
        ) : (
          <DJDashboard 
            dancers={allDancers} 
            onDeleteDancer={deleteDancer} 
            syncStatus={syncStatus}
          />
        )}
      </main>

      {/* Persistent Sync Status Dot */}
      <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800 text-[10px] font-bold">
        <div className={`w-2 h-2 rounded-full ${syncStatus.status === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
        <span className="text-slate-500">CLOUD SYNC</span>
      </div>
    </div>
  );
};

export default App;

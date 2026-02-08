
import React, { useState, useEffect } from 'react';
import { DancerProfile, Song, DanceSet } from '../types';
import { Save, Music, User, Plus, Trash2 } from 'lucide-react';

interface DancerViewProps {
  onSave: (profile: DancerProfile) => void;
  initialProfile?: DancerProfile | null;
}

const DancerView: React.FC<DancerViewProps> = ({ onSave, initialProfile }) => {
  const [profile, setProfile] = useState<DancerProfile>(initialProfile || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    stageName: '',
    sets: [
      { id: 1, songs: [{ id: '1-1', title: '', artist: '' }, { id: '1-2', title: '', artist: '' }] },
      { id: 2, songs: [{ id: '2-1', title: '', artist: '' }, { id: '2-2', title: '', artist: '' }] },
      { id: 3, songs: [{ id: '3-1', title: '', artist: '' }, { id: '3-2', title: '', artist: '' }] },
    ],
    lastUpdated: new Date().toISOString()
  });

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSongChange = (setIndex: number, songIndex: number, field: keyof Song, value: string) => {
    const newSets = [...profile.sets];
    newSets[setIndex].songs[songIndex] = {
      ...newSets[setIndex].songs[songIndex],
      [field]: value
    };
    setProfile({ ...profile, sets: newSets });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.stageName) {
      alert("Por favor, introduce tu nombre artístico");
      return;
    }
    onSave({ ...profile, lastUpdated: new Date().toISOString() });
    alert("¡Tus sets han sido enviados al DJ!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-violet-400 neon-text">Mis Sets de Baile</h1>
        <p className="text-slate-400 mt-2">Completa tus 3 sets (2 canciones cada uno)</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-violet-400" />
            <h2 className="text-xl font-semibold">Información Personal</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nombre Artístico</label>
            <input
              type="text"
              name="stageName"
              value={profile.stageName}
              onChange={handleInfoChange}
              placeholder="Ej: Roxy Star"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {profile.sets.map((set, sIdx) => (
          <div key={set.id} className="glass-panel p-6 rounded-2xl border-l-4 border-violet-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm">
                  {set.id}
                </div>
                SET {set.id}
              </h3>
            </div>
            
            <div className="space-y-4">
              {set.songs.map((song, oIdx) => (
                <div key={song.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre de la canción"
                      value={song.title}
                      onChange={(e) => handleSongChange(sIdx, oIdx, 'title', e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-violet-400 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Artista"
                      value={song.artist}
                      onChange={(e) => handleSongChange(sIdx, oIdx, 'artist', e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-violet-400 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-full shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Save size={20} />
          {initialProfile ? 'ACTUALIZAR MIS LISTAS' : 'ENVIAR LISTAS AL DJ'}
        </button>
      </form>
    </div>
  );
};

export default DancerView;

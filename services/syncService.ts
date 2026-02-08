
import { DancerProfile } from "../types";

/**
 * Este servicio simula una base de datos en tiempo real.
 * En una app real, aquí usaríamos Firebase o Supabase.
 */
const STORAGE_KEY = 'dj_set_cloud_sync_mock';

// Usamos BroadcastChannel para sincronizar pestañas en el mismo navegador
const syncChannel = new BroadcastChannel('dj_set_sync');

export const syncService = {
  // Guardar datos (Simula enviar a la nube)
  async saveDancer(profile: DancerProfile): Promise<void> {
    const data = this.getAllDancers();
    const index = data.findIndex(d => d.id === profile.id);
    if (index >= 0) data[index] = profile;
    else data.push(profile);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Notificar a otras pestañas
    syncChannel.postMessage({ type: 'UPDATE', data });
    
    // Simular retraso de red
    return new Promise(resolve => setTimeout(resolve, 800));
  },

  // Obtener todos los perfiles
  getAllDancers(): DancerProfile[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Eliminar un perfil
  async deleteDancer(id: string): Promise<void> {
    const data = this.getAllDancers().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    syncChannel.postMessage({ type: 'UPDATE', data });
  },

  // Suscribirse a cambios (Simula tiempo real)
  subscribe(callback: (data: DancerProfile[]) => void) {
    const listener = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE') {
        callback(event.data.data);
      }
    };
    syncChannel.addEventListener('message', listener);
    return () => syncChannel.removeEventListener('message', listener);
  }
};

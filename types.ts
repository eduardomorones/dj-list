
export interface Song {
  id: string;
  title: string;
  artist: string;
}

export interface DanceSet {
  id: number;
  songs: Song[];
}

export interface DancerProfile {
  id: string;
  name: string;
  stageName: string;
  sets: DanceSet[];
  lastUpdated: string;
}

export enum UserRole {
  DANCER = 'DANCER',
  DJ = 'DJ'
}

export interface SyncStatus {
  lastSync: Date;
  status: 'idle' | 'syncing' | 'error' | 'success';
}

export interface AppState {
  currentUser: DancerProfile | null;
  role: UserRole;
  allDancers: DancerProfile[];
}

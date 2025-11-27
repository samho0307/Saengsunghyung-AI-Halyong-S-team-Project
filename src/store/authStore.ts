import { create } from 'zustand';

interface UserPreferences {
  nickname: string;
  interests: string[];
  mbti?: string;
  communicationStyle: 'casual' | 'formal' | 'cute';
}

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  preferences: UserPreferences | null;
  login: (email: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  preferences: null,

  login: (email) => set({ 
    isAuthenticated: true, 
    user: { email, name: 'User' } // Mock user
  }),

  signup: (email, name) => set({
    user: { email, name }
  }),

  logout: () => set({ 
    isAuthenticated: false, 
    user: null, 
    preferences: null 
  }),

  setPreferences: (prefs) => set((state) => ({
    preferences: { 
      ...state.preferences, 
      ...prefs 
    } as UserPreferences,
    isAuthenticated: true // Finish onboarding -> authenticated
  })),
}));



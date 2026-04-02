import { create } from 'zustand';

interface AuthState {
  user: { id: string; email: string; role: string } | null;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })(),
  setUser: (user) => {
    if (user) sessionStorage.setItem('user', JSON.stringify(user));
    else sessionStorage.removeItem('user');
    set({ user });
  },
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    sessionStorage.removeItem('user');
    set({ user: null });
  },
}));

interface CurrencyState {
  currency: 'EUR' | 'MAD' | 'GBP';
  setCurrency: (currency: 'EUR' | 'MAD' | 'GBP') => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: 'EUR',
  setCurrency: (currency) => set({ currency }),
}));

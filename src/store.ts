import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { id: string; email: string; role: string } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
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

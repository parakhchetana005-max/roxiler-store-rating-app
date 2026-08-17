import { create } from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  checkAuth: async () => {
    try {
      const { user } = await api.get('/auth/me');
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  login: async (email, password) => {
    const { user } = await api.post('/auth/login', { email, password });
    set({ user });
  },
  signup: async (data) => {
    await api.post('/auth/signup', data);
    // After signup, need to login to get token, or backend sends it?
    // Wait, backend signup doesn't set cookie by default in our implementation?
    // Ah, our backend signup returned 201 with user, didn't set cookie.
    // So we should just login right after or ask them to. Let's just login them.
    const { user } = await api.post('/auth/login', { email: data.email, password: data.password });
    set({ user });
  },
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null });
  },
}));

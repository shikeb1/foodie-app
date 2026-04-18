import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('foodrush_user')) || null,
  token: localStorage.getItem('foodrush_token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('foodrush_token', data.token);
      localStorage.setItem('foodrush_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false };
    }
  },

  register: async (name, email, password, phone, role) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone, role });
      localStorage.setItem('foodrush_token', data.token);
      localStorage.setItem('foodrush_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      toast.success('Account created! Welcome to FoodRush 🎉');
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem('foodrush_token');
    localStorage.removeItem('foodrush_user');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  updateUser: (user) => {
    localStorage.setItem('foodrush_user', JSON.stringify(user));
    set({ user });
  },

  isAuthenticated: () => !!get().token,
}));

export default useAuthStore;

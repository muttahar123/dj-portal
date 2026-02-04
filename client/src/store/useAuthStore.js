import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/login', { email, password });
            const user = res.data.user;
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    logout: async () => {
        await api.get('/auth/logout');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;

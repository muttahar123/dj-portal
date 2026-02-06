import { create } from 'zustand';
import api from '../services/api';

const getStoredUser = () => {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    try {
        return JSON.parse(user);
    } catch (e) {
        return null;
    }
};

const useAuthStore = create((set) => ({
    user: getStoredUser(),
    isAuthenticated: !!getStoredUser(),
    loading: false,
    isInitialLoad: true,

    checkAuth: async () => {
        try {
            const res = await api.get('/auth/me');
            const user = res.data.user;
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuthenticated: true, isInitialLoad: false });
        } catch (error) {
            localStorage.removeItem('user');
            set({ user: null, isAuthenticated: false, isInitialLoad: false });
        }
    },

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

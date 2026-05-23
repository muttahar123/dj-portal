import React from 'react';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuthStore();

    // Get token from cookie or localStorage for socket auth
    const getToken = () => {
        // Try to get from localStorage if stored there
        const storedUser = localStorage.getItem('user');
        // The actual JWT token needs to be obtained; for now we'll use a workaround
        // In a production app, the token would be stored separately
        return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';
    };

    return (
        <nav className="sticky top-0 z-40 w-full bg-[var(--color-surface-default)] border-b border-[#E2E8F0]">
            <div className="px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-[#F1F5F9] rounded-[var(--radius-default)] lg:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6 text-[var(--color-secondary-slate)]" />
                    </button>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[var(--color-primary-navy)] font-headline">
                            DJ Student Portal
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell token={getToken()} />

                    <div className="h-6 w-px bg-[#E2E8F0]"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden md:flex flex-col items-end text-sm">
                            <span className="font-semibold text-[var(--color-primary-navy)]">{user?.name}</span>
                            <span className="text-xs text-[var(--color-secondary-slate)] font-medium tracking-wide">{user?.role}</span>
                        </div>
                        <div className="w-10 h-10 rounded-[var(--radius-full)] bg-[var(--color-tertiary-blue)] flex items-center justify-center shadow-sm overflow-hidden capitalize text-[var(--color-primary-navy)] font-bold">
                            {user?.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-[#F1F5F9] hover:text-[var(--color-error)] rounded-[var(--radius-default)] text-[var(--color-secondary-slate)] transition-all group"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


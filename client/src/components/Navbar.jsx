import React from 'react';
import { Bell, LogOut, User as UserIcon, Menu } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuthStore();

    return (
        <nav className="sticky top-0 z-40 w-full bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
            <div className="px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-slate-800 rounded-lg lg:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6 text-slate-400" />
                    </button>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            DJ Student Portal
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                    </button>

                    <div className="h-6 w-px bg-slate-800"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden md:flex flex-col items-end text-sm">
                            <span className="font-semibold text-slate-100">{user?.name}</span>
                            <span className="text-xs text-slate-400">{user?.role}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-slate-800 shadow-lg overflow-hidden capitalize text-white font-bold">
                            {user?.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 transition-all group"
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

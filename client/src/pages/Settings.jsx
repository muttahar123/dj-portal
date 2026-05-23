import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-toastify';

const Settings = () => {
    const { user, logout } = useAuthStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            toast.info('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-primary-navy)] flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-[var(--color-secondary-slate)]" />
                    Account Settings
                </h1>
                <p className="text-[var(--color-secondary-slate)] mt-2">Manage your institutional profile, security and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Navigation for Settings */}
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-primary-navy)] text-white text-[var(--color-primary-navy)] rounded-2xl shadow-lg shadow-blue-600/20 font-bold transition-all">
                        <User className="w-5 h-5" />
                        My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--color-secondary-slate)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary-navy)] rounded-2xl font-bold transition-all">
                        <Lock className="w-5 h-5" />
                        Security
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--color-secondary-slate)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary-navy)] rounded-2xl font-bold transition-all">
                        <Bell className="w-5 h-5" />
                        Notifications
                    </button>
                </div>

                {/* Main Settings Panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-[var(--color-surface-default)] shadow-sm border border-[#E2E8F0] rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[var(--color-tertiary-sage)]" />
                            Personal Information
                        </h2>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[var(--color-secondary-slate)] uppercase tracking-widest pl-1">Full Identity</label>
                                <div className="bg-[var(--color-background)] border border-[#E2E8F0] px-5 py-4 rounded-2xl text-[var(--color-primary-navy)] font-medium">
                                    {user?.name}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[var(--color-secondary-slate)] uppercase tracking-widest pl-1">Academic Email</label>
                                <div className="bg-[var(--color-background)] border border-[#E2E8F0] px-5 py-4 rounded-2xl text-[var(--color-primary-navy)] font-medium">
                                    {user?.email}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[var(--color-secondary-slate)] uppercase tracking-widest pl-1">Portal Role</label>
                                    <div className="bg-[var(--color-background)] border border-[#E2E8F0] px-5 py-4 rounded-2xl text-[var(--color-tertiary-sage)] font-bold text-sm uppercase tracking-tighter">
                                        {user?.role}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[var(--color-secondary-slate)] uppercase tracking-widest pl-1">Department</label>
                                    <div className="bg-[var(--color-background)] border border-[#E2E8F0] px-5 py-4 rounded-2xl text-[var(--color-primary-navy)] font-medium text-sm">
                                        {user?.department}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-[#E2E8F0]/50">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-500/10 px-6 py-3 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                            >
                                {isLoggingOut ? (
                                    <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogOut className="w-5 h-5" />
                                        Sign Out from Portal
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

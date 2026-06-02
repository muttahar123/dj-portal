import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';

const Profile = () => {
    const { user, checkAuth } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password && password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const updateData = {};
        if (name !== user?.name) updateData.name = name;
        if (password) updateData.password = password;

        if (Object.keys(updateData).length === 0) {
            toast.info('No changes to save');
            return;
        }

        setSaving(true);
        try {
            await api.put('/auth/profile', updateData);
            toast.success('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
            checkAuth(); // Refresh user data
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        <User className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-primary-navy)]">My Profile</h1>
                        <p className="text-[var(--color-secondary-slate)] mt-1">Update your personal information</p>
                    </div>
                </div>

                {/* Profile Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--color-surface-default)] shadow-sm backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-8 shadow-xl"
                >
                    {/* User Info Display */}
                    <div className="mb-8 pb-6 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-[var(--color-primary-navy)]">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-primary-navy)]">{user?.name}</h2>
                                <p className="text-[var(--color-secondary-slate)]">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-[var(--color-tertiary-blue)] border border-blue-500/30">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-primary-navy)] mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[#E2E8F0] rounded-xl text-[var(--color-primary-navy)] placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-primary-navy)] mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[#E2E8F0] rounded-xl text-[var(--color-primary-navy)] placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-primary-navy)] mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[#E2E8F0] rounded-xl text-[var(--color-primary-navy)] placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-[var(--color-primary-navy)] font-medium rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Profile;

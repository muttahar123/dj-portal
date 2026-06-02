import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back!');
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-primary-navy)] relative overflow-hidden">
            <div className="max-w-md w-full p-8 bg-[var(--color-surface-default)] border border-[#E2E8F0] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] relative z-10">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 rounded-[var(--radius-default)] bg-[var(--color-background)] border border-[#E2E8F0] inline-flex items-center justify-center p-2 mb-4">
                        <img src="/dj-science-college-logo.png" alt="DJ Science College Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary-navy)] font-headline tracking-tight">
                        DJ Science College
                    </h1>
                    <p className="text-[var(--color-secondary-slate)] mt-2">Student Portal Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-primary-navy)] ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-secondary-slate)] group-focus-within:text-[var(--color-primary-navy)] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--color-surface-default)] border border-[#E2E8F0] rounded-[var(--radius-default)] py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0F172A18] focus:border-[var(--color-primary-navy)] transition-all text-[var(--color-primary-navy)] placeholder:text-[#94A3B8]"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-primary-navy)] ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-secondary-slate)] group-focus-within:text-[var(--color-primary-navy)] transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--color-surface-default)] border border-[#E2E8F0] rounded-[var(--radius-default)] py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0F172A18] focus:border-[var(--color-primary-navy)] transition-all text-[var(--color-primary-navy)] placeholder:text-[#94A3B8]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm px-1">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] bg-[var(--color-surface-default)] text-[var(--color-primary-navy)] focus:ring-[var(--color-primary-navy)] transition-all" />
                            <span className="text-[var(--color-secondary-slate)] group-hover:text-[var(--color-primary-navy)]">Remember me</span>
                        </label>
                        <a href="#" className="text-[var(--color-tertiary-blue)] hover:underline font-medium transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primary-navy)] hover:bg-[#020617] text-white font-semibold py-3 rounded-[var(--radius-default)] transition-all shadow-sm active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[#E2E8F0] text-center">
                    <p className="text-[var(--color-secondary-slate)] text-sm">
                        New student? Contact the <span className="text-[var(--color-tertiary-blue)] font-medium">Administration</span> for credentials.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

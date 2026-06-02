import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
    Users,
    GraduationCap,
    BookOpen,
    Activity,
    Shield,
    Server,
    ArrowUpRight
} from 'lucide-react';
import StatsCard from '../../components/StatsCard';

const AdminDashboard = () => {
    // Fetch stats
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const usersRes = await api.get('/admin/users');
            const classesRes = await api.get('/admin/classes');

            const students = usersRes.data.data.filter(u => u.role === 'STUDENT').length;
            const teachers = usersRes.data.data.filter(u => u.role === 'TEACHER').length;
            const classes = classesRes.data.data.length;

            return { students, teachers, classes };
        }
    });

    const recentActivities = [
        { id: 1, text: 'New teacher registration: Prof. Arshad', time: '10 mins ago' },
        { id: 2, text: 'Physics lab schedule updated', time: '1 hour ago' },
        { id: 3, text: 'System backup completed successfully', time: '3 hours ago' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary-navy)] font-headline tracking-tight">Institutional Oversight</h1>
                    <p className="text-[var(--color-secondary-slate)] mt-1 tracking-wide">Real-time management of DJ Science College assets.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#22C55E15] rounded-[var(--radius-full)]">
                    <div className="w-2 h-2 rounded-[var(--radius-full)] bg-[var(--color-success)] animate-pulse" />
                    <span className="text-xs font-bold text-[var(--color-success)] uppercase tracking-widest">System Healthy</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/dashboard/users" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Total Students" value={stats?.students || 0} icon={GraduationCap} color="bg-[var(--color-primary-navy)]" />
                </Link>
                <Link to="/dashboard/users" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Faculty Members" value={stats?.teachers || 0} icon={Users} color="bg-[var(--color-primary-navy)]" />
                </Link>
                <Link to="/dashboard/classes" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Active Classes" value={stats?.classes || 0} icon={BookOpen} color="bg-[var(--color-tertiary-blue)]" />
                </Link>
                <Link to="/dashboard/audit" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="System Performance" value="Optimal" icon={Server} color="bg-[#EAB308]" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[var(--color-surface-default)] border border-[#E2E8F0] shadow-[var(--shadow-default)] rounded-[var(--radius-lg)] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-primary-navy)] font-headline">
                            <Activity className="text-[var(--color-tertiary-blue)]" />
                            Live System Feed
                        </h2>
                        <button className="text-sm text-[var(--color-secondary-slate)] hover:text-[var(--color-primary-navy)] transition-colors font-medium">View Logs</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[#E2E8F0] rounded-[var(--radius-default)] group hover:shadow-[var(--shadow-sm)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-default)] border border-[#E2E8F0] flex items-center justify-center text-[var(--color-secondary-slate)] group-hover:text-[var(--color-tertiary-blue)] transition-colors">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-primary-navy)] text-sm font-medium">{act.text}</p>
                                        <p className="text-[var(--color-secondary-slate)] text-xs mt-0.5 tracking-wide">{act.time}</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[var(--color-primary-navy)] transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--color-surface-default)] border border-[#E2E8F0] shadow-[var(--shadow-default)] rounded-[var(--radius-lg)] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Shield className="w-32 h-32 text-[#0F172A05] rotate-12" />
                    </div>
                    <h2 className="text-xl font-bold mb-6 text-[var(--color-primary-navy)] font-headline">Access Control</h2>
                    <div className="space-y-4">
                        <Link to="/dashboard/users" className="flex items-center justify-between p-4 bg-[var(--color-primary-navy)] hover:bg-[#020617] text-white rounded-[var(--radius-default)] transition-all shadow-sm group">
                            <span className="font-bold">Register User</span>
                            <Users className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/dashboard/classes" className="flex items-center justify-between p-4 bg-[var(--color-background)] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[var(--color-primary-navy)] rounded-[var(--radius-default)] transition-all group">
                            <span className="font-bold">Matrix Configuration</span>
                            <BookOpen className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

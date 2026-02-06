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
                    <h1 className="text-3xl font-bold text-white">Institutional Oversight</h1>
                    <p className="text-slate-400 mt-1">Real-time management of DJ Science College assets.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Healthy</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/dashboard/users" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Total Students" value={stats?.students || 0} icon={GraduationCap} color="bg-blue-600" />
                </Link>
                <Link to="/dashboard/users" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Faculty Members" value={stats?.teachers || 0} icon={Users} color="bg-purple-600" />
                </Link>
                <Link to="/dashboard/classes" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Active Classes" value={stats?.classes || 0} icon={BookOpen} color="bg-emerald-600" />
                </Link>
                <Link to="/dashboard/audit" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="System Performance" value="Optimal" icon={Server} color="bg-orange-600" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="text-blue-500" />
                            Live System Feed
                        </h2>
                        <button className="text-sm text-slate-500 hover:text-white transition-colors">View Logs</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-slate-200 text-sm font-medium">{act.text}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{act.time}</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Shield className="w-32 h-32 text-blue-500/5 rotate-12" />
                    </div>
                    <h2 className="text-xl font-bold mb-6">Access Control</h2>
                    <div className="space-y-4">
                        <Link to="/dashboard/users" className="flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-lg shadow-blue-600/20 group">
                            <span className="font-bold">Register User</span>
                            <Users className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/dashboard/classes" className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all group">
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

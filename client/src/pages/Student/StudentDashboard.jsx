import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
    Book,
    FileText,
    Activity,
    Calendar,
    ArrowRight,
    ClipboardCheck
} from 'lucide-react';
import StatsCard from '../../components/StatsCard';

const StudentDashboard = () => {
    const { data: assignments } = useQuery({
        queryKey: ['student-assignments-dashboard'],
        queryFn: async () => {
            const res = await api.get('/student/assignments');
            return res.data.data;
        }
    });

    const { data: attendance } = useQuery({
        queryKey: ['student-attendance-dashboard'],
        queryFn: async () => {
            const res = await api.get('/student/attendance');
            return res.data.data;
        }
    });

    const total = attendance?.length || 0;
    const present = attendance?.filter(a => a.status === 'P').length || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    const upcomingTasks = assignments?.filter(a => new Date(a.dueDate) > new Date()).slice(0, 3) || [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student Hub</h1>
                    <p className="text-slate-400 mt-1">Unified view of your academic progress and deadlines.</p>
                </div>
                <Link to="/dashboard/schedule" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    View Lab Schedule
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/dashboard/student/assignments" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Pending Tasks" value={upcomingTasks.length} icon={FileText} color="bg-orange-600" />
                </Link>
                <Link to="/dashboard/student/attendance" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Attendance" value={`${percentage}%`} icon={ClipboardCheck} color="bg-blue-600" />
                </Link>
                <Link to="/dashboard/schedule" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Active Courses" value="4" icon={Book} color="bg-purple-600" />
                </Link>
                <StatsCard title="Performance" value="A+" icon={Activity} color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <FileText className="text-orange-400" />
                        Upcoming Deadlines
                    </h2>
                    <div className="space-y-4">
                        {upcomingTasks.length === 0 ? (
                            <p className="text-slate-500 text-sm italic py-4">No pending assignments found. You're all caught up!</p>
                        ) : upcomingTasks.map((task) => (
                            <div key={task._id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl group hover:border-orange-500/30 transition-all flex justify-between items-center">
                                <div>
                                    <div className="text-[10px] font-black text-orange-500 mb-1 tracking-widest uppercase">{task.class?.code}</div>
                                    <h3 className="text-white font-bold">{task.title}</h3>
                                    <div className="text-xs text-slate-500 mt-1">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <Link to="/dashboard/student/assignments" className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <Activity className="text-emerald-400" />
                        Academic Stance
                    </h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-500 uppercase tracking-widest">Attendance Metric</span>
                                <span className={percentage > 75 ? 'text-emerald-400' : 'text-orange-400'}>{percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${percentage > 75 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${percentage}%` }} />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 text-sm text-slate-400 leading-relaxed italic">
                            "Education is the most powerful weapon which you can use to change the world."
                        </div>
                        <Link to="/dashboard/student/attendance" className="block text-center py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-600/20">
                            View Detailed History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

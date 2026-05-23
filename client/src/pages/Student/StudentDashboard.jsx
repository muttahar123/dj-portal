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
                    <h1 className="text-3xl font-bold text-[var(--color-primary-navy)] font-headline tracking-tight">Student Hub</h1>
                    <p className="text-[var(--color-secondary-slate)] mt-1 tracking-wide">Unified view of your academic progress and deadlines.</p>
                </div>
                <Link to="/dashboard/schedule" className="bg-[var(--color-surface-default)] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[var(--color-primary-navy)] px-5 py-3 rounded-[var(--radius-default)] font-bold transition-all shadow-sm flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--color-tertiary-blue)]" />
                    View Lab Schedule
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/dashboard/student/assignments" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Pending Tasks" value={upcomingTasks.length} icon={FileText} color="bg-[var(--color-warning)]" />
                </Link>
                <Link to="/dashboard/student/attendance" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Attendance" value={`${percentage}%`} icon={ClipboardCheck} color="bg-[var(--color-primary-navy)]" />
                </Link>
                <Link to="/dashboard/schedule" className="block transform transition-all hover:scale-[1.02]">
                    <StatsCard title="Active Courses" value="4" icon={Book} color="bg-[var(--color-tertiary-blue)]" />
                </Link>
                <StatsCard title="Performance" value="A+" icon={Activity} color="bg-[var(--color-success)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[var(--color-surface-default)] border border-[#E2E8F0] shadow-[var(--shadow-default)] rounded-[var(--radius-lg)] p-8">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-[var(--color-primary-navy)] font-headline">
                        <FileText className="text-[var(--color-warning)]" />
                        Upcoming Deadlines
                    </h2>
                    <div className="space-y-4">
                        {upcomingTasks.length === 0 ? (
                            <p className="text-[var(--color-secondary-slate)] text-sm italic py-4">No pending assignments found. You're all caught up!</p>
                        ) : upcomingTasks.map((task) => (
                            <div key={task._id} className="p-5 bg-[var(--color-background)] border border-[#E2E8F0] rounded-[var(--radius-default)] group hover:border-[var(--color-warning)] transition-all flex justify-between items-center shadow-sm">
                                <div>
                                    <div className="text-[10px] font-black text-[var(--color-warning)] mb-1 tracking-widest uppercase">{task.class?.code}</div>
                                    <h3 className="text-[var(--color-primary-navy)] font-bold">{task.title}</h3>
                                    <div className="text-xs text-[var(--color-secondary-slate)] mt-1">
                                        Due: <span className="font-mono">{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Link to="/dashboard/student/assignments" className="p-3 bg-[var(--color-surface-default)] border border-[#E2E8F0] rounded-[var(--radius-default)] text-[var(--color-secondary-slate)] group-hover:bg-[var(--color-warning)] group-hover:text-[var(--color-primary-navy)] group-hover:border-[var(--color-warning)] transition-all">
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--color-surface-default)] border border-[#E2E8F0] shadow-[var(--shadow-default)] rounded-[var(--radius-lg)] p-8 relative overflow-hidden">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-[var(--color-primary-navy)] font-headline">
                        <Activity className="text-[var(--color-tertiary-blue)]" />
                        Academic Stance
                    </h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-[var(--color-background)] rounded-[var(--radius-default)] border border-[#E2E8F0]">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-[var(--color-secondary-slate)] uppercase tracking-widest">Attendance Metric</span>
                                <span className={percentage > 75 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>{percentage}%</span>
                            </div>
                            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${percentage > 75 ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'}`} style={{ width: `${percentage}%` }} />
                            </div>
                        </div>
                        <div className="p-4 bg-[var(--color-background)] rounded-[var(--radius-default)] border border-[#E2E8F0] text-sm text-[var(--color-secondary-slate)] leading-relaxed italic">
                            "Education is the most powerful weapon which you can use to change the world."
                        </div>
                        <Link to="/dashboard/student/attendance" className="block text-center py-4 bg-[var(--color-primary-navy)] hover:bg-[#020617] rounded-[var(--radius-default)] font-bold text-[var(--color-primary-navy)] transition-all shadow-sm">
                            View Detailed History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

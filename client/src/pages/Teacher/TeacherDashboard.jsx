import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
    BookOpen,
    Users,
    ClipboardCheck,
    FileText,
    Calendar,
    ArrowRight
} from 'lucide-react';
import StatsCard from '../../components/StatsCard';

const TeacherDashboard = () => {
    const { data: classesData, isLoading: isClassesLoading } = useQuery({
        queryKey: ['teacher-classes'],
        queryFn: async () => {
            const res = await api.get('/teacher/classes');
            return res.data.data;
        }
    });

    const { data: assignmentsData } = useQuery({
        queryKey: ['teacher-assignments-summary'],
        queryFn: async () => {
            const res = await api.get('/assignments');
            return res.data.data;
        }
    });

    const totalStudents = classesData?.reduce((acc, curr) => acc + (curr.students?.length || 0), 0) || 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary-navy)] font-headline tracking-tight">Academic Console</h1>
                    <p className="text-[var(--color-secondary-slate)] mt-1 tracking-wide">Efficiently manage your classroom sessions and student performance.</p>
                </div>
                <Link
                    to="/dashboard/attendance"
                    className="bg-[var(--color-primary-navy)] hover:bg-[#020617] text-white px-6 py-3 rounded-[var(--radius-default)] font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                    <ClipboardCheck className="w-5 h-5" />
                    Mark Attendance
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Assigned Classes" value={classesData?.length || 0} icon={BookOpen} color="bg-[var(--color-primary-navy)]" />
                <StatsCard title="Total Students" value={totalStudents} icon={Users} color="bg-[var(--color-tertiary-blue)]" />
                <StatsCard title="Active Assignments" value={assignmentsData?.length || 0} icon={FileText} color="bg-[var(--color-secondary-slate)]" />
                <StatsCard title="Days Present" value="24/24" icon={Calendar} color="bg-[var(--color-primary-navy)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[var(--color-surface-default)] border border-[#E2E8F0] shadow-[var(--shadow-default)] rounded-[var(--radius-lg)] p-8">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-[var(--color-primary-navy)] font-headline">
                        <BookOpen className="text-[var(--color-tertiary-blue)]" />
                        Classroom Matrix
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isClassesLoading ? (
                            [1, 2].map(i => <div key={i} className="h-24 bg-[var(--color-background)] border border-[#E2E8F0] rounded-[var(--radius-default)] animate-pulse" />)
                        ) : classesData?.map((cls) => (
                            <div key={cls._id} className="bg-[var(--color-background)] border border-[#E2E8F0] p-5 rounded-[var(--radius-default)] group hover:border-[var(--color-primary-navy)] hover:shadow-[var(--shadow-sm)] transition-all flex justify-between items-center">
                                <div>
                                    <div className="text-xs font-black text-[var(--color-tertiary-blue)] mb-1 tracking-widest">{cls.code}</div>
                                    <h3 className="text-[var(--color-primary-navy)] font-bold font-headline">{cls.name}</h3>
                                    <div className="text-[10px] text-[var(--color-secondary-slate)] font-bold mt-1 uppercase tracking-tighter">
                                        {cls.students?.length} Students Enrolled
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard/attendance"
                                    className="p-3 bg-[var(--color-surface-default)] border border-[#E2E8F0] rounded-[var(--radius-default)] text-[var(--color-secondary-slate)] group-hover:bg-[var(--color-primary-navy)] group-hover:text-white group-hover:border-[var(--color-primary-navy)] transition-all shadow-sm"
                                    title="Mark Attendance"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--color-surface-default)] border border-[#E2E8F0] shadow-[var(--shadow-default)] rounded-[var(--radius-lg)] p-8">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-[var(--color-primary-navy)] font-headline">
                        <FileText className="text-[var(--color-tertiary-blue)]" />
                        Recent Tasks
                    </h2>
                    <div className="space-y-4">
                        {assignmentsData?.slice(0, 3).map((task) => (
                            <div key={task._id} className="p-4 bg-[var(--color-background)] border border-[#E2E8F0] rounded-[var(--radius-default)] hover:shadow-[var(--shadow-sm)] transition-shadow">
                                <h4 className="text-[var(--color-primary-navy)] font-bold text-sm truncate">{task.title}</h4>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-[10px] bg-[var(--color-surface-default)] border border-[#E2E8F0] px-2 py-1 rounded-[var(--radius-sm)] text-[var(--color-secondary-slate)] font-bold uppercase tracking-widest">
                                        {task.class?.code}
                                    </span>
                                    <Link to="/dashboard/assignments" className="text-[10px] text-[var(--color-tertiary-blue)] font-bold hover:underline">Manage</Link>
                                </div>
                            </div>
                        ))}
                        <Link to="/dashboard/assignments" className="block text-center py-3 bg-[var(--color-background)] border border-[#E2E8F0] rounded-[var(--radius-default)] text-xs font-bold text-[var(--color-secondary-slate)] hover:bg-[#F1F5F9] hover:text-[var(--color-primary-navy)] transition-all">
                            View All Assignments
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

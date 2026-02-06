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
                    <h1 className="text-3xl font-bold text-white">Academic Console</h1>
                    <p className="text-slate-400 mt-1">Efficiently manage your classroom sessions and student performance.</p>
                </div>
                <Link
                    to="/dashboard/attendance"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                >
                    <ClipboardCheck className="w-5 h-5" />
                    Mark Attendance
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Assigned Classes" value={classesData?.length || 0} icon={BookOpen} color="bg-blue-600" />
                <StatsCard title="Total Students" value={totalStudents} icon={Users} color="bg-purple-600" />
                <StatsCard title="Active Assignments" value={assignmentsData?.length || 0} icon={FileText} color="bg-emerald-600" />
                <StatsCard title="Days Present" value="24/24" icon={Calendar} color="bg-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <BookOpen className="text-blue-400" />
                        Classroom Matrix
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isClassesLoading ? (
                            [1, 2].map(i => <div key={i} className="h-24 bg-slate-800/20 rounded-2xl animate-pulse" />)
                        ) : classesData?.map((cls) => (
                            <div key={cls._id} className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl group hover:border-blue-500/50 transition-all flex justify-between items-center">
                                <div>
                                    <div className="text-xs font-black text-blue-500 mb-1 tracking-widest">{cls.code}</div>
                                    <h3 className="text-white font-bold">{cls.name}</h3>
                                    <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">
                                        {cls.students?.length} Students Enrolled
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard/attendance"
                                    className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl"
                                    title="Mark Attendance"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <FileText className="text-emerald-400" />
                        Recent Tasks
                    </h2>
                    <div className="space-y-4">
                        {assignmentsData?.slice(0, 3).map((task) => (
                            <div key={task._id} className="p-4 bg-slate-950/30 border border-slate-800 rounded-2xl">
                                <h4 className="text-slate-200 font-bold text-sm truncate">{task.title}</h4>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-black uppercase tracking-widest">
                                        {task.class?.code}
                                    </span>
                                    <Link to="/dashboard/assignments" className="text-[10px] text-blue-400 font-bold hover:underline">Manage</Link>
                                </div>
                            </div>
                        ))}
                        <Link to="/dashboard/assignments" className="block text-center py-3 bg-slate-800/50 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-800 hover:text-white transition-all">
                            View All Assignments
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
    ClipboardCheck,
    Calendar as CalendarIcon,
    Award,
    CircleCheck,
    CircleX
} from 'lucide-react';
import { format } from 'date-fns';

const StudentAttendance = () => {
    const { data: attendance, isLoading } = useQuery({
        queryKey: ['student-attendance'],
        queryFn: async () => {
            const res = await api.get('/student/attendance');
            return res.data.data;
        }
    });

    // Simple statistics
    const total = attendance?.length || 0;
    const present = attendance?.filter(a => a.status === 'P').length || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardCheck className="w-6 h-6 text-emerald-500" />
                        Attendance History
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor your presence and engagement records.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sessions</p>
                        <p className="text-2xl font-bold text-slate-100">{total}</p>
                    </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CircleCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Present</p>
                        <p className="text-2xl font-bold text-slate-100">{present}</p>
                    </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${percentage > 75 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Overall Ratio</p>
                        <p className="text-2xl font-bold text-slate-100">{percentage}%</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Class Name</th>
                                <th className="px-6 py-4 font-bold">Session Date</th>
                                <th className="px-6 py-4 font-bold">Attendance Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <tr><td colSpan="3" className="px-6 py-10 text-center"><div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" /></td></tr>
                            ) : attendance?.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-slate-200 font-semibold">{log.class?.name}</div>
                                        <div className="text-slate-500 text-xs font-mono">{log.class?.code}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                                        {format(new Date(log.date), 'MMMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 w-fit ${log.status === 'P' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {log.status === 'P' ? <CircleCheck className="w-3 h-3" /> : <CircleX className="w-3 h-3" />}
                                            {log.status === 'P' ? 'PRESENT' : 'ABSENT'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;

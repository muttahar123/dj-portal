import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Calendar, Clock, MapPin, BookOpen, User } from 'lucide-react';

const StudentSchedule = () => {
    const { data: classes, isLoading } = useQuery({
        queryKey: ['student-classes-schedule'],
        queryFn: async () => {
            const res = await api.get('/student/classes');
            return res.data.data;
        }
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Grouping schedule items by day
    const getScheduleForDay = (dayName) => {
        if (!classes) return [];
        const daySchedule = [];
        classes.forEach(cls => {
            cls.schedule.forEach(item => {
                if (item.day === dayName) {
                    daySchedule.push({
                        ...item,
                        className: cls.name,
                        classCode: cls.code,
                        teacherName: cls.teacher?.name
                    });
                }
            });
        });
        // Sort by startTime
        return daySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    Academic Schedule
                </h1>
                <p className="text-slate-400 text-sm mt-1">Weekly timetable for your enrolled laboratory sessions and classes.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {days.map(day => {
                    const dayItems = getScheduleForDay(day);

                    return (
                        <div key={day} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">{day}</h2>
                                <span className="text-[10px] text-slate-500 font-bold">{dayItems.length} Sessions</span>
                            </div>
                            <div className="p-0">
                                {isLoading ? (
                                    <div className="p-6 space-y-3">
                                        <div className="h-16 bg-slate-800/20 rounded-2xl animate-pulse" />
                                        <div className="h-16 bg-slate-800/20 rounded-2xl animate-pulse" />
                                    </div>
                                ) : dayItems.length === 0 ? (
                                    <div className="p-8 text-center text-slate-600 text-sm italic">No sessions scheduled for this day.</div>
                                ) : (
                                    <div className="divide-y divide-slate-800/30">
                                        {dayItems.map((item, idx) => (
                                            <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/10 transition-colors">
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800">
                                                        <Clock className="w-4 h-4 text-blue-500 mb-1" />
                                                        <span className="text-[8px] text-slate-500 font-bold uppercase">{item.startTime}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-slate-100 font-bold text-lg">{item.className}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">{item.classCode}</span>
                                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                <User className="w-3 h-3" />
                                                                <span>Prof. {item.teacherName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Duration</div>
                                                        <div className="text-sm text-slate-300 font-medium">{item.startTime} — {item.endTime}</div>
                                                    </div>
                                                    <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="text-xs text-slate-300 font-bold">{item.room || 'TBA'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentSchedule;

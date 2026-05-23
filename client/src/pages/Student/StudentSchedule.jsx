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
                <h1 className="text-2xl font-bold text-[var(--color-primary-navy)] flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[var(--color-tertiary-sage)]" />
                    Academic Schedule
                </h1>
                <p className="text-[var(--color-secondary-slate)] text-sm mt-1">Weekly timetable for your enrolled laboratory sessions and classes.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {days.map(day => {
                    const dayItems = getScheduleForDay(day);

                    return (
                        <div key={day} className="bg-[var(--color-surface-default)] shadow-sm border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-xl">
                            <div className="bg-[var(--color-background)] px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
                                <h2 className="text-sm font-extrabold text-[var(--color-primary-navy)] uppercase tracking-widest">{day}</h2>
                                <span className="text-[10px] text-[var(--color-secondary-slate)] font-bold">{dayItems.length} Sessions</span>
                            </div>
                            <div className="p-0">
                                {isLoading ? (
                                    <div className="p-6 space-y-3">
                                        <div className="h-16 bg-[#F1F5F9] rounded-2xl animate-pulse" />
                                        <div className="h-16 bg-[#F1F5F9] rounded-2xl animate-pulse" />
                                    </div>
                                ) : dayItems.length === 0 ? (
                                    <div className="p-8 text-center text-slate-600 text-sm italic">No sessions scheduled for this day.</div>
                                ) : (
                                    <div className="divide-y divide-slate-800/30">
                                        {dayItems.map((item, idx) => (
                                            <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--color-background)] border border-[#E2E8F0]/10 transition-colors">
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-background)] flex flex-col items-center justify-center border border-[#E2E8F0]">
                                                        <Clock className="w-4 h-4 text-[var(--color-tertiary-sage)] mb-1" />
                                                        <span className="text-[8px] text-[var(--color-secondary-slate)] font-bold uppercase">{item.startTime}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[var(--color-primary-navy)] font-bold text-lg">{item.className}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] bg-blue-500/10 text-[var(--color-tertiary-sage)] px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">{item.classCode}</span>
                                                            <div className="flex items-center gap-1 text-xs text-[var(--color-secondary-slate)]">
                                                                <User className="w-3 h-3" />
                                                                <span>Prof. {item.teacherName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-[var(--color-secondary-slate)] uppercase font-bold tracking-widest">Duration</div>
                                                        <div className="text-sm text-[var(--color-primary-navy)] font-medium">{item.startTime} — {item.endTime}</div>
                                                    </div>
                                                    <div className="bg-[var(--color-background)] px-4 py-2 rounded-xl border border-[#E2E8F0] flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-[var(--color-tertiary-sage)]" />
                                                        <span className="text-xs text-[var(--color-primary-navy)] font-bold">{item.room || 'TBA'}</span>
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

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
    ClipboardCheck,
    Calendar as CalendarIcon,
    CheckCircle,
    XCircle,
    ArrowRight,
    Search,
    Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Attendance = () => {
    const queryClient = useQueryClient();
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [records, setRecords] = useState({}); // { studentId: 'PRESENT' | 'ABSENT' }
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch assigned classes
    const { data: classes, isLoading: isClassesLoading } = useQuery({
        queryKey: ['teacher-classes'],
        queryFn: async () => {
            const res = await api.get('/teacher/classes');
            return res.data.data;
        }
    });

    // Fetch students for selected class
    const { data: students, isLoading: isStudentsLoading } = useQuery({
        queryKey: ['class-students', selectedClass],
        queryFn: async () => {
            if (!selectedClass) return [];
            const res = await api.get(`/teacher/classes/${selectedClass}/students`);
            return res.data.data;
        },
        enabled: !!selectedClass
    });

    // Initialize records when students load
    useEffect(() => {
        if (students) {
            const initialRecords = {};
            students.forEach(s => {
                initialRecords[s._id] = 'PRESENT';
            });
            setRecords(initialRecords);
        }
    }, [students]);

    const markAttendanceMutation = useMutation({
        mutationFn: (attendanceData) => api.post('/teacher/attendance', attendanceData),
        onSuccess: () => {
            toast.success('Attendance recorded successfully');
            setSelectedClass('');
            setRecords({});
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to record attendance');
        }
    });

    const handleStatusToggle = (studentId) => {
        setRecords(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedClass) return toast.error('Please select a class');

        const formattedRecords = Object.entries(records).map(([studentId, status]) => ({
            studentId,
            status: status.charAt(0) // P or A
        }));

        markAttendanceMutation.mutate({
            classId: selectedClass,
            date,
            records: formattedRecords
        });
    };

    const filteredStudents = students?.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardCheck className="w-6 h-6 text-emerald-500" />
                        Class Attendance
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Mark and manage daily presence tracking.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 lg:h-fit sticky top-24">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-l-2 border-blue-500 pl-3">Sesion Setup</h2>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Target Class</label>
                            <select
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Select Class...</option>
                                {classes?.map(c => (
                                    <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400">Tracking Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="date"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-sm"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {selectedClass && (
                            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Total Enrollment:</span>
                                    <span className="font-bold text-slate-200">{students?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Marked Present:</span>
                                    <span className="font-bold text-emerald-400">
                                        {Object.values(records).filter(status => status === 'PRESENT').length}
                                    </span>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={markAttendanceMutation.isPending || !selectedClass}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
                                >
                                    {markAttendanceMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Confirm Records
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Student List */}
                <div className="lg:col-span-2 space-y-4">
                    {!selectedClass ? (
                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center gap-4">
                            <Users className="w-12 h-12 text-slate-700" />
                            <p>Select a class to begin marking attendance.</p>
                        </div>
                    ) : isStudentsLoading ? (
                        <div className="flex justify-center p-20">
                            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="relative group mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Quick search by name or ID..."
                                    className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {filteredStudents?.map((student) => (
                                    <div
                                        key={student._id}
                                        className="group bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 uppercase">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-slate-100 font-semibold">{student.name}</div>
                                                <div className="text-slate-500 text-[10px] font-mono tracking-wider uppercase">{student.studentId || 'ID Pending'}</div>
                                            </div>
                                        </div>

                                        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                                            <button
                                                onClick={() => handleStatusToggle(student._id)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${records[student._id] === 'PRESENT'
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                        : 'text-slate-500 bg-transparent hover:text-slate-300'
                                                    }`}
                                            >
                                                <CheckCircle className={`w-3.5 h-3.5 ${records[student._id] === 'PRESENT' ? 'opacity-100' : 'opacity-30'}`} />
                                                PRESENT
                                            </button>
                                            <button
                                                onClick={() => handleStatusToggle(student._id)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${records[student._id] === 'ABSENT'
                                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                        : 'text-slate-500 bg-transparent hover:text-slate-300'
                                                    }`}
                                            >
                                                <XCircle className={`w-3.5 h-3.5 ${records[student._id] === 'ABSENT' ? 'opacity-100' : 'opacity-30'}`} />
                                                ABSENT
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;

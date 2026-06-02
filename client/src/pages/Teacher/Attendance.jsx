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
    Users,
    Edit3,
    Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Attendance = () => {
    const queryClient = useQueryClient();
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [records, setRecords] = useState({}); // { studentId: 'PRESENT' | 'ABSENT' }
    const [existingAttendance, setExistingAttendance] = useState([]); // Fetched attendance records
    const [isEditMode, setIsEditMode] = useState(false);
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

    // Fetch existing attendance for the selected class and date
    const { data: attendanceData, isLoading: isAttendanceLoading, refetch: refetchAttendance } = useQuery({
        queryKey: ['attendance', selectedClass, date],
        queryFn: async () => {
            if (!selectedClass || !date) return [];
            const res = await api.get(`/teacher/attendance/${selectedClass}/${date}`);
            return res.data.data;
        },
        enabled: !!selectedClass && !!date
    });

    // Load existing attendance or initialize new records
    useEffect(() => {
        if (!students) return;

        if (attendanceData && attendanceData.length > 0) {
            // Existing attendance found - load it into records
            setExistingAttendance(attendanceData);
            const loadedRecords = {};
            attendanceData.forEach(att => {
                const studentId = att.student?._id || att.student;
                loadedRecords[studentId] = att.status === 'P' ? 'PRESENT' : att.status === 'A' ? 'ABSENT' : 'LATE';
            });
            setRecords(loadedRecords);
            setIsEditMode(true);
        } else {
            // No existing attendance - initialize all as PRESENT
            const initialRecords = {};
            students.forEach(s => {
                initialRecords[s._id] = 'PRESENT';
            });
            setRecords(initialRecords);
            setExistingAttendance([]);
            setIsEditMode(false);
        }
    }, [students, attendanceData]);

    const markAttendanceMutation = useMutation({
        mutationFn: (attendanceData) => api.post('/teacher/attendance', attendanceData),
        onSuccess: () => {
            toast.success('Attendance recorded successfully');
            queryClient.invalidateQueries(['attendance', selectedClass, date]);
            refetchAttendance();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to record attendance');
        }
    });

    const updateAttendanceMutation = useMutation({
        mutationFn: ({ id, status }) => api.put(`/teacher/attendance/${id}`, { status }),
        onSuccess: () => {
            toast.success('Attendance updated successfully');
            queryClient.invalidateQueries(['attendance', selectedClass, date]);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update attendance');
        }
    });

    const handleStatusToggle = (studentId) => {
        const currentStatus = records[studentId];
        let newStatus;
        if (currentStatus === 'PRESENT') newStatus = 'ABSENT';
        else if (currentStatus === 'ABSENT') newStatus = 'LATE';
        else newStatus = 'PRESENT';

        setRecords(prev => ({
            ...prev,
            [studentId]: newStatus
        }));

        // If in edit mode, update immediately
        if (isEditMode) {
            const attendanceRecord = existingAttendance.find(att =>
                (att.student?._id || att.student) === studentId
            );
            if (attendanceRecord) {
                updateAttendanceMutation.mutate({
                    id: attendanceRecord._id,
                    status: newStatus.charAt(0) // P, A, or L
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedClass) return toast.error('Please select a class');

        const formattedRecords = Object.entries(records).map(([studentId, status]) => ({
            studentId,
            status: status.charAt(0) // P, A, or L
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

    const getStatusButton = (studentId, statusType, icon, label, activeColor, shadowColor) => {
        const isActive = records[studentId] === statusType;
        return (
            <button
                onClick={() => handleStatusToggle(studentId)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${isActive
                    ? `${activeColor} text-[var(--color-primary-navy)] shadow-lg ${shadowColor}`
                    : 'text-[var(--color-secondary-slate)] bg-transparent hover:text-[var(--color-primary-navy)]'
                    }`}
            >
                {icon}
                {label}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-primary-navy)] flex items-center gap-2">
                        <ClipboardCheck className="w-6 h-6 text-emerald-500" />
                        Class Attendance
                    </h1>
                    <p className="text-[var(--color-secondary-slate)] text-sm mt-1">Mark and manage daily presence tracking.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="bg-[var(--color-surface-default)] shadow-sm border border-[#E2E8F0] rounded-3xl p-6 lg:h-fit sticky top-24">
                    <h2 className="text-sm font-bold text-[var(--color-secondary-slate)] uppercase tracking-widest mb-6 border-l-2 border-blue-500 pl-3">Session Setup</h2>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-secondary-slate)]">Target Class</label>
                            <select
                                className="w-full bg-[var(--color-background)] border border-[#E2E8F0] rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 text-[var(--color-primary-navy)]"
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
                            <label className="text-xs font-semibold text-[var(--color-secondary-slate)]">Tracking Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-secondary-slate)]" />
                                <input
                                    type="date"
                                    className="w-full bg-[var(--color-background)] border border-[#E2E8F0] rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-sm text-[var(--color-primary-navy)]"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {selectedClass && (
                            <div className="pt-4 border-t border-[#E2E8F0]/50 space-y-4">
                                {isEditMode && (
                                    <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                        <Edit3 className="w-4 h-4 text-amber-400" />
                                        <span className="text-xs text-amber-200 font-medium">Editing existing records</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--color-secondary-slate)]">Total Enrollment:</span>
                                    <span className="font-bold text-[var(--color-primary-navy)]">{students?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--color-secondary-slate)]">Present:</span>
                                    <span className="font-bold text-emerald-400">
                                        {Object.values(records).filter(status => status === 'PRESENT').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--color-secondary-slate)]">Absent:</span>
                                    <span className="font-bold text-red-400">
                                        {Object.values(records).filter(status => status === 'ABSENT').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--color-secondary-slate)]">Late:</span>
                                    <span className="font-bold text-amber-400">
                                        {Object.values(records).filter(status => status === 'LATE').length}
                                    </span>
                                </div>

                                {!isEditMode && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={markAttendanceMutation.isPending || !selectedClass}
                                        className="w-full bg-[var(--color-primary-navy)] text-white hover:bg-[#020617] disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
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
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Student List */}
                <div className="lg:col-span-2 space-y-4">
                    {!selectedClass ? (
                        <div className="bg-[var(--color-surface-default)] shadow-sm border border-[#E2E8F0] rounded-3xl p-12 text-center text-[var(--color-secondary-slate)] flex flex-col items-center gap-4">
                            <Users className="w-12 h-12 text-slate-700" />
                            <p>Select a class to begin marking attendance.</p>
                        </div>
                    ) : isStudentsLoading || isAttendanceLoading ? (
                        <div className="flex justify-center p-20">
                            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="relative group mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-secondary-slate)] group-focus-within:text-[var(--color-tertiary-blue)] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Quick search by name or ID..."
                                    className="w-full bg-[var(--color-surface-default)] shadow-sm border border-[#E2E8F0] rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium text-[var(--color-primary-navy)]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {filteredStudents?.map((student) => (
                                    <div
                                        key={student._id}
                                        className="group bg-[var(--color-surface-default)] shadow-sm backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between hover:border-[#E2E8F0] transition-all shadow-lg shadow-black/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full bg-[var(--color-background)] border border-[#E2E8F0] flex items-center justify-center text-[var(--color-primary-navy)] font-bold border border-[#E2E8F0] uppercase">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[var(--color-primary-navy)] font-semibold">{student.name}</div>
                                                <div className="text-[var(--color-secondary-slate)] text-[10px] font-mono tracking-wider uppercase">{student.studentId || 'ID Pending'}</div>
                                            </div>
                                        </div>

                                        <div className="flex bg-[var(--color-background)] p-1.5 rounded-xl border border-[#E2E8F0]">
                                            {getStatusButton(
                                                student._id,
                                                'PRESENT',
                                                <CheckCircle className={`w-3.5 h-3.5 ${records[student._id] === 'PRESENT' ? 'opacity-100' : 'opacity-30'}`} />,
                                                'P',
                                                'bg-emerald-500',
                                                'shadow-emerald-500/20'
                                            )}
                                            {getStatusButton(
                                                student._id,
                                                'ABSENT',
                                                <XCircle className={`w-3.5 h-3.5 ${records[student._id] === 'ABSENT' ? 'opacity-100' : 'opacity-30'}`} />,
                                                'A',
                                                'bg-red-500',
                                                'shadow-red-500/20'
                                            )}
                                            {getStatusButton(
                                                student._id,
                                                'LATE',
                                                <Clock className={`w-3.5 h-3.5 ${records[student._id] === 'LATE' ? 'opacity-100' : 'opacity-30'}`} />,
                                                'L',
                                                'bg-amber-500',
                                                'shadow-amber-500/20'
                                            )}
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


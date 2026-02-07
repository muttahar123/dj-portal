import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
    Plus,
    BookOpen,
    Users,
    Search,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    Trash2,
    Edit3,
    X
} from 'lucide-react';
import { toast } from 'react-toastify';

const ClassManagement = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        teacher: '',
        students: [],
        schedule: [{ day: 'Monday', startTime: '', endTime: '', room: '' }]
    });

    // Fetch classes
    const { data: classes, isLoading: isClassesLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const res = await api.get('/admin/classes');
            return res.data.data;
        }
    });

    // Fetch teachers for dropdown
    const { data: teachers } = useQuery({
        queryKey: ['users', 'TEACHER'],
        queryFn: async () => {
            const res = await api.get('/admin/users?role=TEACHER');
            return res.data.data;
        }
    });

    // Fetch all students for selection
    const { data: allStudents } = useQuery({
        queryKey: ['users', 'STUDENT'],
        queryFn: async () => {
            const res = await api.get('/admin/users?role=STUDENT');
            return res.data.data;
        }
    });

    const createClassMutation = useMutation({
        mutationFn: (classData) => api.post('/admin/classes', classData),
        onSuccess: () => {
            queryClient.invalidateQueries(['classes']);
            toast.success('Class created successfully');
            closeModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create class');
        }
    });

    const updateClassMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/admin/classes/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['classes']);
            toast.success('Class updated successfully');
            closeModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update class');
        }
    });

    const deleteClassMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/classes/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['classes']);
            toast.success('Class deleted successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete class');
        }
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClass(null);
        setFormData({
            name: '', code: '', teacher: '', students: [],
            schedule: [{ day: 'Monday', startTime: '', endTime: '', room: '' }]
        });
    };

    const openEditModal = (cls) => {
        setEditingClass(cls);
        setFormData({
            name: cls.name,
            code: cls.code,
            teacher: cls.teacher?._id || '',
            students: cls.students?.map(s => s._id) || [],
            schedule: cls.schedule?.length > 0 ? cls.schedule : [{ day: 'Monday', startTime: '', endTime: '', room: '' }]
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleScheduleChange = (index, field, value) => {
        const newSchedule = [...formData.schedule];
        newSchedule[index][field] = value;
        setFormData({ ...formData, schedule: newSchedule });
    };

    const addScheduleItem = () => {
        setFormData({
            ...formData,
            schedule: [...formData.schedule, { day: 'Monday', startTime: '', endTime: '', room: '' }]
        });
    };

    const removeScheduleItem = (index) => {
        const newSchedule = formData.schedule.filter((_, i) => i !== index);
        setFormData({ ...formData, schedule: newSchedule.length > 0 ? newSchedule : [{ day: 'Monday', startTime: '', endTime: '', room: '' }] });
    };

    const handleStudentToggle = (studentId) => {
        const newStudents = formData.students.includes(studentId)
            ? formData.students.filter(id => id !== studentId)
            : [...formData.students, studentId];
        setFormData({ ...formData, students: newStudents });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingClass) {
            updateClassMutation.mutate({ id: editingClass._id, data: formData });
        } else {
            createClassMutation.mutate(formData);
        }
    };

    const handleDelete = (cls) => {
        if (window.confirm(`Are you sure you want to delete "${cls.name}"?`)) {
            deleteClassMutation.mutate(cls._id);
        }
    };

    const isPending = createClassMutation.isPending || updateClassMutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                        Class Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Configure academic classes, schedules, and enrollments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Create New Class
                </button>
            </div>

            {/* Classes Grid */}
            {isClassesLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : classes?.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    No classes found. Start by creating a new class.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes?.map((cls) => (
                        <div key={cls._id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded tracking-widest">{cls.code}</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-1">{cls.name}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                                <Users className="w-4 h-4" />
                                <span>{cls.students?.length} Students Enrolled</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                {cls.schedule?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-500 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="font-semibold text-slate-400 uppercase tracking-tighter w-16">{item.day}</span>
                                        <Clock className="w-3.5 h-3.5 ml-1 text-slate-600" />
                                        <span className="text-slate-300 font-medium">{item.startTime} - {item.endTime}</span>
                                        <MapPin className="w-3.5 h-3.5 ml-1 text-slate-600" />
                                        <span className="text-slate-300 font-medium">{item.room}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                        {cls.teacher?.name?.charAt(0)}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{cls.teacher?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEditModal(cls)}
                                        className="text-slate-500 hover:text-blue-400 transition-colors p-1.5 hover:bg-blue-500/10 rounded-lg"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cls)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Class Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="p-8 overflow-y-auto scrollbar-hide">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {editingClass ? <Edit3 className="text-blue-500" /> : <Plus className="text-blue-500" />}
                                    {editingClass ? 'Edit Class' : 'Configure New Class'}
                                </h2>
                                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Class Name</label>
                                        <input
                                            name="name"
                                            required
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all text-sm text-white"
                                            placeholder="e.g. Theoretical Physics"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Class Code</label>
                                        <input
                                            name="code"
                                            required
                                            disabled={!!editingClass}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono tracking-widest text-white disabled:opacity-50"
                                            placeholder="PHY-101"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Assign Teacher</label>
                                    <select
                                        name="teacher"
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all text-sm text-white"
                                        value={formData.teacher}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a teacher</option>
                                        {teachers?.map(t => (
                                            <option key={t._id} value={t._id}>{t.name} ({t.department})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Class Schedule</label>
                                        <button
                                            type="button"
                                            onClick={addScheduleItem}
                                            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 uppercase bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20"
                                        >
                                            <Plus className="w-3 h-3" /> Add Item
                                        </button>
                                    </div>

                                    {formData.schedule.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50">
                                            <select
                                                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-white"
                                                value={item.day}
                                                onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)}
                                            >
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Start"
                                                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-white"
                                                value={item.startTime}
                                                onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="End"
                                                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-white"
                                                value={item.endTime}
                                                onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Room"
                                                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-white"
                                                value={item.room}
                                                onChange={(e) => handleScheduleChange(idx, 'room', e.target.value)}
                                            />
                                            {formData.schedule.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeScheduleItem(idx)}
                                                    className="text-red-400 hover:text-red-300 transition-colors flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Enroll Students ({formData.students.length} selected)</label>
                                    <div className="bg-slate-950/30 border border-slate-800 rounded-2xl p-4 h-48 overflow-y-auto scrollbar-hide space-y-2">
                                        {allStudents?.map(s => (
                                            <div
                                                key={s._id}
                                                onClick={() => handleStudentToggle(s._id)}
                                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${formData.students.includes(s._id)
                                                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-200'
                                                    : 'bg-slate-900/50 border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] uppercase font-bold text-slate-500">{s.name.charAt(0)}</div>
                                                    <div className="text-xs font-medium">{s.name}</div>
                                                </div>
                                                {formData.students.includes(s._id) && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    disabled={isPending}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : editingClass ? 'Update Class' : 'Initialize Class Connection'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;


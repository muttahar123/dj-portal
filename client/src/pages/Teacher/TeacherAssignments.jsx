import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
    FilePlus,
    FileText,
    Clock,
    BookOpen,
    Target,
    MoreVertical,
    Calendar,
    AlertCircle,
    ChevronRight,
    User,
    GraduationCap,
    Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const TeacherAssignments = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewSubmissionsId, setViewSubmissionsId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: '',
        dueDate: '',
        points: 100
    });

    // Fetch teacher's classes for assignment creation
    const { data: classes } = useQuery({
        queryKey: ['teacher-classes'],
        queryFn: async () => {
            const res = await api.get('/teacher/classes');
            return res.data.data;
        }
    });

    // Fetch teacher's assignments
    const { data: assignments, isLoading } = useQuery({
        queryKey: ['teacher-assignments'],
        queryFn: async () => {
            const res = await api.get('/assignments');
            return res.data.data;
        }
    });

    // Fetch submissions for active view
    const { data: currentSubmissions, isLoading: submissionsLoading } = useQuery({
        queryKey: ['submissions', viewSubmissionsId],
        queryFn: async () => {
            const res = await api.get(`/assignments/${viewSubmissionsId}/submissions`);
            return res.data.data;
        },
        enabled: !!viewSubmissionsId
    });

    const createAssignmentMutation = useMutation({
        mutationFn: (data) => api.post('/assignments', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['teacher-assignments']);
            toast.success('Assignment published successfully');
            setIsModalOpen(false);
            setFormData({ title: '', description: '', classId: '', dueDate: '', points: 100 });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create assignment');
        }
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createAssignmentMutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-500" />
                        Curriculum Assignments
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Design and publish tasks for your classes.</p>
                </div>
                {!viewSubmissionsId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <FilePlus className="w-5 h-5" />
                        New Assignment
                    </button>
                )}
                {viewSubmissionsId && (
                    <button
                        onClick={() => setViewSubmissionsId(null)}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                    >
                        Back to Explorer
                    </button>
                )}
            </div>

            {!viewSubmissionsId ? (
                isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : assignments?.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-16 text-center text-slate-500 flex flex-col items-center gap-4">
                        <p className="text-lg font-medium text-slate-300">No active assignments</p>
                        <p className="text-sm">Start by creating your first course assignment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {assignments?.map((assignment) => (
                            <div key={assignment._id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all group flex flex-col h-full relative overflow-hidden shadow-xl">
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex gap-2">
                                        <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-indigo-500/20">
                                            {assignment.class?.code || 'UNASSIGNED'}
                                        </span>
                                        <span className="bg-slate-800/50 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-slate-800">
                                            {assignment.points} PTS
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-100 mb-2 truncate group-hover:text-indigo-400 transition-colors">{assignment.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">{assignment.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 text-xs">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Due: {format(new Date(assignment.dueDate), 'MMM dd, p')}</span>
                                    </div>
                                    <button
                                        onClick={() => setViewSubmissionsId(assignment._id)}
                                        className="flex items-center gap-1 text-indigo-400 font-bold hover:underline"
                                    >
                                        Submissions <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 bg-slate-800/20 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-slate-100">Review Student Work</h2>
                        <p className="text-xs text-slate-500 mt-1">Assignment ID: {viewSubmissionsId}</p>
                    </div>
                    <div className="p-0">
                        {submissionsLoading ? (
                            <div className="p-20 flex justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                        ) : currentSubmissions?.length === 0 ? (
                            <div className="p-20 text-center text-slate-500 italic">No submissions received yet for this assignment.</div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {currentSubmissions?.map(sub => (
                                    <div key={sub._id} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                                                {sub.student?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-slate-100 font-semibold">{sub.student?.name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono">{sub.student?.studentId}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Submitted</div>
                                                <div className="text-xs text-slate-300 font-medium">{format(new Date(sub.createdAt), 'MMM dd, HH:mm')}</div>
                                            </div>
                                            <a
                                                href={sub.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-600/5"
                                            >
                                                View Bundle
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <FilePlus className="text-indigo-500" />
                                    New Assignment
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl font-bold">×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Class</label>
                                    <select
                                        name="classId"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                                        value={formData.classId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a class</option>
                                        {classes?.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Assignment Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                                        placeholder="e.g. Lab Report 1: Optics"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Instructions</label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm transition-all resize-none"
                                        placeholder="Detail the tasks and objectives..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Deadline</label>
                                        <input
                                            name="dueDate"
                                            type="datetime-local"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm transition-all text-white"
                                            value={formData.dueDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Max Points</label>
                                        <input
                                            name="points"
                                            type="number"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                                            value={formData.points}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={createAssignmentMutation.isPending}
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                                >
                                    {createAssignmentMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : 'Publish Assignment'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherAssignments;

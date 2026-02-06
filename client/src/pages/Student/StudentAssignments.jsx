import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
    FileText,
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Send,
    Link as LinkIcon,
    X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const StudentAssignments = () => {
    const queryClient = useQueryClient();
    const [submissionModalId, setSubmissionModalId] = useState(null);
    const [fileUrl, setFileUrl] = useState('');

    const { data: assignments, isLoading } = useQuery({
        queryKey: ['student-assignments-view'],
        queryFn: async () => {
            const res = await api.get('/student/assignments');
            return res.data.data;
        }
    });

    const submitMutation = useMutation({
        mutationFn: ({ id, fileUrl }) => api.post(`/assignments/${id}/submit`, { fileUrl }),
        onSuccess: () => {
            toast.success('Assignment submitted successfully!');
            setSubmissionModalId(null);
            setFileUrl('');
            queryClient.invalidateQueries(['student-assignments-view']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to submit assignment');
        }
    });

    const handleLinkSubmit = (e) => {
        e.preventDefault();
        if (!fileUrl) return toast.warning('Please provide a valid URL');
        submitMutation.mutate({ id: submissionModalId, fileUrl });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-500" />
                        Curriculum Tasks
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Submit your coursework and track evaluations.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                </div>
            ) : assignments?.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-16 text-center text-slate-500 flex flex-col items-center gap-4 shadow-xl">
                    <p className="text-lg font-medium text-slate-300 uppercase tracking-widest">No Active Tasks</p>
                    <p className="text-sm">Enjoy your session. New assignments will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {assignments?.map((assignment) => {
                        const isLate = new Date() > new Date(assignment.dueDate);

                        return (
                            <div key={assignment._id} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all group shadow-2xl flex flex-col md:flex-row">
                                <div className="p-8 md:w-3/4 flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-500/30">
                                            {assignment.class?.name}
                                        </span>
                                        <span className="text-slate-600 text-[10px] uppercase font-mono font-bold tracking-[0.2em]">{assignment.class?.code}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors tracking-tight">{assignment.title}</h3>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2">{assignment.description}</p>

                                    <div className="mt-auto flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2.5 rounded-2xl border border-slate-700/30 shadow-inner">
                                            <Clock className={`w-4 h-4 ${isLate ? 'text-red-500' : 'text-indigo-400'}`} />
                                            <span className={isLate ? 'text-red-400' : 'text-slate-300'}>Due: {format(new Date(assignment.dueDate), 'MMM dd, HH:mm')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2.5 rounded-2xl border border-slate-700/30 shadow-inner">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-slate-300">Max Score: {assignment.points}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:w-1/4 bg-slate-950/40 flex flex-col justify-center items-center text-center gap-6 border-l border-slate-800/50">
                                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-800">
                                        <Send className="w-8 h-8 text-slate-700" />
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => setSubmissionModalId(assignment._id)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-600/10 active:scale-95 text-xs uppercase tracking-widest"
                                        >
                                            Submit Task
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Digital Hand-in</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Submission Modal */}
            {submissionModalId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSubmissionModalId(null)} />
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <LinkIcon className="text-indigo-500 w-6 h-6" />
                                    Turn In Work
                                </h2>
                                <button onClick={() => setSubmissionModalId(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleLinkSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Document Link (Google Drive / GitHub)</label>
                                    <div className="relative group">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="url"
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-indigo-500/50 text-sm transition-all font-medium text-slate-200 placeholder:text-slate-700 shadow-inner"
                                            placeholder="https://drive.google.com/..."
                                            value={fileUrl}
                                            onChange={(e) => setFileUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={submitMutation.isPending}
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 group/submit"
                                >
                                    {submitMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Confirm & Submit
                                            <Send className="w-4 h-4 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                                    By submitting, you confirm this is your own work <br /> according to the institutional guidelines.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAssignments;

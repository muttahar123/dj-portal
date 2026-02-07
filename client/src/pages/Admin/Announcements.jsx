import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Send, Calendar, User, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { format } from 'date-fns';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/announcements', { title, content });
            setAnnouncements([res.data.data, ...announcements]);
            setTitle('');
            setContent('');
            toast.success('Announcement posted successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post announcement');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                        <Megaphone className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Announcements</h1>
                        <p className="text-slate-400 mt-1">Post important notices for all users</p>
                    </div>
                </div>

                {/* Create Announcement Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-8 shadow-xl"
                >
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-blue-400" />
                        New Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Announcement title..."
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your announcement here..."
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Post Announcement
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Announcements List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Announcements</h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : announcements.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800"
                        >
                            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No announcements yet</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {announcements.map((announcement, index) => (
                                <motion.div
                                    key={announcement._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-all"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-2">{announcement.title}</h3>
                                    <p className="text-slate-300 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {announcement.createdBy?.name || 'Admin'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(announcement.createdAt), 'MMM dd, yyyy - hh:mm a')}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Announcements;

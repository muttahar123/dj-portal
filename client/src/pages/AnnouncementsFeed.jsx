import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Calendar, User, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';

const AnnouncementsFeed = () => {
    const { data: announcements, isLoading } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const res = await api.get('/announcements');
            return res.data.data;
        }
    });

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
                        <h1 className="text-3xl font-bold text-[var(--color-primary-navy)]">Announcements</h1>
                        <p className="text-[var(--color-secondary-slate)] mt-1">Stay updated with important notices</p>
                    </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : announcements?.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-[var(--color-surface-default)]/30 rounded-2xl border border-[#E2E8F0]"
                        >
                            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-[var(--color-secondary-slate)]">No announcements available</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {announcements?.map((announcement, index) => (
                                <motion.div
                                    key={announcement._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[var(--color-surface-default)] shadow-sm backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-6 hover:border-[#E2E8F0] transition-all"
                                >
                                    <h3 className="text-lg font-semibold text-[var(--color-primary-navy)] mb-2">{announcement.title}</h3>
                                    <p className="text-[var(--color-primary-navy)] mb-4 whitespace-pre-wrap">{announcement.content}</p>
                                    <div className="flex items-center gap-4 text-sm text-[var(--color-secondary-slate)]">
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

export default AnnouncementsFeed;

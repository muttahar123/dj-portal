import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Megaphone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

const NotificationBell = ({ token }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const containerRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // Connect to socket
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        socketRef.current = io(socketUrl, {
            auth: { token }
        });

        socketRef.current.on('new_announcement', (data) => {
            if (data.action === 'create') {
                const newNotification = {
                    id: Date.now(),
                    type: 'announcement',
                    title: data.data.title,
                    content: data.data.content,
                    createdAt: data.data.createdAt,
                    read: false
                };
                setNotifications(prev => [newNotification, ...prev].slice(0, 10));
                setUnreadCount(prev => prev + 1);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Bell Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen && unreadCount > 0) {
                        markAllAsRead();
                    }
                }}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => setNotifications([])}
                                    className="text-xs text-slate-400 hover:text-white transition-colors"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors group ${!notification.read ? 'bg-blue-500/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                                                <Megaphone className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                                    {notification.content}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(notification.createdAt), 'MMM dd, hh:mm a')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeNotification(notification.id)}
                                                className="p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;

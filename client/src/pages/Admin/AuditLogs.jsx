import React from 'react';
import { FileText, Shield, Activity, Clock } from 'lucide-react';

const AuditLogs = () => {
    const logs = [
        { id: 1, action: 'User Registration', user: 'Admin', target: 'John Doe (Student)', time: '2 hours ago', status: 'SUCCESS' },
        { id: 2, action: 'Class Initialized', user: 'Admin', target: 'Physics III', time: '5 hours ago', status: 'SUCCESS' },
        { id: 3, action: 'Password Reset', user: 'System', target: 'Prof. Smith', time: 'Yesterday', status: 'SUCCESS' },
        { id: 4, action: 'Database Backup', user: 'System', target: 'Primary Node', time: 'Yesterday', status: 'SUCCESS' },
        { id: 5, action: 'Failed Login', user: 'Unknown', target: 'admin@djcollege.com', time: '2 days ago', status: 'WARNING' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary-navy)] flex items-center gap-2">
                    <Shield className="w-6 h-6 text-purple-500" />
                    Security Audit Trail
                </h1>
                <p className="text-[var(--color-secondary-slate)] text-sm mt-1">Immutable record of critical system and administrative actions.</p>
            </div>

            <div className="bg-[var(--color-surface-default)] shadow-sm border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--color-background)] text-[var(--color-secondary-slate)] text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Event Type</th>
                                <th className="px-6 py-4">Initiator</th>
                                <th className="px-6 py-4">Target Object</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4 text-right">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-[#F1F5F9] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[var(--color-surface-default)] border border-[#E2E8F0]">
                                                <Activity className="w-3.5 h-3.5 text-[var(--color-secondary-slate)]" />
                                            </div>
                                            <span className="text-[var(--color-primary-navy)] font-bold text-sm tracking-tight">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-[var(--color-secondary-slate)]">{log.user}</td>
                                    <td className="px-6 py-4 text-xs font-semibold text-[var(--color-primary-navy)] uppercase tracking-tighter">{log.target}</td>
                                    <td className="px-6 py-4 text-[10px] text-[var(--color-secondary-slate)] font-bold uppercase">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {log.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-[var(--color-background)]/20 text-center border-t border-[#E2E8F0]">
                    <button className="text-xs text-[var(--color-secondary-slate)] hover:text-[var(--color-tertiary-sage)] transition-colors font-bold uppercase tracking-widest">
                        Export Full Report (CSV)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;

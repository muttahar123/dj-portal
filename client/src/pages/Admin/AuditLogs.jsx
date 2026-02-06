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
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-purple-500" />
                    Security Audit Trail
                </h1>
                <p className="text-slate-400 text-sm mt-1">Immutable record of critical system and administrative actions.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Event Type</th>
                                <th className="px-6 py-4">Initiator</th>
                                <th className="px-6 py-4">Target Object</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4 text-right">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                                                <Activity className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <span className="text-slate-200 font-bold text-sm tracking-tight">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{log.user}</td>
                                    <td className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-tighter">{log.target}</td>
                                    <td className="px-6 py-4 text-[10px] text-slate-500 font-bold uppercase">
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
                <div className="p-6 bg-slate-950/20 text-center border-t border-slate-800">
                    <button className="text-xs text-slate-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest">
                        Export Full Report (CSV)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;

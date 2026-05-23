import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    ClipboardCheck,
    FileText,
    Settings,
    GraduationCap,
    Calendar,
    X,
    Megaphone,
    UserCircle
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const SidebarLink = ({ to, icon: Icon, label, end = false }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-[var(--radius-default)] transition-all duration-200 group
      ${isActive
                ? 'bg-[var(--color-tertiary-blue)]/10 text-[var(--color-tertiary-blue)] font-semibold'
                : 'text-[var(--color-secondary-slate)] hover:bg-[#F1F5F9] hover:text-[var(--color-primary-navy)]'}
    `}
    >
        {({ isActive }) => (
            <>
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className={isActive ? 'font-semibold' : 'font-medium'}>{label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-[var(--radius-full)] bg-[var(--color-tertiary-blue)]" />
                )}
            </>
        )}
    </NavLink>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user } = useAuthStore();

    const menuItems = {
        ADMIN: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
            { to: '/dashboard/users', icon: Users, label: 'User Management' },
            { to: '/dashboard/classes', icon: BookOpen, label: 'Class Management' },
            { to: '/dashboard/announcements', icon: Megaphone, label: 'Announcements' },
            { to: '/dashboard/audit', icon: FileText, label: 'Audit Logs' },
        ],
        TEACHER: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard', end: true },
            { to: '/dashboard/classes', icon: BookOpen, label: 'My Classes' },
            { to: '/dashboard/attendance', icon: ClipboardCheck, label: 'Attendance' },
            { to: '/dashboard/assignments', icon: FileText, label: 'Assignments' },
            { to: '/dashboard/announcements', icon: Megaphone, label: 'Announcements' },
        ],
        STUDENT: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'My Portal', end: true },
            { to: '/dashboard/student/attendance', icon: ClipboardCheck, label: 'Attendance' },
            { to: '/dashboard/student/assignments', icon: FileText, label: 'Assignments' },
            { to: '/dashboard/schedule', icon: Calendar, label: 'Schedule' },
            { to: '/dashboard/announcements', icon: Megaphone, label: 'Announcements' },
        ]
    };

    const currentMenu = menuItems[user?.role] || [];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-surface-default)] border-r border-[#E2E8F0] transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0] lg:hidden">
                    <span className="text-xl font-bold text-[var(--color-primary-navy)] font-headline">DJ Portal</span>
                    <button onClick={toggleSidebar} className="p-2 -mr-2 text-[var(--color-secondary-slate)]">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-4rem)] lg:h-full p-4">
                    <div className="mb-8 px-2 hidden lg:block">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-background)] border border-[#E2E8F0] flex items-center justify-center p-1">
                                <img src="/dj-science-college-logo.png" alt="DJ Science College Logo" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--color-primary-navy)] font-headline tracking-tight">
                                DJ SCIENCE
                            </h2>
                        </div>
                        <p className="text-xs text-[var(--color-secondary-slate)] font-medium px-1 tracking-wider uppercase">COLLEGE PORTAL</p>
                    </div>

                    <div className="space-y-1 overflow-y-auto flex-1 scrollbar-hide">
                        {currentMenu.map((item, index) => (
                            <SidebarLink key={index} {...item} />
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-[#E2E8F0] space-y-1">
                        <SidebarLink to="/dashboard/profile" icon={UserCircle} label="Profile" />
                        <SidebarLink to="/dashboard/settings" icon={Settings} label="Settings" />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

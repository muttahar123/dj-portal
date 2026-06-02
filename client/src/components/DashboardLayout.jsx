import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[var(--color-background)] overflow-hidden text-[var(--color-primary-navy)]">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

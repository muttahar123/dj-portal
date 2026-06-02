import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-default)] border border-[#E2E8F0] p-6 rounded-[var(--radius-default)] flex items-center gap-4 hover:shadow-[var(--shadow-md)] transition-shadow shadow-[var(--shadow-default)]"
    >
        <div className={`w-12 h-12 rounded-[var(--radius-default)] flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="text-[var(--color-secondary-slate)] text-sm font-medium tracking-wide">{title}</h3>
            <p className="text-2xl font-bold text-white mt-0.5 font-mono">{value}</p>
        </div>
    </motion.div>
);

export default StatsCard;

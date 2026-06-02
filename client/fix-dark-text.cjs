const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix StatsCard
    if (filePath.endsWith('StatsCard.jsx')) {
        content = content.replace(/text-\[var\(--color-primary-navy\)\]/g, 'text-white');
    }
    
    // Fix Navbar Avatar
    if (filePath.endsWith('Navbar.jsx')) {
        content = content.replace(/capitalize text-\[var\(--color-primary-navy\)\]/g, 'capitalize text-white');
    }

    // Fix UserManagement Avatar
    if (filePath.endsWith('UserManagement.jsx')) {
        content = content.replace(/justify-center text-\[var\(--color-primary-navy\)\] font-bold border border-\[#E2E8F0\]/g, 'justify-center text-white font-bold');
        content = content.replace(/bg-gradient-to-br from-slate-700 to-slate-800/g, 'bg-[var(--color-tertiary-blue)]');
        content = content.replace(/bg-\[#0F172A\]\/60/g, 'bg-[#0F172A]/60');
    }

    // Generic fixes for buttons/badges
    // If we find bg-something-500 or 600 followed closely by text-[var(--color-primary-navy)]
    content = content.replace(/(bg-(?:red|orange|emerald|purple|blue)-(?:500|600)[^>]*?)text-\[var\(--color-primary-navy\)\]/g, '$1text-white');
    
    // Also the other way around: text-[...] before bg-...
    content = content.replace(/text-\[var\(--color-primary-navy\)\]([^>]*?bg-(?:red|orange|emerald|purple|blue)-(?:500|600))/g, 'text-white$1');
    
    // bg-[var(--color-primary-navy)] text-[...] -> text-white
    content = content.replace(/(bg-\[var\(--color-primary-navy\)\][^>]*?)text-\[var\(--color-primary-navy\)\]/g, '$1text-white');
    content = content.replace(/text-\[var\(--color-primary-navy\)\]([^>]*?bg-\[var\(--color-primary-navy\)\])/g, 'text-white$1');
    
    // bg-[var(--color-tertiary-blue)] text-[...] -> text-white
    content = content.replace(/(bg-\[var\(--color-tertiary-blue\)\][^>]*?)text-\[var\(--color-primary-navy\)\]/g, '$1text-white');
    content = content.replace(/text-\[var\(--color-primary-navy\)\]([^>]*?bg-\[var\(--color-tertiary-blue\)\])/g, 'text-white$1');
    
    // Fix Profile Avatar
    if (filePath.endsWith('Profile.jsx')) {
        content = content.replace(/from-slate-700 to-slate-900/g, 'bg-[var(--color-tertiary-blue)]');
        content = content.replace(/bg-slate-800/g, 'bg-[var(--color-primary-navy)]');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.basename(filePath));
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walkDir(directoryPath);
console.log("Dark text fixes applied");

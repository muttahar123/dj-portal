const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Protect text-white in buttons and badges that have dark backgrounds
    // We will look for class strings containing bg-blue, bg-red, bg-emerald, bg-purple, bg-slate-800 (wait, slate-800 is changed)
    // A simpler way: just replace text-white everywhere, then replace bg-[var(--color-primary-navy)] text-[var(--color-primary-navy)] with bg-[var(--color-primary-navy)] text-white
    
    // First, standard replacements
    content = content.replace(/text-slate-100/g, 'text-[var(--color-primary-navy)]');
    content = content.replace(/text-slate-200/g, 'text-[var(--color-primary-navy)]');
    content = content.replace(/text-slate-300/g, 'text-[var(--color-primary-navy)]');
    content = content.replace(/text-slate-400/g, 'text-[var(--color-secondary-slate)]');
    content = content.replace(/text-slate-500/g, 'text-[var(--color-secondary-slate)]');
    
    // Borders
    content = content.replace(/border-slate-800/g, 'border-[#E2E8F0]');
    content = content.replace(/border-slate-700/g, 'border-[#E2E8F0]');
    
    // Backgrounds
    content = content.replace(/bg-slate-900\/40/g, 'bg-[var(--color-surface-default)] shadow-sm');
    content = content.replace(/bg-slate-900\/50/g, 'bg-[var(--color-surface-default)] shadow-sm');
    content = content.replace(/bg-slate-950\/60/g, 'bg-[var(--color-background)]');
    content = content.replace(/bg-slate-950\/50/g, 'bg-[var(--color-background)]');
    content = content.replace(/bg-slate-950\/40/g, 'bg-[var(--color-background)]');
    content = content.replace(/bg-slate-950\/80/g, 'bg-[#0F172A]/60'); // modal overlay
    content = content.replace(/bg-slate-900/g, 'bg-[var(--color-surface-default)]');
    content = content.replace(/bg-slate-950/g, 'bg-[var(--color-background)]');
    
    // bg-slate-800 is used for buttons/inputs sometimes
    content = content.replace(/bg-slate-800\/50/g, 'bg-[var(--color-background)]');
    content = content.replace(/bg-slate-800\/20/g, 'bg-[#F1F5F9]');
    content = content.replace(/bg-slate-800/g, 'bg-[var(--color-background)] border border-[#E2E8F0]');
    
    content = content.replace(/bg-blue-600/g, 'bg-[var(--color-primary-navy)] text-white');
    content = content.replace(/bg-blue-700/g, 'bg-[#020617]');
    content = content.replace(/text-blue-400/g, 'text-[var(--color-tertiary-sage)]');
    content = content.replace(/text-blue-500/g, 'text-[var(--color-tertiary-sage)]');
    
    // Convert all text-white to primary navy EXCEPT if it's already text-white added above
    // Actually, text-white is used heavily. Let's just do a naive replace of text-white to text-[var(--color-primary-navy)]
    content = content.replace(/text-white/g, 'text-[var(--color-primary-navy)]');
    
    // Then fix the buttons we just broke by replacing bg-[var(--color-primary-navy)] text-[var(--color-primary-navy)] 
    // with bg-[var(--color-primary-navy)] text-white
    content = content.replace(/bg-\[var\(--color-primary-navy\)\]\s+text-\[var\(--color-primary-navy\)\]/g, 'bg-[var(--color-primary-navy)] text-white');
    content = content.replace(/text-\[var\(--color-primary-navy\)\]\s+px-5\s+py-2\.5/g, 'text-white px-5 py-2.5'); // Common button class
    content = content.replace(/text-\[var\(--color-primary-navy\)\]\s+px-6\s+py-3/g, 'text-white px-6 py-3'); // Common button class
    content = content.replace(/text-\[var\(--color-primary-navy\)\]\s+font-bold\s+py-4/g, 'text-white font-bold py-4'); // Common button class

    fs.writeFileSync(filePath, content, 'utf8');
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
console.log("Colors fixed");

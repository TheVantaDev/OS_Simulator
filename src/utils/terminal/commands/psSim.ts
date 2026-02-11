import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Dummy Process Data ──────────────────────────────────────────
const DUMMY_PROCESSES = [
    { pid: 1, ppid: 0, user: 'root', state: 'S', cpu: 0.0, mem: 0.1, vsz: 16984, rss: 3200, tty: '?', time: '0:01', command: '/sbin/init' },
    { pid: 2, ppid: 0, user: 'root', state: 'S', cpu: 0.0, mem: 0.0, vsz: 0, rss: 0, tty: '?', time: '0:00', command: '[kthreadd]' },
    { pid: 42, ppid: 1, user: 'root', state: 'S', cpu: 0.1, mem: 0.4, vsz: 45312, rss: 8192, tty: '?', time: '0:05', command: '/usr/lib/systemd/systemd-journald' },
    { pid: 128, ppid: 1, user: 'root', state: 'R', cpu: 2.3, mem: 1.2, vsz: 128000, rss: 24576, tty: '?', time: '1:23', command: '/usr/bin/Xorg :0' },
    { pid: 256, ppid: 128, user: 'user', state: 'S', cpu: 0.8, mem: 3.4, vsz: 512000, rss: 69632, tty: '?', time: '0:45', command: 'aurora-desktop' },
    { pid: 312, ppid: 256, user: 'user', state: 'S', cpu: 0.2, mem: 1.1, vsz: 256000, rss: 22528, tty: '?', time: '0:12', command: 'finder' },
    { pid: 415, ppid: 256, user: 'user', state: 'R', cpu: 1.5, mem: 2.8, vsz: 384000, rss: 57344, tty: 'pts/0', time: '0:30', command: '/bin/bash' },
    { pid: 512, ppid: 415, user: 'user', state: 'R', cpu: 0.0, mem: 0.1, vsz: 8192, rss: 2048, tty: 'pts/0', time: '0:00', command: 'ps-sim' },
    { pid: 667, ppid: 1, user: 'root', state: 'S', cpu: 0.0, mem: 0.3, vsz: 32768, rss: 6144, tty: '?', time: '0:02', command: '[ksoftirqd/0]' },
    { pid: 789, ppid: 256, user: 'user', state: 'T', cpu: 0.0, mem: 0.5, vsz: 64000, rss: 10240, tty: '?', time: '0:08', command: 'notepad (stopped)' },
];

const STATE_LABELS: Record<string, string> = {
    R: 'Running',
    S: 'Sleeping',
    T: 'Stopped',
    Z: 'Zombie',
    D: 'Disk Sleep',
};

const STATE_COLORS: Record<string, string> = {
    R: 'text-emerald-400',
    S: 'text-blue-400',
    T: 'text-amber-400',
    Z: 'text-red-400',
    D: 'text-purple-400',
};

export const psSim: TerminalCommand = {
    name: 'ps-sim',
    description: 'Display simulated process table (educational)',
    usage: 'ps-sim [--all] [--state=R|S|T|Z]',
    execute: ({ args }) => {
        const showAll = args.includes('--all') || args.includes('-a');
        const stateFilter = args.find(a => a.startsWith('--state='))?.split('=')[1]?.toUpperCase();

        let procs = [...DUMMY_PROCESSES];
        if (stateFilter) {
            procs = procs.filter(p => p.state === stateFilter);
        }

        if (procs.length === 0) {
            return { output: [`ps-sim: no processes found with state '${stateFilter}'`], error: true };
        }

        const output: (string | React.ReactNode)[] = [];

        // Header
        output.push(createElement('div', { className: 'text-white/40 text-xs mb-1' },
            '📋 Simulated Process Table (dummy data for educational purposes)'
        ));

        // Table header
        const headerCols = showAll
            ? 'PID   PPID  USER      STAT  %CPU  %MEM    VSZ    RSS TTY      TIME COMMAND'
            : 'PID   USER      STAT  %CPU  %MEM COMMAND';

        output.push(createElement('div', { className: 'font-mono text-xs text-indigo-400 font-bold whitespace-pre' }, headerCols));

        // Process rows
        for (const p of procs) {
            const stateLabel = `${p.state}`;
            const stateClass = STATE_COLORS[p.state] || 'text-white/60';

            if (showAll) {
                output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre flex' },
                    createElement('span', { className: 'text-white/70' },
                        `${String(p.pid).padStart(5)} ${String(p.ppid).padStart(5)}  ${p.user.padEnd(8)}  `
                    ),
                    createElement('span', { className: stateClass }, `${stateLabel.padEnd(4)}`),
                    createElement('span', { className: 'text-white/50' },
                        `  ${p.cpu.toFixed(1).padStart(4)}  ${p.mem.toFixed(1).padStart(4)} ${String(p.vsz).padStart(6)} ${String(p.rss).padStart(6)} ${p.tty.padEnd(8)} ${p.time.padStart(4)} `
                    ),
                    createElement('span', { className: 'text-white/80' }, p.command),
                ));
            } else {
                output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre flex' },
                    createElement('span', { className: 'text-white/70' }, `${String(p.pid).padStart(5)}  ${p.user.padEnd(8)}  `),
                    createElement('span', { className: stateClass }, `${stateLabel.padEnd(4)}`),
                    createElement('span', { className: 'text-white/50' }, `  ${p.cpu.toFixed(1).padStart(4)}  ${p.mem.toFixed(1).padStart(4)} `),
                    createElement('span', { className: 'text-white/80' }, p.command),
                ));
            }
        }

        // Summary & educational note
        output.push('');
        output.push(createElement('div', { className: 'text-white/30 text-xs' },
            `${procs.length} processes shown. States: ${Object.entries(STATE_LABELS).map(([k, v]) => `${k}=${v}`).join(', ')}`
        ));
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Tip: In real Linux, use "ps aux" for all processes. Process states help understand CPU scheduling.'
        ));

        return { output };
    },
};

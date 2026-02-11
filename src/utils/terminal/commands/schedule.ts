import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Scheduling Engine ──────────────────────────────────────────
interface Proc { name: string; at: number; bt: number; pri: number; }
interface GanttEntry { name: string; start: number; end: number; }
interface Result { name: string; ct: number; tat: number; wt: number; }

const DEFAULT_PROCESSES: Proc[] = [
    { name: 'P1', at: 0, bt: 6, pri: 2 },
    { name: 'P2', at: 1, bt: 4, pri: 1 },
    { name: 'P3', at: 2, bt: 2, pri: 3 },
    { name: 'P4', at: 3, bt: 3, pri: 2 },
];

function runFCFS(procs: Proc[]): { gantt: GanttEntry[]; results: Result[] } {
    const sorted = [...procs].sort((a, b) => a.at - b.at);
    const gantt: GanttEntry[] = [];
    const results: Result[] = [];
    let t = 0;
    for (const p of sorted) {
        if (t < p.at) t = p.at;
        gantt.push({ name: p.name, start: t, end: t + p.bt });
        const ct = t + p.bt;
        results.push({ name: p.name, ct, tat: ct - p.at, wt: t - p.at });
        t = ct;
    }
    return { gantt, results };
}

function runSJF(procs: Proc[]): { gantt: GanttEntry[]; results: Result[] } {
    const remaining = [...procs];
    const gantt: GanttEntry[] = [];
    const results: Result[] = [];
    const done = new Set<string>();
    let t = 0;
    while (done.size < procs.length) {
        const avail = remaining.filter(p => p.at <= t && !done.has(p.name));
        if (avail.length === 0) { t = Math.min(...remaining.filter(p => !done.has(p.name)).map(p => p.at)); continue; }
        avail.sort((a, b) => a.bt - b.bt);
        const p = avail[0];
        gantt.push({ name: p.name, start: t, end: t + p.bt });
        const ct = t + p.bt;
        results.push({ name: p.name, ct, tat: ct - p.at, wt: t - p.at });
        done.add(p.name);
        t = ct;
    }
    return { gantt, results };
}

function runRR(procs: Proc[], quantum: number): { gantt: GanttEntry[]; results: Result[] } {
    const sorted = [...procs].sort((a, b) => a.at - b.at);
    const queue: { name: string; at: number; rem: number }[] = [];
    const gantt: GanttEntry[] = [];
    const completed = new Map<string, number>();
    let t = 0, idx = 0;

    while (idx < sorted.length && sorted[idx].at <= t) { queue.push({ ...sorted[idx], rem: sorted[idx].bt }); idx++; }

    while (queue.length > 0 || idx < sorted.length) {
        if (queue.length === 0) { t = sorted[idx].at; while (idx < sorted.length && sorted[idx].at <= t) { queue.push({ ...sorted[idx], rem: sorted[idx].bt }); idx++; } }
        const p = queue.shift()!;
        const exec = Math.min(p.rem, quantum);
        gantt.push({ name: p.name, start: t, end: t + exec });
        t += exec;
        p.rem -= exec;
        while (idx < sorted.length && sorted[idx].at <= t) { queue.push({ ...sorted[idx], rem: sorted[idx].bt }); idx++; }
        if (p.rem > 0) queue.push(p); else completed.set(p.name, t);
    }

    const results: Result[] = procs.map(p => {
        const ct = completed.get(p.name)!;
        return { name: p.name, ct, tat: ct - p.at, wt: ct - p.at - p.bt };
    });
    return { gantt, results };
}

function runPriority(procs: Proc[]): { gantt: GanttEntry[]; results: Result[] } {
    const remaining = [...procs];
    const gantt: GanttEntry[] = [];
    const results: Result[] = [];
    const done = new Set<string>();
    let t = 0;
    while (done.size < procs.length) {
        const avail = remaining.filter(p => p.at <= t && !done.has(p.name));
        if (avail.length === 0) { t = Math.min(...remaining.filter(p => !done.has(p.name)).map(p => p.at)); continue; }
        avail.sort((a, b) => a.pri - b.pri);
        const p = avail[0];
        gantt.push({ name: p.name, start: t, end: t + p.bt });
        const ct = t + p.bt;
        results.push({ name: p.name, ct, tat: ct - p.at, wt: t - p.at });
        done.add(p.name);
        t = ct;
    }
    return { gantt, results };
}

// ─── ASCII Gantt Renderer ───────────────────────────────────────
function renderAsciiGantt(gantt: GanttEntry[]): React.ReactNode[] {
    const total = gantt[gantt.length - 1]?.end || 0;
    const scale = Math.min(2, Math.max(1, Math.floor(40 / total))); // chars per unit

    const colors = ['text-indigo-400', 'text-pink-400', 'text-teal-400', 'text-amber-400', 'text-purple-400', 'text-red-400'];
    const blocks: React.ReactNode[] = [];

    // Timeline bar
    let bar = '';
    let labels = '';
    gantt.forEach((g) => {
        const width = (g.end - g.start) * scale;
        const block = `|${g.name.padStart(Math.floor(width / 2)).padEnd(width - 1)}`;
        bar += block;
        labels += `${String(g.start).padEnd(width)}`;
    });
    bar += '|';
    labels += String(gantt[gantt.length - 1]?.end || 0);

    blocks.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
        gantt.map((g, i) => {
            const width = (g.end - g.start) * scale;
            const block = `|${g.name.padStart(Math.floor(width / 2)).padEnd(width - 1)}`;
            return createElement('span', { key: i, className: colors[i % colors.length] }, block);
        }),
        createElement('span', { className: 'text-white/40' }, '|'),
    ));

    blocks.push(createElement('div', { className: 'font-mono text-xs text-white/30 whitespace-pre' }, labels));

    return blocks;
}

export const schedule: TerminalCommand = {
    name: 'schedule',
    description: 'Run CPU scheduling algorithms (educational)',
    usage: 'schedule --algo=fcfs|sjf|rr|priority [--quantum=N]',
    execute: ({ args }) => {
        const algoArg = args.find(a => a.startsWith('--algo='))?.split('=')[1]?.toLowerCase();
        const quantumArg = parseInt(args.find(a => a.startsWith('--quantum='))?.split('=')[1] || '2');
        const algo = algoArg || 'fcfs';

        if (!['fcfs', 'sjf', 'rr', 'priority'].includes(algo)) {
            return { output: [`schedule: unknown algorithm '${algo}'. Use: fcfs, sjf, rr, priority`], error: true };
        }

        const output: (string | React.ReactNode)[] = [];

        // Header
        const algoNames: Record<string, string> = { fcfs: 'First Come First Served', sjf: 'Shortest Job First', rr: 'Round Robin', priority: 'Priority Scheduling' };
        output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
            `⚙️  CPU Scheduling — ${algoNames[algo]}`
        ));
        output.push('');

        // Process table
        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Process Table:'));
        output.push(createElement('div', { className: 'font-mono text-xs text-white/60 whitespace-pre' },
            'Process  Arrival  Burst  Priority'
        ));
        for (const p of DEFAULT_PROCESSES) {
            output.push(createElement('div', { className: 'font-mono text-xs text-white/80 whitespace-pre' },
                `  ${p.name.padEnd(7)}  ${String(p.at).padStart(5)}    ${String(p.bt).padStart(3)}    ${String(p.pri).padStart(5)}`
            ));
        }
        output.push('');

        // Run algorithm
        let result: { gantt: GanttEntry[]; results: Result[] };
        switch (algo) {
            case 'sjf': result = runSJF(DEFAULT_PROCESSES); break;
            case 'rr': result = runRR(DEFAULT_PROCESSES, quantumArg); break;
            case 'priority': result = runPriority(DEFAULT_PROCESSES); break;
            default: result = runFCFS(DEFAULT_PROCESSES);
        }

        if (algo === 'rr') {
            output.push(createElement('div', { className: 'text-amber-400/70 text-xs' }, `Time Quantum: ${quantumArg}`));
            output.push('');
        }

        // Gantt chart
        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Gantt Chart:'));
        output.push(...renderAsciiGantt(result.gantt));
        output.push('');

        // Results table
        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Results:'));
        output.push(createElement('div', { className: 'font-mono text-xs text-indigo-400 whitespace-pre font-bold' },
            'Process  Completion  Turnaround  Waiting'
        ));
        for (const r of result.results) {
            output.push(createElement('div', { className: 'font-mono text-xs text-white/80 whitespace-pre' },
                `  ${r.name.padEnd(7)}  ${String(r.ct).padStart(8)}    ${String(r.tat).padStart(8)}    ${String(r.wt).padStart(5)}`
            ));
        }

        const avgTat = (result.results.reduce((s, r) => s + r.tat, 0) / result.results.length).toFixed(2);
        const avgWt = (result.results.reduce((s, r) => s + r.wt, 0) / result.results.length).toFixed(2);
        output.push(createElement('div', { className: 'font-mono text-xs text-emerald-400 whitespace-pre' },
            `  Avg:    ${' '.repeat(8)}    ${avgTat.padStart(8)}    ${avgWt.padStart(5)}`
        ));

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            `💡 Tip: Try "schedule --algo=rr --quantum=3" to see how quantum size affects performance.`
        ));

        return { output };
    },
};

import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Disk Scheduling Algorithms ──────────────────────────────────
interface DiskStep {
    track: number;
    seekDistance: number;
    direction?: string;
}

function diskFCFS(requests: number[], head: number): { steps: DiskStep[]; totalSeek: number } {
    const steps: DiskStep[] = [];
    let current = head;
    let totalSeek = 0;

    for (const track of requests) {
        const dist = Math.abs(track - current);
        totalSeek += dist;
        steps.push({ track, seekDistance: dist });
        current = track;
    }
    return { steps, totalSeek };
}

function diskSSTF(requests: number[], head: number): { steps: DiskStep[]; totalSeek: number } {
    const steps: DiskStep[] = [];
    const pending = [...requests];
    let current = head;
    let totalSeek = 0;

    while (pending.length > 0) {
        let minDist = Infinity;
        let minIdx = 0;
        for (let i = 0; i < pending.length; i++) {
            const dist = Math.abs(pending[i] - current);
            if (dist < minDist) { minDist = dist; minIdx = i; }
        }
        totalSeek += minDist;
        steps.push({ track: pending[minIdx], seekDistance: minDist });
        current = pending[minIdx];
        pending.splice(minIdx, 1);
    }
    return { steps, totalSeek };
}

function diskSCAN(requests: number[], head: number, maxTrack: number): { steps: DiskStep[]; totalSeek: number } {
    const steps: DiskStep[] = [];
    const sorted = [...requests].sort((a, b) => a - b);
    let current = head;
    let totalSeek = 0;

    // Move right first
    const right = sorted.filter(t => t >= head);
    const left = sorted.filter(t => t < head).reverse();

    // Go right to end
    for (const track of right) {
        const dist = Math.abs(track - current);
        totalSeek += dist;
        steps.push({ track, seekDistance: dist, direction: '→' });
        current = track;
    }
    // Go to max track if not already there
    if (current !== maxTrack) {
        const dist = maxTrack - current;
        totalSeek += dist;
        steps.push({ track: maxTrack, seekDistance: dist, direction: '→ (end)' });
        current = maxTrack;
    }
    // Reverse, go left
    for (const track of left) {
        const dist = Math.abs(track - current);
        totalSeek += dist;
        steps.push({ track, seekDistance: dist, direction: '←' });
        current = track;
    }
    return { steps, totalSeek };
}

function diskCSCAN(requests: number[], head: number, maxTrack: number): { steps: DiskStep[]; totalSeek: number } {
    const steps: DiskStep[] = [];
    const sorted = [...requests].sort((a, b) => a - b);
    let current = head;
    let totalSeek = 0;

    const right = sorted.filter(t => t >= head);
    const left = sorted.filter(t => t < head);

    // Go right to end
    for (const track of right) {
        const dist = Math.abs(track - current);
        totalSeek += dist;
        steps.push({ track, seekDistance: dist, direction: '→' });
        current = track;
    }
    // Go to max
    if (current !== maxTrack) {
        const dist = maxTrack - current;
        totalSeek += dist;
        steps.push({ track: maxTrack, seekDistance: dist, direction: '→ (end)' });
        current = maxTrack;
    }
    // Jump to 0
    totalSeek += maxTrack;
    steps.push({ track: 0, seekDistance: maxTrack, direction: '⟳ (jump to 0)' });
    current = 0;
    // Continue right from 0
    for (const track of left) {
        const dist = Math.abs(track - current);
        totalSeek += dist;
        steps.push({ track, seekDistance: dist, direction: '→' });
        current = track;
    }
    return { steps, totalSeek };
}

const DEFAULT_REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67];
const DEFAULT_HEAD = 53;
const DEFAULT_MAX_TRACK = 199;

export const diskSched: TerminalCommand = {
    name: 'disk-sched',
    description: 'Simulate disk scheduling algorithms (educational)',
    usage: 'disk-sched --algo=fcfs|sstf|scan|cscan [--head=N] [--requests=98,183,37,...] [--max=199]',
    execute: ({ args }) => {
        const algoArg = args.find(a => a.startsWith('--algo='))?.split('=')[1]?.toLowerCase() || 'fcfs';
        const head = parseInt(args.find(a => a.startsWith('--head='))?.split('=')[1] || String(DEFAULT_HEAD));
        const reqArg = args.find(a => a.startsWith('--requests='))?.split('=')[1];
        const maxTrack = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1] || String(DEFAULT_MAX_TRACK));
        const requests = reqArg ? reqArg.split(',').map(Number).filter(n => !isNaN(n)) : DEFAULT_REQUESTS;

        if (!['fcfs', 'sstf', 'scan', 'cscan'].includes(algoArg)) {
            return { output: [`disk-sched: unknown algorithm '${algoArg}'. Use: fcfs, sstf, scan, cscan`], error: true };
        }

        const output: (string | React.ReactNode)[] = [];
        const algoNames: Record<string, string> = {
            fcfs: 'FCFS (First Come, First Served)',
            sstf: 'SSTF (Shortest Seek Time First)',
            scan: 'SCAN (Elevator)',
            cscan: 'C-SCAN (Circular SCAN)',
        };

        output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
            `💽 Disk Scheduling — ${algoNames[algoArg]}`
        ));
        output.push(createElement('div', { className: 'text-white/40 text-xs' },
            `Head: ${head} | Requests: [${requests.join(', ')}] | Max Track: ${maxTrack}`
        ));
        output.push('');

        // Run algorithm
        let result: { steps: DiskStep[]; totalSeek: number };
        switch (algoArg) {
            case 'sstf': result = diskSSTF(requests, head); break;
            case 'scan': result = diskSCAN(requests, head, maxTrack); break;
            case 'cscan': result = diskCSCAN(requests, head, maxTrack); break;
            default: result = diskFCFS(requests, head);
        }

        // Header
        output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
            createElement('span', { className: 'text-white/40' }, 'Step  '),
            createElement('span', { className: 'text-white/40' }, 'Track   '),
            createElement('span', { className: 'text-white/40' }, 'Seek    '),
            createElement('span', { className: 'text-white/40' }, 'Dir'),
        ));

        output.push(createElement('div', { className: 'font-mono text-xs text-white/10 whitespace-pre' },
            '─'.repeat(36)
        ));

        // Steps
        result.steps.forEach((step, i) => {
            output.push(createElement('div', { key: `s${i}`, className: 'font-mono text-xs whitespace-pre' },
                createElement('span', { className: 'text-white/40' }, String(i + 1).padStart(4) + '  '),
                createElement('span', { className: 'text-amber-400' }, String(step.track).padEnd(8)),
                createElement('span', { className: step.seekDistance > 50 ? 'text-red-400' : 'text-emerald-400' },
                    String(step.seekDistance).padEnd(8)
                ),
                createElement('span', { className: 'text-white/50' }, step.direction || ''),
            ));
        });

        output.push('');

        // Visual track line
        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Seek Order Visualization:'));
        const order = [head, ...result.steps.map(s => s.track)];
        const maxVal = Math.max(...order, maxTrack);
        const barLen = 50;

        for (let i = 0; i < order.length; i++) {
            const pos = Math.round((order[i] / maxVal) * barLen);
            const line = ' '.repeat(pos) + '●';
            const label = i === 0 ? ` ← HEAD (${order[i]})` : ` (${order[i]})`;
            output.push(createElement('div', { key: `v${i}`, className: 'font-mono text-xs whitespace-pre' },
                createElement('span', { className: i === 0 ? 'text-indigo-400' : 'text-amber-400' }, line),
                createElement('span', { className: 'text-white/30' }, label),
            ));
        }

        output.push('');

        // Summary
        const avgSeek = (result.totalSeek / result.steps.length).toFixed(1);
        output.push(createElement('div', { className: 'font-mono text-xs' },
            createElement('span', { className: 'text-red-400' }, `Total Seek: ${result.totalSeek}`),
            createElement('span', { className: 'text-white/30' }, ' | '),
            createElement('span', { className: 'text-emerald-400' }, `Avg Seek: ${avgSeek}`),
            createElement('span', { className: 'text-white/30' }, ' | '),
            createElement('span', { className: 'text-indigo-400' }, `Steps: ${result.steps.length}`),
        ));

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Tip: Compare algorithms: "disk-sched --algo=scan" vs "disk-sched --algo=sstf"'
        ));

        return { output };
    },
};

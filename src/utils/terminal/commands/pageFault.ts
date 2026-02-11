import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Page Replacement Algorithms ────────────────────────────────
function fifo(pages: number[], frames: number): { steps: { page: number; memory: number[]; fault: boolean }[]; faults: number } {
    const memory: number[] = [];
    const steps: { page: number; memory: number[]; fault: boolean }[] = [];
    let pointer = 0;
    let faults = 0;

    for (const page of pages) {
        if (memory.includes(page)) {
            steps.push({ page, memory: [...memory], fault: false });
        } else {
            faults++;
            if (memory.length < frames) {
                memory.push(page);
            } else {
                memory[pointer % frames] = page;
                pointer++;
            }
            steps.push({ page, memory: [...memory], fault: true });
        }
    }
    return { steps, faults };
}

function lru(pages: number[], frames: number): { steps: { page: number; memory: number[]; fault: boolean }[]; faults: number } {
    const memory: number[] = [];
    const lastUsed = new Map<number, number>();
    const steps: { page: number; memory: number[]; fault: boolean }[] = [];
    let faults = 0;

    pages.forEach((page, time) => {
        if (memory.includes(page)) {
            lastUsed.set(page, time);
            steps.push({ page, memory: [...memory], fault: false });
        } else {
            faults++;
            if (memory.length < frames) {
                memory.push(page);
            } else {
                // Find LRU page
                let lruPage = memory[0];
                let lruTime = lastUsed.get(memory[0]) ?? -1;
                for (const p of memory) {
                    const lt = lastUsed.get(p) ?? -1;
                    if (lt < lruTime) { lruPage = p; lruTime = lt; }
                }
                const idx = memory.indexOf(lruPage);
                memory[idx] = page;
            }
            lastUsed.set(page, time);
            steps.push({ page, memory: [...memory], fault: true });
        }
    });
    return { steps, faults };
}

function optimal(pages: number[], frames: number): { steps: { page: number; memory: number[]; fault: boolean }[]; faults: number } {
    const memory: number[] = [];
    const steps: { page: number; memory: number[]; fault: boolean }[] = [];
    let faults = 0;

    pages.forEach((page, i) => {
        if (memory.includes(page)) {
            steps.push({ page, memory: [...memory], fault: false });
        } else {
            faults++;
            if (memory.length < frames) {
                memory.push(page);
            } else {
                // Replace page used farthest in future
                let farthest = -1;
                let victimIdx = 0;
                for (let j = 0; j < memory.length; j++) {
                    const nextUse = pages.indexOf(memory[j], i + 1);
                    if (nextUse === -1) { victimIdx = j; break; }
                    if (nextUse > farthest) { farthest = nextUse; victimIdx = j; }
                }
                memory[victimIdx] = page;
            }
            steps.push({ page, memory: [...memory], fault: true });
        }
    });
    return { steps, faults };
}

const DEFAULT_PAGES = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];

export const pageFault: TerminalCommand = {
    name: 'page-fault',
    description: 'Simulate page replacement algorithms (educational)',
    usage: 'page-fault --algo=fifo|lru|optimal [--frames=N] [--pages=1,2,3,4]',
    execute: ({ args }) => {
        const algoArg = args.find(a => a.startsWith('--algo='))?.split('=')[1]?.toLowerCase() || 'fifo';
        const framesArg = parseInt(args.find(a => a.startsWith('--frames='))?.split('=')[1] || '3');
        const pagesArg = args.find(a => a.startsWith('--pages='))?.split('=')[1];
        const pages = pagesArg ? pagesArg.split(',').map(Number).filter(n => !isNaN(n)) : DEFAULT_PAGES;

        if (!['fifo', 'lru', 'optimal'].includes(algoArg)) {
            return { output: [`page-fault: unknown algorithm '${algoArg}'. Use: fifo, lru, optimal`], error: true };
        }

        const output: (string | React.ReactNode)[] = [];
        const algoNames: Record<string, string> = { fifo: 'FIFO (First In, First Out)', lru: 'LRU (Least Recently Used)', optimal: 'Optimal (Belady)' };

        output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
            `📄 Page Replacement — ${algoNames[algoArg]}`
        ));
        output.push(createElement('div', { className: 'text-white/40 text-xs' },
            `Frames: ${framesArg} | Reference string: ${pages.join(', ')}`
        ));
        output.push('');

        // Run algorithm
        let result: { steps: { page: number; memory: number[]; fault: boolean }[]; faults: number };
        switch (algoArg) {
            case 'lru': result = lru(pages, framesArg); break;
            case 'optimal': result = optimal(pages, framesArg); break;
            default: result = fifo(pages, framesArg);
        }

        // Step-by-step table
        // Header
        const colWidth = 4;
        output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
            createElement('span', { className: 'text-white/40' }, 'Step  '),
            createElement('span', { className: 'text-white/40' }, 'Page  '),
            ...Array.from({ length: framesArg }, (_, i) =>
                createElement('span', { key: i, className: 'text-white/40' }, `F${i + 1}`.padEnd(colWidth))
            ),
            createElement('span', { className: 'text-white/40' }, ' Result'),
        ));

        // Separator
        output.push(createElement('div', { className: 'font-mono text-xs text-white/10 whitespace-pre' },
            '─'.repeat(8 + framesArg * colWidth + 8)
        ));

        // Steps
        result.steps.forEach((step, i) => {
            output.push(createElement('div', { key: i, className: 'font-mono text-xs whitespace-pre' },
                createElement('span', { className: 'text-white/40' }, String(i + 1).padStart(4) + '  '),
                createElement('span', { className: 'text-amber-400' }, String(step.page).padEnd(6)),
                ...Array.from({ length: framesArg }, (_, j) =>
                    createElement('span', { key: j, className: step.memory[j] === step.page ? 'text-emerald-400 font-bold' : 'text-white/60' },
                        (step.memory[j] !== undefined ? String(step.memory[j]) : '-').padEnd(colWidth)
                    )
                ),
                step.fault
                    ? createElement('span', { className: 'text-red-400 font-bold' }, ' FAULT')
                    : createElement('span', { className: 'text-emerald-400' }, ' HIT  '),
            ));
        });

        output.push('');

        // Summary
        const hitRate = ((pages.length - result.faults) / pages.length * 100).toFixed(1);
        output.push(createElement('div', { className: 'font-mono text-xs' },
            createElement('span', { className: 'text-red-400' }, `Page Faults: ${result.faults}`),
            createElement('span', { className: 'text-white/30' }, ' | '),
            createElement('span', { className: 'text-emerald-400' }, `Hits: ${pages.length - result.faults}`),
            createElement('span', { className: 'text-white/30' }, ' | '),
            createElement('span', { className: 'text-indigo-400' }, `Hit Rate: ${hitRate}%`),
        ));

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Tip: Compare algorithms: "page-fault --algo=lru --frames=4" vs "page-fault --algo=fifo --frames=4"'
        ));

        return { output };
    },
};

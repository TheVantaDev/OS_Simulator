import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Memory Simulation ──────────────────────────────────────────
interface MemBlock { id: number; size: number; allocated: boolean; process?: string; }

function createMemoryBlocks(): MemBlock[] {
    return [
        { id: 1, size: 100, allocated: false },
        { id: 2, size: 500, allocated: true, process: 'System' },
        { id: 3, size: 200, allocated: false },
        { id: 4, size: 300, allocated: true, process: 'Browser' },
        { id: 5, size: 600, allocated: false },
        { id: 6, size: 150, allocated: true, process: 'Terminal' },
        { id: 7, size: 350, allocated: false },
        { id: 8, size: 200, allocated: true, process: 'Finder' },
        { id: 9, size: 100, allocated: false },
    ];
}

function firstFit(blocks: MemBlock[], requestSize: number): number {
    return blocks.findIndex(b => !b.allocated && b.size >= requestSize);
}

function bestFit(blocks: MemBlock[], requestSize: number): number {
    let best = -1;
    let bestSize = Infinity;
    blocks.forEach((b, i) => {
        if (!b.allocated && b.size >= requestSize && b.size < bestSize) {
            best = i;
            bestSize = b.size;
        }
    });
    return best;
}

function worstFit(blocks: MemBlock[], requestSize: number): number {
    let worst = -1;
    let worstSize = -1;
    blocks.forEach((b, i) => {
        if (!b.allocated && b.size >= requestSize && b.size > worstSize) {
            worst = i;
            worstSize = b.size;
        }
    });
    return worst;
}

export const memSim: TerminalCommand = {
    name: 'mem-sim',
    description: 'Simulate memory allocation algorithms (educational)',
    usage: 'mem-sim [--algo=first-fit|best-fit|worst-fit] [--request=SIZE]',
    execute: ({ args }) => {
        const algoArg = args.find(a => a.startsWith('--algo='))?.split('=')[1]?.toLowerCase() || 'first-fit';
        const requestSize = parseInt(args.find(a => a.startsWith('--request='))?.split('=')[1] || '250');

        if (!['first-fit', 'best-fit', 'worst-fit'].includes(algoArg)) {
            return { output: [`mem-sim: unknown algorithm '${algoArg}'. Use: first-fit, best-fit, worst-fit`], error: true };
        }

        const blocks = createMemoryBlocks();
        const output: (string | React.ReactNode)[] = [];

        const algoNames: Record<string, string> = { 'first-fit': 'First Fit', 'best-fit': 'Best Fit', 'worst-fit': 'Worst Fit' };
        output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
            `🧠 Memory Allocation — ${algoNames[algoArg]}`
        ));
        output.push('');

        // Memory map visualization
        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Memory Map:'));
        const totalMem = blocks.reduce((s, b) => s + b.size, 0);
        const freeMem = blocks.filter(b => !b.allocated).reduce((s, b) => s + b.size, 0);

        for (const block of blocks) {
            const barWidth = Math.max(2, Math.floor((block.size / totalMem) * 40));
            const bar = block.allocated ? '█'.repeat(barWidth) : '░'.repeat(barWidth);
            const colorClass = block.allocated ? 'text-red-400' : 'text-emerald-400';
            const label = block.allocated ? `[${block.process}]` : '[Free]';

            output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre flex' },
                createElement('span', { className: 'text-white/40 w-16' }, `#${block.id} ${String(block.size).padStart(4)}KB `),
                createElement('span', { className: colorClass }, bar),
                createElement('span', { className: 'text-white/50 ml-1' }, ` ${label}`),
            ));
        }

        output.push('');
        output.push(createElement('div', { className: 'font-mono text-xs text-white/60' },
            `Total: ${totalMem}KB | Used: ${totalMem - freeMem}KB | Free: ${freeMem}KB | Fragmentation: ${blocks.filter(b => !b.allocated).length} holes`
        ));
        output.push('');

        // Allocation attempt
        output.push(createElement('div', { className: 'text-amber-400 text-xs' },
            `📥 Allocation Request: ${requestSize}KB using ${algoNames[algoArg]}`
        ));

        let chosenIdx: number;
        switch (algoArg) {
            case 'best-fit': chosenIdx = bestFit(blocks, requestSize); break;
            case 'worst-fit': chosenIdx = worstFit(blocks, requestSize); break;
            default: chosenIdx = firstFit(blocks, requestSize);
        }

        if (chosenIdx === -1) {
            output.push(createElement('div', { className: 'text-red-400 text-xs font-bold' },
                `❌ Allocation FAILED — No block large enough (need ${requestSize}KB)`
            ));
            output.push(createElement('div', { className: 'text-white/40 text-xs italic' },
                `  External fragmentation: ${freeMem}KB total free but no single block fits the request.`
            ));
        } else {
            const block = blocks[chosenIdx];
            const waste = block.size - requestSize;
            output.push(createElement('div', { className: 'text-emerald-400 text-xs font-bold' },
                `✅ Allocated to Block #${block.id} (${block.size}KB) — Internal fragmentation: ${waste}KB wasted`
            ));

            // Explain the algorithm choice
            const explanations: Record<string, string> = {
                'first-fit': `Scanned blocks sequentially, picked first free block that fits (Block #${block.id}).`,
                'best-fit': `Searched all free blocks, picked the smallest sufficient block to minimize waste.`,
                'worst-fit': `Searched all free blocks, picked the largest to leave the biggest remaining hole.`,
            };
            output.push(createElement('div', { className: 'text-white/40 text-xs italic' },
                `  Strategy: ${explanations[algoArg]}`
            ));
        }

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Tip: Try different algorithms and sizes: "mem-sim --algo=best-fit --request=150"'
        ));

        return { output };
    },
};

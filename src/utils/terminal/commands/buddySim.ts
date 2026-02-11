import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Buddy System Simulation ─────────────────────────────────────
interface BuddyBlock {
    start: number;
    size: number;
    allocated: boolean;
    process?: string;
}

function buddyAllocate(blocks: BuddyBlock[], requestSize: number, processName: string): { blocks: BuddyBlock[]; success: boolean; allocatedSize: number; splits: string[] } {
    // Find smallest power of 2 >= requestSize
    let allocSize = 1;
    while (allocSize < requestSize) allocSize *= 2;

    const splits: string[] = [];
    const result = [...blocks];

    // Find smallest free block that fits
    let bestIdx = -1;
    let bestSize = Infinity;
    for (let i = 0; i < result.length; i++) {
        if (!result[i].allocated && result[i].size >= allocSize && result[i].size < bestSize) {
            bestIdx = i;
            bestSize = result[i].size;
        }
    }

    if (bestIdx === -1) return { blocks: result, success: false, allocatedSize: allocSize, splits };

    // Split until we have the right size
    while (result[bestIdx].size > allocSize) {
        const halfSize = result[bestIdx].size / 2;
        const start = result[bestIdx].start;
        splits.push(`Split ${result[bestIdx].size}KB block at ${start} → two ${halfSize}KB buddies`);

        // Replace with two halves
        result.splice(bestIdx, 1,
            { start, size: halfSize, allocated: false },
            { start: start + halfSize, size: halfSize, allocated: false }
        );
    }

    // Allocate the block
    result[bestIdx].allocated = true;
    result[bestIdx].process = processName;

    return { blocks: result, success: true, allocatedSize: allocSize, splits };
}

function buddyDeallocate(blocks: BuddyBlock[], processName: string): { blocks: BuddyBlock[]; merges: string[] } {
    const merges: string[] = [];
    const result = [...blocks];

    // Find and free the block
    const idx = result.findIndex(b => b.process === processName);
    if (idx === -1) return { blocks: result, merges };

    result[idx].allocated = false;
    result[idx].process = undefined;

    // Try to merge buddies repeatedly
    let merged = true;
    while (merged) {
        merged = false;
        for (let i = 0; i < result.length - 1; i++) {
            if (!result[i].allocated && !result[i + 1].allocated &&
                result[i].size === result[i + 1].size &&
                result[i].start % (result[i].size * 2) === 0) {
                const mergedSize = result[i].size * 2;
                merges.push(`Merge two ${result[i].size}KB buddies at ${result[i].start} → ${mergedSize}KB block`);
                result.splice(i, 2, { start: result[i].start, size: mergedSize, allocated: false });
                merged = true;
                break;
            }
        }
    }

    return { blocks: result, merges };
}

export const buddySim: TerminalCommand = {
    name: 'buddy-sim',
    description: 'Simulate buddy system memory allocation (educational)',
    usage: 'buddy-sim [--total=1024] [--alloc=P1:100,P2:250,P3:64] [--dealloc=P2]',
    execute: ({ args }) => {
        const totalArg = parseInt(args.find(a => a.startsWith('--total='))?.split('=')[1] || '1024');
        const allocArg = args.find(a => a.startsWith('--alloc='))?.split('=')[1];
        const deallocArg = args.find(a => a.startsWith('--dealloc='))?.split('=')[1];

        // Validate total is power of 2
        if (totalArg <= 0 || (totalArg & (totalArg - 1)) !== 0) {
            return { output: [`buddy-sim: total must be a power of 2 (got ${totalArg}). Try: 256, 512, 1024`], error: true };
        }

        const output: (string | React.ReactNode)[] = [];
        output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
            `🧩 Buddy System Memory Allocation`
        ));
        output.push(createElement('div', { className: 'text-white/40 text-xs' },
            `Total Memory: ${totalArg}KB`
        ));
        output.push('');

        // Start with one big block
        let blocks: BuddyBlock[] = [{ start: 0, size: totalArg, allocated: false }];

        // Default demo if no args
        const allocations = allocArg
            ? allocArg.split(',').map(a => { const [name, size] = a.split(':'); return { name, size: parseInt(size) }; })
            : [{ name: 'P1', size: 100 }, { name: 'P2', size: 240 }, { name: 'P3', size: 64 }, { name: 'P4', size: 256 }];

        // Process allocations
        for (const alloc of allocations) {
            if (isNaN(alloc.size)) continue;

            output.push(createElement('div', { className: 'text-amber-400 text-xs font-bold' },
                `📥 Allocating ${alloc.name}: ${alloc.size}KB`
            ));

            const result = buddyAllocate(blocks, alloc.size, alloc.name);

            // Show splits
            for (const split of result.splits) {
                output.push(createElement('div', { className: 'text-white/50 text-xs pl-4' },
                    `↳ ${split}`
                ));
            }

            if (result.success) {
                output.push(createElement('div', { className: 'text-emerald-400 text-xs pl-4' },
                    `✅ Allocated ${result.allocatedSize}KB (requested ${alloc.size}KB, internal frag: ${result.allocatedSize - alloc.size}KB)`
                ));
            } else {
                output.push(createElement('div', { className: 'text-red-400 text-xs pl-4' },
                    `❌ Failed — need ${result.allocatedSize}KB block, no suitable block available`
                ));
            }

            blocks = result.blocks;
            output.push('');
        }

        // Process deallocation if specified
        if (deallocArg) {
            const processesToFree = deallocArg.split(',');
            for (const proc of processesToFree) {
                output.push(createElement('div', { className: 'text-amber-400 text-xs font-bold' },
                    `📤 Deallocating ${proc}`
                ));

                const result = buddyDeallocate(blocks, proc);
                for (const merge of result.merges) {
                    output.push(createElement('div', { className: 'text-white/50 text-xs pl-4' },
                        `↳ ${merge}`
                    ));
                }

                if (result.merges.length === 0) {
                    const existed = blocks.some(b => b.process === proc);
                    if (!existed) {
                        output.push(createElement('div', { className: 'text-white/40 text-xs pl-4' },
                            `No buddy merge possible (or process not found)`
                        ));
                    } else {
                        output.push(createElement('div', { className: 'text-emerald-400 text-xs pl-4' },
                            `✅ Freed (no buddy merge possible — buddy is allocated)`
                        ));
                    }
                } else {
                    output.push(createElement('div', { className: 'text-emerald-400 text-xs pl-4' },
                        `✅ Freed and merged ${result.merges.length} buddy pair(s)`
                    ));
                }

                blocks = result.blocks;
                output.push('');
            }
        }

        // Final memory map
        output.push(createElement('div', { className: 'text-white/60 text-xs font-bold' }, '📊 Memory Map:'));

        for (const block of blocks) {
            const barWidth = Math.max(2, Math.round((block.size / totalArg) * 40));
            const bar = block.allocated ? '█'.repeat(barWidth) : '░'.repeat(barWidth);
            const colorClass = block.allocated ? 'text-red-400' : 'text-emerald-400';
            const label = block.allocated ? `[${block.process}]` : '[Free]';

            output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
                createElement('span', { className: 'text-white/40' }, `${String(block.start).padStart(5)}  `),
                createElement('span', { className: 'text-white/40' }, `${String(block.size).padStart(4)}KB `),
                createElement('span', { className: colorClass }, bar),
                createElement('span', { className: 'text-white/50' }, ` ${label}`),
            ));
        }

        output.push('');

        // Power-of-2 breakdown
        const sizeMap = new Map<number, { free: number; alloc: number }>();
        for (const b of blocks) {
            const entry = sizeMap.get(b.size) || { free: 0, alloc: 0 };
            if (b.allocated) entry.alloc++; else entry.free++;
            sizeMap.set(b.size, entry);
        }

        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Block Size Distribution:'));
        const sizes = [...sizeMap.entries()].sort((a, b) => a[0] - b[0]);
        for (const [size, counts] of sizes) {
            output.push(createElement('div', { className: 'font-mono text-xs' },
                createElement('span', { className: 'text-white/40' }, `  ${String(size).padStart(4)}KB: `),
                createElement('span', { className: 'text-red-400' }, `${counts.alloc} allocated`),
                createElement('span', { className: 'text-white/30' }, ' | '),
                createElement('span', { className: 'text-emerald-400' }, `${counts.free} free`),
            ));
        }

        const freeMem = blocks.filter(b => !b.allocated).reduce((s, b) => s + b.size, 0);
        const usedMem = totalArg - freeMem;
        output.push('');
        output.push(createElement('div', { className: 'font-mono text-xs' },
            createElement('span', { className: 'text-indigo-400' }, `Total: ${totalArg}KB`),
            createElement('span', { className: 'text-white/30' }, ' | '),
            createElement('span', { className: 'text-red-400' }, `Used: ${usedMem}KB`),
            createElement('span', { className: 'text-white/30' }, ' | '),
            createElement('span', { className: 'text-emerald-400' }, `Free: ${freeMem}KB`),
        ));

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Try: "buddy-sim --alloc=A:100,B:240 --dealloc=A" to see buddy merging'
        ));

        return { output };
    },
};

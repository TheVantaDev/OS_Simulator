import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Deadlock Simulation ────────────────────────────────────────
interface Resource { id: string; total: number; available: number; heldBy: string[] }
interface DeadlockProcess { id: string; holding: string[]; waiting: string | null }

function createDeadlockScenario(): { processes: DeadlockProcess[]; resources: Resource[] } {
    return {
        resources: [
            { id: 'R1', total: 1, available: 0, heldBy: ['P1'] },
            { id: 'R2', total: 1, available: 0, heldBy: ['P2'] },
            { id: 'R3', total: 1, available: 0, heldBy: ['P3'] },
        ],
        processes: [
            { id: 'P1', holding: ['R1'], waiting: 'R2' },
            { id: 'P2', holding: ['R2'], waiting: 'R3' },
            { id: 'P3', holding: ['R3'], waiting: 'R1' },
        ],
    };
}

function createSafeScenario(): { processes: DeadlockProcess[]; resources: Resource[] } {
    return {
        resources: [
            { id: 'R1', total: 2, available: 1, heldBy: ['P1'] },
            { id: 'R2', total: 1, available: 0, heldBy: ['P2'] },
        ],
        processes: [
            { id: 'P1', holding: ['R1'], waiting: 'R2' },
            { id: 'P2', holding: ['R2'], waiting: null },
        ],
    };
}

function detectCycle(processes: DeadlockProcess[]): { hasCycle: boolean; cycle: string[] } {
    const waitGraph = new Map<string, string>();

    // Build wait-for graph: if P holds R and Q waits for R, then Q -> P
    for (const p of processes) {
        if (p.waiting) {
            const holder = processes.find(q => q.holding.includes(p.waiting!));
            if (holder) {
                waitGraph.set(p.id, holder.id);
            }
        }
    }

    // DFS cycle detection
    for (const startNode of waitGraph.keys()) {
        const visited = new Set<string>();
        const path: string[] = [];
        let current: string | undefined = startNode;

        while (current && !visited.has(current)) {
            visited.add(current);
            path.push(current);
            current = waitGraph.get(current);
        }

        if (current && visited.has(current)) {
            const cycleStart = path.indexOf(current);
            const cycle = [...path.slice(cycleStart), current];
            return { hasCycle: true, cycle };
        }
    }

    return { hasCycle: false, cycle: [] };
}

export const deadlock: TerminalCommand = {
    name: 'deadlock',
    description: 'Deadlock detection and simulation (educational)',
    usage: 'deadlock create|detect|prevent|safe',
    execute: ({ args }) => {
        const subcommand = args[0]?.toLowerCase() || 'create';
        const output: (string | React.ReactNode)[] = [];

        if (!['create', 'detect', 'prevent', 'safe'].includes(subcommand)) {
            return { output: [`deadlock: unknown subcommand '${subcommand}'. Use: create, detect, prevent, safe`], error: true };
        }

        if (subcommand === 'create' || subcommand === 'detect') {
            const scenario = createDeadlockScenario();

            output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
                '🔒 Deadlock Simulation — Circular Wait Scenario'
            ));
            output.push('');

            // Resource Allocation Table
            output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Resource Allocation:'));
            output.push(createElement('div', { className: 'font-mono text-xs text-white/30 whitespace-pre' },
                'Resource  Total  Available  Held By'
            ));
            for (const r of scenario.resources) {
                output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
                    createElement('span', { className: 'text-amber-400' }, `  ${r.id.padEnd(8)}`),
                    createElement('span', { className: 'text-white/60' }, `${String(r.total).padStart(4)}   ${String(r.available).padStart(6)}    `),
                    createElement('span', { className: 'text-red-400' }, r.heldBy.join(', ') || 'none'),
                ));
            }
            output.push('');

            // Process State
            output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Process State:'));
            for (const p of scenario.processes) {
                output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
                    createElement('span', { className: 'text-indigo-400' }, `  ${p.id}: `),
                    createElement('span', { className: 'text-emerald-400' }, `holds [${p.holding.join(', ')}]`),
                    createElement('span', { className: 'text-white/30' }, ' → '),
                    createElement('span', { className: p.waiting ? 'text-red-400 font-bold' : 'text-white/40' },
                        p.waiting ? `waits for ${p.waiting}` : 'not waiting'
                    ),
                ));
            }
            output.push('');

            // Wait-For Graph (ASCII)
            output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Wait-For Graph:'));
            output.push(createElement('div', { className: 'font-mono text-xs text-white/70 whitespace-pre' },
                '  P1 ──→ P2 ──→ P3 ──→ P1  (CYCLE!)'
            ));
            output.push('');

            if (subcommand === 'detect') {
                const result = detectCycle(scenario.processes);
                if (result.hasCycle) {
                    output.push(createElement('div', { className: 'text-red-400 text-xs font-bold' },
                        `❌ DEADLOCK DETECTED! Cycle: ${result.cycle.join(' → ')}`
                    ));
                    output.push(createElement('div', { className: 'text-white/40 text-xs' },
                        '  Conditions met: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait'
                    ));
                    output.push('');
                    output.push(createElement('div', { className: 'text-amber-400 text-xs' },
                        '  Recovery options: Kill P3 (break cycle), Preempt R3 from P3, or Rollback P2'
                    ));
                } else {
                    output.push(createElement('div', { className: 'text-emerald-400 text-xs font-bold' },
                        '✅ No deadlock detected — system is safe'
                    ));
                }
            } else {
                output.push(createElement('div', { className: 'text-amber-400 text-xs' },
                    '⚠️  This scenario will deadlock! Run "deadlock detect" to verify.'
                ));
            }
        } else if (subcommand === 'safe') {
            const scenario = createSafeScenario();

            output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
                '🔓 Deadlock Simulation — Safe Scenario (No Cycle)'
            ));
            output.push('');

            for (const p of scenario.processes) {
                output.push(createElement('div', { className: 'font-mono text-xs whitespace-pre' },
                    createElement('span', { className: 'text-indigo-400' }, `  ${p.id}: `),
                    createElement('span', { className: 'text-emerald-400' }, `holds [${p.holding.join(', ')}]`),
                    createElement('span', { className: 'text-white/30' }, ' → '),
                    createElement('span', { className: p.waiting ? 'text-amber-400' : 'text-white/40' },
                        p.waiting ? `waits for ${p.waiting}` : 'not waiting'
                    ),
                ));
            }
            output.push('');

            const result = detectCycle(scenario.processes);
            output.push(createElement('div', { className: 'text-emerald-400 text-xs font-bold' },
                result.hasCycle
                    ? `❌ Cycle detected: ${result.cycle.join(' → ')}`
                    : '✅ No cycle detected — P2 can finish and release R2, then P1 can proceed.'
            ));
        } else if (subcommand === 'prevent') {
            output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
                '🛡️  Deadlock Prevention Strategies'
            ));
            output.push('');

            const strategies = [
                { condition: 'Mutual Exclusion', prevention: 'Use sharable resources (e.g., read-only files)', practical: 'Often impossible to eliminate' },
                { condition: 'Hold and Wait', prevention: 'Request ALL resources at once before execution', practical: 'Low resource utilization, possible starvation' },
                { condition: 'No Preemption', prevention: 'If a resource request fails, release ALL held resources', practical: 'Works for resources whose state can be saved (CPU, memory)' },
                { condition: 'Circular Wait', prevention: 'Impose total ordering on resource types; request in order', practical: 'Most practical — widely used in real systems' },
            ];

            for (const s of strategies) {
                output.push(createElement('div', { className: 'font-mono text-xs' },
                    createElement('span', { className: 'text-amber-400 font-bold' }, `  ${s.condition}`),
                ));
                output.push(createElement('div', { className: 'font-mono text-xs text-white/60 whitespace-pre' },
                    `    Prevention: ${s.prevention}`
                ));
                output.push(createElement('div', { className: 'font-mono text-xs text-white/40 whitespace-pre italic' },
                    `    Trade-off: ${s.practical}`
                ));
                output.push('');
            }
        }

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Try: "deadlock create", "deadlock detect", "deadlock prevent", "deadlock safe"'
        ));

        return { output };
    },
};

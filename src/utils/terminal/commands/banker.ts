import { createElement } from 'react';
import { TerminalCommand } from '../types';

// ─── Banker's Algorithm ─────────────────────────────────────────
interface BankerState {
    processes: string[];
    resources: string[];
    available: number[];
    max: number[][];
    allocation: number[][];
    need: number[][];
}

const DEFAULT_STATE: BankerState = {
    processes: ['P0', 'P1', 'P2', 'P3', 'P4'],
    resources: ['A', 'B', 'C'],
    available: [3, 3, 2],
    max: [
        [7, 5, 3],
        [3, 2, 2],
        [9, 0, 2],
        [2, 2, 2],
        [4, 3, 3],
    ],
    allocation: [
        [0, 1, 0],
        [2, 0, 0],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2],
    ],
    need: [
        [7, 4, 3],
        [1, 2, 2],
        [6, 0, 0],
        [0, 1, 1],
        [4, 3, 1],
    ],
};

function findSafeSequence(state: BankerState): { safe: boolean; sequence: string[]; steps: string[] } {
    const n = state.processes.length;
    const m = state.resources.length;
    const work = [...state.available];
    const finish = new Array(n).fill(false);
    const sequence: string[] = [];
    const steps: string[] = [];

    let found = true;
    while (found && sequence.length < n) {
        found = false;
        for (let i = 0; i < n; i++) {
            if (finish[i]) continue;
            let canRun = true;
            for (let j = 0; j < m; j++) {
                if (state.need[i][j] > work[j]) { canRun = false; break; }
            }
            if (canRun) {
                steps.push(`${state.processes[i]}: Need [${state.need[i].join(',')}] <= Work [${work.join(',')}] → Execute & Release [${state.allocation[i].join(',')}]`);
                for (let j = 0; j < m; j++) work[j] += state.allocation[i][j];
                finish[i] = true;
                sequence.push(state.processes[i]);
                found = true;
            }
        }
    }

    return { safe: sequence.length === n, sequence, steps };
}

function checkRequest(state: BankerState, processIdx: number, request: number[]): { granted: boolean; reason: string; safeAfter?: boolean } {
    const m = state.resources.length;

    // Check request <= need
    for (let j = 0; j < m; j++) {
        if (request[j] > state.need[processIdx][j]) {
            return { granted: false, reason: `Request exceeds max claim (${state.resources[j]}: requested ${request[j]} > need ${state.need[processIdx][j]})` };
        }
    }

    // Check request <= available
    for (let j = 0; j < m; j++) {
        if (request[j] > state.available[j]) {
            return { granted: false, reason: `Insufficient resources (${state.resources[j]}: requested ${request[j]} > available ${state.available[j]})` };
        }
    }

    // Trial allocation
    const trialState: BankerState = {
        ...state,
        available: state.available.map((a, j) => a - request[j]),
        allocation: state.allocation.map((row, i) => i === processIdx ? row.map((a, j) => a + request[j]) : [...row]),
        need: state.need.map((row, i) => i === processIdx ? row.map((n, j) => n - request[j]) : [...row]),
    };

    const result = findSafeSequence(trialState);
    return { granted: result.safe, reason: result.safe ? `Safe sequence exists: ${result.sequence.join(' → ')}` : 'Request leads to UNSAFE state — would be denied', safeAfter: result.safe };
}

export const banker: TerminalCommand = {
    name: 'banker',
    description: "Run Banker's algorithm for deadlock avoidance (educational)",
    usage: 'banker [--check] [--request P0 1,0,2]',
    execute: ({ args }) => {
        const requestIdx = args.indexOf('--request');
        const output: (string | React.ReactNode)[] = [];

        output.push(createElement('div', { className: 'text-indigo-400 font-bold text-xs' },
            "🏦 Banker's Algorithm — Deadlock Avoidance"
        ));
        output.push('');

        // Display matrices
        const state = DEFAULT_STATE;
        const matrixHeader = `          ${state.resources.map(r => r.padStart(3)).join('')}`;

        // Available
        output.push(createElement('div', { className: 'text-white/40 text-xs' }, 'Available Resources:'));
        output.push(createElement('div', { className: 'font-mono text-xs text-emerald-400 whitespace-pre' },
            `          ${state.available.map(a => String(a).padStart(3)).join('')}`
        ));
        output.push('');

        // Allocation, Max, Need
        const matrices = [
            { name: 'Allocation', data: state.allocation, color: 'text-amber-400' },
            { name: 'Max', data: state.max, color: 'text-red-400' },
            { name: 'Need', data: state.need, color: 'text-indigo-400' },
        ];

        for (const mat of matrices) {
            output.push(createElement('div', { className: 'text-white/40 text-xs' }, `${mat.name} Matrix:`));
            output.push(createElement('div', { className: `font-mono text-xs text-white/30 whitespace-pre` }, matrixHeader));
            state.processes.forEach((p, i) => {
                output.push(createElement('div', { className: `font-mono text-xs whitespace-pre` },
                    createElement('span', { className: 'text-white/60' }, `  ${p.padEnd(6)}  `),
                    createElement('span', { className: mat.color }, mat.data[i].map(v => String(v).padStart(3)).join('')),
                ));
            });
            output.push('');
        }

        // Handle request
        if (requestIdx !== -1 && args[requestIdx + 1] && args[requestIdx + 2]) {
            const pName = args[requestIdx + 1];
            const pIdx = state.processes.indexOf(pName);
            const reqValues = args[requestIdx + 2].split(',').map(Number);

            if (pIdx === -1) {
                output.push(createElement('div', { className: 'text-red-400 text-xs' }, `Unknown process: ${pName}`));
            } else if (reqValues.length !== state.resources.length || reqValues.some(isNaN)) {
                output.push(createElement('div', { className: 'text-red-400 text-xs' }, `Invalid request format. Use: --request P0 1,0,2`));
            } else {
                output.push(createElement('div', { className: 'text-amber-400 text-xs font-bold' },
                    `📥 Request from ${pName}: [${reqValues.join(', ')}]`
                ));
                const result = checkRequest(state, pIdx, reqValues);
                if (result.granted) {
                    output.push(createElement('div', { className: 'text-emerald-400 text-xs font-bold' }, `✅ GRANTED — ${result.reason}`));
                } else {
                    output.push(createElement('div', { className: 'text-red-400 text-xs font-bold' }, `❌ DENIED — ${result.reason}`));
                }
            }
        } else {
            // Safety check
            output.push(createElement('div', { className: 'text-white/40 text-xs font-bold' }, 'Safety Analysis:'));
            const result = findSafeSequence(state);

            for (const step of result.steps) {
                output.push(createElement('div', { className: 'font-mono text-xs text-white/60 whitespace-pre' }, `  ${step}`));
            }
            output.push('');

            if (result.safe) {
                output.push(createElement('div', { className: 'text-emerald-400 text-xs font-bold' },
                    `✅ System is in SAFE state. Safe sequence: ${result.sequence.join(' → ')}`
                ));
            } else {
                output.push(createElement('div', { className: 'text-red-400 text-xs font-bold' },
                    '❌ System is in UNSAFE state — potential deadlock!'
                ));
            }
        }

        output.push('');
        output.push(createElement('div', { className: 'text-emerald-400/50 text-xs italic' },
            '💡 Tip: Try a request: "banker --request P1 1,0,2"'
        ));

        return { output };
    },
};

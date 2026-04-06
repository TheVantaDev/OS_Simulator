import { useState, useMemo, useCallback } from 'react';
import { Play, Plus, Trash2, RotateCcw, ChevronRight, BookOpen, Cpu, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AppMenuConfig } from '@/types';

// ─── Types ───────────────────────────────────────────────────────
interface Process {
    id: string;
    name: string;
    arrivalTime: number;
    burstTime: number;
    priority: number;
}

interface ScheduleResult {
    pid: string;
    name: string;
    arrivalTime: number;
    burstTime: number;
    completionTime: number;
    turnaroundTime: number;
    waitingTime: number;
    responseTime: number;
}

interface GanttBlock {
    pid: string;
    name: string;
    start: number;
    end: number;
}

type Algorithm = 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'priority';

// ─── Preset Scenarios ────────────────────────────────────────────
const PRESETS: Record<string, { label: string; processes: Omit<Process, 'id'>[] }> = {
    basic: {
        label: '📘 Basic (3 processes)',
        processes: [
            { name: 'P1', arrivalTime: 0, burstTime: 6, priority: 2 },
            { name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
            { name: 'P3', arrivalTime: 2, burstTime: 2, priority: 3 },
        ],
    },
    convoy: {
        label: '🚛 Convoy Effect',
        processes: [
            { name: 'P1', arrivalTime: 0, burstTime: 20, priority: 3 },
            { name: 'P2', arrivalTime: 1, burstTime: 2, priority: 1 },
            { name: 'P3', arrivalTime: 2, burstTime: 2, priority: 2 },
            { name: 'P4', arrivalTime: 3, burstTime: 2, priority: 1 },
        ],
    },
    starvation: {
        label: '⚠️ Starvation Demo',
        processes: [
            { name: 'P1', arrivalTime: 0, burstTime: 10, priority: 5 },
            { name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
            { name: 'P3', arrivalTime: 2, burstTime: 2, priority: 1 },
            { name: 'P4', arrivalTime: 3, burstTime: 4, priority: 1 },
            { name: 'P5', arrivalTime: 4, burstTime: 1, priority: 1 },
        ],
    },
    textbook: {
        label: '📖 Textbook Example',
        processes: [
            { name: 'P1', arrivalTime: 0, burstTime: 10, priority: 3 },
            { name: 'P2', arrivalTime: 0, burstTime: 1, priority: 1 },
            { name: 'P3', arrivalTime: 0, burstTime: 2, priority: 4 },
            { name: 'P4', arrivalTime: 0, burstTime: 1, priority: 5 },
            { name: 'P5', arrivalTime: 0, burstTime: 5, priority: 2 },
        ],
    },
};

// ─── Color palette for processes ─────────────────────────────────
const PROCESS_COLORS = [
    '#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#a855f7',
    '#10b981', '#e11d48', '#0ea5e9', '#eab308', '#d946ef',
];

// ─── Scheduling Algorithms ──────────────────────────────────────
function scheduleFCFS(processes: Process[]): { gantt: GanttBlock[]; results: ScheduleResult[] } {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.name.localeCompare(b.name));
    const gantt: GanttBlock[] = [];
    const results: ScheduleResult[] = [];
    let time = 0;

    for (const p of sorted) {
        if (time < p.arrivalTime) time = p.arrivalTime;
        const start = time;
        const end = time + p.burstTime;
        gantt.push({ pid: p.id, name: p.name, start, end });
        results.push({
            pid: p.id, name: p.name, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
            completionTime: end,
            turnaroundTime: end - p.arrivalTime,
            waitingTime: start - p.arrivalTime,
            responseTime: start - p.arrivalTime,
        });
        time = end;
    }
    return { gantt, results };
}

function scheduleSJF(processes: Process[]): { gantt: GanttBlock[]; results: ScheduleResult[] } {
    const remaining = processes.map(p => ({ ...p, remaining: p.burstTime }));
    const gantt: GanttBlock[] = [];
    const completed: ScheduleResult[] = [];
    let time = 0;
    const done = new Set<string>();

    while (done.size < processes.length) {
        const available = remaining.filter(p => p.arrivalTime <= time && !done.has(p.id));
        if (available.length === 0) {
            time = Math.min(...remaining.filter(p => !done.has(p.id)).map(p => p.arrivalTime));
            continue;
        }
        available.sort((a, b) => a.burstTime - b.burstTime);
        const p = available[0];
        const start = time;
        const end = time + p.burstTime;
        gantt.push({ pid: p.id, name: p.name, start, end });
        completed.push({
            pid: p.id, name: p.name, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
            completionTime: end, turnaroundTime: end - p.arrivalTime,
            waitingTime: start - p.arrivalTime, responseTime: start - p.arrivalTime,
        });
        done.add(p.id);
        time = end;
    }
    return { gantt, results: completed };
}

function scheduleSRTF(processes: Process[]): { gantt: GanttBlock[]; results: ScheduleResult[] } {
    const remaining = processes.map(p => ({ ...p, remaining: p.burstTime, firstRun: -1 }));
    const gantt: GanttBlock[] = [];
    let time = 0;
    const completed = new Map<string, { completionTime: number; firstRun: number }>();

    while (completed.size < processes.length) {
        const available = remaining.filter(p => p.arrivalTime <= time && !completed.has(p.id));
        if (available.length === 0) {
            time = Math.min(...remaining.filter(p => !completed.has(p.id)).map(p => p.arrivalTime));
            continue;
        }
        available.sort((a, b) => a.remaining - b.remaining);
        const p = available[0];
        if (p.firstRun === -1) p.firstRun = time;

        // Run for 1 unit
        const start = time;
        p.remaining--;
        time++;

        // Merge with previous gantt block if same process
        if (gantt.length > 0 && gantt[gantt.length - 1].pid === p.id) {
            gantt[gantt.length - 1].end = time;
        } else {
            gantt.push({ pid: p.id, name: p.name, start, end: time });
        }

        if (p.remaining === 0) {
            completed.set(p.id, { completionTime: time, firstRun: p.firstRun });
        }
    }

    const results: ScheduleResult[] = processes.map(p => {
        const c = completed.get(p.id)!;
        return {
            pid: p.id, name: p.name, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
            completionTime: c.completionTime,
            turnaroundTime: c.completionTime - p.arrivalTime,
            waitingTime: c.completionTime - p.arrivalTime - p.burstTime,
            responseTime: c.firstRun - p.arrivalTime,
        };
    });
    return { gantt, results };
}

function scheduleRR(processes: Process[], quantum: number): { gantt: GanttBlock[]; results: ScheduleResult[] } {
    const queue: { id: string; name: string; arrivalTime: number; burstTime: number; remaining: number; firstRun: number }[] = [];
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const gantt: GanttBlock[] = [];
    const completed = new Map<string, { completionTime: number; firstRun: number }>();
    let time = 0;
    let idx = 0;

    // Add initial arrivals
    while (idx < sorted.length && sorted[idx].arrivalTime <= time) {
        queue.push({ ...sorted[idx], remaining: sorted[idx].burstTime, firstRun: -1 });
        idx++;
    }

    while (queue.length > 0 || idx < sorted.length) {
        if (queue.length === 0) {
            time = sorted[idx].arrivalTime;
            while (idx < sorted.length && sorted[idx].arrivalTime <= time) {
                queue.push({ ...sorted[idx], remaining: sorted[idx].burstTime, firstRun: -1 });
                idx++;
            }
        }

        const p = queue.shift()!;
        if (p.firstRun === -1) p.firstRun = time;
        const execTime = Math.min(p.remaining, quantum);
        const start = time;
        time += execTime;
        p.remaining -= execTime;
        gantt.push({ pid: p.id, name: p.name, start, end: time });

        // Add newly arrived processes before re-adding current
        while (idx < sorted.length && sorted[idx].arrivalTime <= time) {
            queue.push({ ...sorted[idx], remaining: sorted[idx].burstTime, firstRun: -1 });
            idx++;
        }

        if (p.remaining > 0) {
            queue.push(p);
        } else {
            completed.set(p.id, { completionTime: time, firstRun: p.firstRun });
        }
    }

    const results: ScheduleResult[] = processes.map(p => {
        const c = completed.get(p.id)!;
        return {
            pid: p.id, name: p.name, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
            completionTime: c.completionTime,
            turnaroundTime: c.completionTime - p.arrivalTime,
            waitingTime: c.completionTime - p.arrivalTime - p.burstTime,
            responseTime: c.firstRun - p.arrivalTime,
        };
    });
    return { gantt, results };
}

function schedulePriority(processes: Process[]): { gantt: GanttBlock[]; results: ScheduleResult[] } {
    const remaining = [...processes];
    const gantt: GanttBlock[] = [];
    const results: ScheduleResult[] = [];
    let time = 0;
    const done = new Set<string>();

    while (done.size < processes.length) {
        const available = remaining.filter(p => p.arrivalTime <= time && !done.has(p.id));
        if (available.length === 0) {
            time = Math.min(...remaining.filter(p => !done.has(p.id)).map(p => p.arrivalTime));
            continue;
        }
        // Lower priority number = higher priority
        available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
        const p = available[0];
        const start = time;
        const end = time + p.burstTime;
        gantt.push({ pid: p.id, name: p.name, start, end });
        results.push({
            pid: p.id, name: p.name, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
            completionTime: end, turnaroundTime: end - p.arrivalTime,
            waitingTime: start - p.arrivalTime, responseTime: start - p.arrivalTime,
        });
        done.add(p.id);
        time = end;
    }
    return { gantt, results };
}

function runScheduler(processes: Process[], algo: Algorithm, quantum: number) {
    switch (algo) {
        case 'fcfs': return scheduleFCFS(processes);
        case 'sjf': return scheduleSJF(processes);
        case 'srtf': return scheduleSRTF(processes);
        case 'rr': return scheduleRR(processes, quantum);
        case 'priority': return schedulePriority(processes);
    }
}

// ─── Algorithm Descriptions ─────────────────────────────────────
const ALGO_INFO: Record<Algorithm, { name: string; fullName: string; description: string; pros: string; cons: string }> = {
    fcfs: {
        name: 'FCFS', fullName: 'First Come, First Served',
        description: 'Processes are executed in the order they arrive. The simplest scheduling algorithm — no preemption.',
        pros: 'Simple to implement, fair (no starvation)', cons: 'Convoy effect — short processes wait behind long ones',
    },
    sjf: {
        name: 'SJF', fullName: 'Shortest Job First (Non-Preemptive)',
        description: 'Selects the process with the shortest burst time from the ready queue. Once a process starts, it runs to completion.',
        pros: 'Optimal average waiting time for non-preemptive', cons: 'May cause starvation of long processes',
    },
    srtf: {
        name: 'SRTF', fullName: 'Shortest Remaining Time First (Preemptive SJF)',
        description: 'Preemptive version of SJF. If a new process arrives with a shorter remaining time than the current process, it preempts.',
        pros: 'Optimal average waiting time overall', cons: 'High context switching overhead, starvation risk',
    },
    rr: {
        name: 'RR', fullName: 'Round Robin',
        description: 'Each process gets a fixed time quantum. After the quantum expires, the process is moved to the back of the queue.',
        pros: 'Fair, bounded waiting time, good for time-sharing', cons: 'Performance depends on quantum size — too small = overhead, too large = becomes FCFS',
    },
    priority: {
        name: 'Priority', fullName: 'Priority Scheduling (Non-Preemptive)',
        description: 'Each process is assigned a priority (lower number = higher priority). The highest-priority process runs first.',
        pros: 'Expressive — models real system priorities', cons: 'Can cause indefinite starvation of low-priority processes',
    },
};

// ─── Menu Configuration ─────────────────────────────────────────
export const cpuSchedulerMenuConfig: AppMenuConfig = {
    menus: ['Scheduler'],
    items: {
        Scheduler: [
            { label: 'New Simulation', shortcut: '⌘N', action: 'cpuScheduler:newSimulation' },
            { type: 'separator' },
            { label: 'About CPU Scheduler', action: 'cpuScheduler:about' },
        ],
    },
};

// ─── Main Component ─────────────────────────────────────────────
let nextId = 1;

export function CpuScheduler() {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [algorithm, setAlgorithm] = useState<Algorithm>('fcfs');
    const [quantum, setQuantum] = useState(2);
    const [hasRun, setHasRun] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    // Form state for adding processes
    const [formName, setFormName] = useState('');
    const [formArrival, setFormArrival] = useState('0');
    const [formBurst, setFormBurst] = useState('');
    const [formPriority, setFormPriority] = useState('1');

    const addProcess = useCallback(() => {
        const burst = parseInt(formBurst);
        if (!burst || burst <= 0) return;
        const name = formName.trim() || `P${nextId}`;
        setProcesses(prev => [...prev, {
            id: `proc-${nextId++}`,
            name,
            arrivalTime: Math.max(0, parseInt(formArrival) || 0),
            burstTime: burst,
            priority: Math.max(1, parseInt(formPriority) || 1),
        }]);
        setFormName('');
        setFormBurst('');
        setFormArrival('0');
        setFormPriority('1');
        setHasRun(false);
    }, [formName, formArrival, formBurst, formPriority]);

    const removeProcess = useCallback((id: string) => {
        setProcesses(prev => prev.filter(p => p.id !== id));
        setHasRun(false);
    }, []);

    const loadPreset = useCallback((key: string) => {
        const preset = PRESETS[key];
        if (!preset) return;
        setProcesses(preset.processes.map((p) => ({ ...p, id: `proc-${nextId++}` })));
        setHasRun(false);
    }, []);

    const resetAll = useCallback(() => {
        setProcesses([]);
        setHasRun(false);
        nextId = 1;
    }, []);

    const { gantt, results } = useMemo(() => {
        if (!hasRun || processes.length === 0) return { gantt: [], results: [] };
        return runScheduler(processes, algorithm, quantum);
    }, [hasRun, processes, algorithm, quantum]);

    const avgTurnaround = results.length > 0 ? (results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length).toFixed(2) : '—';
    const avgWaiting = results.length > 0 ? (results.reduce((s, r) => s + r.waitingTime, 0) / results.length).toFixed(2) : '—';
    const avgResponse = results.length > 0 ? (results.reduce((s, r) => s + r.responseTime, 0) / results.length).toFixed(2) : '—';
    const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;

    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        processes.forEach((p, i) => { map[p.id] = PROCESS_COLORS[i % PROCESS_COLORS.length]; });
        return map;
    }, [processes]);

    // Build Gantt chart data for recharts
    const ganttData = useMemo(() => {
        return gantt.map((block, i) => ({
            name: `${block.start}-${block.end}`,
            start: block.start,
            duration: block.end - block.start,
            pid: block.pid,
            pname: block.name,
            fill: colorMap[block.pid] || '#6366f1',
            index: i,
        }));
    }, [gantt, colorMap]);

    const info = ALGO_INFO[algorithm];

    return (
        <div className="h-full flex flex-col bg-black/90 text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] shrink-0">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-base font-semibold tracking-tight">CPU Scheduler Visualizer</h1>
                    <p className="text-[11px] text-white/40">Interactive scheduling algorithm simulator</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => setShowInfo(!showInfo)} className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> {showInfo ? 'Hide' : 'Show'} Theory
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Algorithm Info Card */}
                {showInfo && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-white/90">{info.fullName} ({info.name})</span>
                        </div>
                        <p className="text-[12px] text-white/50 leading-relaxed">{info.description}</p>
                        <div className="flex gap-4 text-[11px]">
                            <span className="text-emerald-400/80">✅ {info.pros}</span>
                            <span className="text-red-400/80">⚠️ {info.cons}</span>
                        </div>
                    </div>
                )}

                {/* Controls Row */}
                <div className="flex flex-wrap items-end gap-3">
                    {/* Algorithm Selector */}
                    <div className="space-y-1">
                        <label className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Algorithm</label>
                        <select
                            value={algorithm}
                            onChange={e => { setAlgorithm(e.target.value as Algorithm); setHasRun(false); }}
                            className="block w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                        >
                            <option value="fcfs">FCFS</option>
                            <option value="sjf">SJF (Non-Preemptive)</option>
                            <option value="srtf">SRTF (Preemptive)</option>
                            <option value="rr">Round Robin</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>

                    {/* Time Quantum (only for RR) */}
                    {algorithm === 'rr' && (
                        <div className="space-y-1">
                            <label className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Quantum</label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={quantum}
                                onChange={e => { setQuantum(Math.max(1, parseInt(e.target.value) || 1)); setHasRun(false); }}
                                className="block w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-indigo-500/50"
                            />
                        </div>
                    )}

                    {/* Preset Loader */}
                    <div className="space-y-1">
                        <label className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Presets</label>
                        <select
                            onChange={e => { if (e.target.value) loadPreset(e.target.value); e.target.value = ''; }}
                            defaultValue=""
                            className="block w-48 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Load preset...</option>
                            {Object.entries(PRESETS).map(([key, preset]) => (
                                <option key={key} value={key}>{preset.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => setHasRun(true)}
                            disabled={processes.length === 0}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            <Play className="w-3.5 h-3.5" /> Run
                        </button>
                        <button
                            onClick={resetAll}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                    </div>
                </div>

                {/* Process Input */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                        <span className="text-[12px] font-medium text-white/60">Process Table</span>
                        <span className="text-[11px] text-white/30">{processes.length} process{processes.length !== 1 ? 'es' : ''}</span>
                    </div>

                    {/* Add Process Form */}
                    <div className="px-4 py-3 border-b border-white/5 flex items-end gap-2 bg-white/[0.02]">
                        <div className="space-y-1">
                            <label className="text-[10px] text-white/30">Name</label>
                            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder={`P${nextId}`}
                                className="block w-16 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/90 placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-white/30">Arrival</label>
                            <input type="number" min={0} value={formArrival} onChange={e => setFormArrival(e.target.value)}
                                className="block w-16 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/90 focus:outline-none focus:border-indigo-500/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-white/30">Burst *</label>
                            <input type="number" min={1} value={formBurst} onChange={e => setFormBurst(e.target.value)} placeholder="e.g. 5"
                                className="block w-16 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/90 placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-white/30">Priority</label>
                            <input type="number" min={1} value={formPriority} onChange={e => setFormPriority(e.target.value)}
                                className="block w-16 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/90 focus:outline-none focus:border-indigo-500/50" />
                        </div>
                        <button onClick={addProcess} className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-medium transition-colors">
                            <Plus className="w-3 h-3" /> Add
                        </button>
                    </div>

                    {/* Process List */}
                    {processes.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_2rem] gap-2 px-4 py-2 text-[10px] text-white/30 font-medium uppercase tracking-wider">
                                <span></span><span>Name</span><span>Arrival</span><span>Burst</span><span>Priority</span><span></span>
                            </div>
                            {processes.map((p, i) => (
                                <div key={p.id} className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_2rem] gap-2 px-4 py-2 items-center hover:bg-white/[0.02] transition-colors">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PROCESS_COLORS[i % PROCESS_COLORS.length] }} />
                                    <span className="text-sm text-white/80 font-mono">{p.name}</span>
                                    <span className="text-sm text-white/60">{p.arrivalTime}</span>
                                    <span className="text-sm text-white/60">{p.burstTime}</span>
                                    <span className="text-sm text-white/60">{p.priority}</span>
                                    <button onClick={() => removeProcess(p.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-white/20 text-sm">
                            Add processes above or load a preset to get started
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {hasRun && results.length > 0 && (
                    <>
                        {/* Gantt Chart */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-indigo-400" />
                                <span className="text-[12px] font-medium text-white/70">Gantt Chart</span>
                                <span className="text-[11px] text-white/30 ml-auto">Total time: {totalTime} units</span>
                            </div>

                            <div className="w-full" style={{ height: Math.max(70, 40) }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ganttData} layout="vertical" barCategoryGap={0} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis type="number" domain={[0, totalTime]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickLine={{ stroke: 'rgba(255,255,255,0.1)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip
                                            contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                                            labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                                            formatter={(value, name) => {
                                                const numericValue = value ?? 0;
                                                const label = name === 'start' ? 'Offset' : 'Duration';
                                                return [numericValue, label];
                                            }}
                                        />
                                        <Bar dataKey="start" stackId="a" fill="transparent" isAnimationActive={false} />
                                        <Bar dataKey="duration" stackId="a" isAnimationActive={false} radius={[4, 4, 4, 4]}>
                                            {ganttData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Gantt block labels */}
                            <div className="flex flex-wrap gap-1">
                                {gantt.map((block, i) => (
                                    <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/60">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[block.pid] }} />
                                        <span className="font-mono">{block.name}</span>
                                        <span className="text-white/30">[{block.start}–{block.end}]</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-white/10">
                                <span className="text-[12px] font-medium text-white/60">Results — {info.fullName}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                            <th className="px-4 py-2 text-left">Process</th>
                                            <th className="px-4 py-2 text-right">Arrival</th>
                                            <th className="px-4 py-2 text-right">Burst</th>
                                            <th className="px-4 py-2 text-right">Completion</th>
                                            <th className="px-4 py-2 text-right">Turnaround</th>
                                            <th className="px-4 py-2 text-right">Waiting</th>
                                            <th className="px-4 py-2 text-right">Response</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {results.map((r) => (
                                            <tr key={r.pid} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-2 text-white/80 font-mono flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[r.pid] }} />
                                                    {r.name}
                                                </td>
                                                <td className="px-4 py-2 text-right text-white/50">{r.arrivalTime}</td>
                                                <td className="px-4 py-2 text-right text-white/50">{r.burstTime}</td>
                                                <td className="px-4 py-2 text-right text-white/70">{r.completionTime}</td>
                                                <td className="px-4 py-2 text-right text-indigo-400">{r.turnaroundTime}</td>
                                                <td className="px-4 py-2 text-right text-amber-400">{r.waitingTime}</td>
                                                <td className="px-4 py-2 text-right text-emerald-400">{r.responseTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t border-white/10 text-[12px] font-medium">
                                            <td className="px-4 py-2 text-white/40" colSpan={4}>Averages</td>
                                            <td className="px-4 py-2 text-right text-indigo-400">{avgTurnaround}</td>
                                            <td className="px-4 py-2 text-right text-amber-400">{avgWaiting}</td>
                                            <td className="px-4 py-2 text-right text-emerald-400">{avgResponse}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

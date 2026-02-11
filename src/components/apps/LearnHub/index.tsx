import { useState } from 'react';
import { GraduationCap, Terminal, Cpu, HardDrive, Lock, ChevronRight } from 'lucide-react';
import { ShellModule } from './modules/ShellModule';
import { CpuModule } from './modules/CpuModule';
import { MemoryModule } from './modules/MemoryModule';
import { ProcessModule } from './modules/ProcessModule';
import { AppMenuConfig } from '@/types';

// ─── Module Definitions ─────────────────────────────────────────
interface Module {
    id: string;
    name: string;
    icon: typeof Terminal;
    color: string;
    description: string;
    component: React.ComponentType;
}

const MODULES: Module[] = [
    {
        id: 'shell',
        name: 'Shell & Terminal',
        icon: Terminal,
        color: 'text-emerald-400',
        description: 'Commands, navigation, scripting',
        component: ShellModule,
    },
    {
        id: 'cpu',
        name: 'CPU Scheduling',
        icon: Cpu,
        color: 'text-blue-400',
        description: 'FCFS, SJF, Round Robin, Priority',
        component: CpuModule,
    },
    {
        id: 'memory',
        name: 'Memory Management',
        icon: HardDrive,
        color: 'text-purple-400',
        description: 'Allocation, paging, replacement',
        component: MemoryModule,
    },
    {
        id: 'process',
        name: 'Sync & Deadlock',
        icon: Lock,
        color: 'text-red-400',
        description: "Deadlock, Banker's, semaphores",
        component: ProcessModule,
    },
];

// ─── Menu Configuration ─────────────────────────────────────────
export const learnHubMenuConfig: AppMenuConfig = {
    menus: ['Learn', 'View', 'Help'],
    items: {
        'Learn': [
            { label: 'Shell & Terminal', shortcut: '⌘1', action: 'learn-shell' },
            { label: 'CPU Scheduling', shortcut: '⌘2', action: 'learn-cpu' },
            { label: 'Memory Management', shortcut: '⌘3', action: 'learn-memory' },
            { label: 'Sync & Deadlock', shortcut: '⌘4', action: 'learn-process' },
        ],
    },
};

// ─── Main Component ─────────────────────────────────────────────
export function LearnHub() {
    const [activeModule, setActiveModule] = useState<string | null>(null);

    // If no module selected, show welcome screen
    if (!activeModule) {
        return (
            <div className="h-full flex flex-col bg-black/90 text-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.03] shrink-0">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <GraduationCap className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold tracking-tight">OS Learning Hub</h1>
                        <p className="text-[11px] text-white/40">Interactive operating system education</p>
                    </div>
                </div>

                {/* Welcome Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Hero */}
                        <div className="text-center space-y-3 py-6">
                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5">
                                <GraduationCap className="w-12 h-12 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white/90">Learn Operating Systems</h2>
                            <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                                Hands-on lessons with theory, guided exercises, and a built-in practice terminal.
                                Choose a module to get started.
                            </p>
                        </div>

                        {/* Module Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {MODULES.map(mod => {
                                const Icon = mod.icon;
                                return (
                                    <button
                                        key={mod.id}
                                        onClick={() => setActiveModule(mod.id)}
                                        className="group text-left p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                                                <Icon className={`w-5 h-5 ${mod.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{mod.name}</div>
                                                <div className="text-[11px] text-white/40 mt-0.5">{mod.description}</div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 mt-0.5 transition-colors" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Start Banner */}
                        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-emerald-400 shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-emerald-300">New to terminals?</div>
                                    <div className="text-[12px] text-white/50 mt-0.5">
                                        Start with <span className="text-emerald-400 font-medium cursor-pointer" onClick={() => setActiveModule('shell')}>Shell & Terminal</span> — learn basic commands with a hands-on practice terminal.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render active module
    const mod = MODULES.find(m => m.id === activeModule);
    if (!mod) return null;
    const ActiveComponent = mod.component;
    const Icon = mod.icon;

    return (
        <div className="h-full flex flex-col bg-black/90 text-white overflow-hidden">
            {/* Module Header */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-white/[0.03] shrink-0">
                <button
                    onClick={() => setActiveModule(null)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors"
                >
                    ← Modules
                </button>
                <div className="w-px h-4 bg-white/10" />
                <Icon className={`w-4 h-4 ${mod.color}`} />
                <span className="text-sm font-medium text-white/80">{mod.name}</span>
            </div>

            {/* Module Content */}
            <div className="flex-1 overflow-hidden">
                <ActiveComponent />
            </div>
        </div>
    );
}

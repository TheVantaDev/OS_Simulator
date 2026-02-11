import { useState, useCallback } from 'react';
import { CheckCircle2, Circle, BookOpen, ChevronDown, ChevronRight, Cpu } from 'lucide-react';
import { PracticeTerminal } from '../PracticeTerminal';

// ─── Lesson Data ─────────────────────────────────────────────────
interface Exercise {
    id: string;
    task: string;
    command: string;
    explanation: string;
}

interface Lesson {
    id: string;
    title: string;
    theory: string;
    exercises: Exercise[];
}

const LESSONS: Lesson[] = [
    {
        id: 'scheduling-intro',
        title: 'What is CPU Scheduling?',
        theory: `The CPU can only run ONE process at a time. When multiple processes are ready, the OS must decide which one runs next — this is CPU Scheduling.

Key Metrics:
• Turnaround Time = Completion - Arrival (total time in system)
• Waiting Time = Turnaround - Burst (time spent waiting)
• Response Time = First Run - Arrival (time until first execution)

The goal is to minimize these metrics while being fair to all processes.

Types of Scheduling:
• Non-preemptive: Once a process starts, it runs to completion
• Preemptive: The OS can interrupt a running process

Use the 'schedule' command to visualize how different algorithms work!`,
        exercises: [
            { id: 'c1', task: 'Run FCFS scheduling (simplest algorithm)', command: 'schedule --algo=fcfs', explanation: 'FCFS = First Come First Served. Processes run in arrival order. Simple but can cause long waits (convoy effect).' },
            { id: 'c2', task: 'Run Shortest Job First', command: 'schedule --algo=sjf', explanation: 'SJF picks the process with the shortest burst time. Optimal average waiting time but can starve long processes.' },
            { id: 'c3', task: 'Run Round Robin with quantum=2', command: 'schedule --algo=rr --quantum=2', explanation: 'Round Robin gives each process a time slice (quantum). Fair for all processes — used in real time-sharing systems.' },
            { id: 'c4', task: 'Run Priority scheduling', command: 'schedule --algo=priority', explanation: 'Priority scheduling runs the highest-priority process first. Danger: low-priority processes may starve indefinitely.' },
        ],
    },
    {
        id: 'process-states',
        title: 'Process States & Lifecycle',
        theory: `A process goes through several states during its lifecycle:

NEW → READY → RUNNING → TERMINATED
                ↕
             WAITING

States:
• NEW: Process is being created
• READY: Waiting to be assigned to the CPU
• RUNNING: Currently executing on the CPU
• WAITING: Blocked on I/O or event
• TERMINATED: Finished execution

The Process Control Block (PCB) stores:
- Process ID (PID)
- Current state
- Program counter
- CPU registers
- Memory info
- Priority

Use ps-sim to see a simulated process table!`,
        exercises: [
            { id: 'p1', task: 'View the process table', command: 'ps-sim', explanation: 'ps-sim shows all processes with their PIDs, states, CPU usage, and memory — like the real ps command.' },
            { id: 'p2', task: 'View all processes (including system)', command: 'ps-sim --all', explanation: 'The --all flag shows system processes too, not just user processes.' },
        ],
    },
    {
        id: 'compare',
        title: 'Comparing Algorithms',
        theory: `Different scenarios favor different algorithms:

FCFS: Best when all processes have similar burst times
SJF: Best when you know burst times in advance — optimal average wait
SRTF: Like SJF but preemptive — even better average wait but more context switches
Round Robin: Best for interactive systems — every process gets a fair share
Priority: Best when some jobs are genuinely more important

The "Convoy Effect" (FCFS problem):
If a long process arrives first, all short processes behind it must wait — like being stuck behind a slow truck.

Try running different algorithms on the same process set to compare their performance!`,
        exercises: [
            { id: 'cmp1', task: 'Run FCFS to see convoy effect', command: 'schedule --algo=fcfs', explanation: 'Watch how P2, P3, P4 have to wait behind P1 even though they are much shorter.' },
            { id: 'cmp2', task: 'Now run SJF on the same processes', command: 'schedule --algo=sjf', explanation: 'Notice how the average waiting time drops significantly — short jobs go first!' },
            { id: 'cmp3', task: 'Try Round Robin with quantum=3', command: 'schedule --algo=rr --quantum=3', explanation: 'RR is a compromise — no starvation, but quantum size affects performance.' },
        ],
    },
];

// ─── Component ───────────────────────────────────────────────────
export function CpuModule() {
    const [activeLesson, setActiveLesson] = useState(0);
    const [theoryOpen, setTheoryOpen] = useState(true);
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
    const [activeExercise, setActiveExercise] = useState<string | null>(null);

    const lesson = LESSONS[activeLesson];

    const markComplete = useCallback((id: string) => {
        setCompletedExercises(prev => new Set(prev).add(id));
    }, []);

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-56 border-r border-white/10 bg-white/[0.02] overflow-y-auto shrink-0">
                <div className="px-3 py-3 border-b border-white/5">
                    <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Lessons</h3>
                </div>
                {LESSONS.map((l, i) => {
                    const done = l.exercises.filter(e => completedExercises.has(e.id)).length;
                    return (
                        <button
                            key={l.id}
                            onClick={() => { setActiveLesson(i); setActiveExercise(null); }}
                            className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors ${i === activeLesson ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:bg-white/[0.03]'}`}
                        >
                            <Cpu className={`w-4 h-4 shrink-0 ${i === activeLesson ? 'text-emerald-400' : 'text-white/30'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-medium truncate">{l.title}</div>
                                <div className="text-[10px] text-white/30">{done}/{l.exercises.length} done</div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <h2 className="text-lg font-semibold text-white/90">{lesson.title}</h2>

                {/* Theory */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <button
                        onClick={() => setTheoryOpen(!theoryOpen)}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                        {theoryOpen ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white/80">Theory</span>
                    </button>
                    {theoryOpen && (
                        <pre className="px-4 pb-4 text-[12px] text-white/60 leading-relaxed whitespace-pre-wrap font-sans border-t border-white/5 pt-3">
                            {lesson.theory}
                        </pre>
                    )}
                </div>

                {/* Exercises */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-white/70">Exercises</span>
                    {lesson.exercises.map(exercise => {
                        const isDone = completedExercises.has(exercise.id);
                        const isActive = activeExercise === exercise.id;
                        return (
                            <div key={exercise.id} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                                <button
                                    onClick={() => setActiveExercise(isActive ? null : exercise.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                                >
                                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Circle className="w-4 h-4 text-white/20 shrink-0" />}
                                    <span className={`text-sm text-left ${isDone ? 'text-white/50 line-through' : 'text-white/80'}`}>{exercise.task}</span>
                                    <code className="text-[11px] font-mono text-indigo-400/60 ml-auto shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded">{exercise.command}</code>
                                </button>
                                {isActive && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                                        <p className="text-[12px] text-white/50 italic">💡 {exercise.explanation}</p>
                                        <PracticeTerminal
                                            expectedCommand={exercise.command}
                                            onTaskComplete={() => markComplete(exercise.id)}
                                            hint={`Run: ${exercise.command}`}
                                            isCompleted={isDone}
                                            height={180}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

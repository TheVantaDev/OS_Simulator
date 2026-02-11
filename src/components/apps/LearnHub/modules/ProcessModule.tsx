import { useState, useCallback } from 'react';
import { CheckCircle2, Circle, BookOpen, ChevronDown, ChevronRight, Lock } from 'lucide-react';
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
        id: 'deadlock-basics',
        title: 'What is Deadlock?',
        theory: `Deadlock occurs when two or more processes are waiting for each other to release resources, causing all of them to be stuck forever.

Four Necessary Conditions (ALL must hold):
1. Mutual Exclusion: Only one process can use a resource at a time
2. Hold and Wait: A process holds resources while waiting for others
3. No Preemption: Resources can't be forcibly taken away
4. Circular Wait: P1 waits for P2, P2 waits for P3, P3 waits for P1

Real-world analogy:
Imagine a narrow bridge where cars from both sides drive on. If two cars meet in the middle, neither can proceed — that's deadlock!

Solutions:
• Prevention: Eliminate one of the four conditions
• Avoidance: Use algorithms (like Banker's) to avoid unsafe states
• Detection: Allow deadlocks, detect them, and recover
• Ignorance: Pretend they won't happen (Linux/Windows actually do this!)`,
        exercises: [
            { id: 'd1', task: 'Create a deadlock scenario', command: 'deadlock create', explanation: 'This creates a resource allocation graph with a circular dependency — classic deadlock.' },
            { id: 'd2', task: 'Detect the deadlock', command: 'deadlock detect', explanation: 'Detection scans the resource allocation graph for cycles — if found, deadlock exists.' },
        ],
    },
    {
        id: 'bankers',
        title: "Banker's Algorithm",
        theory: `The Banker's Algorithm prevents deadlock by never entering an unsafe state.

Analogy: A banker with limited cash. Before lending, they check: "If I lend this, can I still satisfy all other customers eventually?"

Key Matrices:
• Allocation: What each process currently holds
• Maximum: What each process might need at most
• Available: Resources currently free
• Need = Maximum - Allocation: What each process still needs

Safety Algorithm:
1. Find a process whose Need ≤ Available
2. Pretend it finishes → Available += its Allocation
3. Repeat until all processes are marked or stuck
4. If all can finish → SAFE. Otherwise → UNSAFE.

Request Algorithm:
When a process requests resources:
1. Check: Request ≤ Need? (not asking for more than declared)
2. Check: Request ≤ Available? (resources actually free)
3. Pretend to grant it, run safety check
4. If safe → grant. If unsafe → process must wait.`,
        exercises: [
            { id: 'b1', task: "Run Banker's algorithm", command: 'banker', explanation: 'Runs the safety algorithm on a preset scenario — determines if the system is in a safe state.' },
            { id: 'b2', task: 'Simulate P1 requesting resources', command: 'banker --request P1 1,0,2', explanation: 'Tests if granting P1\'s request of (1,0,2) would leave the system in a safe state.' },
        ],
    },
    {
        id: 'sync',
        title: 'Process Synchronization',
        theory: `When multiple processes share resources, synchronization prevents conflicts:

Race Condition:
Multiple processes access shared data simultaneously → unpredictable results.

Critical Section Problem:
A section of code where shared resources are accessed. Must ensure:
• Mutual Exclusion: Only one process in critical section at a time
• Progress: If no one is in CS, a waiting process should enter
• Bounded Waiting: A process won't wait forever

Solutions:
• Mutex Lock: Binary lock (locked/unlocked)
• Semaphore: Counter-based (can allow N simultaneous accesses)
• Monitor: High-level construct (used in Java, Python)

Producer-Consumer Problem:
A classic synchronization problem — one process produces data, another consumes it. They share a bounded buffer.

The Dining Philosophers:
Five philosophers sit at a round table. Each needs two forks to eat. If all pick up their left fork first → deadlock!`,
        exercises: [
            { id: 's1', task: 'View process states to spot contention', command: 'ps-sim --all', explanation: 'Look for processes in WAITING or BLOCKED state — they might be waiting for a shared resource.' },
            { id: 's2', task: 'Check for potential deadlocks', command: 'deadlock detect', explanation: 'In concurrent systems, deadlocks can arise from improper synchronization of shared resources.' },
        ],
    },
];

// ─── Component ───────────────────────────────────────────────────
export function ProcessModule() {
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
                            <Lock className={`w-4 h-4 shrink-0 ${i === activeLesson ? 'text-red-400' : 'text-white/30'}`} />
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

                <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <button onClick={() => setTheoryOpen(!theoryOpen)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/[0.02] transition-colors">
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

                <div className="space-y-3">
                    <span className="text-sm font-medium text-white/70">Exercises</span>
                    {lesson.exercises.map(exercise => {
                        const isDone = completedExercises.has(exercise.id);
                        const isActive = activeExercise === exercise.id;
                        return (
                            <div key={exercise.id} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                                <button onClick={() => setActiveExercise(isActive ? null : exercise.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Circle className="w-4 h-4 text-white/20 shrink-0" />}
                                    <span className={`text-sm text-left ${isDone ? 'text-white/50 line-through' : 'text-white/80'}`}>{exercise.task}</span>
                                    <code className="text-[11px] font-mono text-indigo-400/60 ml-auto shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded">{exercise.command}</code>
                                </button>
                                {isActive && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                                        <p className="text-[12px] text-white/50 italic">💡 {exercise.explanation}</p>
                                        <PracticeTerminal expectedCommand={exercise.command} onTaskComplete={() => markComplete(exercise.id)} hint={`Run: ${exercise.command}`} isCompleted={isDone} height={180} />
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

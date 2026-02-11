import { useState, useCallback } from 'react';
import { CheckCircle2, Circle, BookOpen, ChevronDown, ChevronRight, HardDrive } from 'lucide-react';
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
        id: 'memory-alloc',
        title: 'Memory Allocation Strategies',
        theory: `When a process needs memory, the OS must find a free block to assign. Three main strategies:

First Fit:
• Scans from the beginning, uses the FIRST block that fits
• Fast but can leave small gaps (external fragmentation)

Best Fit:
• Searches ALL blocks, picks the SMALLEST one that fits
• Minimizes wasted space but is slower

Worst Fit:
• Picks the LARGEST free block
• Idea: leaves bigger leftover blocks for future use
• In practice, often worst performance

External Fragmentation:
Free memory is split into small, non-contiguous blocks. Total free space is enough, but no single block is large enough.

Internal Fragmentation:
Allocated block is larger than needed — the leftover space inside the block is wasted.

Solutions:
• Compaction: Move processes to create one large free block (expensive)
• Paging: Divide memory into fixed-size frames (modern approach)`,
        exercises: [
            { id: 'm1', task: 'Run First Fit allocation', command: 'mem-sim --algo=first-fit', explanation: 'First Fit scans memory from the start and picks the first block that\'s large enough.' },
            { id: 'm2', task: 'Run Best Fit allocation', command: 'mem-sim --algo=best-fit', explanation: 'Best Fit finds the smallest block that fits — minimizes wasted space within each block.' },
            { id: 'm3', task: 'Run Worst Fit allocation', command: 'mem-sim --algo=worst-fit', explanation: 'Worst Fit uses the largest block — leaving larger remainders for future allocations.' },
        ],
    },
    {
        id: 'page-replacement',
        title: 'Page Replacement Algorithms',
        theory: `Virtual Memory lets processes use more memory than physically available by swapping pages to disk.

When a page is needed but not in RAM → Page Fault!
The OS must evict a page to make room. Which one?

FIFO (First In, First Out):
• Evict the oldest page
• Simple but suffers from Belady's Anomaly (more frames = more faults!)

LRU (Least Recently Used):
• Evict the page not used for the longest time
• Good performance but expensive to track

Optimal:
• Evict the page not needed for the longest time in the future
• Impossible in practice (requires future knowledge) — used as a benchmark

Page Table:
Maps virtual page numbers to physical frame numbers. The valid/invalid bit tells if the page is in RAM.

Thrashing:
When a process spends more time paging than executing — usually from too few frames assigned.`,
        exercises: [
            { id: 'pf1', task: 'Run FIFO page replacement', command: 'page-fault --algo=fifo', explanation: 'FIFO evicts the oldest loaded page — simple but not always effective.' },
            { id: 'pf2', task: 'Run LRU page replacement', command: 'page-fault --algo=lru', explanation: 'LRU evicts the least recently accessed page — better than FIFO in most cases.' },
            { id: 'pf3', task: 'Run Optimal page replacement', command: 'page-fault --algo=optimal', explanation: 'Optimal looks into the future and evicts the page not needed for the longest time. Used as the theoretical best.' },
            { id: 'pf4', task: 'Try FIFO with only 3 frames', command: 'page-fault --algo=fifo --frames=3', explanation: 'Fewer frames = more page faults. Try comparing this with --frames=4 to see the difference.' },
        ],
    },
];

// ─── Component ───────────────────────────────────────────────────
export function MemoryModule() {
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
                            <HardDrive className={`w-4 h-4 shrink-0 ${i === activeLesson ? 'text-purple-400' : 'text-white/30'}`} />
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

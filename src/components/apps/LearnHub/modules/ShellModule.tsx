import { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, BookOpen, CheckCircle2, Circle, Terminal as TerminalIcon } from 'lucide-react';
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
    icon: string;
    theory: {
        title: string;
        content: string;
        codeExamples?: { label: string; code: string }[];
    };
    exercises: Exercise[];
}

const LESSONS: Lesson[] = [
    {
        id: 'basics',
        title: 'Terminal Basics',
        icon: '🖥️',
        theory: {
            title: 'What is a Terminal?',
            content: `The terminal (or shell) is a text-based interface for interacting with your operating system. Instead of clicking icons, you type commands.

The prompt shows: username@hostname:directory$
• username — who you are logged in as
• hostname — the computer's name
• directory — where you are in the file system (~ means home)

Everything in Linux/Unix is a file — even devices and processes. The terminal gives you direct control over all of it.`,
            codeExamples: [
                { label: 'Print text', code: 'echo "Hello World"' },
                { label: 'Show current directory', code: 'pwd' },
                { label: 'List files', code: 'ls' },
                { label: 'Who am I?', code: 'whoami' },
            ],
        },
        exercises: [
            { id: 'b1', task: 'Print "Hello World" to the terminal', command: 'echo Hello World', explanation: 'echo prints text to the terminal output (stdout).' },
            { id: 'b2', task: 'Find out which directory you are in', command: 'pwd', explanation: 'pwd = Print Working Directory. Shows your current location in the filesystem.' },
            { id: 'b3', task: 'List all files in the current directory', command: 'ls', explanation: 'ls = List. Shows files and folders in the current directory.' },
            { id: 'b4', task: 'Find out your username', command: 'whoami', explanation: 'whoami prints the currently logged-in user name.' },
        ],
    },
    {
        id: 'navigation',
        title: 'Navigating the Filesystem',
        icon: '📂',
        theory: {
            title: 'The Directory Tree',
            content: `The filesystem is organized as an upside-down tree:

/ (root) — The top of the tree
├── /home — User directories
│   └── /home/user — Your home directory (~)
├── /etc — System configuration files
├── /bin — Essential system commands
├── /usr — User programs and utilities
└── /tmp — Temporary files

Paths can be:
• Absolute: Start from / (e.g., /home/user/Desktop)
• Relative: Start from current directory (e.g., ../Documents)

Special shortcuts:
• ~ (tilde) = Your home directory
• . (dot) = Current directory
• .. (double-dot) = Parent directory`,
            codeExamples: [
                { label: 'Go to root', code: 'cd /' },
                { label: 'List root contents', code: 'ls /' },
                { label: 'Go home', code: 'cd ~' },
                { label: 'Detailed listing', code: 'ls -la' },
            ],
        },
        exercises: [
            { id: 'n1', task: 'Navigate to the root directory', command: 'cd /', explanation: 'cd = Change Directory. "/" is the root, the top of the filesystem tree.' },
            { id: 'n2', task: 'List what\'s in the root directory', command: 'ls /', explanation: 'You can pass a path to ls to list a specific directory without navigating to it.' },
            { id: 'n3', task: 'Read the system hostname file', command: 'cat /etc/hostname', explanation: 'cat = Concatenate. It reads and displays file contents. /etc/hostname stores the computer name.' },
            { id: 'n4', task: 'Go back to your home directory', command: 'cd ~', explanation: '~ is a shortcut that always expands to your home directory path.' },
        ],
    },
    {
        id: 'files',
        title: 'Managing Files & Directories',
        icon: '📄',
        theory: {
            title: 'Creating, Reading, and Deleting',
            content: `Files and directories are the building blocks of the filesystem:

Creating:
• mkdir dirname — Create a directory
• touch filename — Create an empty file

Reading:
• cat filename — Display file contents
• ls -la — Show detailed file info (permissions, size, date)

Moving & Copying:
• mv source dest — Move or rename a file
• cp source dest — Copy a file

Deleting:
• rm filename — Delete a file
• rm -r dirname — Delete a directory and its contents

⚠️ Be careful with rm — there's no undo!`,
            codeExamples: [
                { label: 'Create a folder', code: 'mkdir ~/projects' },
                { label: 'Create a file', code: 'touch ~/hello.txt' },
                { label: 'List with details', code: 'ls -la ~' },
            ],
        },
        exercises: [
            { id: 'f1', task: 'Create a "projects" directory in your home', command: 'mkdir ~/projects', explanation: 'mkdir = Make Directory. Creates a new empty directory at the specified path.' },
            { id: 'f2', task: 'Create an empty file called "notes.txt"', command: 'touch ~/notes.txt', explanation: 'touch creates an empty file if it doesn\'t exist, or updates its timestamp if it does.' },
            { id: 'f3', task: 'List files in your home with details', command: 'ls -la ~', explanation: '-l = long format (details), -a = all files (including hidden ones starting with .)' },
            { id: 'f4', task: 'Read the system passwd file', command: 'cat /etc/passwd', explanation: '/etc/passwd contains user account information — usernames, IDs, home directories, and shells.' },
        ],
    },
    {
        id: 'variables',
        title: 'Shell Variables & Environment',
        icon: '🔧',
        theory: {
            title: 'Variables in the Shell',
            content: `The shell uses variables to store data. There are two types:

Environment Variables (global):
• $HOME — Your home directory path
• $USER — Your username
• $PATH — List of directories to search for commands
• $HOSTNAME — This computer's name

Using Variables:
• echo $HOME — Print a variable's value
• Variables are prefixed with $ when reading them

How $PATH Works:
When you type a command like "ls", the shell searches for it in each directory listed in $PATH. This is why commands in /bin and /usr/bin work from anywhere.

The OS has two PATH directories:
• /bin — System commands (ls, cat, echo, etc.)
• /usr/bin — Application launchers (browser, terminal, etc.)`,
            codeExamples: [
                { label: 'Show home path', code: 'echo $HOME' },
                { label: 'Show username', code: 'echo $USER' },
                { label: 'Show hostname', code: 'hostname' },
            ],
        },
        exercises: [
            { id: 'v1', task: 'Display your home directory path', command: 'echo $HOME', explanation: '$HOME is an environment variable that stores the absolute path to your home directory.' },
            { id: 'v2', task: 'Display the system hostname', command: 'hostname', explanation: 'The hostname command reads from /etc/hostname — it\'s the computer\'s network name.' },
            { id: 'v3', task: 'Show your current username', command: 'whoami', explanation: 'This reads the current effective user — useful when you\'ve switched users with su.' },
            { id: 'v4', task: 'Check who is logged in', command: 'who', explanation: 'who shows all currently logged-in user sessions on the system.' },
        ],
    },
    {
        id: 'educational',
        title: 'OS Simulation Commands',
        icon: '🎓',
        theory: {
            title: 'Learning OS Concepts via Terminal',
            content: `EduOS includes special educational commands that simulate OS concepts:

Process Management:
• ps-sim — Display a simulated process table showing process states
  (Running, Ready, Waiting, Terminated)

CPU Scheduling:
• schedule --algo=fcfs — First Come First Served
• schedule --algo=sjf — Shortest Job First
• schedule --algo=rr --quantum=2 — Round Robin

Memory Management:
• mem-sim --algo=best-fit — Memory allocation strategies
• page-fault --algo=lru --frames=3 — Page replacement algorithms

Concurrency:
• banker — Banker's algorithm for deadlock avoidance
• deadlock detect — Check for circular waits

These commands produce visual output right in the terminal — ASCII charts, tables, and step-by-step traces.`,
            codeExamples: [
                { label: 'View processes', code: 'ps-sim' },
                { label: 'Run Round Robin', code: 'schedule --algo=rr --quantum=2' },
                { label: 'Memory simulation', code: 'mem-sim --algo=best-fit' },
                { label: 'Deadlock detection', code: 'deadlock detect' },
            ],
        },
        exercises: [
            { id: 'e1', task: 'View the simulated process table', command: 'ps-sim', explanation: 'ps-sim shows processes in different states — like the real "ps" command but educational.' },
            { id: 'e2', task: 'Run Round Robin scheduling with quantum=2', command: 'schedule --algo=rr --quantum=2', explanation: 'Round Robin gives each process a fixed time slice (quantum), then moves to the next.' },
            { id: 'e3', task: 'Simulate Best Fit memory allocation', command: 'mem-sim --algo=best-fit', explanation: 'Best Fit places a process in the smallest free block that fits — minimizes wasted space.' },
            { id: 'e4', task: 'Check for deadlocks', command: 'deadlock detect', explanation: 'Deadlock detection looks for circular wait conditions in the resource allocation graph.' },
        ],
    },
];

// ─── Component ───────────────────────────────────────────────────
export function ShellModule() {
    const [activeLesson, setActiveLesson] = useState(0);
    const [theoryOpen, setTheoryOpen] = useState(true);
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
    const [activeExercise, setActiveExercise] = useState<string | null>(null);

    const lesson = LESSONS[activeLesson];

    const markComplete = useCallback((exerciseId: string) => {
        setCompletedExercises(prev => {
            const next = new Set(prev);
            next.add(exerciseId);
            return next;
        });
    }, []);

    const lessonProgress = (l: Lesson) => {
        const completed = l.exercises.filter(e => completedExercises.has(e.id)).length;
        return { completed, total: l.exercises.length };
    };

    return (
        <div className="flex h-full">
            {/* Lesson Sidebar */}
            <div className="w-56 border-r border-white/10 bg-white/[0.02] overflow-y-auto shrink-0">
                <div className="px-3 py-3 border-b border-white/5">
                    <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Lessons</h3>
                </div>
                {LESSONS.map((l, i) => {
                    const progress = lessonProgress(l);
                    const isActive = i === activeLesson;
                    const isDone = progress.completed === progress.total && progress.total > 0;
                    return (
                        <button
                            key={l.id}
                            onClick={() => { setActiveLesson(i); setActiveExercise(null); }}
                            className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors ${isActive ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:bg-white/[0.03] hover:text-white/70'}`}
                        >
                            <span className="text-base">{l.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-medium truncate">{l.title}</div>
                                <div className="text-[10px] text-white/30">
                                    {isDone ? '✅ Complete' : `${progress.completed}/${progress.total} done`}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Lesson Header */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{lesson.icon}</span>
                    <div>
                        <h2 className="text-lg font-semibold text-white/90">
                            Lesson {activeLesson + 1}: {lesson.title}
                        </h2>
                        <p className="text-[12px] text-white/40">
                            {lessonProgress(lesson).completed}/{lessonProgress(lesson).total} exercises completed
                        </p>
                    </div>
                </div>

                {/* Theory Card (Collapsible) */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <button
                        onClick={() => setTheoryOpen(!theoryOpen)}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                        {theoryOpen ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white/80">{lesson.theory.title}</span>
                        <span className="text-[10px] text-white/30 ml-auto">Theory</span>
                    </button>
                    {theoryOpen && (
                        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                            <pre className="text-[12px] text-white/60 leading-relaxed whitespace-pre-wrap font-sans mt-3">
                                {lesson.theory.content}
                            </pre>
                            {lesson.theory.codeExamples && (
                                <div className="grid grid-cols-2 gap-2">
                                    {lesson.theory.codeExamples.map((ex, i) => (
                                        <div key={i} className="rounded-lg bg-black/40 px-3 py-2 border border-white/5">
                                            <div className="text-[10px] text-white/30 mb-1">{ex.label}</div>
                                            <code className="text-[12px] text-emerald-400 font-mono">{ex.code}</code>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Exercise Cards */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-white/70">Hands-On Exercises</span>
                    </div>

                    {lesson.exercises.map((exercise) => {
                        const isDone = completedExercises.has(exercise.id);
                        const isActive = activeExercise === exercise.id;

                        return (
                            <div key={exercise.id} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                                {/* Exercise Header */}
                                <button
                                    onClick={() => setActiveExercise(isActive ? null : exercise.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                                >
                                    {isDone ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-white/20 shrink-0" />
                                    )}
                                    <span className={`text-sm text-left ${isDone ? 'text-white/50 line-through' : 'text-white/80'}`}>
                                        {exercise.task}
                                    </span>
                                    <code className="text-[11px] font-mono text-indigo-400/60 ml-auto shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded">
                                        {exercise.command}
                                    </code>
                                </button>

                                {/* Expanded: Terminal + Explanation */}
                                {isActive && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                                        <p className="text-[12px] text-white/50 italic">
                                            💡 {exercise.explanation}
                                        </p>
                                        <PracticeTerminal
                                            expectedCommand={exercise.command}
                                            onTaskComplete={() => markComplete(exercise.id)}
                                            hint={`Run: ${exercise.command}`}
                                            isCompleted={isDone}
                                            height={160}
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

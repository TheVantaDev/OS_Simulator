import { useState, useRef, useEffect, useCallback } from 'react';
import { useFileSystem, type FileSystemContextType } from '@/components/FileSystemContext';
import { useAppContext } from '@/components/AppContext';
import { getCommand, getAllCommands } from '@/utils/terminal/registry';
import type { CommandContext, CommandResult } from '@/utils/terminal/types';
import { Terminal, CheckCircle2 } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────
interface HistoryEntry {
    command: string;
    output: React.ReactNode[];
    isError?: boolean;
}

interface PracticeTerminalProps {
    /** Expected command the user should type (for exercise validation) */
    expectedCommand?: string;
    /** Callback when the expected command is successfully executed */
    onTaskComplete?: () => void;
    /** Hint text shown above the terminal */
    hint?: string;
    /** Whether the task is already completed */
    isCompleted?: boolean;
    /** Fixed height or auto */
    height?: number;
}

// ─── Component ───────────────────────────────────────────────────
export function PracticeTerminal({
    expectedCommand,
    onTaskComplete,
    hint,
    isCompleted = false,
    height = 220,
}: PracticeTerminalProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('/home/user');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fs = useFileSystem() as unknown as FileSystemContextType;
    const { activeUser } = useAppContext();

    const username = activeUser || 'user';
    const hostname = 'eduos';

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input on click
    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    // Build a simplified CommandContext for executing commands
    const buildContext = useCallback((args: string[]): CommandContext => {
        const resolvePathLocal = (p: string): string => {
            if (p.startsWith('/')) return p;
            if (p.startsWith('~')) return p.replace('~', `/home/${username}`);
            if (p === '..') {
                const parts = cwd.split('/').filter(Boolean);
                parts.pop();
                return '/' + parts.join('/');
            }
            if (p === '.') return cwd;
            return `${cwd === '/' ? '' : cwd}/${p}`;
        };

        return {
            args,
            fileSystem: fs,
            currentPath: cwd,
            setCurrentPath: setCwd,
            resolvePath: resolvePathLocal,
            allCommands: getAllCommands(),
            terminalUser: username,
            spawnSession: () => { },
            closeSession: () => { },
            onLaunchApp: () => { },
            getNodeAtPath: (path: string) => fs.getNodeAtPath(resolvePathLocal(path)),
            readFile: (path: string) => fs.readFile(resolvePathLocal(path)),
            prompt: async () => '',
            isSudoAuthorized: false,
            setIsSudoAuthorized: () => { },
            verifyPassword: () => false,
            print: () => { },
            t: (key: string) => key,
            getCommandHistory: () => commandHistory,
            clearCommandHistory: () => setCommandHistory([]),
            closeWindow: undefined,
            isRootSession: false,
        };
    }, [fs, cwd, username, commandHistory]);

    // Execute a command
    const executeCommand = useCallback(async (rawInput: string) => {
        const trimmed = rawInput.trim();
        if (!trimmed) return;

        // Add to command history
        setCommandHistory(prev => [trimmed, ...prev]);
        setHistoryIndex(-1);

        // Parse command
        const parts = trimmed.split(/\s+/);
        const cmdName = parts[0];
        const args = parts.slice(1);

        // Handle clear
        if (cmdName === 'clear') {
            setHistory([]);
            return;
        }

        // Look up command
        const cmd = getCommand(cmdName);
        if (!cmd) {
            setHistory(prev => [...prev, {
                command: trimmed,
                output: [`bash: ${cmdName}: command not found`],
                isError: true,
            }]);
            return;
        }

        try {
            const ctx = buildContext(args);
            const result: CommandResult = await cmd.execute(ctx);

            setHistory(prev => [...prev, {
                command: trimmed,
                output: result.output || [],
                isError: result.error,
            }]);

            if (result.newCwd) {
                setCwd(result.newCwd);
            }

            // Check if this matches the expected command
            if (expectedCommand && !isCompleted) {
                const normalizedInput = trimmed.toLowerCase().replace(/\s+/g, ' ');
                const normalizedExpected = expectedCommand.toLowerCase().replace(/\s+/g, ' ');
                if (normalizedInput === normalizedExpected || normalizedInput.startsWith(normalizedExpected)) {
                    onTaskComplete?.();
                }
            }
        } catch (err) {
            setHistory(prev => [...prev, {
                command: trimmed,
                output: [`Error: ${err instanceof Error ? err.message : 'Unknown error'}`],
                isError: true,
            }]);
        }
    }, [buildContext, expectedCommand, isCompleted, onTaskComplete]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    const borderColor = isCompleted
        ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
        : expectedCommand
            ? 'border-indigo-500/30'
            : 'border-white/10';

    return (
        <div className="space-y-2">
            {/* Hint / Task Badge */}
            {hint && (
                <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-300'}`}>
                    {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                        <Terminal className="w-3.5 h-3.5" />
                    )}
                    <span className="font-mono">{isCompleted ? '✓ Completed' : `Task: ${hint}`}</span>
                </div>
            )}

            {/* Terminal Window */}
            <div
                className={`rounded-xl border ${borderColor} bg-[#0d1117] overflow-hidden transition-all duration-500 font-mono text-[13px]`}
                onClick={focusInput}
            >
                {/* Title bar */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] text-white/30 ml-2">practice terminal</span>
                </div>

                {/* Terminal content */}
                <div
                    ref={scrollRef}
                    className="p-3 overflow-y-auto overflow-x-hidden"
                    style={{ height }}
                >
                    {/* History */}
                    {history.map((entry, i) => (
                        <div key={i} className="mb-1">
                            {/* Prompt line */}
                            <div className="flex items-start gap-0 flex-wrap">
                                <span className="text-emerald-400">{username}@{hostname}</span>
                                <span className="text-white/30">:</span>
                                <span className="text-blue-400">{cwd === `/home/${username}` ? '~' : cwd}</span>
                                <span className="text-white/50">$ </span>
                                <span className="text-white/90">{entry.command}</span>
                            </div>
                            {/* Output */}
                            {entry.output.map((line, j) => (
                                <div key={j} className={`whitespace-pre-wrap break-all leading-relaxed ${entry.isError ? 'text-red-400' : 'text-white/70'}`}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Active prompt */}
                    <div className="flex items-center gap-0">
                        <span className="text-emerald-400">{username}@{hostname}</span>
                        <span className="text-white/30">:</span>
                        <span className="text-blue-400">{cwd === `/home/${username}` ? '~' : cwd}</span>
                        <span className="text-white/50">$ </span>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none text-white/90 caret-white min-w-0"
                            spellCheck={false}
                            autoComplete="off"
                            autoFocus
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

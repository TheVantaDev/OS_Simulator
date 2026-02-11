import { TerminalCommand } from '../types';

export const who: TerminalCommand = {
    name: 'who',
    description: 'Show who is logged on',
    descriptionKey: 'terminal.commands.who.description',
    execute: ({ fileSystem }) => {
        // In a real system this shows TTYs etc. We'll just show the current user.
        return { output: [fileSystem.currentUser || 'unknown'] };
    },
};

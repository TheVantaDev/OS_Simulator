import { TerminalCommand } from '../types';

export const reset: TerminalCommand = {
    name: 'reset',
    description: 'Reset filesystem to factory defaults',
    descriptionKey: 'terminal.commands.reset.description',
    execute: ({ fileSystem }) => {
        // Confirmation? Terminal doesn't support interactive input easily yet.
        // We'll trust the user or they can use flags later.
        fileSystem.resetFileSystem();
        return { output: ['System reset initiated...'] };
    },
};

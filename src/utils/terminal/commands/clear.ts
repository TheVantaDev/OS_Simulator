import { TerminalCommand } from '../types';

export const clear: TerminalCommand = {
    name: 'clear',
    description: 'Clear the terminal screen',
    descriptionKey: 'terminal.commands.clear.description',
    execute: () => {
        return { output: [], shouldClear: true };
    },
};

import { TerminalCommand } from '../types';

export const date: TerminalCommand = {
    name: 'date',
    description: 'Print the system date and time',
    descriptionKey: 'terminal.commands.date.description',
    execute: () => {
        return { output: [new Date().toString()] };
    },
};

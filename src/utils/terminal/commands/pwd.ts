import { TerminalCommand } from '../types';

export const pwd: TerminalCommand = {
    name: 'pwd',
    description: 'Print working directory',
    descriptionKey: 'terminal.commands.pwd.description',
    execute: ({ currentPath }) => {
        return { output: [currentPath] };
    },
};

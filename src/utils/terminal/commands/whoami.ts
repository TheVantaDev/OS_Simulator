import { TerminalCommand } from '../types';

export const whoami: TerminalCommand = {
    name: 'whoami',
    description: 'Print current user',
    descriptionKey: 'terminal.commands.whoami.description',
    execute: ({ fileSystem, terminalUser }) => {
        return { output: [terminalUser || fileSystem.currentUser || 'nobody'] };
    },
};

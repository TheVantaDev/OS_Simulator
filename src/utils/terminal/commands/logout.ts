import { TerminalCommand } from '../types';

export const logout: TerminalCommand = {
    name: 'logout',
    description: 'Logout of the current session',
    descriptionKey: 'terminal.commands.logout.description',
    execute: ({ fileSystem }) => {
        fileSystem.logout();
        return { output: ['Logging out...'] };
    },
};

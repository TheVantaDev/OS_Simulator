import { TerminalCommand } from '../types';

export const echo: TerminalCommand = {
    name: 'echo',
    description: 'Display a line of text',
    descriptionKey: 'terminal.commands.echo.description',
    usage: 'echo [text]',
    usageKey: 'terminal.commands.echo.usage',
    execute: ({ args }) => {
        return { output: [args.join(' ')] };
    },
};

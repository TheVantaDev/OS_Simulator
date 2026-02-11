import { TerminalCommand } from '../types';

export const help: TerminalCommand = {
    name: 'help',
    description: 'Show this help message',
    descriptionKey: 'terminal.commands.help.description',
    execute: ({ allCommands, t }) => {
        const visibleCommands = allCommands.filter(c => !c.hidden);
        const longestName = Math.max(...visibleCommands.map(c => c.name.length));

        const output = [
            t('terminal.help.availableCommands'),
            ...visibleCommands.map(c => {
                const padding = ' '.repeat(longestName - c.name.length + 2);
                const desc = c.descriptionKey ? t(c.descriptionKey) : c.description;
                const usageText = c.usageKey ? t(c.usageKey) : (c.usage || '');
                const usage = usageText ? ` (${t('terminal.help.usage')}: ${usageText})` : '';
                return `  ${c.name}${padding}- ${desc}${usage}`;
            }),
            '',
            `  [app]           - ${t('terminal.help.appLaunchHelp')}`,
            ''
        ];

        return { output };
    },
};

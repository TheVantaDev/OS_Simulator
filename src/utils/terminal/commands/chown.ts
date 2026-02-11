import { TerminalCommand } from '../types';

export const chown: TerminalCommand = {
    name: 'chown',
    description: 'Change file owner and group',
    descriptionKey: 'terminal.commands.chown.description',
    usage: 'chown <owner>[:<group>] <file>',
    usageKey: 'terminal.commands.chown.usage',
    execute: (context) => {
        const { args, fileSystem, resolvePath, terminalUser } = context;
        if (args.length < 2) {
            return { output: ['chown: missing operand'], error: true };
        }

        const { chown, getNodeAtPath, currentUser } = fileSystem;
        const activeUser = terminalUser || currentUser || 'user';

        // Only root can chown
        if (activeUser !== 'root') {
            return { output: [`chown: changing ownership of '${args[1]}': Operation not permitted`], error: true };
        }

        const ownerGroup = args[0];
        const file = resolvePath(args[1]);
        const node = getNodeAtPath(file);

        if (!node) {
            return { output: [`chown: cannot access '${args[1]}': No such file or directory`], error: true };
        }

        let owner = ownerGroup;
        let group = undefined;

        if (ownerGroup.includes(':')) {
            const parts = ownerGroup.split(':');
            owner = parts[0];
            group = parts[1];
        }

        const success = chown(file, owner, group);

        if (!success) {
            return { output: [`chown: changing ownership of '${file}': Operation failed`], error: true };
        }

        return { output: [] };
    },
};

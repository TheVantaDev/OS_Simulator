import { TerminalCommand } from '../types';

export const chmod: TerminalCommand = {
    name: 'chmod',
    description: 'Change file modes (permissions)',
    descriptionKey: 'terminal.commands.chmod.description',
    usage: 'chmod <mode> <file>',
    usageKey: 'terminal.commands.chmod.usage',
    execute: (context) => {
        const { args, fileSystem, resolvePath, terminalUser } = context;
        if (args.length < 2) {
            return { output: ['chmod: missing operand'], error: true };
        }

        const { chmod, getNodeAtPath, currentUser } = fileSystem;
        const activeUser = terminalUser || currentUser || 'user';

        const mode = args[0];
        const file = resolvePath(args[1]); // Resolve relative to terminal cwd
        const node = getNodeAtPath(file);

        if (!node) {
            return { output: [`chmod: cannot access '${args[1]}': No such file or directory`], error: true };
        }

        // Only owner or root can change permissions
        if (activeUser !== 'root' && node.owner !== activeUser) {
            return { output: [`chmod: changing permissions of '${args[1]}': Operation not permitted`], error: true };
        }

        const success = chmod(file, mode);

        if (!success) {
            return { output: [`chmod: changing permissions of '${file}': Operation failed`], error: true };
        }

        return { output: [] };
    },
};

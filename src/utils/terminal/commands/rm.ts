import { TerminalCommand } from '../types';
import { checkPermissions } from '../../../utils/fileSystemUtils';

export const rm: TerminalCommand = {
    name: 'rm',
    description: 'Remove file or directory',
    descriptionKey: 'terminal.commands.rm.description',
    usage: 'rm <name>',
    usageKey: 'terminal.commands.rm.usage',
    execute: ({ args, fileSystem, resolvePath, terminalUser }) => {
        if (args.length === 0) {
            return { output: ['rm: missing operand'], error: true };
        }

        const output: string[] = [];
        let error = false;

        const { getNodeAtPath, users, currentUser } = fileSystem;
        const activeUser = terminalUser || currentUser || 'user';
        const userObj = users.find(u => u.username === activeUser) || {
            username: 'nobody', uid: 65534, gid: 65534, fullName: 'Nobody', homeDir: '/', shell: ''
        };

        args.forEach(arg => {
            const targetPath = resolvePath(arg);
            const node = getNodeAtPath(targetPath);

            if (!node && !arg.includes('*')) {
                output.push(`rm: cannot remove '${arg}': No such file or directory`);
                error = true;
                return;
            }

            // Check write permission on the parent directory
            const lastSlashIndex = targetPath.lastIndexOf('/');
            const parentPath = lastSlashIndex === 0 ? '/' : targetPath.substring(0, lastSlashIndex);
            const parentNode = getNodeAtPath(parentPath);

            if (parentNode && !checkPermissions(parentNode, userObj, 'write')) {
                output.push(`rm: cannot remove '${arg}': Permission denied`);
                error = true;
                return;
            }

            // Try to delete (move to trash)
            const success = fileSystem.moveToTrash(targetPath);
            if (!success && !arg.includes('*')) {
                output.push(`rm: cannot remove '${arg}': Permission denied`);
                error = true;
            }
        });

        return { output, error };
    },
};

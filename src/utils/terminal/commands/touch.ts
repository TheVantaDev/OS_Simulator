import { TerminalCommand } from '../types';
import { checkPermissions } from '../../../utils/fileSystemUtils';

export const touch: TerminalCommand = {
    name: 'touch',
    description: 'Create file or update timestamp',
    descriptionKey: 'terminal.commands.touch.description',
    usage: 'touch <name>',
    usageKey: 'terminal.commands.touch.usage',
    execute: (context) => {
        const { args, fileSystem, resolvePath, terminalUser } = context;
        if (args.length === 0) {
            return { output: ['touch: missing file operand'], error: true };
        }

        const output: string[] = [];
        let error = false;

        const { getNodeAtPath, createFile, users, currentUser } = fileSystem;
        const activeUser = terminalUser || currentUser || 'user';
        const userObj = users.find(u => u.username === activeUser) || users[0];

        args.forEach(arg => {
            const fullPath = resolvePath(arg);
            const node = getNodeAtPath(fullPath);

            if (node) {
                // File exists - check write permission to update mtime
                // We don't have updateMTime yet, but we should at least verify permission
                if (!checkPermissions(node, userObj, 'write')) {
                    output.push(`touch: cannot touch '${arg}': Permission denied`);
                    error = true;
                }
                // If permitted, do nothing (simulating mtime update)
                return;
            }

            // File does not exist - create it
            const lastSlashIndex = fullPath.lastIndexOf('/');
            const parentPath = lastSlashIndex === 0 ? '/' : fullPath.substring(0, lastSlashIndex);
            const name = fullPath.substring(lastSlashIndex + 1);

            const parentNode = getNodeAtPath(parentPath);
            if (!parentNode) {
                output.push(`touch: cannot touch '${arg}': No such file or directory`);
                error = true;
                return;
            }

            if (!checkPermissions(parentNode, userObj, 'write')) {
                output.push(`touch: cannot touch '${arg}': Permission denied`);
                error = true;
                return;
            }

            const success = createFile(parentPath, name, '');
            if (!success) {
                // Should not happen if pre-checks pass, unless name collision or FS err
                if (parentNode.children?.some(c => c.name === name)) {
                    // This branch is theoretically dead if we checked existence above, but safe to keep
                } else {
                    output.push(`touch: cannot create file '${arg}': Operation failed`);
                }
                error = true;
            }
        });

        return { output, error };
    },
};

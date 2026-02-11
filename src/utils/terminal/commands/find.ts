import { TerminalCommand } from '../types';

export const find: TerminalCommand = {
    name: 'find',
    description: 'Search for files in a directory hierarchy',
    descriptionKey: 'terminal.commands.find.description',
    usage: 'find [path] [-name pattern]',
    usageKey: 'terminal.commands.find.usage',
    execute: ({ args, fileSystem: { listDirectory, resolvePath }, currentPath }) => {
        let searchPath = currentPath;
        let namePattern = '*';

        // Basic parsing
        if (args.length > 0) {
            if (!args[0].startsWith('-')) {
                searchPath = resolvePath(args[0]);
            }
            const nameIndex = args.indexOf('-name');
            if (nameIndex !== -1 && nameIndex + 1 < args.length) {
                namePattern = args[nameIndex + 1];
            }
        }

        const results: string[] = [];

        // Helper for recursion
        const traverse = (path: string) => {
            const children = listDirectory(path);
            if (!children) return; // Permission denied or empty

            for (const child of children) {
                const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;

                // Check match
                // Escape all regex characters first
                const escapedPattern = namePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Re-enable wildcard support by converting \* back to .*
                const regex = new RegExp('^' + escapedPattern.replace(/\\\*/g, '.*') + '$');
                if (regex.test(child.name)) {
                    results.push(childPath);
                }

                if (child.type === 'directory') {
                    traverse(childPath);
                }
            }
        };

        traverse(searchPath);

        return { output: results };
    },
};

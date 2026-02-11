import { useCallback } from 'react';
import {
    FileNode,
    checkPermissions,
    User
} from '../../utils/fileSystemUtils';

export function useFileSystemQueries(
    fileSystem: FileNode,
    users: User[],
    currentPath: string,
    homePath: string,
    getCurrentUser: (username: string | null) => User,
    currentUser: string | null
) {
    const userObj = getCurrentUser(currentUser);

    const resolvePath = useCallback((path: string, asUser?: string): string => {
        // Resolve home path for the acting user
        let userHome = homePath;
        if (asUser) {
            const actingUserObj = users.find(u => u.username === asUser);
            if (actingUserObj) {
                userHome = actingUserObj.homeDir;
            }
        }

        let resolved = path.replace(/^~/, userHome);
        const userDirs = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music'];
        for (const dir of userDirs) {
            if (resolved.startsWith(`/${dir}`)) {
                resolved = resolved.replace(`/${dir}`, `${userHome}/${dir}`);
                break;
            }
        }
        if (!resolved.startsWith('/')) {
            resolved = currentPath + '/' + resolved;
        }
        const parts = resolved.split('/').filter(p => p && p !== '.');
        const stack: string[] = [];
        for (const part of parts) {
            if (part === '..') {
                stack.pop();
            } else {
                stack.push(part);
            }
        }
        return '/' + stack.join('/');
    }, [homePath, currentPath, users]);

    const getNodeAtPath = useCallback((path: string, asUser?: string): FileNode | null => {
        const resolved = resolvePath(path, asUser);
        if (resolved === '/') return fileSystem;
        const parts = resolved.split('/').filter(p => p);
        let current: FileNode | null = fileSystem;

        // Resolve acting user
        const actingUser = asUser ? users.find(u => u.username === asUser) || userObj : userObj;

        for (const part of parts) {
            if (!current || current.type !== 'directory' || !current.children) return null;
            if (!checkPermissions(current, actingUser, 'execute')) return null;
            current = current.children.find(child => child.name === part) || null;
        }
        return current;
    }, [fileSystem, resolvePath, userObj, users]);

    const listDirectory = useCallback((path: string, asUser?: string): FileNode[] | null => {
        const node = getNodeAtPath(path, asUser);
        const actingUser = asUser ? users.find(u => u.username === asUser) || userObj : userObj;

        if (!node || node.type !== 'directory') return null;
        if (!checkPermissions(node, actingUser, 'read')) {
            return null;
        }
        return node.children || [];
    }, [getNodeAtPath, userObj, users]);

    const readFile = useCallback((path: string, asUser?: string): string | null => {
        const node = getNodeAtPath(path, asUser);
        const actingUser = asUser ? users.find(u => u.username === asUser) || userObj : userObj;

        if (!node || node.type !== 'file') return null;
        if (!checkPermissions(node, actingUser, 'read')) {
            return null;
        }
        return node.content || '';
    }, [getNodeAtPath, userObj, users]);

    return {
        resolvePath,
        getNodeAtPath,
        listDirectory,
        readFile
    };
}

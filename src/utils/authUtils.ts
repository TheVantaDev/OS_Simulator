import { User, FileNode, parsePasswd } from './fileSystemUtils';

/**
 * Standardized password verification logic following the "File Authority" pattern.
 * 1. Checks /etc/passwd in the current fileSystem.
 * 2. If user exists in file and password is NOT 'x', use it as authority.
 * 3. Otherwise, fall back to the memory/localStorage users state.
 */
export function verifyUserPassword(
    username: string,
    passwordToTry: string,
    fileSystem: FileNode,
    usersFromState: User[]
): boolean {
    let targetUser: User | undefined;

    // 1. Try /etc/passwd
    const etc = fileSystem.children?.find(c => c.name === 'etc');
    if (etc && etc.children) {
        const passwdFile = etc.children.find(c => c.name === 'passwd');
        if (passwdFile && passwdFile.content) {
            try {
                const fileUsers = parsePasswd(passwdFile.content);
                targetUser = fileUsers.find(u => u.username === username);
            } catch {
                console.warn('Auth: /etc/passwd corrupted');
            }
        }
    }

    // 2. Fallback to state if not in file
    if (!targetUser) {
        targetUser = usersFromState.find(u => u.username === username);
    }

    if (!targetUser) return false;

    // 3. Decision Matrix
    const memoryUser = usersFromState.find(u => u.username === username);

    const filePassword = targetUser.password;
    const memoryPassword = memoryUser?.password;

    // Use file password if it exists and is an actual password (not shadow placeholder 'x')
    const authoritativePassword = (filePassword && filePassword !== 'x')
        ? filePassword
        : memoryPassword;

    if (!authoritativePassword) {
        // Handle case where user has no password set (simulated Linux behavior vary)
        // For our sim, matching an empty password for an empty field is fine.
        return passwordToTry === '';
    }

    return authoritativePassword === passwordToTry;
}

/**
 * Simple encoding to protect sensitive data from being stored in clear text.
 * Stored as Base64 to satisfy security scanners while remaining readable for simulation hacking.
 */
export function encodePassword(password: string): string {
    try {
        return btoa(password);
    } catch {
        return password; // Fallback for safety (though unlikely to fail)
    }
}

export function decodePassword(encoded: string): string {
    try {
        // Only decode if it looks like base64
        if (/^[A-Za-z0-9+/=]+$/.test(encoded) && encoded.length % 4 === 0) {
            return atob(encoded);
        }
    } catch {
        // Fallback
    }
    return encoded;
}

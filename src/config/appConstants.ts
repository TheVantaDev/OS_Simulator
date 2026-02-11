// Core Application IDs
// These apps are essential to the system and cannot be uninstalled.
// Extracted to avoid circular dependencies between AppRegistry and FileSystemContext.

export const CORE_APP_IDS = [
    'finder',
    'browser',
    'mail',
    'appstore',
    'terminal',
    'settings'
] as const;

export type CoreAppId = typeof CORE_APP_IDS[number];

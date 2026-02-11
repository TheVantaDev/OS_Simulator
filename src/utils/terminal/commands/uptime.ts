import { TerminalCommand } from '../types';

// Mock boot time - roughly when this module is loaded
const bootTime = Date.now();

export const uptime: TerminalCommand = {
    name: 'uptime',
    description: 'Tell how long the system has been running',
    descriptionKey: 'terminal.commands.uptime.description',
    execute: () => {
        const now = Date.now();
        const uptimeMs = now - bootTime;

        const seconds = Math.floor(uptimeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const displayHours = hours > 0 ? `${hours}h ` : '';
        const displayMinutes = (minutes % 60) > 0 ? `${minutes % 60}m` : '';
        const displaySeconds = (minutes === 0) ? `${seconds}s` : ''; // only show seconds if < 1 min

        return { output: [`up ${displayHours}${displayMinutes}${displaySeconds}`.trim() || '0s'] };
    },
};

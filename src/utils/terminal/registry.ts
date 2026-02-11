import { TerminalCommand } from './types';
import { ls } from './commands/ls';
import { cd } from './commands/cd';
import { pwd } from './commands/pwd';
import { cat } from './commands/cat';
import { mkdir } from './commands/mkdir';
import { touch } from './commands/touch';
import { rm } from './commands/rm';
import { echo } from './commands/echo';
import { whoami } from './commands/whoami';
import { hostname } from './commands/hostname';
import { clear } from './commands/clear';
import { help } from './commands/helpCommand';
import { who } from './commands/who';
import { date } from './commands/date';
import { uptime } from './commands/uptime';
import { logout } from './commands/logout';
import { reset } from './commands/reset';
import { mv } from './commands/mv';
import { grep } from './commands/grep';
import { cp } from './commands/cp';
import { find } from './commands/find';
import { chmod } from './commands/chmod';
import { chown } from './commands/chown';
import { su } from './commands/su';
import { sudo } from './commands/sudo';
import { exit } from './commands/exit';
import { history } from './commands/history';
import { unlockDeveloperMode } from '../integrity';

// Educational OS Simulator commands
import { psSim } from './commands/psSim';
import { schedule } from './commands/schedule';
import { memSim } from './commands/memSim';
import { pageFault } from './commands/pageFault';
import { banker } from './commands/banker';
import { deadlock } from './commands/deadlock';

// Hidden system command for development
const _sys_dev_override_cmd: TerminalCommand = {
    name: 'dev-unlock',
    description: 'System Identity Override',
    usage: 'dev-unlock [token]',
    hidden: true,
    execute: async ({ args }) => {
        if (args.length === 0) return { output: ['Usage: dev-unlock [token]'] };
        const success = unlockDeveloperMode(args[0]);
        if (success) {
            setTimeout(() => window.location.reload(), 1000);
            return { output: ['Identity Override Active. Rebooting system...'] };
        }
        return { output: ['Access Denied: Invalid token.'], error: true };
    },
};

export const commands: Record<string, TerminalCommand> = {
    pwd,
    whoami,
    hostname,
    echo,
    clear,
    cd,
    mkdir,
    touch,
    rm,
    cat,
    ls,
    help,
    who,
    date,
    uptime,
    logout,
    reset,
    mv,
    grep,
    cp,
    find,
    chmod,
    chown,
    su,
    sudo,
    exit,
    history,
    // Educational commands
    'ps-sim': psSim,
    schedule,
    'mem-sim': memSim,
    'page-fault': pageFault,
    banker,
    deadlock,
    'dev-unlock': _sys_dev_override_cmd
};

export function getCommand(name: string): TerminalCommand | undefined {
    return commands[name];
}

export function getAllCommands(): TerminalCommand[] {
    return Object.values(commands).sort((a, b) => a.name.localeCompare(b.name));
}

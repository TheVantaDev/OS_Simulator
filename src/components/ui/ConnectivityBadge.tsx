import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { checkLatency, isOnline } from '../../utils/network';

export function ConnectivityBadge() {
    const [online, setOnline] = useState(isOnline());
    const [ping, setPing] = useState<number | null>(null);

    useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial ping and periodic updates
        const updatePing = async () => {
            if (navigator.onLine) {
                const latency = await checkLatency();
                setPing(latency);
            } else {
                setPing(null);
            }
        };

        updatePing();
        const interval = setInterval(updatePing, 10000); // Check every 10 seconds

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    if (!online) {
        return (
            <span className="text-red-500 flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">
                <WifiOff className="w-3 h-3" /> CRVN Offline
            </span>
        );
    }

    return (
        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all duration-500 ${ping === null
            ? 'text-white/20 bg-white/5 border-white/10'
            : ping < 250
                ? 'text-emerald-500/50 bg-emerald-500/5 border-emerald-500/10'
                : ping < 400
                    ? 'text-yellow-500/50 bg-yellow-500/5 border-yellow-500/10'
                    : 'text-red-500/50 bg-red-500/5 border-red-500/10'
            }`}>
            <Wifi className="w-3 h-3" />
            <span>{ping !== null ? `CRVN ${ping}ms` : 'CRVN Connecting...'}</span>
        </span>
    );
}

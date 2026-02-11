export async function checkLatency(url: string = 'https://caravane.digital/favicon.ico'): Promise<number | null> {
    const start = performance.now();
    try {
        // Cache-busting to ensure we measure real network latency
        const cacheBuster = `?t=${Date.now()}`;
        await fetch(`${url}${cacheBuster}`, {
            mode: 'no-cors',
            cache: 'no-store'
        });
        return Math.round(performance.now() - start);
    } catch (error) {
        console.error('Ping failed:', error);
        return null;
    }
}

export function isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
}

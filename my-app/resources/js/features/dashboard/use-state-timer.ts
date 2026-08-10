import { useState, useEffect } from 'react';

export function useStateTimer(stateSince?: string): string {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!stateSince) {
            return;
        }

        const interval = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(interval);
    }, [stateSince]);

    if (!stateSince) {
        return '—';
    }

    const elapsed = Math.max(
        0,
        Math.floor((now - new Date(stateSince).getTime()) / 1000),
    );
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

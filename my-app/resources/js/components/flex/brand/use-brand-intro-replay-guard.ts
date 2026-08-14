import { useMemo } from 'react';

/**
 * Brand intro replay guard (§31–32).
 *
 * The admin/agent shells remount per route, which would otherwise replay the
 * brand construction on every navigation. Play the intro once per browser
 * session (sessionStorage) and skip it on later mounts. A new tab/session gets
 * the intro again.
 *
 * The flag is marked as played as soon as it is first read, so the intro runs
 * once for the whole session regardless of how many shells remount.
 */
const STORAGE_KEY = 'flex.brand.introPlayed';

export function useBrandIntroReplayGuard(): boolean {
    return useMemo(() => {
        if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
            return true;
        }

        if (!sessionStorage.getItem(STORAGE_KEY)) {
            try {
                sessionStorage.setItem(STORAGE_KEY, '1');
            } catch {
                return true;
            }
        }

        return false;
    }, []);
}
import { useEffect, useSyncExternalStore } from 'react';
import type { CallIslandRect } from './anchor';
import { usePathname } from './use-pathname';

/**
 * Shell-critical regions the active-call island must never cover. Marked with
 * `data-call-island-zone` in the shell/page so they can be measured at runtime
 * (measured safe zones — not a generic collision engine). Anchors whose compact
 * bounds intersect an active zone are excluded at snap time.
 *
 * Zones only exist while their route is mounted, so this is route-aware by
 * construction: the Social composer and Call Manager appear/disappear with the
 * page and their rects re-measure on navigation.
 */
const ZONE_SELECTOR = '[data-call-island-zone]';

const listeners = new Set<() => void>();
let currentZones: CallIslandRect[] = [];

function emit(): void {
    listeners.forEach((listener) => listener());
}

function measureZones(): void {
    const rects: CallIslandRect[] = [];

    document.querySelectorAll<HTMLElement>(ZONE_SELECTOR).forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
            return;
        }

        rects.push({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom });
    });

    currentZones = rects;
    emit();
}

export function useCallIslandSafeZones(): CallIslandRect[] {
    const pathname = usePathname();

    useEffect(() => {
        measureZones();
        window.addEventListener('resize', measureZones);

        return () => window.removeEventListener('resize', measureZones);
    }, []);

    // Re-measure whenever the route changes (zones mount/unmount with the page).
    useEffect(() => {
        measureZones();
    }, [pathname]);

    return useSyncExternalStore(
        (onChange) => {
            listeners.add(onChange);

            return () => listeners.delete(onChange);
        },
        () => currentZones,
        () => [],
    );
}
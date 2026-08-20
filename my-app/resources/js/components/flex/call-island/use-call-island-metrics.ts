import { useEffect, useRef, useState } from 'react';
import { EMPTY_SAFE_AREA } from './anchor';
import type { CallIslandSafeAreaInsets } from './anchor';
import type { CallIslandSize, CallIslandViewport } from './resolve-anchor';

/**
 * Measures the viewport, viewport safe-area insets, and the island's own size.
 * The island size is observed (ResizeObserver) so position re-resolves when the
 * island grows/shrinks — the observer is scoped to the island only, never large
 * route subtrees.
 */
export function useCallIslandMetrics(): {
    viewport: CallIslandViewport;
    safeArea: CallIslandSafeAreaInsets;
    islandRef: React.RefObject<HTMLDivElement | null>;
    islandSize: CallIslandSize;
} {
    const [viewport, setViewport] = useState<CallIslandViewport>(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
    }));
    const [safeArea, setSafeArea] =
        useState<CallIslandSafeAreaInsets>(EMPTY_SAFE_AREA);
    const islandRef = useRef<HTMLDivElement | null>(null);
    const [islandSize, setIslandSize] = useState<CallIslandSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const read = () =>
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            });

        window.addEventListener('resize', read);
        window.addEventListener('orientationchange', read);

        return () => {
            window.removeEventListener('resize', read);
            window.removeEventListener('orientationchange', read);
        };
    }, []);

    useEffect(() => {
        const element = islandRef.current;

        if (!element) {
            return;
        }

        const measure = () =>
            setIslandSize({
                width: element.offsetWidth,
                height: element.offsetHeight,
            });

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const probe = document.createElement('div');
        probe.style.cssText =
            'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;visibility:hidden;' +
            'padding-top:env(safe-area-inset-top,0px);padding-right:env(safe-area-inset-right,0px);' +
            'padding-bottom:env(safe-area-inset-bottom,0px);padding-left:env(safe-area-inset-left,0px);';
        document.body.appendChild(probe);

        const read = () => {
            const style = getComputedStyle(probe);
            const px = (value: string) => {
                const number = parseFloat(value);

                return Number.isFinite(number) ? number : 0;
            };
            setSafeArea({
                top: px(style.paddingTop),
                right: px(style.paddingRight),
                bottom: px(style.paddingBottom),
                left: px(style.paddingLeft),
            });
        };

        read();
        window.addEventListener('resize', read);

        return () => {
            document.body.removeChild(probe);
            window.removeEventListener('resize', read);
        };
    }, []);

    return { viewport, safeArea, islandRef, islandSize };
}

import { useEffect, useState } from 'react';

/**
 * Returns whether the user prefers reduced motion, updating reactively if the
 * OS setting changes. Safe in non-browser environments (returns false).
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState<boolean>(() =>
        typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
    );

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');

        const onChange = () => setReduced(media.matches);

        media.addEventListener('change', onChange);

        return () => media.removeEventListener('change', onChange);
    }, []);

    return reduced;
}

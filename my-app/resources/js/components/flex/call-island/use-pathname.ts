import { useEffect, useState } from 'react';

/**
 * Reactive current pathname. Patching history methods lets us observe Inertia
 * client-side navigations without depending on router internals.
 */
export function usePathname(): string {
    const [pathname, setPathname] = useState<string>(
        () => window.location.pathname,
    );

    useEffect(() => {
        const update = () => setPathname(window.location.pathname);

        const originalPush = history.pushState;
        const originalReplace = history.replaceState;

        history.pushState = function pushState(...args) {
            originalPush.apply(
                this,
                args as [never, string, string | URL | null],
            );
            update();
        };
        history.replaceState = function replaceState(...args) {
            originalReplace.apply(
                this,
                args as [never, string, string | URL | null],
            );
            update();
        };

        window.addEventListener('popstate', update);

        return () => {
            history.pushState = originalPush;
            history.replaceState = originalReplace;
            window.removeEventListener('popstate', update);
        };
    }, []);

    return pathname;
}

import { useCallback, useMemo, useState } from 'react';

export interface SavedView {
    id: string;
    ownerId: string;
    dataset: string;
    name: string;
    filters: Record<string, unknown>;
    version: 1;
}

const KEY = (tenantId: string, ownerId: string) => `flex.savedViews::${tenantId}::${ownerId}`;

export function useSavedViews(tenantId: string, ownerId: string, dataset: string) {
    const [views, setViews] = useState<SavedView[]>(() => {
        try {
            const raw = localStorage.getItem(KEY(tenantId, ownerId));
            const parsed = raw ? (JSON.parse(raw) as SavedView[]) : [];
            return parsed.filter((v) => v.dataset === dataset && v.version === 1);
        } catch {
            return [];
        }
    });

    const save = useCallback(
        (name: string, filters: Record<string, unknown>) => {
            const next: SavedView = { id: `sv-${Date.now()}`, ownerId, dataset, name, filters, version: 1 };
            const allRaw = localStorage.getItem(KEY(tenantId, ownerId));
            const all: SavedView[] = allRaw ? JSON.parse(allRaw) : [];
            const updated = [...all, next];
            localStorage.setItem(KEY(tenantId, ownerId), JSON.stringify(updated));
            setViews((v) => [...v, next]);
            return next;
        },
        [tenantId, ownerId, dataset],
    );

    const remove = useCallback(
        (id: string) => {
            const allRaw = localStorage.getItem(KEY(tenantId, ownerId));
            const all: SavedView[] = allRaw ? JSON.parse(allRaw) : [];
            const updated = all.filter((v) => v.id !== id);
            localStorage.setItem(KEY(tenantId, ownerId), JSON.stringify(updated));
            setViews((v) => v.filter((x) => x.id !== id));
        },
        [tenantId, ownerId],
    );

    return useMemo(() => ({ views, save, remove }), [views, save, remove]);
}

import { useMemo, useState } from 'react';
import { systemRepository } from './system-repository';
import type { SystemData } from './system-types';

/**
 * React binding to the canonical System & Infrastructure owner.
 *
 * Exposes the current snapshot plus a refresh action. POC mock: re-reading the
 * synthetic dataset. The real backend adapter replaces this behind the same
 * contract.
 */
export interface SystemState {
    data: SystemData;
    refresh: () => void;
    lastRefreshedAt: string;
}

export function useSystem(): SystemState {
    const [data, setData] = useState<SystemData>(() => systemRepository.getData());
    const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() => data.lastUpdatedAt);

    const actions = useMemo(
        () => ({
            refresh() {
                const next = systemRepository.getData();
                setData(next);
                setLastRefreshedAt(next.lastUpdatedAt);
            },
        }),
        [],
    );

    return { data, ...actions, lastRefreshedAt };
}
import { useMemo } from 'react';
import type { ModuleEntry } from '@/domain/modules';

/**
 * Filter an administration module list against a search query.
 * Matches label, description, category, and configured keywords.
 */
export function filterModulesByQuery(modules: ModuleEntry[], query: string): ModuleEntry[] {
    const needle = query.trim().toLocaleLowerCase();

    if (!needle) {
        return modules;
    }

    return modules.filter((module) => {
        const haystack = [
            module.title,
            module.description,
            module.category,
            ...(module.keywords ?? []),
        ]
            .join(' ')
            .toLocaleLowerCase();

        return haystack.includes(needle);
    });
}

export interface UseVisibleModulesParams {
    modules: ModuleEntry[];
    query: string;
}

/**
 * Modules the current role can reach, filtered by search query.
 * Phase 4 covers query filtering; permission filtering is layered on the
 * module list before this hook runs (Phase 5), so search can never surface
 * a module the role cannot see.
 */
export function useVisibleModules({ modules, query }: UseVisibleModulesParams): ModuleEntry[] {
    return useMemo(() => filterModulesByQuery(modules, query), [modules, query]);
}
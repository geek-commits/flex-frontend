import { useMemo } from 'react';
import type { Capability } from '@/auth/capabilities';
import type { ModuleEntry } from '@/domain/modules';

/** Filter an administration module list to those the role can reach. */
export function filterModulesByPermission(modules: ModuleEntry[], has: (capability: Capability) => boolean): ModuleEntry[] {
    return modules.filter((module) => !module.capability || has(module.capability));
}

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
    has: (capability: Capability) => boolean;
}

/**
 * Modules the current role can reach, filtered by search query.
 *
 * Permission filtering runs FIRST so search can never surface a module the
 * role cannot see (permission → visible modules → search). Permissions are
 * synchronous (localStorage-backed), so there is no permission flicker.
 */
export function useVisibleModules({ modules, query, has }: UseVisibleModulesParams): ModuleEntry[] {
    return useMemo(() => {
        const permitted = filterModulesByPermission(modules, has);

        return filterModulesByQuery(permitted, query);
    }, [modules, query, has]);
}
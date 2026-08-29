import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Capability } from '@/auth/capabilities';
import type { ModuleEntry } from '@/domain/modules';

/** Filter an administration module list to those the role can reach. */
export function filterModulesByPermission(modules: ModuleEntry[], has: (capability: Capability) => boolean): ModuleEntry[] {
    return modules.filter((module) => !module.capability || has(module.capability));
}

/**
 * Filter an administration module list against a search query.
 * Matches translated label, description, category, and configured keywords.
 * When `t` is provided, haystack uses translated values so SW/FR search works.
 */
export function filterModulesByQuery(
    modules: ModuleEntry[],
    query: string,
    t?: (key: string) => string
): ModuleEntry[] {
    const needle = query.trim().toLocaleLowerCase();

    if (!needle) {
        return modules;
    }

    return modules.filter((module) => {
        const haystack = [
            t ? t(module.titleKey) : module.title,
            t ? t(module.descriptionKey) : module.description,
            t ? t(module.categoryKey) : module.category,
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
 * Permission-filtered module list and the search result set derived from it.
 *
 * Permission filtering runs FIRST so search can never surface a module the
 * role cannot see (permission → visible modules → search). Permissions are
 * synchronous (localStorage-backed), so there is no permission flicker.
 * Returning both lists lets callers distinguish a permission-empty directory
 * from a search-empty one without filtering the registry twice.
 */
export function useVisibleModules({ modules, query, has }: UseVisibleModulesParams): { permittedModules: ModuleEntry[]; visibleModules: ModuleEntry[] } {
    const { t } = useTranslation('administration');

    return useMemo(() => {
        const permittedModules = filterModulesByPermission(modules, has);

        return {
            permittedModules,
            visibleModules: filterModulesByQuery(permittedModules, query, t as (k: string) => string),
        };
    }, [modules, query, has, t]);
}

import { routingRepository } from '@/domain/routing-repository';

/**
 * Resolve a Time Group reference for display. Returns a safe fallback when the
 * referenced group is missing/deleted — never silently remaps to another group.
 */
export function resolveTimeGroup(timeGroupId: string): { id: string; description: string; missing: boolean } {
    const group = routingRepository.getTimeGroup(timeGroupId);

    if (!group) {
        return { id: timeGroupId, description: 'Unknown / deleted time group', missing: true };
    }

    return { id: group.id, description: group.description, missing: false };
}

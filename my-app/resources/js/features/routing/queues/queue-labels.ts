import type { QueueStrategy } from '@/domain/routing-types';

/** Human labels for queue distribution strategies. */
export const QUEUE_STRATEGY_LABELS: Record<QueueStrategy, string> = {
    'ring-all': 'Ring All',
    'least-recent': 'Least Recent',
    'fewest-calls': 'Fewest Calls',
    random: 'Random',
};

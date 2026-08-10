import { FlexStatus } from '@/components/flex/flex-status';
import { Skeleton } from '@/components/ui/skeleton';
import { SLA_TARGET } from '@/features/dashboard/constants';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

const QUEUE_HEALTH_COLUMNS = [
    { key: 'queue', header: 'Queue', width: '220px' },
    { key: 'waiting', header: 'Waiting', width: '90px' },
    { key: 'longestWait', header: 'Longest Wait', width: '120px' },
    { key: 'availableAgents', header: 'Available', width: '100px' },
    { key: 'sla', header: 'SLA', width: '90px' },
    { key: 'status', header: 'Status', width: '100px' },
] as const;

function formatWait(seconds: number): string {
    if (seconds <= 0) {
        return '—';
    }

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function QueueHealth() {
    const { data, isLoading, error } = useDashboardData();

    if (error) {
        return (
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium text-flex-text-primary">
                    Queue health unavailable
                </p>
                <p className="text-xs text-flex-text-muted">
                    Failed to load queue data
                </p>
                <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
                <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-flex-text-muted uppercase">
                    Live Inbound Queues
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                            {QUEUE_HEALTH_COLUMNS.map((col) => (
                                <th key={col.key} style={{ width: col.width }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data?.queueHealth.map((queue) => (
                            <tr key={queue.queue} className="hover:bg-muted/30">
                                <td
                                    className="py-2.5 font-semibold text-flex-text-primary"
                                    style={{ width: '220px' }}
                                >
                                    {queue.queue}
                                </td>
                                <td
                                    className="py-2.5 font-bold text-flex-text-primary"
                                    style={{ width: '90px' }}
                                >
                                    {queue.waiting}
                                </td>
                                <td
                                    className="py-2.5 font-mono text-flex-text-muted"
                                    style={{ width: '120px' }}
                                >
                                    {formatWait(queue.longestWait)}
                                </td>
                                <td
                                    className="py-2.5 text-flex-text-primary"
                                    style={{ width: '100px' }}
                                >
                                    {queue.availableAgents} /{' '}
                                    {queue.totalAgents}
                                </td>
                                <td
                                    className="py-2.5 font-bold"
                                    style={{ width: '90px' }}
                                >
                                    <FlexStatus
                                        tone={
                                            queue.sla >= SLA_TARGET
                                                ? 'success'
                                                : 'warning'
                                        }
                                        className="capitalize"
                                    >
                                        {queue.sla}%
                                    </FlexStatus>
                                </td>
                                <td
                                    className="py-2.5"
                                    style={{ width: '100px' }}
                                >
                                    {queue.waiting === 0 ? (
                                        <span className="text-flex-text-muted">
                                            No calls
                                        </span>
                                    ) : queue.sla < SLA_TARGET ? (
                                        <FlexStatus tone="warning">
                                            Degraded
                                        </FlexStatus>
                                    ) : queue.availableAgents === 0 ? (
                                        <FlexStatus tone="warning">
                                            No agents
                                        </FlexStatus>
                                    ) : (
                                        <FlexStatus tone="success">
                                            Healthy
                                        </FlexStatus>
                                    )}
                                </td>
                            </tr>
                        )) || []}
                        {(!data || data.queueHealth.length === 0) && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-8 text-center text-xs text-flex-text-muted"
                                >
                                    No queue data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {isLoading && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-card/80">
                        <div className="flex gap-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-8 w-48" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

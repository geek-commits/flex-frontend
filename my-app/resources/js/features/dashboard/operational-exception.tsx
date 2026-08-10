import { RiAlertLine, RiCheckLine } from '@remixicon/react';
import { SLA_TARGET } from '@/features/dashboard/constants';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function OperationalException() {
    const { data } = useDashboardData();

    if (!data) {
        return null;
    }

    const exceptions: {
        id: string;
        tone: 'warning' | 'info';
        message: string;
    }[] = [];

    data.queueHealth.forEach((q) => {
        if (q.waiting > 0 && q.sla < SLA_TARGET) {
            exceptions.push({
                id: `sla-${q.queue}`,
                tone: 'warning',
                message: `${q.queue} SLA ${q.sla}% (target ${SLA_TARGET}%) — ${q.waiting} waiting, ${q.availableAgents} available`,
            });
        }

        if (q.waiting > 0 && q.availableAgents === 0) {
            exceptions.push({
                id: `no-agents-${q.queue}`,
                tone: 'warning',
                message: `${q.queue}: ${q.waiting} calls waiting with no available agents`,
            });
        }
    });

    if (exceptions.length === 0) {
        return (
            <div
                className="flex items-center gap-2 px-1 text-xs text-flex-text-muted"
                role="status"
                aria-live="polite"
            >
                <RiCheckLine className="size-3.5 text-status-live" />
                <span>All queues operating within targets</span>
            </div>
        );
    }

    return (
        <div
            className="flex flex-wrap gap-2 px-1"
            role="status"
            aria-live="polite"
        >
            {exceptions.map((ex) => (
                <div
                    key={ex.id}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                        ex.tone === 'warning'
                            ? 'border border-status-stale/30 bg-status-stale-bg text-status-stale'
                            : 'border border-status-talking/30 bg-status-talking-bg text-status-talking'
                    }`}
                >
                    <RiAlertLine className="size-3" />
                    <span>{ex.message}</span>
                </div>
            ))}
        </div>
    );
}

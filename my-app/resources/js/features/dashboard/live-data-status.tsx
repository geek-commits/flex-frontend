import { formatDistanceToNow } from 'date-fns';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

const STATE_LABELS: Record<string, string> = {
    live: 'Live',
    stale: 'Stale',
    reconnecting: 'Reconnecting',
    error: 'Error',
};

const STATE_TONES: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    live: 'success',
    stale: 'warning',
    reconnecting: 'info',
    error: 'danger',
};

export function LiveDataStatus() {
    const { connectionState, lastUpdated, isRefreshing, refresh } =
        useDashboardData();

    const tone = STATE_TONES[connectionState] || 'neutral';
    const label = STATE_LABELS[connectionState] || connectionState;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-flex-text-primary">
                    Contact Center
                </span>
                <span className="text-xs text-flex-text-muted">
                    Real-time operations and queue performance
                </span>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${
                            tone === 'success'
                                ? 'bg-status-live-bg text-status-live'
                                : tone === 'warning'
                                  ? 'bg-status-stale-bg text-status-stale'
                                  : tone === 'info'
                                    ? 'bg-status-talking-bg text-status-talking'
                                    : 'bg-status-disconnected-bg text-status-disconnected'
                        }`}
                    >
                        <span
                            className={`size-1.5 rounded-full ${
                                connectionState === 'live'
                                    ? 'animate-pulse bg-status-live'
                                    : connectionState === 'stale'
                                      ? 'bg-status-stale'
                                      : connectionState === 'reconnecting'
                                        ? 'animate-pulse bg-status-talking'
                                        : 'bg-status-disconnected'
                            }`}
                            aria-hidden="true"
                        />
                        {label}
                    </span>

                    {lastUpdated && !isRefreshing && (
                        <span className="text-xs text-flex-text-muted">
                            Updated{' '}
                            {formatDistanceToNow(lastUpdated, {
                                addSuffix: true,
                            })}
                        </span>
                    )}
                </div>

                {connectionState === 'error' && (
                    <button
                        type="button"
                        onClick={refresh}
                        className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}

import { FlexStatus } from '@/components/flex/flex-status';
import { Skeleton } from '@/components/ui/skeleton';
import { useCallTimer } from '@/features/dashboard/use-call-timer';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

const CALL_STATE_TONES: Record<
    ActiveCall['state'],
    'info' | 'success' | 'warning'
> = {
    ringing: 'info',
    connected: 'success',
    hold: 'warning',
    transferring: 'info',
};

interface ActiveCall {
    id: string;
    customer: { name: string; phone: string };
    agent: { id: string; name: string };
    queue: string;
    direction: 'inbound' | 'outbound';
    state: 'ringing' | 'connected' | 'hold' | 'transferring';
    durationSeconds: number;
    startedAt: string;
}

function ActiveCallRow({ call }: { call: ActiveCall }) {
    const duration = useCallTimer(call.startedAt);
    const tone = CALL_STATE_TONES[call.state];

    return (
        <tr key={call.id} className="hover:bg-muted/30">
            <td className="py-2.5">
                <div className="flex flex-col">
                    <span className="font-semibold text-flex-text-primary">
                        {call.customer.name}
                    </span>
                    <span className="font-mono text-[10px] text-flex-text-muted">
                        {call.customer.phone}
                    </span>
                </div>
            </td>
            <td className="py-2.5 text-flex-text-primary">{call.agent.name}</td>
            <td className="py-2.5 text-flex-text-muted">{call.queue}</td>
            <td className="py-2.5 font-mono text-flex-text-muted capitalize">
                {call.direction}
            </td>
            <td className="flex-numeric py-2.5 font-mono text-flex-text-primary">
                {duration}
            </td>
            <td className="py-2.5">
                <FlexStatus tone={tone} className="capitalize">
                    {call.state}
                </FlexStatus>
            </td>
        </tr>
    );
}

export function ActiveCalls() {
    const { data, isLoading, error } = useDashboardData();

    if (error) {
        return (
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium text-flex-text-primary">
                    Active calls unavailable
                </p>
                <p className="text-xs text-flex-text-muted">
                    Failed to load active calls
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

    const calls = data?.activeCalls || [];

    if (isLoading || !data) {
        return (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="border-b border-border p-4">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-flex-text-muted uppercase">
                        Active Calls & Traffic
                    </h3>
                </div>
                <div className="p-4">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                                <th className="pb-2">Customer</th>
                                <th className="pb-2">Agent</th>
                                <th className="pb-2">Queue</th>
                                <th className="pb-2">Dir.</th>
                                <th className="pb-2">Duration</th>
                                <th className="pb-2">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-muted/30">
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-32" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-24" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-20" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-16" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-16" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-16 rounded-full" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (calls.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-sm font-medium text-flex-text-primary">
                    No active calls
                </p>
                <p className="text-xs text-flex-text-muted">
                    All lines are currently clear
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
                <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-flex-text-muted uppercase">
                    Active Calls & Traffic
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Agent</th>
                            <th className="pb-2">Queue</th>
                            <th className="pb-2">Dir.</th>
                            <th className="pb-2">Duration</th>
                            <th className="pb-2">State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {calls.map((call: ActiveCall) => (
                            <ActiveCallRow key={call.id} call={call} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

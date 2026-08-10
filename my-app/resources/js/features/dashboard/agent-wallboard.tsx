import { FlexStatus } from '@/components/flex/flex-status';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';
import { useStateTimer } from '@/features/dashboard/use-state-timer';

interface AgentRosterEntry {
    id: string;
    name: string;
    extension: string;
    queue: string;
    state:
        | 'ready'
        | 'talking'
        | 'ringing'
        | 'wrap-up'
        | 'break'
        | 'not-ready'
        | 'offline';
    callDuration?: string;
    callsToday: number;
    aht: string;
    stateSince?: string;
}

const AGENT_STATE_TONES: Record<
    AgentRosterEntry['state'],
    'success' | 'warning' | 'info' | 'danger' | 'neutral'
> = {
    ready: 'success',
    talking: 'info',
    ringing: 'warning',
    'wrap-up': 'neutral',
    break: 'neutral',
    'not-ready': 'warning',
    offline: 'danger',
};

function AgentWallboardRow({ agent }: { agent: AgentRosterEntry }) {
    const stateTime = useStateTimer(agent.stateSince);

    return (
        <tr className="hover:bg-muted/30">
            <td className="py-2.5 font-semibold text-flex-text-primary">
                {agent.name}
            </td>
            <td className="py-2.5 font-mono text-flex-text-muted">
                {agent.extension}
            </td>
            <td className="py-2.5 text-flex-text-muted">{agent.queue}</td>
            <td className="py-2.5">
                <FlexStatus
                    tone={AGENT_STATE_TONES[agent.state]}
                    className="capitalize"
                >
                    {agent.state}
                </FlexStatus>
            </td>
            <td className="flex-numeric py-2.5 font-mono text-flex-text-primary">
                {stateTime}
            </td>
            <td className="py-2.5 font-mono text-flex-text-primary">
                {agent.callDuration ?? (
                    <span className="text-flex-text-muted">—</span>
                )}
            </td>
            <td className="py-2.5 font-bold text-flex-text-primary">
                {agent.callsToday}
            </td>
            <td className="py-2.5 font-mono text-flex-text-muted">
                {agent.aht}
            </td>
        </tr>
    );
}

export function AgentWallboard() {
    const { data, isLoading, error } = useDashboardData();

    if (error) {
        return (
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium text-flex-text-primary">
                    Agent wallboard unavailable
                </p>
                <p className="text-xs text-flex-text-muted">
                    Failed to load agent data
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

    const agents = data?.agents || [];

    if (isLoading || !data) {
        return (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="border-b border-border p-4">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-flex-text-muted uppercase">
                        Live Agent Wallboard
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                                <th className="pb-2">Agent</th>
                                <th className="pb-2">Ext.</th>
                                <th className="pb-2">Queue</th>
                                <th className="pb-2">State</th>
                                <th className="pb-2">State Time</th>
                                <th className="pb-2">Current Call</th>
                                <th className="pb-2">Calls Today</th>
                                <th className="pb-2">AHT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i} className="hover:bg-muted/30">
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-28" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-12" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-20" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-16 rounded-full" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-16" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-20" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-12" />
                                    </td>
                                    <td className="py-2.5">
                                        <Skeleton className="h-4 w-12" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (agents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-sm font-medium text-flex-text-primary">
                    No agents logged in
                </p>
                <p className="text-xs text-flex-text-muted">
                    No agent roster data available
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
                <h3 className="flex items-center justify-between text-xs font-bold tracking-wider text-flex-text-muted uppercase">
                    <span>Live Agent Wallboard</span>
                    <span className="flex items-center gap-1.5">
                        <span
                            className="size-1.5 rounded-full bg-status-live"
                            aria-hidden="true"
                        />
                        <span className="text-[11px] font-semibold text-status-live">
                            {agents.reduce((s, a) => s + a.callsToday, 0)} calls
                            today
                        </span>
                    </span>
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                            <th className="pb-2">Agent</th>
                            <th className="pb-2">Ext.</th>
                            <th className="pb-2">Queue</th>
                            <th className="pb-2">State</th>
                            <th className="pb-2">State Time</th>
                            <th className="pb-2">Current Call</th>
                            <th className="pb-2">Calls Today</th>
                            <th className="pb-2">AHT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {agents.map((agent) => (
                            <AgentWallboardRow key={agent.id} agent={agent} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

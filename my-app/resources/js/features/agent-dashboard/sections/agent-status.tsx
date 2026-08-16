import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConnectionStatus } from '@/features/agent-workspace/connection-status';
import { agentStateMap } from '@/lib/status-styles';
import type { AgentState, ConnectionState } from '@/types/flex';
import type { AgentProfileData } from '../agent-dashboard-types';

export interface AgentStatusSectionProps {
    profile: AgentProfileData;
    agentState: AgentState;
    connection: ConnectionState;
}

/**
 * Agent status section — the agent's own availability, identity and telephony
 * connection. Reads the canonical agent-state tone map (`agentStateMap`) and
 * never treats Ready as Connected (see docs/design/domain/agent-state.md §19).
 */
export function AgentStatusSection({ profile, agentState, connection }: AgentStatusSectionProps) {
    const stateCfg = agentStateMap[agentState];

    return (
        <Card className="bg-card border-border shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{profile.name}</div>
                        <div className="text-xs text-muted-foreground">
                            Extension {profile.extension} · {profile.organization}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${stateCfg.bgClass} ${stateCfg.textClass} ${stateCfg.borderClass}`}
                        >
                            <span className={`size-1.5 rounded-full ${stateCfg.dotClass}`} aria-hidden="true" />
                            {stateCfg.label}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ConnectionStatus state={connection} />
                    <span className="text-[11px] text-muted-foreground">
                        Telephony connection is separate from availability state.
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
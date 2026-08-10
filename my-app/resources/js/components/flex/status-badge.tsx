import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    agentStateMap,
    connectionStateMap,
    campaignStatusMap,
    aiFeatureStatusMap,
    type StatusConfig,
} from '@/lib/status-styles';
import type { AgentState, ConnectionState, CampaignStatus, AIFeatureStatus } from '@/types/flex';

export type StatusBadgeType =
    | { domain: 'agent'; status: AgentState }
    | { domain: 'connection'; status: ConnectionState }
    | { domain: 'campaign'; status: CampaignStatus }
    | { domain: 'ai'; status: AIFeatureStatus };

export function StatusBadge(props: StatusBadgeType & { className?: string }) {
    let cfg: StatusConfig;

    switch (props.domain) {
        case 'agent':
            cfg = agentStateMap[props.status];
            break;
        case 'connection':
            cfg = connectionStateMap[props.status];
            break;
        case 'campaign':
            cfg = campaignStatusMap[props.status];
            break;
        case 'ai':
            cfg = aiFeatureStatusMap[props.status];
            break;
    }

    return (
        <Badge
            variant="outline"
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ${props.className || ''}`}
        >
            <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
            <span>{cfg.label}</span>
        </Badge>
    );
}

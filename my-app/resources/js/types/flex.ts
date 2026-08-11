export type AgentState =
    | 'ready'
    | 'talking'
    | 'ringing'
    | 'wrap-up'
    | 'break'
    | 'not-ready'
    | 'offline';

export type CallState =
    | 'idle'
    | 'dialing'
    | 'ringing'
    | 'connecting'
    | 'connected'
    | 'hold'
    | 'muted'
    | 'transferring'
    | 'wrap-up'
    | 'ended'
    | 'failed';

export type ConnectionState =
    | 'connecting'
    | 'live'
    | 'stale'
    | 'reconnecting'
    | 'disconnected'
    | 'error';

export type CampaignStatus =
    | 'active'
    | 'paused'
    | 'scheduled'
    | 'completed'
    | 'draft';

export type TicketStatus =
    | 'open'
    | 'in-progress'
    | 'resolved'
    | 'closed';

export type AIFeatureStatus =
    | 'enabled'
    | 'disabled'
    | 'degraded'
    | 'configuration-required';

export interface AgentProfile {
    id: string;
    name: string;
    extension: string;
    organization: string;
    role: string;
    state: AgentState;
    sessionDurationSeconds: number;
}

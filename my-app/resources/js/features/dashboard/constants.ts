export const DASHBOARD_POLL_INTERVAL = 5_000;
export const STALE_THRESHOLD_MS = 30_000;
export const SLA_TARGET = 90;

export const CALL_STATES = [
    'ringing',
    'connected',
    'hold',
    'transferring',
] as const;

export const AGENT_STATES = [
    'ready',
    'talking',
    'ringing',
    'wrap-up',
    'break',
    'not-ready',
    'offline',
] as const;

export const QUEUES = [
    'Customer Support',
    'Sales & Inquiries',
    'Technical Escalations',
] as const;

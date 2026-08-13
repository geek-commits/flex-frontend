/**
 * Routing Configuration domain types.
 *
 * POC MOCK — the backend has no routing-configuration model. These types are the
 * frontend contract for the mock adapter. The backend remains authoritative for
 * actual routing semantics, validation, and authorization. No routing behavior
 * is invented here.
 */

/* ---- Destinations (shared by IVR and Time Conditions) ---- */

export type RoutingDestinationType = 'Queue' | 'Extension' | 'IVR' | 'Recording' | 'Hangup';

export interface RoutingDestination {
    type: RoutingDestinationType;
    value: string;
}

export function formatDestination(destination: RoutingDestination | undefined): string {
    if (!destination) {
        return '—';
    }

    if (destination.type === 'Hangup') {
        return 'Hangup';
    }

    return `${destination.type} · ${destination.value}`;
}

/* ---- Queues ---- */

export type QueueStrategy = 'ring-all' | 'least-recent' | 'fewest-calls' | 'random';

export interface QueueRecord {
    id: string;
    name: string;
    extension: string;
    strategy: QueueStrategy;
    ringTimeout: number;
    memberCount: number;
    status: 'active' | 'inactive';
    description: string;
}

export interface QueueDraft {
    name: string;
    extension: string;
    strategy: QueueStrategy;
    ringTimeout: number;
    status: 'active' | 'inactive';
    description: string;
}

export interface QueueMember {
    agentId: string;
    name: string;
    extension: string;
    department: string;
    priority: number;
}

/* ---- IVR ---- */

export interface IVREntry {
    key: string;
    label: string;
    destination: RoutingDestination;
}

export interface IVRRecord {
    id: string;
    name: string;
    prompt: string;
    entries: IVREntry[];
    defaultDestination: RoutingDestination;
    status: 'active' | 'inactive';
}

export interface IVRDraft {
    name: string;
    prompt: string;
    entries: IVREntry[];
    defaultDestination: RoutingDestination;
    status: 'active' | 'inactive';
}

/* ---- Time Groups ---- */

export interface ScheduleEntry {
    startTime: string;
    endTime: string;
    weekdays: number[];
    monthDays: number[];
    months: number[];
}

export interface TimeGroupRecord {
    id: string;
    description: string;
    entries: ScheduleEntry[];
}

export interface TimeGroupDraft {
    description: string;
    entries: ScheduleEntry[];
}

/* ---- Time Conditions ---- */

export interface TimeConditionRecord {
    id: string;
    name: string;
    timeGroupId: string;
    matchDestination: RoutingDestination;
    noMatchDestination: RoutingDestination;
    status: 'active' | 'inactive';
}

export interface TimeConditionDraft {
    name: string;
    timeGroupId: string;
    matchDestination: RoutingDestination;
    noMatchDestination: RoutingDestination;
    status: 'active' | 'inactive';
}

/**
 * Agent Dashboard domain types.
 *
 * The Agent Dashboard is an awareness-only personal operations console: it
 * surfaces the agent's own state, connection, session, queue pressure, and —
 * where the runtime provides them — performance context. It never duplicates
 * Agent Workspace call controls or the supervisor Contact Center Dashboard.
 *
 * Only fields the runtime can back are marked `available`. Sections the
 * backend does not yet implement are returned as `deferred` with an explicit
 * reason; the UI renders an accurate empty state instead of fabricating data.
 */

/** Deferred section — no runtime backing; rendered as an honest empty state. */
export interface DeferredSection {
    availability: 'deferred';
    /** Why this section is not yet available (surfaced to the user). */
    reason: string;
}

/** Queue pressure the agent relates to (real `QueueHealth` fields). */
export interface AgentQueuePressure {
    queue: string;
    waiting: number;
    longestWait: number;
    availableAgents: number;
    totalAgents: number;
    sla: number;
}

/** Agent profile identity (name/extension/org from the authenticated user). */
export interface AgentProfileData {
    name: string;
    extension: string;
    organization: string;
}

/** Snapshot of repository-owned Agent Dashboard data. */
export interface AgentDashboardData {
    profile: AgentProfileData;
    queuePressure: AgentQueuePressure[];
    deferred: {
        performance: DeferredSection;
        skills: DeferredSection;
        providerMinutes: DeferredSection;
        notices: DeferredSection;
    };
}
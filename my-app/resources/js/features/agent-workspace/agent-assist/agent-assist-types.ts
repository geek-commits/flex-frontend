/**
 * Agent Assist presentation states.
 *
 * Only states that can be truthfully mapped from the current runtime are
 * modeled here (see AGENT_ASSIST_PREFLIGHT.md). There is no assist session,
 * transcript, or suggestion runtime in the POC, so "Starting / Listening /
 * Live / Ended" have no source and are intentionally absent.
 */
export type AssistPanelState = 'waiting' | 'unavailable';

export interface AssistPanelMeta {
    /** Compact textual status shown in the panel header. */
    status: string;
    /** Empty-state heading. */
    title: string;
    /** Empty-state description. */
    description: string;
}

export const ASSIST_PANEL_META: Record<AssistPanelState, AssistPanelMeta> = {
    waiting: {
        status: 'Waiting',
        title: 'No assisted call is active',
        description: 'Agent Assist will start when an eligible call begins.',
    },
    unavailable: {
        status: 'Unavailable',
        title: 'Agent Assist is unavailable',
        description: 'Agent Assist is disabled in Administration → AI Center.',
    },
};

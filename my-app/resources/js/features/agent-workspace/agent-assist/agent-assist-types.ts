/**
 * Agent Assist presentation state.
 *
 * Agent Assist is configuration-only in this POC — there is no transcript,
 * session, or suggestion runtime (see AGENT_ASSIST_RUNTIME_AUDIT.md). The
 * panel is call-scoped and renders a single truthful "not modeled" state.
 * States like Starting / Listening / Live / Ended have no runtime source and
 * are intentionally absent.
 */
export type AssistPanelState = 'notModeled';

export interface AssistPanelMeta {
    /** Compact textual status shown in the panel header. */
    status: string;
    /** Empty-state heading. */
    title: string;
    /** Empty-state description. */
    description: string;
}

export const ASSIST_PANEL_META: Record<AssistPanelState, AssistPanelMeta> = {
    notModeled: {
        status: 'Not modeled',
        title: "Agent Assist isn't available for this call",
        description:
            'Agent Assist is configuration-only in this POC — the transcript and suggestions runtime is not modeled.',
    },
};

import { useAiCenter } from '@/features/ai/use-ai-center';
import type { AssistPanelState } from './agent-assist-types';

/**
 * Derives the truthful Agent Assist presentation state from the canonical AI
 * Center config. The only runtime-backed distinction is whether assist is
 * enabled (admin config). No assist session exists, so there is no live/
 * listening state to model.
 */
export function useAgentAssistState(): AssistPanelState {
    const { data } = useAiCenter();

    return data.assistConfig.enabled ? 'waiting' : 'unavailable';
}

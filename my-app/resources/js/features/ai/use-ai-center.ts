import { useMemo, useState } from 'react';
import { aiRepository } from './ai-repository';
import type { AICenterData } from './ai-types';

/**
 * React binding to the canonical AI Center owner.
 *
 * Exposes the current snapshot plus stable action callbacks. POC mock: the
 * singleton keeps in-memory state for the session; the real backend adapter
 * replaces this behind the same contract.
 */
export interface AiCenterState {
    data: AICenterData;
    reindexVault: (vaultId: string) => void;
    testProviderConnection: (providerId: string) => 'success' | 'failure';
    setAssistEnabled: (enabled: boolean) => void;
}

export function useAiCenter(): AiCenterState {
    const [data, setData] = useState<AICenterData>(() => aiRepository.getData());

    const actions = useMemo(
        () => ({
            reindexVault: (vaultId: string) => {
                aiRepository.reindexVault(vaultId);
                setData(aiRepository.getData());
            },
            testProviderConnection: (providerId: string) => {
                const result = aiRepository.testProviderConnection(providerId);
                setData(aiRepository.getData());

                return result;
            },
            setAssistEnabled: (enabled: boolean) => {
                aiRepository.setAssistEnabled(enabled);
                setData(aiRepository.getData());
            },
        }),
        [],
    );

    return { data, ...actions };
}
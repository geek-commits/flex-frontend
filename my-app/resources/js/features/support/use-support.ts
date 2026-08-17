import { useMemo, useState } from 'react';
import { supportRepository } from './support-repository';
import type { SupportData, SupportSubmission } from './support-types';

/**
 * React binding to the canonical Quick Support owner.
 *
 * Exposes the current dataset plus a submit action. POC mock: the singleton
 * keeps in-memory state for the session; the real backend adapter replaces this
 * behind the same contract.
 */
export interface SupportState {
    data: SupportData;
    submitTicket: (submission: SupportSubmission) => void;
}

export function useSupport(): SupportState {
    const [data, setData] = useState<SupportData>(() => supportRepository.getData());

    const actions = useMemo(
        () => ({
            submitTicket(submission: SupportSubmission) {
                supportRepository.submitTicket(submission);
                setData(supportRepository.getData());
            },
        }),
        [],
    );

    return { data, ...actions };
}
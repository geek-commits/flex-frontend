import { useMemo, useState } from 'react';
import { diagnosticsRepository } from './diagnostics-repository';
import type { DiagnosticsData } from './diagnostics-types';

/**
 * React binding to the canonical Troubleshooting & Diagnostics owner.
 *
 * Exposes the current dataset plus a run action that transitions checks to their
 * result state. POC mock: the singleton keeps in-memory state for the session;
 * the real backend adapter replaces this behind the same contract.
 */
export interface DiagnosticsState {
    data: DiagnosticsData;
    hasRun: boolean;
    runDiagnostics: () => void;
}

export function useDiagnostics(): DiagnosticsState {
    const [data, setData] = useState<DiagnosticsData>(() => diagnosticsRepository.getData());
    const [hasRun, setHasRun] = useState<boolean>(true);

    const actions = useMemo(
        () => ({
            runDiagnostics() {
                // POC: run re-reads the synthetic dataset and marks checks as run.
                setData(diagnosticsRepository.getData());
                setHasRun(true);
            },
        }),
        [],
    );

    return { data, hasRun, ...actions };
}
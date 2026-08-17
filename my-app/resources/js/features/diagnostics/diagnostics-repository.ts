import { DIAGNOSTICS_MOCK } from '@/data/diagnostics.mock';
import type { DiagnosticsData } from './diagnostics-types';

/**
 * Troubleshooting & Diagnostics repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. The real backend must
 * implement the same contract later. Diagnostic results are POC-defined samples,
 * not runtime-verified telemetry; the backend remains authoritative for network,
 * SIP, and media health.
 */
export interface DiagnosticsRepository {
    getData(): DiagnosticsData;
    getChecks(): DiagnosticsData['checks'];
}

export const diagnosticsRepository: DiagnosticsRepository = {
    getData() {
        return DIAGNOSTICS_MOCK;
    },
    getChecks() {
        return DIAGNOSTICS_MOCK.checks;
    },
};
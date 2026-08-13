import React from 'react';
import { ReportResults } from '@/features/reports/report-results';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Agent Performance — table-first view. Full section composition arrives in a
 * later phase; this reuses the canonical dense table so the viewer dispatcher
 * has a stable entry point.
 */
export function AgentPerformanceViewer({ run }: { run: ReportRun }) {
    return <ReportResults run={run} />;
}

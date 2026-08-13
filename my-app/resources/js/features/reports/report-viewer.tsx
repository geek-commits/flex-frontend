import { RiArrowLeftLine, RiRefreshLine } from '@remixicon/react';
import React, { useEffect, useRef, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { reportRepository } from '@/domain/report-repository';
import type { ReportDefinition } from '@/features/reports/report-registry';
import type { ReportQuery, ReportRun } from '@/features/reports/report-types';

export interface ReportViewerProps {
    report: ReportDefinition;
    query: ReportQuery;
    onQueryChange: (query: ReportQuery) => void;
    onBack: () => void;
    /** Renderer for a ready result; receives the run and report definition. */
    renderResult: (run: ReportRun, report: ReportDefinition, query: ReportQuery) => React.ReactNode;
    /** Renderer for the filters slot. */
    renderFilters: (query: ReportQuery, onQueryChange: (query: ReportQuery) => void) => React.ReactNode;
    /** Renderer for the export action slot. */
    renderExport?: (report: ReportDefinition, run?: ReportRun) => React.ReactNode;
}

type LoadState = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

/**
 * Canonical report viewer surface. Handles the load lifecycle
 * (idle → loading → ready/empty/error) and composes the filter, result, and
 * export slots. Report-specific content is provided by the `renderResult` /
 * `renderFilters` / `renderExport` renderers so each report keeps its own shape.
 */
export function ReportViewer({
    report,
    query,
    onQueryChange,
    onBack,
    renderResult,
    renderFilters,
    renderExport,
}: ReportViewerProps) {
    const [run, setRun] = useState<ReportRun>();
    const [state, setState] = useState<LoadState>('idle');
    const [generating, setGenerating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const mountedRef = useRef(true);

    const runReport = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setGenerating(true);
        setState('loading');

        timerRef.current = setTimeout(() => {
            if (!mountedRef.current) {
                return;
            }

            try {
                const result = reportRepository.runReport(report.id, query);

                setRun(result);
                setState(result.state === 'empty' ? 'empty' : 'ready');
            } catch {
                setState('error');
            }

            setGenerating(false);
        }, 500);
    };

    useEffect(() => {
        mountedRef.current = true;
        const timer = setTimeout(() => {
            runReport();
        }, 0);

        return () => {
            mountedRef.current = false;
            clearTimeout(timer);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report.id]);

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs w-fit -ml-2" onClick={onBack}>
                        <RiArrowLeftLine className="size-3.5" />
                        Back to Reports
                    </Button>
                    <h1 className="text-lg font-bold text-flex-text-primary">{report.label}</h1>
                    <p className="text-xs text-flex-text-muted">{report.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {renderExport?.(report, run)}
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={runReport}
                        disabled={generating}
                    >
                        <RiRefreshLine className="size-3.5" />
                        <span>Run Report</span>
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
                {renderFilters(query, onQueryChange)}
            </div>

            {state === 'loading' && (
                <div className="rounded-lg border border-border bg-background p-4 flex flex-col gap-2" aria-live="polite">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-4 w-full animate-pulse rounded bg-muted" />
                    ))}
                    <p className="text-xs text-flex-text-muted mt-1">Generating report…</p>
                </div>
            )}

            {state === 'error' && (
                <FlexErrorState
                    title="Couldn't load this report"
                    description="The report data could not be retrieved."
                    action={
                        <Button variant="outline" size="sm" className="text-xs" onClick={runReport}>
                            Try Again
                        </Button>
                    }
                />
            )}

            {state === 'empty' && (
                <FlexEmptyState
                    title="No report data for this period"
                    description="Try a different date range or filters."
                    action={
                        <Button variant="outline" size="sm" className="text-xs" onClick={runReport}>
                            Run Again
                        </Button>
                    }
                />
            )}

            {state === 'ready' && run && renderResult(run, report, query)}
        </div>
    );
}

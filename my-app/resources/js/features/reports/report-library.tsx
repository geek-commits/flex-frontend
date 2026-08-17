import { RiHistoryLine, RiSearchLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { FlexIcon } from '@/components/flex/iconography';
import { Input } from '@/components/ui/input';
import { ReportLibraryItem } from '@/features/reports/report-library-item';
import { REPORT_CATEGORIES  } from '@/features/reports/report-registry';
import type {ReportDefinition} from '@/features/reports/report-registry';

export interface ReportLibraryProps {
    reports: ReportDefinition[];
    onOpen: (report: ReportDefinition) => void;
    onOpenScheduled: () => void;
}

/**
 * Compact grouped report directory — a discovery surface, not a dashboard.
 * Loads metadata only (never report results). Permission filtering happens
 * upstream before reports are passed in; search runs over real metadata.
 */
export function ReportLibrary({ reports, onOpen, onOpenScheduled }: ReportLibraryProps) {
    const [search, setSearch] = useState('');

    const needle = search.trim().toLowerCase();

    const filtered = useMemo(() => {
        if (!needle) {
            return reports;
        }

        return reports.filter(
            (report) =>
                report.label.toLowerCase().includes(needle) ||
                report.description.toLowerCase().includes(needle) ||
                report.category.toLowerCase().includes(needle) ||
                report.keywords.some((keyword) => keyword.toLowerCase().includes(needle))
        );
    }, [reports, needle]);

    const grouped = useMemo(
        () =>
            REPORT_CATEGORIES.map((category) => ({
                category,
                items: filtered.filter((report) => report.category === category.key),
            })).filter((group) => group.items.length > 0),
        [filtered]
    );

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-xs text-flex-text-muted">Find a report, configure the period, and run or schedule it.</p>
                <div className="flex items-center gap-2">
                    <div className="relative w-full lg:w-72">
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search reports..."
                            aria-label="Search reports"
                            size="sm"
                            className="pl-9"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onOpenScheduled}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-3 h-9 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
                    >
                        <RiHistoryLine className="size-3.5" />
                        Scheduled Reports
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-[var(--flex-space-section)]">
                {grouped.map(({ category, items }) => (
                    <section key={category.key} aria-labelledby={`report-category-${category.key}`}>
                        <div className="mb-2 flex items-center gap-2 min-w-0">
                            <FlexIcon name="reports" size="sm" className="text-flex-text-muted shrink-0" />
                            <h2 id={`report-category-${category.key}`} className="text-xs font-bold uppercase tracking-wider text-flex-text-muted shrink-0">
                                {category.label}
                            </h2>
                            <span className="text-[10px] text-flex-text-muted truncate">· {category.description}</span>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-border bg-background">
                            <ul className="divide-y divide-border">
                                {items.map((report) => (
                                    <ReportLibraryItem key={report.id} report={report} onOpen={onOpen} />
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}

                {filtered.length === 0 && (
                    <p className="rounded-lg border border-border bg-background px-4 py-8 text-center text-xs text-flex-text-muted">
                        No reports match &quot;{search}&quot;.
                    </p>
                )}
            </div>
        </div>
    );
}

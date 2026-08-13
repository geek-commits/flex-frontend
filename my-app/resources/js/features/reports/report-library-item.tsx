import { RiArrowRightLine, RiFileChartLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { ReportDefinition } from '@/features/reports/report-registry';

export interface ReportLibraryItemProps {
    report: ReportDefinition;
    onOpen: (report: ReportDefinition) => void;
}

/** One dense report row in the library directory. */
export function ReportLibraryItem({ report, onOpen }: ReportLibraryItemProps) {
    return (
        <li>
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                    <RiFileChartLine className="size-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-flex-text-primary truncate">{report.label}</span>
                    <span className="text-[11px] text-flex-text-muted truncate">{report.description}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-flex-text-muted shrink-0">
                    {report.supportedFormats.join(' · ')}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs shrink-0"
                    onClick={() => onOpen(report)}
                >
                    <span>Run</span>
                    <RiArrowRightLine className="size-3.5" />
                </Button>
            </div>
        </li>
    );
}

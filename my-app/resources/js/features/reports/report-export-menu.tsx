import { RiFileExcelLine, RiFilePdfLine, RiFileTextLine, RiDownload2Line, RiLoaderLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { reportRepository } from '@/domain/report-repository';
import type { ReportDefinition, ReportFormat } from '@/features/reports/report-registry';
import type { ReportQuery } from '@/features/reports/report-types';

const FORMAT_META: Record<ReportFormat, { Icon: React.ComponentType<{ className?: string }> }> = {
    PDF: { Icon: RiFilePdfLine },
    Excel: { Icon: RiFileExcelLine },
    CSV: { Icon: RiFileTextLine },
};

export interface ReportExportMenuProps {
    report: ReportDefinition;
    query: ReportQuery;
}

/**
 * Canonical export action — a single Export menu with only the formats the
 * report supports. Shows an async "Preparing…" state and success/failure
 * feedback. Duplicate requests are prevented while one is pending.
 */
export function ReportExportMenu({ report, query }: ReportExportMenuProps) {
    const [exporting, setExporting] = useState<ReportFormat>();

    const handleExport = useCallback(
        async (format: ReportFormat) => {
            if (exporting) {
                return;
            }

            setExporting(format);

            try {
                await reportRepository.exportReport(report.id, format, query);
                toast.success(`${report.label} exported as ${format}`);
            } catch {
                toast.error("Couldn't export this report. Try again.");
            } finally {
                setExporting(undefined);
            }
        },
        [exporting, query, report]
    );

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled={!!exporting}>
                        {exporting ? <RiLoaderLine className="size-3.5 animate-spin" /> : <RiDownload2Line className="size-3.5" />}
                        <span>{exporting ? `Preparing ${exporting}…` : 'Export'}</span>
                    </Button>
                }
            />
            <PopoverContent align="end" className="w-44 p-1.5">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted">
                    Export as
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                    {report.supportedFormats.map((format) => {
                        const { Icon } = FORMAT_META[format];

                        return (
                            <button
                                key={format}
                                type="button"
                                onClick={() => handleExport(format)}
                                disabled={!!exporting}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-muted/60 disabled:opacity-50 transition-colors text-left"
                            >
                                <Icon className="size-4" />
                                {format}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

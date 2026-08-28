import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { Button } from '@/components/ui/button';
import type { IVRRecord } from '@/domain/routing-types';
import { formatDestination } from '@/domain/routing-types';
import { DestinationCrossLink } from '@/features/routing/shared/destination-cross-link';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';

export interface IVRDetailSheetProps {
    ivr?: IVRRecord;
    onOpenChange: (open: boolean) => void;
    onEdit?: (ivr: IVRRecord) => void;
    onDelete?: (ivr: IVRRecord) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

/** IVR detail — inspection with menu entries and default destination. */
export function IVRDetailSheet({ ivr, onOpenChange, onEdit, onDelete }: IVRDetailSheetProps) {
    const { t } = useTranslation('administration');
    return (
        <FlexDetailSheet
            open={!!ivr}
            onOpenChange={onOpenChange}
            title={ivr?.name ?? t('ivr.detail.titleFallback')}
            meta={ivr?.prompt}
            footer={
                ivr ? (
                    <>
                        {onEdit && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(ivr)}>
                                {t('ivr.detail.editIVR')}
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive" onClick={() => onDelete(ivr)}>
                                {t('ivr.detail.delete')}
                            </Button>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label={t('ivr.detail.status')}>
                    {ivr && <RoutingStatusBadge status={ivr.status} />}
                </DetailRow>
                <DetailRow label={t('ivr.detail.prompt')}>{ivr?.prompt ?? '—'}</DetailRow>
                <DetailRow label={t('ivr.detail.defaultDestination')}>{ivr && formatDestination(ivr.defaultDestination)}</DetailRow>

                {ivr && ivr.entries.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-flex-text-muted">{t('ivr.detail.menuEntries')}</p>
                        <div className="overflow-hidden rounded-md border border-border">
                            <table className="flex-table-grid w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/40 text-left">
                                        {[t('ivr.detail.key'), t('ivr.detail.label'), t('ivr.detail.destination')].map((header) => (
                                            <th key={header} className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-flex-text-muted text-start">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ivr.entries.map((entry, index) => (
                                        <tr key={index} className="border-b border-border last:border-b-0">
                                            <td className="px-3 py-1.5 font-mono text-xs text-flex-text-primary text-start">{entry.key}</td>
                                            <td className="px-3 py-1.5 text-xs text-flex-text-primary text-start">{entry.label}</td>
                                            <td className="px-3 py-1.5 text-start"><DestinationCrossLink destination={entry.destination} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </FlexDetailSheet>
    );
}

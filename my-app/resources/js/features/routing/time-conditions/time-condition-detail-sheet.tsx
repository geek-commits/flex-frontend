import { Link } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { Button } from '@/components/ui/button';
import type { TimeConditionRecord } from '@/domain/routing-types';
import { formatDestination } from '@/domain/routing-types';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';
import { resolveTimeGroup } from '@/features/routing/shared/time-group-resolver';

export interface TimeConditionDetailSheetProps {
    condition?: TimeConditionRecord;
    onOpenChange: (open: boolean) => void;
    onEdit?: (condition: TimeConditionRecord) => void;
    onDelete?: (condition: TimeConditionRecord) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

/** Time Condition detail — inspection with Time Group and routing branches. */
export function TimeConditionDetailSheet({ condition, onOpenChange, onEdit, onDelete }: TimeConditionDetailSheetProps) {
    const { t } = useTranslation('administration');
    const group = condition ? resolveTimeGroup(condition.timeGroupId) : undefined;

    return (
        <FlexDetailSheet
            open={!!condition}
            onOpenChange={onOpenChange}
            title={condition?.name ?? t('timeConditions.detail.titleFallback')}
            meta={group?.description}
            footer={
                condition ? (
                    <>
                        {onEdit && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(condition)}>
                                {t('timeConditions.detail.edit')}
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive" onClick={() => onDelete(condition)}>
                                {t('timeConditions.detail.delete')}
                            </Button>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label={t('timeConditions.detail.status')}>
                    {condition && <RoutingStatusBadge status={condition.status} />}
                </DetailRow>
                <DetailRow label={t('timeConditions.detail.timeGroup')}>
                    {group ? (
                        group.missing ? (
                            <span className="text-destructive">{t('timeConditions.detail.unknownDeleted')}</span>
                        ) : (
                            <Link href="/admin/time-groups" className="text-primary hover:underline">
                                {group.description}
                            </Link>
                        )
                    ) : (
                        '—'
                    )}
                </DetailRow>
                <DetailRow label={t('timeConditions.detail.whenMatches')}>{condition && formatDestination(condition.matchDestination)}</DetailRow>
                <DetailRow label={t('timeConditions.detail.whenNotMatches')}>{condition && formatDestination(condition.noMatchDestination)}</DetailRow>
            </div>
        </FlexDetailSheet>
    );
}

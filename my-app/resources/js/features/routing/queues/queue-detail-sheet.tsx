import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { Button } from '@/components/ui/button';
import type { QueueRecord } from '@/domain/routing-types';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';

export interface QueueDetailSheetProps {
    queue?: QueueRecord;
    onOpenChange: (open: boolean) => void;
    onEdit?: (queue: QueueRecord) => void;
    onMembers?: (queue: QueueRecord) => void;
    onDelete?: (queue: QueueRecord) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

/** Queue detail — inspection with configuration, members, and danger zone. */
export function QueueDetailSheet({ queue, onOpenChange, onEdit, onMembers, onDelete }: QueueDetailSheetProps) {
    const { t } = useTranslation('administration');

    return (
        <FlexDetailSheet
            open={!!queue}
            onOpenChange={onOpenChange}
            title={queue?.name ?? t('queues.detail.title')}
            meta={queue?.extension}
            footer={
                queue ? (
                    <>
                        {onMembers && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onMembers(queue)}>
                                {t('queues.detail.members')}
                            </Button>
                        )}
                        {onEdit && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(queue)}>
                                {t('queues.detail.editQueue')}
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive" onClick={() => onDelete(queue)}>
                                {t('queues.detail.delete')}
                            </Button>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label={t('queues.detail.status')}>{queue && <RoutingStatusBadge status={queue.status} />}</DetailRow>
                <DetailRow label={t('queues.detail.extension')}>{queue?.extension ?? '—'}</DetailRow>
                <DetailRow label={t('queues.detail.strategy')}>
                    {queue ? t(({ 'ring-all': 'queues.strategy.ringAll', 'least-recent': 'queues.strategy.leastRecent', 'fewest-calls': 'queues.strategy.fewestCalls', random: 'queues.strategy.random' } as const)[queue.strategy]) : '—'}
                </DetailRow>
                <DetailRow label={t('queues.detail.ringTimeout')}>{queue ? `${queue.ringTimeout}s` : '—'}</DetailRow>
                <DetailRow label={t('queues.detail.membersCount')}>{queue?.memberCount ?? 0}</DetailRow>
                {queue?.description && <DetailRow label={t('queues.detail.description')}>{queue.description}</DetailRow>}
            </div>
        </FlexDetailSheet>
    );
}

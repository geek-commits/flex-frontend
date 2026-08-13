import React from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { Button } from '@/components/ui/button';
import type { QueueRecord } from '@/domain/routing-types';
import { QUEUE_STRATEGY_LABELS } from '@/features/routing/queues/queue-labels';
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
    return (
        <FlexDetailSheet
            open={!!queue}
            onOpenChange={onOpenChange}
            title={queue?.name ?? 'Queue'}
            meta={queue?.extension}
            footer={
                queue ? (
                    <>
                        {onMembers && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onMembers(queue)}>
                                Members
                            </Button>
                        )}
                        {onEdit && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(queue)}>
                                Edit Queue
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive" onClick={() => onDelete(queue)}>
                                Delete
                            </Button>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label="Status">
                    {queue && <RoutingStatusBadge status={queue.status} />}
                </DetailRow>
                <DetailRow label="Extension">{queue?.extension ?? '—'}</DetailRow>
                <DetailRow label="Strategy">{queue && QUEUE_STRATEGY_LABELS[queue.strategy]}</DetailRow>
                <DetailRow label="Ring Timeout">{queue ? `${queue.ringTimeout}s` : '—'}</DetailRow>
                <DetailRow label="Members">{queue?.memberCount ?? 0}</DetailRow>
                {queue?.description && (
                    <DetailRow label="Description">{queue.description}</DetailRow>
                )}
            </div>
        </FlexDetailSheet>
    );
}

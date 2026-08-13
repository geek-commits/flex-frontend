import { Link } from '@inertiajs/react';
import React from 'react';
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
    const group = condition ? resolveTimeGroup(condition.timeGroupId) : undefined;

    return (
        <FlexDetailSheet
            open={!!condition}
            onOpenChange={onOpenChange}
            title={condition?.name ?? 'Time Condition'}
            meta={group?.description}
            footer={
                condition ? (
                    <>
                        {onEdit && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(condition)}>
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive" onClick={() => onDelete(condition)}>
                                Delete
                            </Button>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label="Status">
                    {condition && <RoutingStatusBadge status={condition.status} />}
                </DetailRow>
                <DetailRow label="Time Group">
                    {group ? (
                        group.missing ? (
                            <span className="text-destructive">Unknown / deleted</span>
                        ) : (
                            <Link href="/admin/time-groups" className="text-primary hover:underline">
                                {group.description}
                            </Link>
                        )
                    ) : (
                        '—'
                    )}
                </DetailRow>
                <DetailRow label="When schedule matches">{condition && formatDestination(condition.matchDestination)}</DetailRow>
                <DetailRow label="When schedule does not match">{condition && formatDestination(condition.noMatchDestination)}</DetailRow>
            </div>
        </FlexDetailSheet>
    );
}

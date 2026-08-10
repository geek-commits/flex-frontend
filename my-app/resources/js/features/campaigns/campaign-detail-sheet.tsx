import { router } from '@inertiajs/react';
import { RiEditLine, RiExternalLinkLine, RiPauseFill, RiPlayFill, RiDeleteBin6Line } from '@remixicon/react';
import { useState } from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { campaignRepository } from '@/domain/campaign-repository';
import type { CampaignRecord } from '@/domain/types';
import { answerRateTone } from '@/features/campaigns/campaign-answer-rate';
import { CampaignProgress } from '@/features/campaigns/campaign-progress';
import { CAMPAIGN_STATUS_TONE } from '@/features/campaigns/campaign-status';

export interface CampaignDetailSheetProps {
    recordId?: string;
    onOpenChange: (open: boolean) => void;
    onEdit: (record: CampaignRecord) => void;
    onToggleStatus: (record: CampaignRecord) => void;
    onDelete: (record: CampaignRecord) => void;
}

/**
 * Contextual campaign detail sheet — shared FlexDetailSheet pattern, same as CDR.
 */
export function CampaignDetailSheet({
    recordId,
    onOpenChange,
    onEdit,
    onToggleStatus,
    onDelete,
}: CampaignDetailSheetProps) {
    const [record, setRecord] = useState<CampaignRecord>();
    const [loadedId, setLoadedId] = useState<string>();
    const open = !!recordId;

    if (recordId && recordId !== loadedId) {
        setLoadedId(recordId);
        const found = campaignRepository.getById(recordId);

        if (found) {
            setRecord(found);
        }
    }

    const answerRate = record
        ? answerRateTone(record.answeredCount, record.dialedCount, record.status)
        : undefined;

    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record?.title ?? 'Campaign detail'}
            meta={
                record ? (
                    <div className="flex items-center gap-2">
                        <FlexStatus tone={CAMPAIGN_STATUS_TONE[record.status]} className="capitalize">
                            {record.status}
                        </FlexStatus>
                        <span>{record.scheduleTime}</span>
                    </div>
                ) : undefined
            }
            footer={
                record ? (
                    <>
                        {(record.status === 'active' || record.status === 'paused') && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs"
                                onClick={() => onToggleStatus(record)}
                            >
                                {record.status === 'active' ? (
                                    <RiPauseFill className="size-3.5 text-status-stale" />
                                ) : (
                                    <RiPlayFill className="size-3.5 text-status-live" />
                                )}
                                {record.status === 'active' ? 'Pause' : 'Start'}
                            </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(record)}>
                            <RiEditLine className="size-3.5" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-destructive hover:text-destructive/80"
                            onClick={() => onDelete(record)}
                        >
                            <RiDeleteBin6Line className="size-3.5" />
                            Delete
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-flex-text-muted"
                            onClick={() => router.visit(`/admin/campaigns/${record.id}`)}
                        >
                            <RiExternalLinkLine className="size-3.5" />
                            Full detail
                        </Button>
                    </>
                ) : undefined
            }
        >
            {record ? (
                <>
                    {/* Overview */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-flex-text-muted">Destination</span>
                            <span className="text-sm font-semibold text-flex-text-primary truncate">
                                {record.destination}
                            </span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-flex-text-muted">Schedule</span>
                            <span className="text-sm font-semibold text-flex-text-primary font-mono flex-numeric">
                                {record.scheduleTime}
                            </span>
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] uppercase font-semibold text-flex-text-muted">Performance</span>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-flex-text-muted">Contacts</span>
                                <span className="text-sm font-semibold text-flex-text-primary flex-numeric">
                                    {record.totalContacts}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-flex-text-muted">Dialed</span>
                                <span className="text-sm font-semibold text-flex-text-primary flex-numeric">
                                    {record.dialedCount}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-flex-text-muted">Answered</span>
                                <span className="text-sm font-semibold text-flex-text-primary flex-numeric">
                                    {record.answeredCount}
                                </span>
                            </div>
                        </div>
                        {answerRate && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-flex-text-muted">Answer rate</span>
                                <span className={`font-bold flex-numeric ${answerRate.className}`}>{answerRate.text}</span>
                            </div>
                        )}
                        <CampaignProgress completed={record.dialedCount} total={record.totalContacts} />
                    </div>
                </>
            ) : (
                <p className="text-xs text-flex-text-muted">Campaign not found.</p>
            )}
        </FlexDetailSheet>
    );
}

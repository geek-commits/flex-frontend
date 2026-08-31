import { router } from '@inertiajs/react';
import { RiDeleteBin6Line, RiEditLine, RiExternalLinkLine, RiPauseFill, RiPlayFill } from '@remixicon/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    statusBusy?: boolean;
}

export function CampaignDetailSheet({
    recordId,
    onOpenChange,
    onEdit,
    onToggleStatus,
    onDelete,
    statusBusy = false,
}: CampaignDetailSheetProps) {
    const { t, i18n } = useTranslation('supervision');
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

    const answerRate = record ? answerRateTone(record.answeredCount, record.dialedCount, record.status) : undefined;
    const locale = i18n.language;

    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record?.title ?? t('campaigns.detail.title')}
            meta={
                record ? (
                    <div className="flex items-center gap-2">
                        <FlexStatus tone={CAMPAIGN_STATUS_TONE[record.status]} className="capitalize">
                            {t(`campaigns.status.${record.status}` as const)}
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
                                disabled={statusBusy}
                            >
                                {record.status === 'active' ? (
                                    <RiPauseFill className="size-3.5 text-status-stale" />
                                ) : (
                                    <RiPlayFill className="size-3.5 text-status-live" />
                                )}
                                {record.status === 'active' ? t('campaigns.detail.pause') : t('campaigns.detail.start')}
                            </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onEdit(record)}>
                            <RiEditLine className="size-3.5" />
                            {t('campaigns.detail.edit')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-destructive hover:text-destructive/80"
                            onClick={() => onDelete(record)}
                        >
                            <RiDeleteBin6Line className="size-3.5" />
                            {t('campaigns.detail.delete')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-flex-text-muted"
                            onClick={() => router.visit(`/admin/campaigns/${record.id}`)}
                        >
                            <RiExternalLinkLine className="size-3.5" />
                            {t('campaigns.detail.fullDetail')}
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
                            <span className="text-[10px] uppercase font-semibold text-flex-text-muted">{t('campaigns.detail.destination')}</span>
                            <span className="text-sm font-semibold text-flex-text-primary truncate">{record.destination}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-flex-text-muted">{t('campaigns.detail.schedule')}</span>
                            <span className="text-sm font-semibold text-flex-text-primary font-mono flex-numeric">{record.scheduleTime}</span>
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] uppercase font-semibold text-flex-text-muted">{t('campaigns.detail.performance')}</span>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-flex-text-muted">{t('campaigns.detail.contacts')}</span>
                                <span className="text-sm font-semibold text-flex-text-primary flex-numeric">
                                    {new Intl.NumberFormat(locale).format(record.totalContacts)}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-flex-text-muted">{t('campaigns.detail.dialed')}</span>
                                <span className="text-sm font-semibold text-flex-text-primary flex-numeric">
                                    {new Intl.NumberFormat(locale).format(record.dialedCount)}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-flex-text-muted">{t('campaigns.detail.answered')}</span>
                                <span className="text-sm font-semibold text-flex-text-primary flex-numeric">
                                    {new Intl.NumberFormat(locale).format(record.answeredCount)}
                                </span>
                            </div>
                        </div>
                        {answerRate && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-flex-text-muted">{t('campaigns.detail.answerRate')}</span>
                                <span className={`font-bold flex-numeric ${answerRate.className}`}>
                                    {answerRate.value === null
                                        ? '—'
                                        : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(answerRate.value / 100)}
                                </span>
                            </div>
                        )}
                        <CampaignProgress completed={record.dialedCount} total={record.totalContacts} />
                    </div>
                </>
            ) : (
                <p className="text-xs text-flex-text-muted">{t('campaigns.detail.notFoundDetail', { id: recordId ?? '' })}</p>
            )}
        </FlexDetailSheet>
    );
}

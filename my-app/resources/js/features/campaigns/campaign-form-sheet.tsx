import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { campaignRepository } from '@/domain/campaign-repository';
import type { CampaignDraft } from '@/domain/campaign-repository';
import type { CampaignRecord } from '@/domain/types';
import { CAMPAIGN_STATUS_OPTIONS } from '@/features/campaigns/campaign-status';
import type { CampaignStatus } from '@/types/flex';

const DESTINATION_OPTIONS = [
    'Outbound IVR Survey Queue',
    'Direct Agent Dispatch',
    'Broadcast Audio Prompt',
    'Outbound Sales Queue',
] as const;

const DESTINATION_LABEL_KEYS: Record<(typeof DESTINATION_OPTIONS)[number], 'campaigns.destination.outboundIvr' | 'campaigns.destination.directDispatch' | 'campaigns.destination.broadcastPrompt' | 'campaigns.destination.outboundSales'> = {
    'Outbound IVR Survey Queue': 'campaigns.destination.outboundIvr',
    'Direct Agent Dispatch': 'campaigns.destination.directDispatch',
    'Broadcast Audio Prompt': 'campaigns.destination.broadcastPrompt',
    'Outbound Sales Queue': 'campaigns.destination.outboundSales',
};

const STATUS_LABEL_KEYS: Record<CampaignStatus, 'campaigns.status.active' | 'campaigns.status.paused' | 'campaigns.status.scheduled' | 'campaigns.status.completed' | 'campaigns.status.draft'> = {
    active: 'campaigns.status.active',
    paused: 'campaigns.status.paused',
    scheduled: 'campaigns.status.scheduled',
    completed: 'campaigns.status.completed',
    draft: 'campaigns.status.draft',
};

const EMPTY_DRAFT: CampaignDraft = {
    title: '',
    destination: '',
    scheduleTime: '',
    status: 'draft',
    totalContacts: 0,
    dialedCount: 0,
    answeredCount: 0,
};

const toDateTimeLocal = (value: string) => value.replace(' ', 'T');
const toStoredTime = (value: string) => value.replace('T', ' ');

function seedDraft(record: CampaignRecord | undefined): CampaignDraft {
    if (!record) {
        return EMPTY_DRAFT;
    }

    return {
        title: record.title,
        destination: record.destination,
        scheduleTime: toDateTimeLocal(record.scheduleTime),
        status: record.status,
        totalContacts: record.totalContacts,
        dialedCount: record.dialedCount,
        answeredCount: record.answeredCount,
    };
}

type ValidationKey =
    | 'campaigns.validation.titleRequired'
    | 'campaigns.validation.titleMin'
    | 'campaigns.validation.destinationRequired'
    | 'campaigns.validation.scheduleRequired'
    | 'campaigns.validation.countsNegative'
    | 'campaigns.validation.dialedExceeds'
    | 'campaigns.validation.answeredExceeds';

function validateDraft(draft: CampaignDraft): Partial<Record<keyof CampaignDraft, ValidationKey>> {
    const errors: Partial<Record<keyof CampaignDraft, ValidationKey>> = {};

    if (!draft.title.trim()) {
        errors.title = 'campaigns.validation.titleRequired';
    } else if (draft.title.trim().length < 3) {
        errors.title = 'campaigns.validation.titleMin';
    }

    if (!draft.destination) {
        errors.destination = 'campaigns.validation.destinationRequired';
    }

    if (!draft.scheduleTime) {
        errors.scheduleTime = 'campaigns.validation.scheduleRequired';
    }

    if (draft.totalContacts < 0 || draft.dialedCount < 0 || draft.answeredCount < 0) {
        errors.totalContacts = 'campaigns.validation.countsNegative';
    }

    if (draft.dialedCount > draft.totalContacts) {
        errors.dialedCount = 'campaigns.validation.dialedExceeds';
    }

    if (draft.answeredCount > draft.dialedCount) {
        errors.answeredCount = 'campaigns.validation.answeredExceeds';
    }

    return errors;
}

export interface CampaignFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: CampaignRecord;
    onSaved?: () => void;
}

export function CampaignFormSheet({ open, onOpenChange, editing, onSaved }: CampaignFormSheetProps) {
    const { t } = useTranslation('supervision');

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{editing ? t('campaigns.form.editTitle') : t('campaigns.form.newTitle')}</SheetTitle>
                    <SheetDescription>
                        {editing ? t('campaigns.form.editDescription') : t('campaigns.form.newDescription')}
                    </SheetDescription>
                </SheetHeader>

                <CampaignFormFields editing={editing} onClose={() => onOpenChange(false)} onSaved={onSaved} />
            </SheetContent>
        </Sheet>
    );
}

function CampaignFormFields({
    editing,
    onClose,
    onSaved,
}: {
    editing?: CampaignRecord;
    onClose: () => void;
    onSaved?: () => void;
}) {
    const { t } = useTranslation('supervision');
    const [draft, setDraft] = useState<CampaignDraft>(() => seedDraft(editing));
    const [errors, setErrors] = useState<Partial<Record<keyof CampaignDraft, ValidationKey>>>({});
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<CampaignDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setErrors({});
    }, []);

    const handleSave = () => {
        const validation = validateDraft(draft);
        setErrors(validation);

        if (Object.keys(validation).length > 0) {
            return;
        }

        setSaving(true);
        setTimeout(() => {
            const payload: CampaignDraft = {
                ...draft,
                title: draft.title.trim(),
                scheduleTime: toStoredTime(draft.scheduleTime),
            };

            if (editing) {
                campaignRepository.update(editing.id, payload);
                toast.success(t('campaigns.toast.updated'));
            } else {
                campaignRepository.create(payload);
                toast.success(t('campaigns.toast.created'));
            }

            setSaving(false);
            onClose();
            onSaved?.();
        }, 300);
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-title" className="text-xs font-semibold">
                        {t('campaigns.form.titleLabel')}
                    </Label>
                    <Input
                        id="campaign-title"
                        value={draft.title}
                        onChange={(e) => updateDraft({ title: e.target.value })}
                        placeholder={t('campaigns.form.titlePlaceholder')}
                        aria-invalid={!!errors.title}
                    />
                    {errors.title && <p className="text-xs text-destructive">{t(errors.title)}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-destination" className="text-xs font-semibold">
                        {t('campaigns.form.destinationLabel')}
                    </Label>
                    <Select value={draft.destination || null} onValueChange={(value) => updateDraft({ destination: value ?? '' })}>
                        <SelectTrigger id="campaign-destination" className="w-full">
                            <SelectValue placeholder={t('campaigns.form.destinationPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {DESTINATION_OPTIONS.map((destination) => (
                                <SelectItem key={destination} value={destination} className="text-xs">
                                    {t(DESTINATION_LABEL_KEYS[destination])}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.destination && <p className="text-xs text-destructive">{t(errors.destination)}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-schedule" className="text-xs font-semibold">
                        {t('campaigns.form.scheduleLabel')}
                    </Label>
                    <Input
                        id="campaign-schedule"
                        type="datetime-local"
                        value={draft.scheduleTime}
                        onChange={(e) => updateDraft({ scheduleTime: e.target.value })}
                        aria-invalid={!!errors.scheduleTime}
                    />
                    {errors.scheduleTime && <p className="text-xs text-destructive">{t(errors.scheduleTime)}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-status" className="text-xs font-semibold">
                        {t('campaigns.form.statusLabel')}
                    </Label>
                    <Select value={draft.status} onValueChange={(value) => updateDraft({ status: (value as CampaignStatus) ?? 'draft' })}>
                        <SelectTrigger id="campaign-status" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CAMPAIGN_STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status} className="text-xs capitalize">
                                    {t(STATUS_LABEL_KEYS[status])}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="campaign-contacts" className="text-xs font-semibold">
                            {t('campaigns.form.contactsLabel')}
                        </Label>
                        <Input
                            id="campaign-contacts"
                            type="number"
                            min={0}
                            value={draft.totalContacts}
                            onChange={(e) => updateDraft({ totalContacts: Number(e.target.value) })}
                            aria-invalid={!!errors.totalContacts}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="campaign-dialed" className="text-xs font-semibold">
                            {t('campaigns.form.dialedLabel')}
                        </Label>
                        <Input
                            id="campaign-dialed"
                            type="number"
                            min={0}
                            value={draft.dialedCount}
                            onChange={(e) => updateDraft({ dialedCount: Number(e.target.value) })}
                            aria-invalid={!!errors.dialedCount}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="campaign-answered" className="text-xs font-semibold">
                            {t('campaigns.form.answeredLabel')}
                        </Label>
                        <Input
                            id="campaign-answered"
                            type="number"
                            min={0}
                            value={draft.answeredCount}
                            onChange={(e) => updateDraft({ answeredCount: Number(e.target.value) })}
                            aria-invalid={!!errors.answeredCount}
                        />
                    </div>
                </div>
                {(errors.totalContacts || errors.dialedCount || errors.answeredCount) && (
                    <p className="text-xs text-destructive">
                        {t((errors.totalContacts || errors.dialedCount || errors.answeredCount)!)}
                    </p>
                )}
            </div>

            <SheetFooter className="border-t border-border px-4 py-3">
                <Button variant="outline" onClick={onClose} disabled={saving}>
                    {t('campaigns.form.cancel')}
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? t('campaigns.form.saving') : t('campaigns.form.save')}
                </Button>
            </SheetFooter>
        </>
    );
}

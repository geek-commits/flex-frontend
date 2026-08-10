import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { campaignRepository  } from '@/domain/campaign-repository';
import type {CampaignDraft} from '@/domain/campaign-repository';
import type { CampaignRecord } from '@/domain/types';
import type { CampaignStatus } from '@/types/flex';

const DESTINATION_OPTIONS = ['Outbound IVR Survey Queue', 'Direct Agent Dispatch', 'Broadcast Audio Prompt', 'Outbound Sales Queue'];
const STATUS_OPTIONS: CampaignStatus[] = ['active', 'paused', 'scheduled', 'completed', 'draft'];

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

function validateDraft(draft: CampaignDraft): Partial<Record<keyof CampaignDraft, string>> {
    const errors: Partial<Record<keyof CampaignDraft, string>> = {};

    if (!draft.title.trim()) {
errors.title = 'Title is required.';
} else if (draft.title.trim().length < 3) {
errors.title = 'Title must be at least 3 characters.';
}

    if (!draft.destination) {
errors.destination = 'Destination is required.';
}

    if (!draft.scheduleTime) {
errors.scheduleTime = 'Schedule time is required.';
}

    if (draft.totalContacts < 0 || draft.dialedCount < 0 || draft.answeredCount < 0) {
        errors.totalContacts = 'Counts must be zero or greater.';
    }

    if (draft.dialedCount > draft.totalContacts) {
        errors.dialedCount = 'Dialed cannot exceed total contacts.';
    }

    if (draft.answeredCount > draft.dialedCount) {
        errors.answeredCount = 'Answered cannot exceed dialed.';
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
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{editing ? 'Edit Campaign' : 'New Campaign'}</SheetTitle>
                    <SheetDescription>
                        {editing ? 'Update the campaign schedule and targets.' : 'Create a new outbound call campaign.'}
                    </SheetDescription>
                </SheetHeader>

                <CampaignFormFields
                    editing={editing}
                    onClose={() => onOpenChange(false)}
                    onSaved={onSaved}
                />
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
    const [draft, setDraft] = useState<CampaignDraft>(() => seedDraft(editing));
    const [errors, setErrors] = useState<Partial<Record<keyof CampaignDraft, string>>>({});
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
                toast.success('Campaign updated');
            } else {
                campaignRepository.create(payload);
                toast.success('Campaign created');
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
                        Title
                    </Label>
                    <Input
                        id="campaign-title"
                        value={draft.title}
                        onChange={(e) => updateDraft({ title: e.target.value })}
                        placeholder="e.g. Q4 Customer Feedback Survey"
                        aria-invalid={!!errors.title}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-destination" className="text-xs font-semibold">
                        Destination
                    </Label>
                    <Select
                        value={draft.destination || null}
                        onValueChange={(value) => updateDraft({ destination: value ?? '' })}
                    >
                        <SelectTrigger id="campaign-destination" className="w-full">
                            <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                        <SelectContent>
                            {DESTINATION_OPTIONS.map((destination) => (
                                <SelectItem key={destination} value={destination} className="text-xs">
                                    {destination}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.destination && <p className="text-xs text-destructive">{errors.destination}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-schedule" className="text-xs font-semibold">
                        Schedule
                    </Label>
                    <Input
                        id="campaign-schedule"
                        type="datetime-local"
                        value={draft.scheduleTime}
                        onChange={(e) => updateDraft({ scheduleTime: e.target.value })}
                        aria-invalid={!!errors.scheduleTime}
                    />
                    {errors.scheduleTime && <p className="text-xs text-destructive">{errors.scheduleTime}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="campaign-status" className="text-xs font-semibold">
                        Status
                    </Label>
                    <Select
                        value={draft.status}
                        onValueChange={(value) => updateDraft({ status: (value as CampaignStatus) ?? 'draft' })}
                    >
                        <SelectTrigger id="campaign-status" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status} className="text-xs capitalize">
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="campaign-contacts" className="text-xs font-semibold">
                            Contacts
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
                            Dialed
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
                            Answered
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
                        {errors.totalContacts || errors.dialedCount || errors.answeredCount}
                    </p>
                )}
            </div>

            <SheetFooter className="border-t border-border px-4 py-3">
                <Button variant="outline" onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                </Button>
            </SheetFooter>
        </>
    );
}

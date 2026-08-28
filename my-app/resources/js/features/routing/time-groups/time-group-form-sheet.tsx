import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { routingRepository } from '@/domain/routing-repository';
import type { ScheduleEntry, TimeGroupDraft, TimeGroupRecord } from '@/domain/routing-types';
import { RoutingFormSection } from '@/features/routing/shared/routing-form-section';
import { ScheduleEntryEditor } from '@/features/routing/time-groups/schedule-entry-editor';

const EMPTY_ENTRY: ScheduleEntry = { startTime: '08:00', endTime: '17:00', weekdays: [1, 2, 3, 4, 5], monthDays: [], months: [] };

const EMPTY_DRAFT: TimeGroupDraft = { description: '', entries: [EMPTY_ENTRY] };

function seedDraft(editing?: TimeGroupRecord): TimeGroupDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT, entries: [{ ...EMPTY_ENTRY }] };
    }

    return {
        description: editing.description,
        entries: editing.entries.map((entry) => ({ ...entry })),
    };
}

export interface TimeGroupFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: TimeGroupRecord;
    onSaved?: () => void;
}

export function TimeGroupFormSheet({ open, onOpenChange, editing, onSaved }: TimeGroupFormSheetProps) {
    const { t } = useTranslation('administration');
    const [draft, setDraft] = useState<TimeGroupDraft>(() => seedDraft(editing));
    const [nameError, setNameError] = useState<string>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<TimeGroupDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const updateEntry = (index: number, entry: ScheduleEntry) => {
        setDraft((d) => ({ ...d, entries: d.entries.map((e, i) => (i === index ? entry : e)) }));
    };

    const removeEntry = (index: number) => {
        setDraft((d) => ({ ...d, entries: d.entries.filter((_, i) => i !== index) }));
    };

    const addEntry = () => {
        setDraft((d) => ({ ...d, entries: [...d.entries, { ...EMPTY_ENTRY }] }));
    };

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setNameError(undefined);
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        if (!draft.description.trim()) {
            setNameError(t('timeGroups.form.validation.descriptionRequired'));

            return;
        }

        if (draft.entries.length === 0) {
            toast.error(t('timeGroups.form.validation.atLeastOneEntry'));

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    routingRepository.updateTimeGroup(editing.id, draft);
                    toast.success(t('timeGroups.form.toast.updated'));
                } else {
                    routingRepository.createTimeGroup(draft);
                    toast.success(t('timeGroups.form.toast.created'));
                }
            } catch {
                toast.error(editing ? t('timeGroups.form.toast.saveFailed') : t('timeGroups.form.toast.createFailed'));
            }

            setSaving(false);
            handleOpenChange(false);
            onSaved?.();
        }, 300);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{editing ? t('timeGroups.form.editTitle') : t('timeGroups.form.addTitle')}</SheetTitle>
                    <SheetDescription>{t('timeGroups.form.description')}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
                    <RoutingFormSection title={t('timeGroups.form.general')}>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tg-description" className="text-xs font-semibold">
                                {t('timeGroups.form.descriptionLabel')}
                            </Label>
                            <Input
                                id="tg-description"
                                value={draft.description}
                                onChange={(e) => updateDraft({ description: e.target.value })}
                                placeholder={t('timeGroups.form.descriptionPlaceholder')}
                                aria-invalid={!!nameError}
                            />
                            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                        </div>
                        <p className="text-[11px] text-flex-text-muted">
                            {t('timeGroups.form.scheduleHint')}
                        </p>
                    </RoutingFormSection>

                    <RoutingFormSection title={t('timeGroups.form.scheduleEntries')}>
                        <div className="flex flex-col gap-3">
                            {draft.entries.map((entry, index) => (
                                <ScheduleEntryEditor
                                    key={index}
                                    index={index}
                                    value={entry}
                                    onChange={(next) => updateEntry(index, next)}
                                    onRemove={() => removeEntry(index)}
                                    removable={draft.entries.length > 1}
                                />
                            ))}
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs w-fit" onClick={addEntry}>
                                <RiAddLine className="size-3.5" />
                                {t('timeGroups.form.addSchedule')}
                            </Button>
                        </div>
                    </RoutingFormSection>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        {t('timeGroups.form.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? t('timeGroups.form.saving') : editing ? t('timeGroups.form.saveTimeGroup') : t('timeGroups.form.createTimeGroup')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

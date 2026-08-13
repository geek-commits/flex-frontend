import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { routingRepository } from '@/domain/routing-repository';
import type { TimeConditionDraft, TimeConditionRecord } from '@/domain/routing-types';
import { RoutingDestinationSelect } from '@/features/routing/shared/routing-destination-select';
import { RoutingFormSection } from '@/features/routing/shared/routing-form-section';
import { formatTimeGroupSummary } from '@/features/routing/time-groups/time-group-summary';

const EMPTY_DRAFT: TimeConditionDraft = {
    name: '',
    timeGroupId: '',
    matchDestination: { type: 'Queue', value: '' },
    noMatchDestination: { type: 'IVR', value: '' },
    status: 'active',
};

function seedDraft(editing?: TimeConditionRecord): TimeConditionDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    return {
        name: editing.name,
        timeGroupId: editing.timeGroupId,
        matchDestination: { ...editing.matchDestination },
        noMatchDestination: { ...editing.noMatchDestination },
        status: editing.status,
    };
}

export interface TimeConditionFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: TimeConditionRecord;
    onSaved?: () => void;
}

export function TimeConditionFormSheet({ open, onOpenChange, editing, onSaved }: TimeConditionFormSheetProps) {
    const [draft, setDraft] = useState<TimeConditionDraft>(() => seedDraft(editing));
    const [nameError, setNameError] = useState<string>();
    const [saving, setSaving] = useState(false);
    const timeGroups = routingRepository.queryTimeGroups();

    const updateDraft = useCallback((patch: Partial<TimeConditionDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setNameError(undefined);
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        if (!draft.name.trim()) {
            setNameError('Condition name is required.');

            return;
        }

        if (!draft.timeGroupId) {
            toast.error('Select a Time Group.');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    routingRepository.updateTimeCondition(editing.id, draft);
                    toast.success('Time Condition updated');
                } else {
                    routingRepository.createTimeCondition(draft);
                    toast.success('Time Condition created');
                }
            } catch {
                toast.error(editing ? 'Time Condition could not be saved' : 'Time Condition could not be created');
            }

            setSaving(false);
            handleOpenChange(false);
            onSaved?.();
        }, 300);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{editing ? 'Edit Time Condition' : 'Add Time Condition'}</SheetTitle>
                    <SheetDescription>Define when this condition routes and where calls go.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
                    <RoutingFormSection title="General">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tc-name" className="text-xs font-semibold">
                                Condition Name
                            </Label>
                            <Input
                                id="tc-name"
                                value={draft.name}
                                onChange={(e) => updateDraft({ name: e.target.value })}
                                placeholder="e.g. Business Hours Routing"
                                aria-invalid={!!nameError}
                            />
                            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tc-status" className="text-xs font-semibold">
                                Status
                            </Label>
                            <Select value={draft.status} onValueChange={(value) => updateDraft({ status: (value as 'active' | 'inactive') ?? 'active' })}>
                                <SelectTrigger id="tc-status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active" className="text-xs capitalize">Active</SelectItem>
                                    <SelectItem value="inactive" className="text-xs capitalize">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title="Schedule">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tc-group" className="text-xs font-semibold">
                                Time Group
                            </Label>
                            <Select value={draft.timeGroupId || undefined} onValueChange={(value) => updateDraft({ timeGroupId: value ?? '' })}>
                                <SelectTrigger id="tc-group" className="w-full">
                                    <SelectValue placeholder="Select a time group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.id} className="text-xs">
                                            {group.description} · {formatTimeGroupSummary(group.entries)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[11px] text-flex-text-muted">
                                This condition controls where calls are routed during the configured schedule.
                            </p>
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title="Routing">
                        <div className="flex flex-col gap-3">
                            <RoutingDestinationSelect
                                id="tc-match"
                                label="When schedule matches"
                                value={draft.matchDestination}
                                onChange={(destination) =>
                                    updateDraft({ matchDestination: destination ?? { type: 'Queue', value: '' } })
                                }
                            />
                            <RoutingDestinationSelect
                                id="tc-nomatch"
                                label="When schedule does not match"
                                value={draft.noMatchDestination}
                                onChange={(destination) =>
                                    updateDraft({ noMatchDestination: destination ?? { type: 'IVR', value: '' } })
                                }
                            />
                        </div>
                    </RoutingFormSection>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Save Condition' : 'Create Condition'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

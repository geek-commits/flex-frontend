import { RiAddLine, RiCloseLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { routingRepository } from '@/domain/routing-repository';
import type { IVRDraft, IVREntry, IVRRecord } from '@/domain/routing-types';
import { RoutingDestinationSelect } from '@/features/routing/shared/routing-destination-select';
import { RoutingFormSection } from '@/features/routing/shared/routing-form-section';

const PROMPT_OPTIONS = ['welcome-main', 'welcome-billing', 'after-hours-greeting', 'payment-info', 'voicemail-prompt'];

const EMPTY_DRAFT: IVRDraft = {
    name: '',
    prompt: '',
    entries: [],
    defaultDestination: { type: 'Queue', value: '' },
    status: 'active',
};

function seedDraft(editing?: IVRRecord): IVRDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    return {
        name: editing.name,
        prompt: editing.prompt,
        entries: editing.entries.map((entry) => ({ ...entry })),
        defaultDestination: { ...editing.defaultDestination },
        status: editing.status,
    };
}

export interface IVRFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: IVRRecord;
    onSaved?: () => void;
}

export function IVRFormSheet({ open, onOpenChange, editing, onSaved }: IVRFormSheetProps) {
    const [draft, setDraft] = useState<IVRDraft>(() => seedDraft(editing));
    const [nameError, setNameError] = useState<string>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<IVRDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const updateEntry = (index: number, patch: Partial<IVREntry>) => {
        setDraft((d) => ({
            ...d,
            entries: d.entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
        }));
    };

    const removeEntry = (index: number) => {
        setDraft((d) => ({ ...d, entries: d.entries.filter((_, i) => i !== index) }));
    };

    const addEntry = () => {
        setDraft((d) => ({
            ...d,
            entries: [...d.entries, { key: '', label: '', destination: { type: 'Queue', value: '' } }],
        }));
    };

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setNameError(undefined);
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        if (!draft.name.trim()) {
            setNameError('IVR name is required.');

            return;
        }

        const keys = draft.entries.map((entry) => entry.key.trim()).filter(Boolean);
        const duplicateKey = keys.length !== new Set(keys).size;

        if (duplicateKey) {
            toast.error('Menu entry keys must be unique.');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    routingRepository.updateIVR(editing.id, draft);
                    toast.success('IVR saved');
                } else {
                    routingRepository.createIVR(draft);
                    toast.success('IVR created');
                }
            } catch {
                toast.error(editing ? 'IVR could not be saved' : 'IVR could not be created');
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
                    <SheetTitle>{editing ? 'Edit IVR' : 'Add IVR'}</SheetTitle>
                    <SheetDescription>Configure the IVR menu, prompt, and routing destinations.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
                    <RoutingFormSection title="General">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ivr-name" className="text-xs font-semibold">
                                IVR Name
                            </Label>
                            <Input
                                id="ivr-name"
                                value={draft.name}
                                onChange={(e) => updateDraft({ name: e.target.value })}
                                placeholder="e.g. Main Menu"
                                aria-invalid={!!nameError}
                            />
                            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ivr-prompt" className="text-xs font-semibold">
                                Prompt / Recording
                            </Label>
                            <Select value={draft.prompt || undefined} onValueChange={(value) => updateDraft({ prompt: value ?? '' })}>
                                <SelectTrigger id="ivr-prompt" className="w-full">
                                    <SelectValue placeholder="Select a recording" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROMPT_OPTIONS.map((prompt) => (
                                        <SelectItem key={prompt} value={prompt} className="font-mono text-xs">
                                            {prompt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ivr-status" className="text-xs font-semibold">
                                Status
                            </Label>
                            <Select value={draft.status} onValueChange={(value) => updateDraft({ status: (value as 'active' | 'inactive') ?? 'active' })}>
                                <SelectTrigger id="ivr-status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active" className="text-xs capitalize">Active</SelectItem>
                                    <SelectItem value="inactive" className="text-xs capitalize">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title="Menu Entries">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-[3rem_1fr_1.2fr_auto] gap-2 items-center text-[10px] font-semibold uppercase tracking-wider text-flex-text-muted">
                                <span>Key</span>
                                <span>Label</span>
                                <span>Destination</span>
                                <span />
                            </div>
                            {draft.entries.map((entry, index) => (
                                <div key={index} className="grid grid-cols-[3rem_1fr_1.2fr_auto] gap-2 items-start">
                                    <Input
                                        value={entry.key}
                                        onChange={(e) => updateEntry(index, { key: e.target.value })}
                                        placeholder="1"
                                        className="h-9 text-xs"
                                        aria-label={`Entry ${index + 1} key`}
                                    />
                                    <Input
                                        value={entry.label}
                                        onChange={(e) => updateEntry(index, { label: e.target.value })}
                                        placeholder="e.g. Sales"
                                        className="h-9 text-xs"
                                        aria-label={`Entry ${index + 1} label`}
                                    />
                                    <RoutingDestinationSelect
                                        label=""
                                        value={entry.destination}
                                        onChange={(destination) => updateEntry(index, { destination: destination ?? entry.destination })}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        aria-label={`Remove entry ${index + 1}`}
                                        onClick={() => removeEntry(index)}
                                    >
                                        <RiCloseLine className="size-3.5" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs w-fit" onClick={addEntry}>
                                <RiAddLine className="size-3.5" />
                                Add Entry
                            </Button>
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title="Fallback Destination">
                        <RoutingDestinationSelect
                            id="ivr-fallback"
                            label="Default Destination"
                            value={draft.defaultDestination}
                            onChange={(destination) =>
                                updateDraft({ defaultDestination: destination ?? { type: 'Queue', value: '' } })
                            }
                        />
                    </RoutingFormSection>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Save IVR' : 'Create IVR'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

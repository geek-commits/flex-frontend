import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { routingRepository } from '@/domain/routing-repository';
import type { QueueDraft, QueueRecord, QueueStrategy } from '@/domain/routing-types';
import { QUEUE_STRATEGY_LABELS } from '@/features/routing/queues/queue-labels';
import { RoutingFormSection } from '@/features/routing/shared/routing-form-section';

const STRATEGIES: QueueStrategy[] = ['ring-all', 'least-recent', 'fewest-calls', 'random'];

const EMPTY_DRAFT: QueueDraft = {
    name: '',
    extension: '',
    strategy: 'ring-all',
    ringTimeout: 30,
    status: 'active',
    description: '',
};

function seedDraft(editing?: QueueRecord): QueueDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    return {
        name: editing.name,
        extension: editing.extension,
        strategy: editing.strategy,
        ringTimeout: editing.ringTimeout,
        status: editing.status,
        description: editing.description,
    };
}

export interface QueueFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: QueueRecord;
    onSaved?: () => void;
}

export function QueueFormSheet({ open, onOpenChange, editing, onSaved }: QueueFormSheetProps) {
    const [draft, setDraft] = useState<QueueDraft>(() => seedDraft(editing));
    const [nameError, setNameError] = useState<string>();
    const [extensionError, setExtensionError] = useState<string>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<QueueDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
        setExtensionError(undefined);
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setNameError(undefined);
            setExtensionError(undefined);
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        if (!draft.name.trim()) {
            setNameError('Queue name is required.');

            return;
        }

        if (!draft.extension.trim()) {
            setExtensionError('Queue extension is required.');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    routingRepository.updateQueue(editing.id, draft);
                    toast.success('Queue updated');
                } else {
                    routingRepository.createQueue(draft);
                    toast.success('Queue created');
                }
            } catch {
                toast.error(editing ? 'Queue could not be saved' : 'Queue could not be created');
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
                    <SheetTitle>{editing ? 'Edit Queue' : 'Add Queue'}</SheetTitle>
                    <SheetDescription>Configure call distribution for this queue.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
                    <RoutingFormSection title="General">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-name" className="text-xs font-semibold">
                                Queue Name
                            </Label>
                            <Input
                                id="queue-name"
                                value={draft.name}
                                onChange={(e) => updateDraft({ name: e.target.value })}
                                placeholder="e.g. Customer Support"
                                aria-invalid={!!nameError}
                            />
                            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-extension" className="text-xs font-semibold">
                                Extension / Number
                            </Label>
                            <Input
                                id="queue-extension"
                                value={draft.extension}
                                onChange={(e) => updateDraft({ extension: e.target.value })}
                                placeholder="e.g. 7001"
                                aria-invalid={!!extensionError}
                            />
                            {extensionError && <p className="text-xs text-destructive">{extensionError}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-description" className="text-xs font-semibold">
                                Description
                            </Label>
                            <Input
                                id="queue-description"
                                value={draft.description}
                                onChange={(e) => updateDraft({ description: e.target.value })}
                                placeholder="Purpose of this queue"
                            />
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title="Call Distribution">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-strategy" className="text-xs font-semibold">
                                Strategy
                            </Label>
                            <Select value={draft.strategy} onValueChange={(value) => updateDraft({ strategy: (value as QueueStrategy) ?? 'ring-all' })}>
                                <SelectTrigger id="queue-strategy" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STRATEGIES.map((strategy) => (
                                        <SelectItem key={strategy} value={strategy} className="text-xs capitalize">
                                            {QUEUE_STRATEGY_LABELS[strategy]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-ring" className="text-xs font-semibold">
                                Ring Timeout (seconds)
                            </Label>
                            <Input
                                id="queue-ring"
                                type="number"
                                min={5}
                                value={draft.ringTimeout}
                                onChange={(e) => updateDraft({ ringTimeout: Number(e.target.value) || 0 })}
                            />
                            <p className="text-[11px] text-flex-text-muted">
                                How long an agent is rung before the queue attempts the next action.
                            </p>
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title="Status">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-status" className="text-xs font-semibold">
                                Status
                            </Label>
                            <Select value={draft.status} onValueChange={(value) => updateDraft({ status: (value as 'active' | 'inactive') ?? 'active' })}>
                                <SelectTrigger id="queue-status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active" className="text-xs capitalize">Active</SelectItem>
                                    <SelectItem value="inactive" className="text-xs capitalize">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </RoutingFormSection>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Save Queue' : 'Create Queue'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

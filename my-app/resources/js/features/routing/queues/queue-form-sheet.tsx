import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { routingRepository } from '@/domain/routing-repository';
import type { QueueDraft, QueueRecord, QueueStrategy } from '@/domain/routing-types';
import { RoutingFormSection } from '@/features/routing/shared/routing-form-section';

const STRATEGIES: QueueStrategy[] = ['ring-all', 'least-recent', 'fewest-calls', 'random'];

const QUEUE_STRATEGY_KEYS = {
    'ring-all': 'queues.strategy.ringAll',
    'least-recent': 'queues.strategy.leastRecent',
    'fewest-calls': 'queues.strategy.fewestCalls',
    random: 'queues.strategy.random',
} as const;

type QueueValidationKey = 'queues.form.validation.nameRequired' | 'queues.form.validation.extensionRequired';

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
    const { t } = useTranslation('administration');
    const [draft, setDraft] = useState<QueueDraft>(() => seedDraft(editing));
    const [nameError, setNameError] = useState<QueueValidationKey>();
    const [extensionError, setExtensionError] = useState<QueueValidationKey>();
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
            setNameError('queues.form.validation.nameRequired');

            return;
        }

        if (!draft.extension.trim()) {
            setExtensionError('queues.form.validation.extensionRequired');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    routingRepository.updateQueue(editing.id, draft);
                    toast.success(t('queues.form.toast.updated'));
                } else {
                    routingRepository.createQueue(draft);
                    toast.success(t('queues.form.toast.created'));
                }
            } catch {
                toast.error(t(editing ? 'queues.form.toast.saveFailed' : 'queues.form.toast.createFailed'));
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
                    <SheetTitle>{editing ? t('queues.form.editTitle') : t('queues.form.addTitle')}</SheetTitle>
                    <SheetDescription>{t('queues.form.description')}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
                    <RoutingFormSection title={t('queues.form.general')}>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-name" className="text-xs font-semibold">
                                {t('queues.form.queueNameLabel')}
                            </Label>
                            <Input
                                id="queue-name"
                                value={draft.name}
                                onChange={(e) => updateDraft({ name: e.target.value })}
                                placeholder={t('queues.form.queueNamePlaceholder')}
                                aria-invalid={!!nameError}
                            />
                            {nameError && <p className="text-xs text-destructive">{t(nameError)}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-extension" className="text-xs font-semibold">
                                {t('queues.form.extensionLabel')}
                            </Label>
                            <Input
                                id="queue-extension"
                                value={draft.extension}
                                onChange={(e) => updateDraft({ extension: e.target.value })}
                                placeholder={t('queues.form.extensionPlaceholder')}
                                aria-invalid={!!extensionError}
                            />
                            {extensionError && <p className="text-xs text-destructive">{t(extensionError)}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-description" className="text-xs font-semibold">
                                {t('queues.form.descriptionLabel')}
                            </Label>
                            <Input
                                id="queue-description"
                                value={draft.description}
                                onChange={(e) => updateDraft({ description: e.target.value })}
                                placeholder={t('queues.form.descriptionPlaceholder')}
                            />
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title={t('queues.form.callDistribution')}>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-strategy" className="text-xs font-semibold">
                                {t('queues.form.strategyLabel')}
                            </Label>
                            <Select value={draft.strategy} onValueChange={(value) => updateDraft({ strategy: (value as QueueStrategy) ?? 'ring-all' })}>
                                <SelectTrigger id="queue-strategy" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STRATEGIES.map((strategy) => (
                                        <SelectItem key={strategy} value={strategy} className="text-xs capitalize">
                                            {t(QUEUE_STRATEGY_KEYS[strategy])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-ring" className="text-xs font-semibold">
                                {t('queues.form.ringTimeoutLabel')}
                            </Label>
                            <Input
                                id="queue-ring"
                                type="number"
                                min={5}
                                value={draft.ringTimeout}
                                onChange={(e) => updateDraft({ ringTimeout: Number(e.target.value) || 0 })}
                            />
                            <p className="text-[11px] text-flex-text-muted">{t('queues.form.ringTimeoutHelp')}</p>
                        </div>
                    </RoutingFormSection>

                    <RoutingFormSection title={t('queues.form.statusLabel')}>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="queue-status" className="text-xs font-semibold">
                                {t('queues.form.statusLabel')}
                            </Label>
                            <Select value={draft.status} onValueChange={(value) => updateDraft({ status: (value as 'active' | 'inactive') ?? 'active' })}>
                                <SelectTrigger id="queue-status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active" className="text-xs capitalize">
                                        {t('queues.form.statusActive')}
                                    </SelectItem>
                                    <SelectItem value="inactive" className="text-xs capitalize">
                                        {t('queues.form.statusInactive')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </RoutingFormSection>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        {t('queues.form.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? t('queues.form.saving') : editing ? t('queues.form.saveQueue') : t('queues.form.createQueue')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

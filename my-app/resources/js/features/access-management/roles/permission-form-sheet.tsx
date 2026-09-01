import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { accessRepository } from '@/domain/access-repository';
import { PERMISSION_TYPES, PERMISSION_TYPE_KEYS } from '@/features/access-management/shared/permission-catalog';
import type {PermissionDraft} from '@/features/access-management/shared/permission-catalog';

const EMPTY_DRAFT: PermissionDraft = { name: '', type: 'view' };

type PermissionValidationKey =
    | 'roles.permissions.form.validation.nameRequired'
    | 'roles.permissions.form.validation.duplicate';

export interface PermissionFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: () => void;
}

export function PermissionFormSheet({ open, onOpenChange, onSaved }: PermissionFormSheetProps) {
    const { t } = useTranslation('administration');
    const [draft, setDraft] = useState<PermissionDraft>({ ...EMPTY_DRAFT });
    const [nameError, setNameError] = useState<PermissionValidationKey>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<PermissionDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft({ ...EMPTY_DRAFT });
            setNameError(undefined);
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        if (!draft.name.trim()) {
            setNameError('roles.permissions.form.validation.nameRequired');

            return;
        }

        const duplicate = accessRepository
            .queryPermissions()
            .some((permission) => permission.kind === 'custom' && permission.name.toLowerCase() === draft.name.trim().toLowerCase());

        if (duplicate) {
            setNameError('roles.permissions.form.validation.duplicate');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                accessRepository.createPermission({ name: draft.name.trim(), type: draft.type });
                toast.success(t('roles.permissions.form.toast.created'));
            } catch {
                toast.error(t('roles.permissions.form.toast.createFailed'));
            }

            setSaving(false);
            handleOpenChange(false);
            onSaved?.();
        }, 300);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{t('roles.permissions.form.addTitle')}</SheetTitle>
                    <SheetDescription>{t('roles.permissions.form.addDescription')}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="permission-name" className="text-xs font-semibold">
                            {t('roles.permissions.form.nameLabel')}
                        </Label>
                        <Input
                            id="permission-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder={t('roles.permissions.form.namePlaceholder')}
                            aria-invalid={!!nameError}
                        />
                        {nameError && <p className="text-xs text-destructive">{t(nameError)}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="permission-type" className="text-xs font-semibold">
                            {t('roles.permissions.form.typeLabel')}
                        </Label>
                        <Select value={draft.type} onValueChange={(value) => updateDraft({ type: value ?? 'view' })}>
                            <SelectTrigger id="permission-type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PERMISSION_TYPES.map((type) => (
                                    <SelectItem key={type} value={type} className="text-xs capitalize">
                                        {t(PERMISSION_TYPE_KEYS[type])}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        {t('roles.permissions.form.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? t('roles.permissions.form.saving') : t('roles.permissions.form.save')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
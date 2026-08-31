import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Role } from '@/auth/capabilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { accessRepository } from '@/domain/access-repository';
import { ROLE_LABEL_KEYS } from '@/features/access-management/shared/role-options';
import type { UserAccount, UserDraft } from '@/features/access-management/shared/types';

const ORGANIZATION_OPTIONS = ['FLEX HQ', 'Nairobi Central', 'Customer Support', 'Sales & Inquiries', 'Technical Escalations'];

const EMPTY_DRAFT: UserDraft = {
    name: '',
    email: '',
    username: '',
    role: 'agent',
    organization: '',
    credentials: 'email',
};

function seedDraft(editing?: UserAccount): UserDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    return {
        name: editing.name,
        email: editing.email,
        username: editing.username,
        role: editing.role,
        organization: editing.organization,
        credentials: 'email',
    };
}

type UserValidationKey =
    | 'users.form.validation.nameRequired'
    | 'users.form.validation.emailRequired'
    | 'users.form.validation.emailInvalid'
    | 'users.form.validation.usernameRequired'
    | 'users.form.validation.organizationRequired';

type UserFormErrors = Partial<Record<'name' | 'email' | 'username' | 'organization', UserValidationKey>>;

function validateDraft(draft: UserDraft): UserFormErrors {
    const errors: UserFormErrors = {};

    if (!draft.name.trim()) {
        errors.name = 'users.form.validation.nameRequired';
    }

    if (!draft.email.trim()) {
        errors.email = 'users.form.validation.emailRequired';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
        errors.email = 'users.form.validation.emailInvalid';
    }

    if (!draft.username.trim()) {
        errors.username = 'users.form.validation.usernameRequired';
    }

    if (!draft.organization) {
        errors.organization = 'users.form.validation.organizationRequired';
    }

    return errors;
}

export interface UserFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: UserAccount;
    onSaved?: () => void;
}

export function UserFormSheet({ open, onOpenChange, editing, onSaved }: UserFormSheetProps) {
    const { t } = useTranslation('administration');
    const [draft, setDraft] = useState<UserDraft>(() => seedDraft(editing));
    const [errors, setErrors] = useState<UserFormErrors>({});
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<UserDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setErrors({});
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setErrors({});
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        const validation = validateDraft(draft);
        setErrors(validation);

        if (Object.keys(validation).length > 0) {
            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    accessRepository.updateUser(editing.id, {
                        name: draft.name.trim(),
                        email: draft.email.trim(),
                        username: draft.username.trim(),
                        role: draft.role,
                        organization: draft.organization,
                    });
                    toast.success(t('users.form.toast.updated'));
                } else {
                    accessRepository.createUser({
                        name: draft.name.trim(),
                        email: draft.email.trim(),
                        username: draft.username.trim(),
                        role: draft.role,
                        organization: draft.organization,
                        credentials: 'email',
                    });
                    toast.success(t('users.form.toast.created'));
                }
            } catch {
                toast.error(t('users.form.toast.saveFailed'));
            }

            setSaving(false);
            handleOpenChange(false);
            onSaved?.();
        }, 300);
    };

    const roleChanged = !!editing && editing.role !== draft.role;

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{editing ? t('users.form.editTitle') : t('users.form.addTitle')}</SheetTitle>
                    <SheetDescription>
                        {editing ? t('users.form.editDescription') : t('users.form.addDescription')}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-name" className="text-xs font-semibold">
                            {t('users.form.nameLabel')}
                        </Label>
                        <Input
                            id="user-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder={t('users.form.namePlaceholder')}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-xs text-destructive">{t(errors.name)}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-email" className="text-xs font-semibold">
                            {t('users.form.emailLabel')}
                        </Label>
                        <Input
                            id="user-email"
                            type="email"
                            value={draft.email}
                            onChange={(e) => updateDraft({ email: e.target.value })}
                            placeholder={t('users.form.emailPlaceholder')}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className="text-xs text-destructive">{t(errors.email)}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-username" className="text-xs font-semibold">
                            {t('users.form.usernameLabel')}
                        </Label>
                        <Input
                            id="user-username"
                            value={draft.username}
                            onChange={(e) => updateDraft({ username: e.target.value })}
                            placeholder={t('users.form.usernamePlaceholder')}
                            aria-invalid={!!errors.username}
                        />
                        {errors.username && <p className="text-xs text-destructive">{t(errors.username)}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-role" className="text-xs font-semibold">
                            {t('users.form.roleLabel')}
                        </Label>
                        <Select value={draft.role} onValueChange={(value) => updateDraft({ role: (value as Role) ?? 'agent' })}>
                            <SelectTrigger id="user-role" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(
                                    [
                                        { value: 'super-admin', labelKey: ROLE_LABEL_KEYS['super-admin'] },
                                        { value: 'admin', labelKey: ROLE_LABEL_KEYS.admin },
                                        { value: 'supervisor', labelKey: ROLE_LABEL_KEYS.supervisor },
                                        { value: 'agent', labelKey: ROLE_LABEL_KEYS.agent },
                                    ] as const
                                ).map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {t(option.labelKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {roleChanged && (
                        <p className="rounded-md border border-flex-status-warning-bg bg-flex-status-warning-bg px-3 py-2 text-xs text-flex-status-warning">
                            {t('users.form.roleChangeWarning', {
                                from: t(ROLE_LABEL_KEYS[editing!.role]),
                                to: t(ROLE_LABEL_KEYS[draft.role]),
                                name: draft.name.trim() || t('users.form.thisUser'),
                            })}
                        </p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-organization" className="text-xs font-semibold">
                            {t('users.form.organizationLabel')}
                        </Label>
                        <Select
                            value={draft.organization || undefined}
                            onValueChange={(value) => updateDraft({ organization: value ?? '' })}
                        >
                            <SelectTrigger id="user-organization" className="w-full">
                                <SelectValue placeholder={t('users.form.organizationPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {ORGANIZATION_OPTIONS.map((organization) => (
                                    <SelectItem key={organization} value={organization} className="text-xs">
                                        {organization}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.organization && <p className="text-xs text-destructive">{t(errors.organization)}</p>}
                    </div>

                    {!editing && (
                        <div className="rounded-md border border-border bg-flex-surface-muted/50 px-3 py-2.5">
                            <p className="text-xs text-flex-text-secondary font-semibold">{t('users.form.credentialsTitle')}</p>
                            <p className="mt-0.5 text-xs text-flex-text-muted">{t('users.form.credentialsDescription')}</p>
                        </div>
                    )}
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        {t('users.form.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? t('users.form.saving') : editing ? t('users.form.saveChanges') : t('users.form.createUser')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

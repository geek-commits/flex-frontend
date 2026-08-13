import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { Role } from '@/auth/capabilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { accessRepository } from '@/domain/access-repository';
import { ROLE_OPTIONS } from '@/features/access-management/shared/role-options';
import type { UserDraft } from '@/features/access-management/shared/types';

const ORGANIZATION_OPTIONS = ['FLEX HQ', 'Nairobi Central', 'Customer Support', 'Sales & Inquiries', 'Technical Escalations'];

const EMPTY_DRAFT: UserDraft = {
    name: '',
    email: '',
    username: '',
    role: 'agent',
    organization: '',
    credentials: 'email',
};

function seedDraft(): UserDraft {
    return { ...EMPTY_DRAFT };
}

type UserFormErrors = Partial<Record<'name' | 'email' | 'username' | 'organization', string>>;

function validateDraft(draft: UserDraft): UserFormErrors {
    const errors: UserFormErrors = {};

    if (!draft.name.trim()) {
        errors.name = 'Name is required.';
    }

    if (!draft.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (!draft.username.trim()) {
        errors.username = 'Username is required.';
    }

    if (!draft.organization) {
        errors.organization = 'Organization is required.';
    }

    return errors;
}

export interface UserFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: () => void;
}

export function UserFormSheet({ open, onOpenChange, onSaved }: UserFormSheetProps) {
    const [draft, setDraft] = useState<UserDraft>(seedDraft);
    const [errors, setErrors] = useState<UserFormErrors>({});
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<UserDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setErrors({});
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft());
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
                accessRepository.createUser({
                    name: draft.name.trim(),
                    email: draft.email.trim(),
                    username: draft.username.trim(),
                    role: draft.role,
                    organization: draft.organization,
                    credentials: 'email',
                });
                toast.success('User created. Temporary login instructions were sent by email.');
            } catch {
                toast.error('User could not be created');
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
                    <SheetTitle>Add User</SheetTitle>
                    <SheetDescription>Create a user account and establish initial access.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-name" className="text-xs font-semibold">
                            Name
                        </Label>
                        <Input
                            id="user-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder="e.g. Anisa Kiptoo"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-email" className="text-xs font-semibold">
                            Email
                        </Label>
                        <Input
                            id="user-email"
                            type="email"
                            value={draft.email}
                            onChange={(e) => updateDraft({ email: e.target.value })}
                            placeholder="name@flexco.com"
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-username" className="text-xs font-semibold">
                            Username
                        </Label>
                        <Input
                            id="user-username"
                            value={draft.username}
                            onChange={(e) => updateDraft({ username: e.target.value })}
                            placeholder="e.g. a.kiptoo"
                            aria-invalid={!!errors.username}
                        />
                        {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-role" className="text-xs font-semibold">
                            Role
                        </Label>
                        <Select value={draft.role} onValueChange={(value) => updateDraft({ role: (value as Role) ?? 'agent' })}>
                            <SelectTrigger id="user-role" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-organization" className="text-xs font-semibold">
                            Organization
                        </Label>
                        <Select
                            value={draft.organization || undefined}
                            onValueChange={(value) => updateDraft({ organization: value ?? '' })}
                        >
                            <SelectTrigger id="user-organization" className="w-full">
                                <SelectValue placeholder="Select an organization" />
                            </SelectTrigger>
                            <SelectContent>
                                {ORGANIZATION_OPTIONS.map((organization) => (
                                    <SelectItem key={organization} value={organization} className="text-xs">
                                        {organization}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.organization && <p className="text-xs text-destructive">{errors.organization}</p>}
                    </div>

                    <div className="rounded-md border border-border bg-flex-surface-muted/50 px-3 py-2.5">
                        <p className="text-xs text-flex-text-strong font-semibold">Temporary credentials</p>
                        <p className="mt-0.5 text-xs text-flex-text-muted">
                            Temporary login instructions will be sent to the user&apos;s email. They must change the
                            temporary password on first login.
                        </p>
                    </div>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Creating…' : 'Create User'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { tenantRepository } from '@/domain/tenant-repository';
import type { TenantDraft, TenantRecord, TenantStatus, TenantUpdateDraft } from '@/features/tenants/shared/types';
import { TENANT_STATUS_LABELS, TENANT_STATUS_OPTIONS } from '@/features/tenants/tenant-status';

const EMPTY_DRAFT: TenantDraft = {
    name: '',
    email: '',
    domain: '',
    contact: '',
    phone: '',
};

function seedDraft(editing?: TenantRecord): { draft: TenantDraft; status: TenantStatus } {
    if (!editing) {
        return { draft: { ...EMPTY_DRAFT }, status: 'active' };
    }

    return {
        draft: {
            name: editing.name,
            email: editing.email,
            domain: editing.domain,
            contact: editing.contact,
            phone: editing.phone,
        },
        status: editing.status,
    };
}

type TenantFormErrors = Partial<Record<'name' | 'email' | 'domain' | 'contact', string>>;

function validateDraft(draft: TenantDraft): TenantFormErrors {
    const errors: TenantFormErrors = {};

    if (!draft.name.trim()) {
        errors.name = 'Tenant name is required.';
    }

    if (!draft.email.trim()) {
        errors.email = 'Contact email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (!draft.domain.trim()) {
        errors.domain = 'Domain is required.';
    }

    if (!draft.contact.trim()) {
        errors.contact = 'Contact name is required.';
    }

    return errors;
}

export interface TenantFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: TenantRecord;
    onSaved?: () => void;
}

export function TenantFormSheet({ open, onOpenChange, editing, onSaved }: TenantFormSheetProps) {
    const [seed] = useState(() => seedDraft(editing));
    const [draft, setDraft] = useState<TenantDraft>(seed.draft);
    const [status, setStatus] = useState<TenantStatus>(seed.status);
    const [errors, setErrors] = useState<TenantFormErrors>({});
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<TenantDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setErrors({});
    }, []);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            const reseed = seedDraft(editing);
            setDraft(reseed.draft);
            setStatus(reseed.status);
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
                const payload: TenantUpdateDraft = {
                    name: draft.name.trim(),
                    email: draft.email.trim(),
                    domain: draft.domain.trim(),
                    contact: draft.contact.trim(),
                    phone: draft.phone.trim(),
                    status,
                };

                if (editing) {
                    tenantRepository.updateTenant(editing.id, payload);
                    toast.success('Tenant updated');
                } else {
                    tenantRepository.createTenant({
                        name: draft.name.trim(),
                        email: draft.email.trim(),
                        domain: draft.domain.trim(),
                        contact: draft.contact.trim(),
                        phone: draft.phone.trim(),
                    });
                    toast.success('Tenant created');
                }
            } catch {
                toast.error(editing ? 'Tenant could not be updated' : 'Tenant could not be created');
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
                    <SheetTitle>{editing ? 'Edit Tenant' : 'Add Tenant'}</SheetTitle>
                    <SheetDescription>
                        {editing
                            ? 'Update the tenant account and contact details.'
                            : 'Register a new tenant organization.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tenant-name" className="text-xs font-semibold">
                            Tenant name
                        </Label>
                        <Input
                            id="tenant-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder="e.g. Acme Contact Center"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tenant-domain" className="text-xs font-semibold">
                            Domain
                        </Label>
                        <Input
                            id="tenant-domain"
                            value={draft.domain}
                            onChange={(e) => updateDraft({ domain: e.target.value })}
                            placeholder="e.g. acmecc.com"
                            aria-invalid={!!errors.domain}
                        />
                        {errors.domain && <p className="text-xs text-destructive">{errors.domain}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tenant-contact" className="text-xs font-semibold">
                            Contact name
                        </Label>
                        <Input
                            id="tenant-contact"
                            value={draft.contact}
                            onChange={(e) => updateDraft({ contact: e.target.value })}
                            placeholder="e.g. Fatuma Ally"
                            aria-invalid={!!errors.contact}
                        />
                        {errors.contact && <p className="text-xs text-destructive">{errors.contact}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tenant-email" className="text-xs font-semibold">
                            Contact email
                        </Label>
                        <Input
                            id="tenant-email"
                            type="email"
                            value={draft.email}
                            onChange={(e) => updateDraft({ email: e.target.value })}
                            placeholder="admin@acmecc.com"
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tenant-phone" className="text-xs font-semibold">
                            Phone
                        </Label>
                        <Input
                            id="tenant-phone"
                            value={draft.phone}
                            onChange={(e) => updateDraft({ phone: e.target.value })}
                            placeholder="+254 700 000 000"
                        />
                    </div>

                    {editing && (
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tenant-status" className="text-xs font-semibold">
                                Status
                            </Label>
                            <Select value={status} onValueChange={(value) => setStatus(value as TenantStatus)}>
                                <SelectTrigger id="tenant-status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TENANT_STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option} className="text-xs capitalize">
                                            {TENANT_STATUS_LABELS[option]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Tenant'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

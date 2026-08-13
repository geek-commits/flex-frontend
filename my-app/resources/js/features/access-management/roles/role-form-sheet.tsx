import { RiSearchLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Capability } from '@/auth/capabilities';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { accessRepository } from '@/domain/access-repository';
import {
    PERMISSIONS,
    permissionGroups
    
    
    
} from '@/features/access-management/shared/permission-catalog';
import type {PermissionDefinition, RoleDraft, RoleRecord} from '@/features/access-management/shared/permission-catalog';

const EMPTY_DRAFT: RoleDraft = { name: '', permissions: [] };

function seedDraft(editing?: RoleRecord): RoleDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    return {
        name: editing.name,
        permissions: [...editing.permissions],
    };
}

export interface RoleFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: RoleRecord;
    onSaved?: () => void;
}

export function RoleFormSheet({ open, onOpenChange, editing, onSaved }: RoleFormSheetProps) {
    const [draft, setDraft] = useState<RoleDraft>(() => seedDraft(editing));
    const [search, setSearch] = useState('');
    const [nameError, setNameError] = useState<string>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<RoleDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const togglePermission = useCallback(
        (id: Capability) => {
            setDraft((d) => {
                const has = d.permissions.includes(id);

                return { ...d, permissions: has ? d.permissions.filter((p) => p !== id) : [...d.permissions, id] };
            });
        },
        []
    );

    const filteredGroups = useMemo(() => {
        const needle = search.trim().toLowerCase();
        const source: PermissionDefinition[] = needle
            ? PERMISSIONS.filter(
                  (permission) =>
                      permission.name.toLowerCase().includes(needle) || permission.module.toLowerCase().includes(needle)
              )
            : PERMISSIONS;

        return permissionGroups(source);
    }, [search]);

    const selectedCount = draft.permissions.length;

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setSearch('');
            setNameError(undefined);
        }

        onOpenChange(next);
    };

    const handleSave = () => {
        if (!draft.name.trim()) {
            setNameError('Role name is required.');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    accessRepository.updateRole(editing.id, {
                        name: draft.name.trim(),
                        permissions: draft.permissions,
                    });
                    toast.success('Role saved');
                } else {
                    accessRepository.createRole({
                        name: draft.name.trim(),
                        permissions: draft.permissions,
                    });
                    toast.success('Role created');
                }
            } catch {
                toast.error(editing ? 'Role could not be saved' : 'Role could not be created');
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
                    <SheetTitle>{editing ? 'Edit Role' : 'Add Role'}</SheetTitle>
                    <SheetDescription>
                        {editing ? 'Update the role name and assigned permissions.' : 'Create a role and assign permissions.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-name" className="text-xs font-semibold">
                            Role name
                        </Label>
                        <Input
                            id="role-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder="e.g. Billing Supervisor"
                            aria-invalid={!!nameError}
                        />
                        {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <Label className="text-xs font-semibold">Permissions</Label>
                            <span className="text-xs text-flex-text-muted">{selectedCount} selected</span>
                        </div>

                        <div className="relative">
                            <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search permissions…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            {filteredGroups.map((group) => (
                                <div key={group.module} className="flex flex-col gap-1.5">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted">
                                        {group.module}
                                    </p>
                                    {group.permissions.map((permission) => {
                                        const checked = draft.permissions.includes(permission.id);

                                        return (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-flex-surface-muted/50 transition-colors cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() => togglePermission(permission.id)}
                                                    aria-label={permission.name}
                                                />
                                                <span className="text-xs text-flex-text-primary">{permission.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ))}

                            {filteredGroups.length === 0 && (
                                <p className="px-2 py-4 text-center text-xs text-flex-text-muted">
                                    No permissions match &quot;{search}&quot;.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Save Role' : 'Create Role'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
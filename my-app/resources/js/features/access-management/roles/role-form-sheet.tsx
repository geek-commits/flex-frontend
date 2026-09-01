import { RiSearchLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { accessRepository } from '@/domain/access-repository';
import type { PermissionDefinition, RoleDraft, RoleRecord } from '@/features/access-management/shared/permission-catalog';
import { PERMISSIONS, permissionGroups } from '@/features/access-management/shared/permission-catalog';

const EMPTY_DRAFT: RoleDraft = { name: '', permissions: [] };

function seedDraft(editing?: RoleRecord): RoleDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    if (editing.kind === 'builtin') {
        return { name: '', permissions: [...editing.permissions] };
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

type RoleValidationKey = 'roles.form.validation.nameRequired';

export function RoleFormSheet({ open, onOpenChange, editing, onSaved }: RoleFormSheetProps) {
    const { t } = useTranslation('administration');
    const [draft, setDraft] = useState<RoleDraft>(() => seedDraft(editing));
    const [search, setSearch] = useState('');
    const [nameError, setNameError] = useState<RoleValidationKey>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<RoleDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const togglePermission = useCallback(
        (id: string) => {
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
            ? PERMISSIONS.filter((permission) => {
                  const name = permission.kind === 'builtin' ? t(permission.labelKey) : permission.name;
                  const mod = t(permission.moduleKey);
                  const typeLabel = permission.kind === 'builtin' ? t(permission.typeKey) : permission.type;

                  return (
                      name.toLowerCase().includes(needle) ||
                      mod.toLowerCase().includes(needle) ||
                      typeLabel.toLowerCase().includes(needle) ||
                      permission.id.toLowerCase().includes(needle)
                  );
              })
            : PERMISSIONS;

        return permissionGroups(source);
    }, [search, t]);

    const selectedCount = draft.permissions.length;

    const unknownPermissions = useMemo(() => {
        const knownIds = new Set(PERMISSIONS.map((permission) => permission.id));

        return draft.permissions.filter((id) => !knownIds.has(id));
    }, [draft.permissions]);

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
            setNameError('roles.form.validation.nameRequired');

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
                    toast.success(t('roles.form.toast.saved'));
                } else {
                    accessRepository.createRole({
                        name: draft.name.trim(),
                        permissions: draft.permissions,
                    });
                    toast.success(t('roles.form.toast.created'));
                }
            } catch {
                toast.error(editing ? t('roles.form.toast.saveFailed') : t('roles.form.toast.createFailed'));
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
                    <SheetTitle>{editing ? t('roles.form.editTitle') : t('roles.form.addTitle')}</SheetTitle>
                    <SheetDescription>
                        {editing ? t('roles.form.editDescription') : t('roles.form.createDescription')}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-name" className="text-xs font-semibold">
                            {t('roles.form.roleNameLabel')}
                        </Label>
                        <Input
                            id="role-name"
                            value={draft.name}
                            onChange={(e) => {
                                if (editing?.kind !== 'builtin') {
                                    updateDraft({ name: e.target.value });
                                }
                            }}
                            placeholder={t('roles.form.roleNamePlaceholder')}
                            aria-invalid={!!nameError}
                            readOnly={editing?.kind === 'builtin'}
                        />
                        {nameError && <p className="text-xs text-destructive">{t(nameError)}</p>}
                        {editing?.kind === 'builtin' && (
                            <p className="text-xs text-flex-text-muted">{t('roles.form.builtinRoleHint')}</p>
                        )}
                    </div>

                    {editing && editing.userCount > 0 && (
                        <p className="rounded-md border border-flex-status-warning-bg bg-flex-status-warning-bg px-3 py-2 text-xs text-flex-status-warning">
                            {t('roles.form.assignedWarning', { count: editing.userCount })}
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <Label className="text-xs font-semibold">{t('roles.form.permissionsLabel')}</Label>
                            <span className="text-xs text-flex-text-muted">{t('roles.form.selectedCount', { count: selectedCount })}</span>
                        </div>

                        <div className="relative">
                            <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder={t('roles.form.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>

                        {unknownPermissions.length > 0 && (
                            <p className="rounded-md border border-flex-status-warning-bg bg-flex-status-warning-bg px-3 py-2 text-xs text-flex-status-warning">
                                {t('roles.form.unknownWarning', { count: unknownPermissions.length })}
                            </p>
                        )}

                        <div className="flex flex-col gap-3">
                            {filteredGroups.map((group) => (
                                <div key={group.moduleKey} className="flex flex-col gap-1.5">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted">
                                        {t(group.moduleKey)}
                                    </p>
                                    {group.permissions.map((permission) => {
                                        const checked = draft.permissions.includes(permission.id);
                                        const label: string = permission.kind === 'builtin' ? t(permission.labelKey) : permission.name;

                                        return (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-flex-surface-muted/50 transition-colors cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() => togglePermission(permission.id)}
                                                    aria-label={label}
                                                />
                                                <span className="text-xs text-flex-text-primary">{label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ))}

                            {filteredGroups.length === 0 && (
                                <p className="px-2 py-4 text-center text-xs text-flex-text-muted">
                                    {t('roles.form.noMatch', { search })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        {t('roles.form.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? t('roles.form.saving') : editing ? t('roles.form.saveRole') : t('roles.form.createRole')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { accessRepository } from '@/domain/access-repository';
import { PERMISSION_TYPES  } from '@/features/access-management/shared/permission-catalog';
import type {PermissionDraft} from '@/features/access-management/shared/permission-catalog';

const EMPTY_DRAFT: PermissionDraft = { name: '', type: 'view' };

export interface PermissionFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: () => void;
}

export function PermissionFormSheet({ open, onOpenChange, onSaved }: PermissionFormSheetProps) {
    const [draft, setDraft] = useState<PermissionDraft>({ ...EMPTY_DRAFT });
    const [nameError, setNameError] = useState<string>();
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
            setNameError('Permission name is required.');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                accessRepository.createPermission({ name: draft.name.trim(), type: draft.type });
                toast.success('Permission added');
            } catch {
                toast.error('Permission could not be added');
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
                    <SheetTitle>Add Permission</SheetTitle>
                    <SheetDescription>Add a new permission definition to this system.</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="permission-name" className="text-xs font-semibold">
                            Permission name
                        </Label>
                        <Input
                            id="permission-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder="e.g. View Billing Reports"
                            aria-invalid={!!nameError}
                        />
                        {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="permission-type" className="text-xs font-semibold">
                            Permission type
                        </Label>
                        <Select value={draft.type} onValueChange={(value) => updateDraft({ type: value ?? 'view' })}>
                            <SelectTrigger id="permission-type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PERMISSION_TYPES.map((type) => (
                                    <SelectItem key={type} value={type} className="text-xs">
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SheetFooter className="border-t border-border px-4 py-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
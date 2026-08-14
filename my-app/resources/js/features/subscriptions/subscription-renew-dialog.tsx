import { RiRefreshLine } from '@remixicon/react';
import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { SubscriptionRecord } from '@/domain/subscription-types';

export interface SubscriptionRenewDialogProps {
    record?: SubscriptionRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (record: SubscriptionRecord, months: number) => void;
}

export function SubscriptionRenewDialog({
    record,
    open,
    onOpenChange,
    onConfirm,
}: SubscriptionRenewDialogProps) {
    const [months, setMonths] = useState<number>(1);

    if (!record) {
        return null;
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="gap-2">
                    <div className="flex items-center gap-2 text-primary">
                        <RiRefreshLine className="size-5" />
                        <AlertDialogTitle>Renew Subscription</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-xs text-flex-text-muted leading-relaxed">
                        Extend active access and reset notification flags for{' '}
                        <span className="font-semibold text-flex-text-primary">"{record.accountName}"</span> ({record.plan} Plan, {record.seats} seats).
                    </AlertDialogDescription>

                    <div className="flex flex-col gap-1.5 my-2">
                        <Label htmlFor="renew-duration" className="text-xs font-semibold text-flex-text-primary">
                            Renewal Term Extension
                        </Label>
                        <Select
                            value={String(months)}
                            onValueChange={(val) => setMonths(Number(val))}
                        >
                            <SelectTrigger id="renew-duration" className="h-9 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1" className="text-xs">
                                    +1 Month ({record.billingCycle === 'monthly' ? `$${record.amount}` : `$${Math.round(record.amount / 12)}`})
                                </SelectItem>
                                <SelectItem value="3" className="text-xs">
                                    +3 Months (Quarterly)
                                </SelectItem>
                                <SelectItem value="12" className="text-xs">
                                    +12 Months (1 Year - Annual)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="text-xs h-9">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="text-xs h-9 gap-1.5"
                        onClick={() => onConfirm(record, months)}
                    >
                        <RiRefreshLine className="size-3.5" />
                        Confirm Renewal
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

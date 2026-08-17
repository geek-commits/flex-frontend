import { RiCloseLine, RiSearchLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    SubscriptionPlan,
    SubscriptionQuery,
    SubscriptionStatus,
} from '@/domain/subscription-types';

export interface SubscriptionToolbarProps {
    query: SubscriptionQuery;
    onQueryChange: (query: SubscriptionQuery) => void;
}

const STATUS_OPTIONS: { value: SubscriptionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expiring', label: 'Expiring Soon (≤5 days)' },
    { value: 'expired', label: 'Expired' },
    { value: 'trial', label: 'Trial' },
];

const PLAN_OPTIONS: { value: SubscriptionPlan | 'all'; label: string }[] = [
    { value: 'all', label: 'All Plans' },
    { value: 'Starter', label: 'Starter' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Custom', label: 'Custom' },
];

export function SubscriptionToolbar({ query, onQueryChange }: SubscriptionToolbarProps) {
    const hasFilters = Boolean(query.search || query.status || query.plan || query.expiringOnly);

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                    <Input
                        type="search"
                        placeholder="Search account, email, or plan..."
                        value={query.search ?? ''}
                        onChange={(e) => onQueryChange({ ...query, search: e.target.value || undefined })}
                        size="sm"
                        className="pl-8.5"
                    />
                </div>

                {/* Status Filter */}
                <Select
                    value={query.status ?? 'all'}
                    onValueChange={(val) =>
                        onQueryChange({
                            ...query,
                            status: val === 'all' ? undefined : (val as SubscriptionStatus),
                        })
                    }
                >
                    <SelectTrigger size="sm" className="w-[160px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Plan Filter */}
                <Select
                    value={query.plan ?? 'all'}
                    onValueChange={(val) =>
                        onQueryChange({
                            ...query,
                            plan: val === 'all' ? undefined : (val as SubscriptionPlan),
                        })
                    }
                >
                    <SelectTrigger size="sm" className="w-[140px]">
                        <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                        {PLAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onQueryChange({})}
                        className="h-9 px-2.5 text-xs text-flex-text-muted hover:text-flex-text-primary gap-1"
                    >
                        <RiCloseLine className="size-3.5" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}

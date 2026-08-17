import { RiFilterOffLine, RiSearchLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RecoveryQuery, RecoveryStatus } from '@/features/customer-recovery/recovery-types';

const STATUS_FILTERS: (RecoveryStatus | 'all')[] = ['all', 'unhandled', 'callback-scheduled', 'resolved'];
const OWNERSHIP_FILTERS: RecoveryQuery['ownership'][] = ['all', 'unclaimed', 'me'];
const VOICEMAIL_FILTERS: RecoveryQuery['voicemail'][] = ['all', 'with', 'without'];

export interface RecoveryToolbarProps {
    query: RecoveryQuery;
    queues: string[];
    onQueryChange: (query: RecoveryQuery) => void;
}

export function RecoveryToolbar({ query, queues, onQueryChange }: RecoveryToolbarProps) {
    const hasFilters = Boolean(query.search) || (query.status ?? 'all') !== 'all' || (query.queue ?? 'all') !== 'all' || (query.ownership ?? 'all') !== 'all' || (query.voicemail ?? 'all') !== 'all';

    const clearFilters = () => onQueryChange({});

    return (
        <div className="flex flex-col gap-3">
            <div className="relative w-full lg:w-72">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                <Input
                    value={query.search ?? ''}
                    onChange={(e) => onQueryChange({ ...query, search: e.target.value })}
                    placeholder="Search phone number or queue..."
                    aria-label="Search missed calls"
                    size="sm"
                    className="pl-9"
                />
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-status" className="text-xs font-semibold text-flex-text-muted">
                        Status
                    </Label>
                    <Select value={query.status ?? 'all'} onValueChange={(value) => onQueryChange({ ...query, status: value as RecoveryStatus | 'all' })}>
                        <SelectTrigger id="rec-status" size="sm" className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FILTERS.map((status) => (
                                <SelectItem key={status} value={status} className="text-xs capitalize">
                                    {status === 'all' ? 'All statuses' : status.replace('-', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-queue" className="text-xs font-semibold text-flex-text-muted">
                        Queue
                    </Label>
                    <Select value={query.queue ?? 'all'} onValueChange={(value) => onQueryChange({ ...query, queue: value ?? 'all' })}>
                        <SelectTrigger id="rec-queue" size="sm" className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-xs">All queues</SelectItem>
                            {queues.map((queue) => (
                                <SelectItem key={queue} value={queue} className="text-xs">
                                    {queue}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-owner" className="text-xs font-semibold text-flex-text-muted">
                        Ownership
                    </Label>
                    <Select value={query.ownership ?? 'all'} onValueChange={(value) => onQueryChange({ ...query, ownership: value as RecoveryQuery['ownership'] })}>
                        <SelectTrigger id="rec-owner" size="sm" className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {OWNERSHIP_FILTERS.map((ownership) => (
                                <SelectItem key={ownership ?? 'all'} value={ownership ?? 'all'} className="text-xs capitalize">
                                    {ownership === 'all' ? 'All' : ownership === 'me' ? 'Claimed by me' : 'Unclaimed'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-vm" className="text-xs font-semibold text-flex-text-muted">
                        Voicemail
                    </Label>
                    <Select value={query.voicemail ?? 'all'} onValueChange={(value) => onQueryChange({ ...query, voicemail: value as RecoveryQuery['voicemail'] })}>
                        <SelectTrigger id="rec-vm" size="sm" className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {VOICEMAIL_FILTERS.map((vm) => (
                                <SelectItem key={vm ?? 'all'} value={vm ?? 'all'} className="text-xs capitalize">
                                    {vm === 'all' ? 'All' : vm === 'with' ? 'With voicemail' : 'Without voicemail'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasFilters && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={clearFilters}>
                        <RiFilterOffLine className="size-3.5" />
                        Clear filters
                    </Button>
                )}
            </div>
        </div>
    );
}

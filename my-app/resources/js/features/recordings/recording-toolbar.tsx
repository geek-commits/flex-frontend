import { RiFilterOffLine, RiSearchLine, RiUploadCloudLine } from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import React from 'react';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RecordingCategory, RecordingQuery, RecordingRecord } from '@/domain/recording-types';

export interface RecordingToolbarProps {
    table: Table<DataGridFeatures, RecordingRecord>;
    query: RecordingQuery;
    onQueryChange: (query: RecordingQuery) => void;
    onUploadClick: () => void;
}

const CATEGORIES: { value: RecordingCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'ivr-prompt', label: 'IVR Prompts' },
    { value: 'queue-announcement', label: 'Queue Announcements' },
    { value: 'voicemail-greeting', label: 'Voicemail Greetings' },
    { value: 'hold-music', label: 'Hold Music' },
    { value: 'system-announcement', label: 'System Notices' },
];

const FORMATS: { value: 'all' | 'WAV' | 'MP3'; label: string }[] = [
    { value: 'all', label: 'All Formats' },
    { value: 'WAV', label: 'WAV' },
    { value: 'MP3', label: 'MP3' },
];

export function RecordingToolbar({
    table,
    query,
    onQueryChange,
    onUploadClick,
}: RecordingToolbarProps) {
    const hasFilters =
        Boolean(query.search) ||
        (query.category ?? 'all') !== 'all' ||
        (query.format ?? 'all') !== 'all';

    const clearFilters = () => onQueryChange({});

    return (
        <div className="flex flex-col gap-3 px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group — scope & filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-cat" className="text-xs font-semibold text-flex-text-muted shrink-0">
                        Category
                    </Label>
                    <Select
                        value={query.category ?? 'all'}
                        onValueChange={(val) => onQueryChange({ ...query, category: val as RecordingCategory | 'all' })}
                    >
                        <SelectTrigger id="rec-cat" size="sm" className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="text-xs">
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-format" className="text-xs font-semibold text-flex-text-muted shrink-0">
                        Format
                    </Label>
                    <Select
                        value={query.format ?? 'all'}
                        onValueChange={(val) => onQueryChange({ ...query, format: val as 'all' | 'WAV' | 'MP3' })}
                    >
                        <SelectTrigger id="rec-format" size="sm" className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FORMATS.map((fmt) => (
                                <SelectItem key={fmt.value} value={fmt.value} className="text-xs">
                                    {fmt.label}
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

            {/* Right group — search, columns, actions */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-full lg:w-64">
                    <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-flex-text-muted" />
                    <Input
                        value={query.search ?? ''}
                        onChange={(e) => onQueryChange({ ...query, search: e.target.value })}
                        placeholder="Search audio titles, files..."
                        aria-label="Search recordings"
                        size="sm"
                        className="pl-8"
                    />
                </div>

                <DataGridColumnVisibility
                    table={table}
                    trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
                />

                <Button size="sm" className="gap-1.5 text-xs" onClick={onUploadClick}>
                    <RiUploadCloudLine className="size-3.5" />
                    Upload Recording
                </Button>
            </div>
        </div>
    );
}
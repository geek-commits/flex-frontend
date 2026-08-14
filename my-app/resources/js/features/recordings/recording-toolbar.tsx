import { RiFilterOffLine, RiSearchLine, RiUploadCloudLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RecordingCategory, RecordingQuery } from '@/domain/recording-types';

export interface RecordingToolbarProps {
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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap flex-1">
                <div className="relative w-full sm:w-64">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                    <Input
                        value={query.search ?? ''}
                        onChange={(e) => onQueryChange({ ...query, search: e.target.value })}
                        placeholder="Search audio titles, files..."
                        aria-label="Search recordings"
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="rec-cat" className="text-xs font-semibold text-flex-text-muted shrink-0">
                        Category
                    </Label>
                    <Select
                        value={query.category ?? 'all'}
                        onValueChange={(val) => onQueryChange({ ...query, category: val as RecordingCategory | 'all' })}
                    >
                        <SelectTrigger id="rec-cat" className="w-44 h-9 text-xs">
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
                        <SelectTrigger id="rec-format" className="w-32 h-9 text-xs">
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
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9" onClick={clearFilters}>
                        <RiFilterOffLine className="size-3.5" />
                        Clear filters
                    </Button>
                )}
            </div>

            <Button size="sm" className="gap-1.5 text-xs self-start lg:self-auto shrink-0" onClick={onUploadClick}>
                <RiUploadCloudLine className="size-3.5" />
                Upload Recording
            </Button>
        </div>
    );
}

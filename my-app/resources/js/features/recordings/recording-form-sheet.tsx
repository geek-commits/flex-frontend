import { RiMusic2Line, RiUploadCloudLine } from '@remixicon/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { RecordingCategory, RecordingDraft, RecordingRecord } from '@/domain/recording-types';

export interface RecordingFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit' | 'replace';
    editing?: RecordingRecord;
    onSave: (draft: RecordingDraft) => boolean;
    onReplaceAudio?: (id: string, fileData: { filename: string; format: 'WAV' | 'MP3'; duration?: string; durationSeconds?: number; fileSizeBytes?: number; url?: string }) => boolean;
}

const CATEGORIES: { value: RecordingCategory; label: string }[] = [
    { value: 'ivr-prompt', label: 'IVR Prompt' },
    { value: 'queue-announcement', label: 'Queue Announcement' },
    { value: 'voicemail-greeting', label: 'Voicemail Greeting' },
    { value: 'hold-music', label: 'Hold Music' },
    { value: 'system-announcement', label: 'System Notice' },
];

function RecordingFormContent({
    mode,
    editing,
    onOpenChange,
    onSave,
    onReplaceAudio,
}: {
    mode: 'create' | 'edit' | 'replace';
    editing?: RecordingRecord;
    onOpenChange: (open: boolean) => void;
    onSave: (draft: RecordingDraft) => boolean;
    onReplaceAudio?: (id: string, fileData: { filename: string; format: 'WAV' | 'MP3'; duration?: string; durationSeconds?: number; fileSizeBytes?: number; url?: string }) => boolean;
}) {
    const [name, setName] = useState(editing?.name ?? '');
    const [category, setCategory] = useState<RecordingCategory>(editing?.category ?? 'ivr-prompt');
    const [description, setDescription] = useState(editing?.description ?? '');
    const [filename, setFilename] = useState(editing?.filename ?? '');
    const [format, setFormat] = useState<'WAV' | 'MP3'>(editing?.format ?? 'WAV');
    const [duration] = useState(editing?.duration ?? '0:25');
    const [durationSeconds] = useState(editing?.durationSeconds ?? 25);
    const [fileSizeBytes, setFileSizeBytes] = useState(editing?.fileSizeBytes ?? 400000);
    const [nameError, setNameError] = useState<string>();
    const [fileError, setFileError] = useState<string>();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelected = (file: File) => {
        const ext = file.name.split('.').pop()?.toUpperCase();

        if (ext !== 'WAV' && ext !== 'MP3') {
            setFileError('Supported formats are WAV and MP3 only.');

            return;
        }

        setFilename(file.name);
        setFormat(ext === 'MP3' ? 'MP3' : 'WAV');
        setFileSizeBytes(file.size || 350000);
        setFileError(undefined);

        if (!name && mode === 'create') {
            const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

            setName(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            handleFileSelected(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];

        if (file) {
            handleFileSelected(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'replace') {
            if (!filename) {
                setFileError('Please choose a replacement audio file.');

                return;
            }

            if (editing && onReplaceAudio) {
                const success = onReplaceAudio(editing.id, {
                    filename,
                    format,
                    duration,
                    durationSeconds,
                    fileSizeBytes,
                });

                if (success) {
                    toast.success('Audio file replaced successfully');
                    onOpenChange(false);
                }
            }

            return;
        }

        if (!name.trim()) {
            setNameError('Recording title is required.');

            return;
        }

        if (mode === 'create' && !filename) {
            setFileError('Audio file is required.');

            return;
        }

        const draft: RecordingDraft = {
            name: name.trim(),
            category,
            description: description.trim(),
            filename: filename || (editing ? editing.filename : 'prompt.wav'),
            format,
            duration,
            durationSeconds,
            fileSizeBytes,
        };

        const success = onSave(draft);

        if (success) {
            toast.success(mode === 'create' ? 'Audio recording uploaded' : 'Recording metadata updated');
            onOpenChange(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 flex-1">
            {(mode === 'create' || mode === 'replace') && (
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold">Audio File (WAV / MP3)</Label>
                    <label
                        htmlFor="rec-file-input"
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer text-center focus-within:ring-2 focus-within:ring-ring ${
                            isDragging
                                ? 'border-primary bg-primary/5'
                                : filename
                                  ? 'border-border bg-muted/20'
                                  : 'border-muted hover:border-border'
                        }`}
                    >
                        <input
                            id="rec-file-input"
                            type="file"
                            accept=".wav,.mp3,audio/wav,audio/mpeg"
                            onChange={handleFileChange}
                            className="sr-only"
                        />
                        <RiUploadCloudLine className="size-8 text-flex-text-muted mb-2" />
                        {filename ? (
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-flex-text-primary">{filename}</span>
                                <span className="text-[11px] text-flex-text-muted">Click or drag to replace</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-flex-text-primary">
                                    Choose audio file or drag & drop
                                </span>
                                <span className="text-[11px] text-flex-text-muted">WAV or MP3 (max 20 MB)</span>
                            </div>
                        )}
                    </label>
                    {fileError && <p className="text-[11px] text-destructive">{fileError}</p>}
                </div>
            )}

            {mode !== 'replace' && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rec-name" className="text-xs font-semibold">
                            Recording Title
                        </Label>
                        <Input
                            id="rec-name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNameError(undefined);
                            }}
                            placeholder="e.g. Main Support Greeting"
                            className="h-9 text-xs"
                        />
                        {nameError && <p className="text-[11px] text-destructive">{nameError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rec-category" className="text-xs font-semibold">
                            Category
                        </Label>
                        <Select value={category} onValueChange={(val) => setCategory(val as RecordingCategory)}>
                            <SelectTrigger id="rec-category" className="h-9 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c.value} value={c.value} className="text-xs">
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rec-desc" className="text-xs font-semibold">
                            Description & Script
                        </Label>
                        <Textarea
                            id="rec-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Transcript, usage notes, or menu key instructions..."
                            rows={3}
                            className="text-xs"
                        />
                    </div>
                </>
            )}

            <SheetFooter className="mt-auto pt-4 border-t gap-2 sm:justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-1.5">
                    <RiMusic2Line className="size-3.5" />
                    {mode === 'create'
                        ? 'Upload & Save'
                        : mode === 'replace'
                          ? 'Confirm Replace'
                          : 'Save Changes'}
                </Button>
            </SheetFooter>
        </form>
    );
}

export function RecordingFormSheet({
    open,
    onOpenChange,
    mode,
    editing,
    onSave,
    onReplaceAudio,
}: RecordingFormSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6 overflow-y-auto">
                <SheetHeader className="gap-1.5">
                    <SheetTitle>
                        {mode === 'create'
                            ? 'Upload Audio Recording'
                            : mode === 'replace'
                              ? `Replace Audio: ${editing?.name}`
                              : 'Edit Recording Details'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Upload WAV or MP3 audio assets for IVR trees, queue prompts, and announcements.'
                            : mode === 'replace'
                              ? 'Upload a new audio file while preserving existing routing associations and metadata.'
                              : 'Update title, category, or operational description for this recording.'}
                    </SheetDescription>
                </SheetHeader>

                {open && (
                    <RecordingFormContent
                        key={`${mode}-${editing?.id ?? 'new'}`}
                        mode={mode}
                        editing={editing}
                        onOpenChange={onOpenChange}
                        onSave={onSave}
                        onReplaceAudio={onReplaceAudio}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}

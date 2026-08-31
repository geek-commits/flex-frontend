import { RiMusic2Line, RiUploadCloudLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { RECORDING_CATEGORY_KEYS  } from '@/domain/recording-types';
import type { RecordingCategory, RecordingDraft, RecordingRecord } from '@/domain/recording-types';
import type {RecordingCategoryKey} from '@/domain/recording-types';

export interface RecordingFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit' | 'replace';
    editing?: RecordingRecord;
    onSave: (draft: RecordingDraft) => boolean;
    onReplaceAudio?: (id: string, fileData: { filename: string; format: 'WAV' | 'MP3'; duration?: string; durationSeconds?: number; fileSizeBytes?: number; url?: string }) => boolean;
}

type RecordingValidationKey =
    | 'recordings.form.validation.unsupportedFormat'
    | 'recordings.form.validation.replacementRequired'
    | 'recordings.form.validation.titleRequired'
    | 'recordings.form.validation.fileRequired';

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
    const { t } = useTranslation('administration');
    const [name, setName] = useState(editing?.name ?? '');
    const [category, setCategory] = useState<RecordingCategory>(editing?.category ?? 'ivr-prompt');
    const [description, setDescription] = useState(editing?.description ?? '');
    const [filename, setFilename] = useState(editing?.filename ?? '');
    const [format, setFormat] = useState<'WAV' | 'MP3'>(editing?.format ?? 'WAV');
    const [duration] = useState(editing?.duration ?? '0:25');
    const [durationSeconds] = useState(editing?.durationSeconds ?? 25);
    const [fileSizeBytes, setFileSizeBytes] = useState(editing?.fileSizeBytes ?? 400000);
    const [nameError, setNameError] = useState<RecordingValidationKey>();
    const [fileError, setFileError] = useState<RecordingValidationKey>();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelected = (file: File) => {
        const ext = file.name.split('.').pop()?.toUpperCase();

        if (ext !== 'WAV' && ext !== 'MP3') {
            setFileError('recordings.form.validation.unsupportedFormat');

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
                setFileError('recordings.form.validation.replacementRequired');

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
                    toast.success(t('recordings.form.replacedToast'));
                    onOpenChange(false);
                }
            }

            return;
        }

        if (!name.trim()) {
            setNameError('recordings.form.validation.titleRequired');

            return;
        }

        if (mode === 'create' && !filename) {
            setFileError('recordings.form.validation.fileRequired');

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
            toast.success(t(mode === 'create' ? 'recordings.form.uploadSaveToast' : 'recordings.form.updatedToast'));
            onOpenChange(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 flex-1">
            {(mode === 'create' || mode === 'replace') && (
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold">{t('recordings.form.audioFile')}</Label>
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
                                <span className="text-[11px] text-flex-text-muted">{t('recordings.form.dragReplace')}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-flex-text-primary">{t('recordings.form.chooseFile')}</span>
                                <span className="text-[11px] text-flex-text-muted">{t('recordings.form.wavMp3')}</span>
                            </div>
                        )}
                    </label>
                    {fileError && <p className="text-[11px] text-destructive">{t(fileError)}</p>}
                </div>
            )}

            {mode !== 'replace' && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rec-name" className="text-xs font-semibold">
                            {t('recordings.form.titleLabel')}
                        </Label>
                        <Input
                            id="rec-name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNameError(undefined);
                            }}
                            placeholder={t('recordings.form.titlePlaceholder')}
                            className="h-9 text-xs"
                        />
                        {nameError && <p className="text-[11px] text-destructive">{t(nameError)}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rec-category" className="text-xs font-semibold">
                            {t('recordings.form.categoryLabel')}
                        </Label>
                        <Select value={category} onValueChange={(val) => setCategory(val as RecordingCategory)}>
                            <SelectTrigger id="rec-category" className="h-9 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(Object.keys(RECORDING_CATEGORY_KEYS) as RecordingCategory[]).map((cat) => (
                                    <SelectItem key={cat} value={cat} className="text-xs">
                                        {t(RECORDING_CATEGORY_KEYS[cat] as RecordingCategoryKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rec-desc" className="text-xs font-semibold">
                            {t('recordings.form.descriptionLabel')}
                        </Label>
                        <Textarea
                            id="rec-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('recordings.form.descriptionPlaceholder')}
                            rows={3}
                            className="text-xs"
                        />
                    </div>
                </>
            )}

            <SheetFooter className="mt-auto pt-4 border-t gap-2 sm:justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                    {t('recordings.form.cancel')}
                </Button>
                <Button type="submit" size="sm" className="gap-1.5">
                    <RiMusic2Line className="size-3.5" />
                    {mode === 'create' ? t('recordings.form.uploadSave') : mode === 'replace' ? t('recordings.form.confirmReplace') : t('recordings.form.saveChanges')}
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
    const { t } = useTranslation('administration');

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6 overflow-y-auto">
                <SheetHeader className="gap-1.5">
                    <SheetTitle>
                        {mode === 'create'
                            ? t('recordings.form.uploadTitle')
                            : mode === 'replace'
                              ? t('recordings.form.replaceTitle', { name: editing?.name })
                              : t('recordings.form.editTitle')}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? t('recordings.form.createDescription')
                            : mode === 'replace'
                              ? t('recordings.form.replaceDescription')
                              : t('recordings.form.editDescription')}
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

import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { scheduledReportsRepository } from '@/domain/scheduled-reports-repository';
import { getReportById, REPORTS } from '@/features/reports/report-registry';
import type { ReportFormat, ReportId } from '@/features/reports/report-registry';
import type {
    RecipientTargetType,
    ScheduleStatus,
    ScheduleType,
    ScheduledReportDraft,
    ScheduledReportRecord,
} from '@/features/reports/scheduled/scheduled-types';

const SCHEDULE_TYPES: ScheduleType[] = ['Daily', 'Weekly', 'Monthly', 'Custom'];
const TARGET_TYPES: RecipientTargetType[] = ['Emails', 'Users', 'Roles', 'Departments'];
const STATUSES: ScheduleStatus[] = ['Active', 'Inactive', 'Disabled'];

const RECIPIENT_OPTIONS: Record<RecipientTargetType, string[]> = {
    Emails: ['ops@flexco.com', 'support@flexco.com', 'reports@flexco.com'],
    Users: ['Grace Mwanga', 'James Otieno', 'Fatuma Ally', 'Sarah Smith'],
    Roles: ['Super Administrator', 'Administrator', 'Agent'],
    Departments: ['Billing', 'Sales & Inquiries', 'Technical Escalations', 'Customer Support'],
};

const EMPTY_DRAFT: ScheduledReportDraft = {
    name: '',
    reportId: 'contact-center-performance',
    format: 'PDF',
    scheduleType: 'Daily',
    scheduleSummary: 'Every day at 08:00',
    targetType: 'Users',
    recipients: [],
    status: 'Active',
};

function seedDraft(editing?: ScheduledReportRecord): ScheduledReportDraft {
    if (!editing) {
        return { ...EMPTY_DRAFT };
    }

    return {
        name: editing.name,
        reportId: editing.reportId,
        format: editing.format,
        scheduleType: editing.scheduleType,
        scheduleSummary: editing.scheduleSummary,
        targetType: editing.targetType,
        recipients: editing.recipients,
        status: editing.status,
    };
}

const SCHEDULE_PLACEHOLDERS: Record<ScheduleType, string> = {
    Daily: 'Every day at 08:00',
    Weekly: 'Every Monday at 07:30',
    Monthly: '1st of every month at 09:00',
    Custom: 'Cron expression, e.g. 0 4 * * 1-5',
};

export interface ScheduleFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing?: ScheduledReportRecord;
    onSaved?: () => void;
}

export function ScheduleFormSheet({ open, onOpenChange, editing, onSaved }: ScheduleFormSheetProps) {
    const [draft, setDraft] = useState<ScheduledReportDraft>(() => seedDraft(editing));
    const [nameError, setNameError] = useState<string>();
    const [saving, setSaving] = useState(false);

    const updateDraft = useCallback((patch: Partial<ScheduledReportDraft>) => {
        setDraft((d) => ({ ...d, ...patch }));
        setNameError(undefined);
    }, []);

    const selectedReport = getReportById(draft.reportId);

    const availableFormats: ReportFormat[] = useMemo(
        () => selectedReport?.supportedFormats ?? ['PDF'],
        [selectedReport]
    );

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setDraft(seedDraft(editing));
            setNameError(undefined);
        }

        onOpenChange(next);
    };

    const toggleRecipient = (value: string) => {
        setDraft((d) => {
            const has = d.recipients.some((recipient) => recipient.value === value);

            return {
                ...d,
                recipients: has
                    ? d.recipients.filter((recipient) => recipient.value !== value)
                    : [...d.recipients, { type: d.targetType, value }],
            };
        });
    };

    const handleSave = () => {
        if (!draft.name.trim()) {
            setNameError('Report name is required.');

            return;
        }

        if (draft.recipients.length === 0) {
            toast.error('Select at least one recipient.');

            return;
        }

        setSaving(true);
        setTimeout(() => {
            try {
                if (editing) {
                    scheduledReportsRepository.updateSchedule(editing.id, draft);
                    toast.success('Schedule saved');
                } else {
                    scheduledReportsRepository.createSchedule(draft);
                    toast.success('Schedule created');
                }
            } catch {
                toast.error(editing ? 'Schedule could not be saved' : 'Schedule could not be created');
            }

            setSaving(false);
            handleOpenChange(false);
            onSaved?.();
        }, 300);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{editing ? 'Edit Schedule' : 'Add New Report'}</SheetTitle>
                    <SheetDescription>
                        Configure automated report generation and delivery.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
                    {/* Report */}
                    <SectionTitle>Report</SectionTitle>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-name" className="text-xs font-semibold">
                            Report Name
                        </Label>
                        <Input
                            id="sched-name"
                            value={draft.name}
                            onChange={(e) => updateDraft({ name: e.target.value })}
                            placeholder="e.g. Contact Center Performance — Daily"
                            aria-invalid={!!nameError}
                        />
                        {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-report" className="text-xs font-semibold">
                            Report Type
                        </Label>
                        <Select
                            value={draft.reportId}
                            onValueChange={(value) => updateDraft({ reportId: (value as ReportId) ?? EMPTY_DRAFT.reportId })}
                        >
                            <SelectTrigger id="sched-report" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORTS.map((report) => (
                                    <SelectItem key={report.id} value={report.id} className="text-xs">
                                        {report.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-format" className="text-xs font-semibold">
                            Output Format
                        </Label>
                        <Select value={draft.format} onValueChange={(value) => updateDraft({ format: (value as ReportFormat) ?? 'PDF' })}>
                            <SelectTrigger id="sched-format" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableFormats.map((format) => (
                                    <SelectItem key={format} value={format} className="text-xs">
                                        {format}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Schedule */}
                    <SectionTitle>Schedule</SectionTitle>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-type" className="text-xs font-semibold">
                            Schedule Type
                        </Label>
                        <Select
                            value={draft.scheduleType}
                            onValueChange={(value) => {
                                const type = (value as ScheduleType) ?? 'Daily';

                                updateDraft({ scheduleType: type, scheduleSummary: SCHEDULE_PLACEHOLDERS[type] });
                            }}
                        >
                            <SelectTrigger id="sched-type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SCHEDULE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type} className="text-xs">
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-summary" className="text-xs font-semibold">
                            Schedule
                        </Label>
                        <Input
                            id="sched-summary"
                            value={draft.scheduleSummary}
                            onChange={(e) => updateDraft({ scheduleSummary: e.target.value })}
                            placeholder={SCHEDULE_PLACEHOLDERS[draft.scheduleType]}
                        />
                        {draft.scheduleType === 'Custom' && (
                            <p className="text-[11px] text-flex-text-muted">Use a cron expression the backend can validate.</p>
                        )}
                    </div>

                    {/* Recipients */}
                    <SectionTitle>Recipients</SectionTitle>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-target" className="text-xs font-semibold">
                            Target Type
                        </Label>
                        <Select
                            value={draft.targetType}
                            onValueChange={(value) => updateDraft({ targetType: (value as RecipientTargetType) ?? 'Users', recipients: [] })}
                        >
                            <SelectTrigger id="sched-target" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TARGET_TYPES.map((type) => (
                                    <SelectItem key={type} value={type} className="text-xs">
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold">{draft.targetType}</Label>
                        <div className="flex flex-col gap-1 rounded-md border border-border p-2">
                            {RECIPIENT_OPTIONS[draft.targetType].map((option) => {
                                const checked = draft.recipients.some((recipient) => recipient.value === option);

                                return (
                                    <label key={option} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/40 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleRecipient(option)}
                                            className="size-3.5 accent-[var(--flex-primary)]"
                                        />
                                        <span className="text-flex-text-primary">{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <p className="text-[11px] text-flex-text-muted">{draft.recipients.length} selected</p>
                    </div>

                    {/* Status */}
                    <SectionTitle>Status</SectionTitle>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sched-status" className="text-xs font-semibold">
                            Status
                        </Label>
                        <Select value={draft.status} onValueChange={(value) => updateDraft({ status: (value as ScheduleStatus) ?? 'Active' })}>
                            <SelectTrigger id="sched-status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status} className="text-xs capitalize">
                                        {status}
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
                        {saving ? 'Saving…' : editing ? 'Save Schedule' : 'Create Schedule'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="border-b border-border pb-1 text-[11px] font-bold uppercase tracking-wider text-flex-text-muted">
            {children}
        </p>
    );
}

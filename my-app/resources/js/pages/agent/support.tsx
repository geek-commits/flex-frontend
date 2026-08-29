import { Head } from '@inertiajs/react';
import { RiLifebuoyLine, RiSendPlaneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SupportCategory, SupportTicketStatus } from '@/features/support/support-types';
import { SUPPORT_CATEGORY_KEY, SUPPORT_STATUS_KEY } from '@/features/support/support-types';
import { useSupport } from '@/features/support/use-support';
import { AgentShell } from '@/layouts/agent-shell';

const TICKET_TONE: Record<SupportTicketStatus, FlexStatusTone> = {
    open: 'warning',
    'in-progress': 'info',
    resolved: 'success',
};

function formatTicketDate(iso: string, locale: string): string {
    const d = new Date(iso);

    if (Number.isNaN(d.getTime())) {
return iso;
}

    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export default function SupportPage() {
    const { t, i18n } = useTranslation('agent');
    const { data, submitTicket } = useSupport();
    const { tickets, categories } = data;

    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState<SupportCategory>(categories[0]);

    const handleSubmit = () => {
        if (!subject.trim()) {
return;
}

        submitTicket({ category, subject });
        setSubject('');
    };

    return (
        <AgentShell title={t('support.title')}>
            <Head title={t('support.headTitle')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs lg:col-span-1">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiLifebuoyLine className="size-4 text-primary" />
                            {t('support.submitTicket')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">{t('support.issueCategory')}</Label>
                            <Select value={category} onValueChange={(value) => setCategory((value as SupportCategory) ?? categories[0])}>
                                <SelectTrigger className="h-9 text-xs" aria-label={t('support.issueCategory')}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c} className="text-xs">
                                            {t(SUPPORT_CATEGORY_KEY[c])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">{t('support.subjectLabel')}</Label>
                            <Input
                                placeholder={t('support.placeholder')}
                                aria-label={t('support.subjectLabel')}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>

                        <Button className="w-full h-9 text-xs gap-1.5 mt-2" onClick={handleSubmit} disabled={!subject.trim()} aria-label={t('support.submit')}>
                            <RiSendPlaneLine className="size-3.5" />
                            <span>{t('support.submit')}</span>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-2xs lg:col-span-2">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t('support.myTickets')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {tickets.length === 0 ? (
                            <FlexEmptyState title={t('support.emptyTitle')} description={t('support.emptyDescription')} />
                        ) : (
                            <div className="flex flex-col gap-3">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-foreground">{ticket.id}</span>
                                                <span className="text-[10px] text-muted-foreground">• {t(SUPPORT_CATEGORY_KEY[ticket.category])}</span>
                                            </div>
                                            <p className="font-medium text-foreground truncate">{ticket.subject}</p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-mono text-[11px] text-muted-foreground">{formatTicketDate(ticket.createdAt, i18n.language)}</span>
                                            <FlexStatus tone={TICKET_TONE[ticket.status]} className="capitalize">
                                                {t(SUPPORT_STATUS_KEY[ticket.status])}
                                            </FlexStatus>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AgentShell>
    );
}

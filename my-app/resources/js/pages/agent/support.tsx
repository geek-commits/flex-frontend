import { Head } from '@inertiajs/react';
import { RiLifebuoyLine, RiSendPlaneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SupportTicketStatus } from '@/features/support/support-types';
import { useSupport } from '@/features/support/use-support';
import { AgentShell } from '@/layouts/agent-shell';

const TICKET_TONE: Record<SupportTicketStatus, FlexStatusTone> = {
    open: 'warning',
    'in-progress': 'info',
    resolved: 'success',
};

export default function SupportPage() {
    const { data, submitTicket } = useSupport();
    const { tickets, categories } = data;

    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState(categories[0]);

    const handleSubmit = () => {
        if (!subject.trim()) {
            return;
        }

        submitTicket({ category, subject });
        setSubject('');
    };

    return (
        <AgentShell title="Flex Quick Support" subtitle="Submit Technical Support & Helpdesk Tickets">
            <Head title="Quick Support — Flex Contact Center" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {/* Submit Ticket Form */}
                <Card className="bg-card border-border shadow-2xs lg:col-span-1">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiLifebuoyLine className="size-4 text-primary" />
                            Submit a Ticket
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Issue Category</Label>
                            <Select value={category} onValueChange={(value) => setCategory(value ?? categories[0])}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c} className="text-xs">
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs">Subject / Brief Summary</Label>
                            <Input
                                placeholder="Describe the issue..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>

                        <Button className="w-full h-9 text-xs gap-1.5 mt-2" onClick={handleSubmit} disabled={!subject.trim()}>
                            <RiSendPlaneLine className="size-3.5" />
                            <span>Submit Ticket</span>
                        </Button>
                    </CardContent>
                </Card>

                {/* Submitted Tickets List */}
                <Card className="bg-card border-border shadow-2xs lg:col-span-2">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            My Submitted Tickets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {tickets.length === 0 ? (
                            <FlexEmptyState
                                title="No tickets submitted yet"
                                description="Submit a ticket to track your technical support requests here."
                            />
                        ) : (
                            <div className="flex flex-col gap-3">
                                {tickets.map((t) => (
                                    <div
                                        key={t.id}
                                        className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-foreground">{t.id}</span>
                                                <span className="text-[10px] text-muted-foreground">• {t.category}</span>
                                            </div>
                                            <p className="font-medium text-foreground truncate">{t.subject}</p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-mono text-[11px] text-muted-foreground">{t.createdAt}</span>
                                            <FlexStatus tone={TICKET_TONE[t.status]} className="capitalize">
                                                {t.status}
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
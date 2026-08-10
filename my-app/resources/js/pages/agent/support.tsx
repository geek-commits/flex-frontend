import { Head } from '@inertiajs/react';
import { RiLifebuoyLine, RiSendPlaneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AgentShell } from '@/layouts/agent-shell';

export interface SupportTicket {
    id: string;
    subject: string;
    category: string;
    status: 'open' | 'in-progress' | 'resolved';
    createdAt: string;
}

export default function SupportPage() {
    const [tickets] = useState<SupportTicket[]>([
        {
            id: 'TICK-1024',
            subject: 'Headset audio crackling on WebRTC softphone',
            category: 'Audio / Hardware',
            status: 'in-progress',
            createdAt: '2026-08-07 11:30',
        },
        {
            id: 'TICK-1019',
            subject: 'DID route failover test inquiry',
            category: 'Telephony / Routing',
            status: 'resolved',
            createdAt: '2026-08-05 09:14',
        },
    ]);

    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Audio / Hardware');

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
                            <Select value={category} onValueChange={(value) => setCategory(value ?? 'Audio / Hardware')}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="Audio / Hardware" className="text-xs">
                                        Audio / Hardware
                                    </SelectItem>
                                    <SelectItem value="Telephony / Routing" className="text-xs">
                                        Telephony / Routing
                                    </SelectItem>
                                    <SelectItem value="CRM / Integration" className="text-xs">
                                        CRM / Integration
                                    </SelectItem>
                                    <SelectItem value="Account & Login" className="text-xs">
                                        Account & Login
                                    </SelectItem>
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

                        <Button className="w-full h-9 text-xs gap-1.5 mt-2" disabled={!subject}>
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
                                        <Badge
                                            variant="outline"
                                            className={`capitalize ${
                                                t.status === 'resolved'
                                                    ? 'bg-status-live-bg text-status-live border-status-live/30'
                                                    : 'bg-status-stale-bg text-status-stale border-status-stale/30'
                                            }`}
                                        >
                                            {t.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AgentShell>
    );
}

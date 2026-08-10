import { Head, usePage } from '@inertiajs/react';
import { RiPauseFill, RiPlayFill, RiEditLine, RiDeleteBin6Line, RiUserStarLine, RiPhoneLine, RiCheckboxCircleLine, RiTimeLine } from '@remixicon/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BackLink } from '@/components/flex/back-link';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { StatusBadge } from '@/components/flex/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { campaignRepository } from '@/domain/campaign-repository';
import type { CampaignRecord } from '@/domain/types';
import { CampaignFormSheet } from '@/features/campaigns/campaign-form-sheet';
import { AdminShell } from '@/layouts/admin-shell';
import type { CampaignStatus } from '@/types/flex';

const CONTACT_TONE: Record<string, string> = {
    answered: 'text-status-live',
    dialed: 'text-status-talking',
    queued: 'text-muted-foreground',
    failed: 'text-destructive',
    'not-answered': 'text-status-stale',
};

export default function CampaignDetailPage() {
    const campaignId = (usePage().props as { campaign?: string }).campaign ?? '';
    const campaign = campaignRepository.getById(campaignId);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (!campaign) {
        return (
            <AdminShell title="Campaign" subtitle="Campaign not found">
                <Head title="Campaign — Flex Contact Center" />
                <div className="flex flex-col gap-4 w-full">
                    <BackLink href="/admin/campaigns" label="Back to Campaigns" />
                    <Card className="bg-card border-border shadow-2xs">
                        <CardContent className="p-8 text-center text-sm text-muted-foreground">
                            Campaign <span className="font-mono">{campaignId}</span> could not be found.
                        </CardContent>
                    </Card>
                </div>
            </AdminShell>
        );
    }

    const contacts = campaignRepository.getContacts(campaign.id, 12);
    const progressPct = campaign.totalContacts > 0 ? Math.round((campaign.dialedCount / campaign.totalContacts) * 100) : 0;
    const answerRate = campaign.dialedCount > 0 ? Math.round((campaign.answeredCount / campaign.dialedCount) * 100) : 0;

    const toggleStatus = (record: CampaignRecord) => {
        const nextStatus: CampaignStatus = record.status === 'active' ? 'paused' : 'active';
        campaignRepository.update(record.id, {
            title: record.title,
            destination: record.destination,
            scheduleTime: record.scheduleTime,
            status: nextStatus,
            totalContacts: record.totalContacts,
            dialedCount: record.dialedCount,
            answeredCount: record.answeredCount,
        });
        toast.success(nextStatus === 'active' ? 'Campaign started' : 'Campaign paused');
        window.location.reload();
    };

    const handleDelete = () => {
        setDeleting(true);
        setTimeout(() => {
            campaignRepository.delete(campaign.id);
            setDeleting(false);
            setDeleteOpen(false);
            toast.success('Campaign deleted');
            window.location.assign('/admin/campaigns');
        }, 250);
    };

    return (
        <AdminShell
            title={campaign.title}
            subtitle={campaign.destination}
            contextTitle="Telephony"
            contextSubtitle="Campaigns & operations"
            actions={
                <div className="flex items-center gap-2">
                    {campaign.status === 'active' || campaign.status === 'paused' ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => toggleStatus(campaign)}
                        >
                            {campaign.status === 'active' ? (
                                <RiPauseFill className="size-3.5 text-status-stale" />
                            ) : (
                                <RiPlayFill className="size-3.5 text-status-live" />
                            )}
                            {campaign.status === 'active' ? 'Pause' : 'Start'}
                        </Button>
                    ) : null}
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setEditOpen(true)}>
                        <RiEditLine className="size-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-destructive hover:text-destructive/80"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <RiDeleteBin6Line className="size-3.5" />
                        Delete
                    </Button>
                </div>
            }
        >
            <Head title={`${campaign.title} — Flex Contact Center`} />

            <div className="flex flex-col gap-5 w-full">
                <BackLink href="/admin/campaigns" label="Back to Campaigns" />

                {/* Header card */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-5 flex flex-col gap-5">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-xl font-semibold text-foreground tracking-tight">{campaign.title}</span>
                                    <StatusBadge domain="campaign" status={campaign.status} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {campaign.scheduleTime} · {campaign.destination}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground">
                                    {campaign.dialedCount}/{campaign.totalContacts} contacts dialed
                                </span>
                                <span className="font-bold text-foreground">{progressPct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metrics */}
                <MetricGroup>
                    <MetricCard title="Total Contacts" value={campaign.totalContacts} description="In this campaign" icon={RiUserStarLine} />
                    <MetricCard title="Dialed" value={campaign.dialedCount} description="Contacts attempted" icon={RiPhoneLine} />
                    <MetricCard title="Answered" value={campaign.answeredCount} description="Connected calls" icon={RiCheckboxCircleLine} />
                    <MetricCard title="Answer Rate" value={`${campaign.totalContacts > 0 ? `${answerRate}%` : '—'}`} description="Answered of dialed" icon={RiTimeLine} />
                </MetricGroup>

                {/* Contacts list */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Contacts ({contacts.length} shown)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="px-4 py-2.5">Name</th>
                                    <th className="px-4 py-2.5">Phone</th>
                                    <th className="px-4 py-2.5">Status</th>
                                    <th className="px-4 py-2.5">Dialed At</th>
                                    <th className="px-4 py-2.5">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2.5 font-medium text-foreground">{contact.name}</td>
                                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{contact.phone}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`capitalize font-semibold ${CONTACT_TONE[contact.status]}`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{contact.dialedAt ?? '—'}</td>
                                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                                            {contact.durationSeconds
                                                ? `${String(Math.floor(contact.durationSeconds / 60)).padStart(2, '0')}:${String(contact.durationSeconds % 60).padStart(2, '0')}`
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <CampaignFormSheet open={editOpen} onOpenChange={setEditOpen} editing={campaign} onSaved={() => window.location.reload()} />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{campaign.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete campaign'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminShell>
    );
}

import { Head, usePage } from '@inertiajs/react';
import { RiCheckboxCircleLine, RiDeleteBin6Line, RiEditLine, RiPauseFill, RiPhoneLine, RiPlayFill, RiTimeLine, RiUserStarLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { BackLink } from '@/components/flex/back-link';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { StatusBadge } from '@/components/flex/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    const { t, i18n } = useTranslation('supervision');
    const campaignId = (usePage().props as { campaign?: string }).campaign ?? '';
    const campaign = campaignRepository.getById(campaignId);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const locale = i18n.language;

    if (!campaign) {
        return (
            <AdminShell title={t('campaigns.detail.notFoundTitle')} subtitle={t('campaigns.detail.notFoundSubtitle')}>
                <Head title={t('campaigns.detail.notFoundTitle') + ' — Flex Contact Center'} />
                <div className="flex flex-col gap-4 w-full">
                    <BackLink href="/admin/campaigns" label={t('campaigns.detail.back')} />
                    <Card className="bg-card border-border shadow-2xs">
                        <CardContent className="p-8 text-center text-sm text-muted-foreground">
                            {t('campaigns.detail.notFoundDetail', { id: campaignId })}
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
        toast.success(t(nextStatus === 'active' ? 'campaigns.toast.started' : 'campaigns.toast.paused'));
        window.location.reload();
    };

    const handleDelete = () => {
        setDeleting(true);
        setTimeout(() => {
            campaignRepository.delete(campaign.id);
            setDeleting(false);
            setDeleteOpen(false);
            toast.success(t('campaigns.toast.deleted'));
            window.location.assign('/admin/campaigns');
        }, 250);
    };

    return (
        <AdminShell
            title={campaign.title}
            subtitle={campaign.destination}
            actions={
                <div className="flex items-center gap-2">
                    {campaign.status === 'active' || campaign.status === 'paused' ? (
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toggleStatus(campaign)}>
                            {campaign.status === 'active' ? (
                                <RiPauseFill className="size-3.5 text-status-stale" />
                            ) : (
                                <RiPlayFill className="size-3.5 text-status-live" />
                            )}
                            {campaign.status === 'active' ? t('campaigns.detail.pause') : t('campaigns.detail.start')}
                        </Button>
                    ) : null}
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setEditOpen(true)}>
                        <RiEditLine className="size-3.5" />
                        {t('campaigns.detail.edit')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-destructive hover:text-destructive/80"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <RiDeleteBin6Line className="size-3.5" />
                        {t('campaigns.detail.delete')}
                    </Button>
                </div>
            }
        >
            <Head title={`${campaign.title} — Flex Contact Center`} />

            <div className="flex flex-col gap-5 w-full">
                <BackLink href="/admin/campaigns" label={t('campaigns.detail.back')} />

                {/* Header card */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-5 flex flex-col gap-5">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[length:var(--flex-font-size-page-title)] font-medium text-foreground tracking-tight">{campaign.title}</span>
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
                                    {t('campaigns.detail.progress', { dialed: new Intl.NumberFormat(locale).format(campaign.dialedCount), total: new Intl.NumberFormat(locale).format(campaign.totalContacts) })}
                                </span>
                                <span className="font-bold text-foreground">{new Intl.NumberFormat(locale).format(progressPct)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metrics */}
                <MetricGroup>
                    <MetricCard title={t('campaigns.detail.contacts')} value={new Intl.NumberFormat(locale).format(campaign.totalContacts)} description={t('campaigns.detail.performance')} icon={RiUserStarLine} />
                    <MetricCard title={t('campaigns.detail.dialed')} value={new Intl.NumberFormat(locale).format(campaign.dialedCount)} description={t('campaigns.detail.dialed')} icon={RiPhoneLine} />
                    <MetricCard title={t('campaigns.detail.answered')} value={new Intl.NumberFormat(locale).format(campaign.answeredCount)} description={t('campaigns.detail.answered')} icon={RiCheckboxCircleLine} />
                    <MetricCard
                        title={t('campaigns.detail.answerRate')}
                        value={campaign.dialedCount > 0 ? new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(answerRate / 100) : '—'}
                        description={t('campaigns.detail.answerRate')}
                        icon={RiTimeLine}
                    />
                </MetricGroup>

                {/* Contacts list */}
                <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
                    <div className="border-b border-flex-workspace-divider p-4 pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t('campaigns.detail.contactsShown', { count: contacts.length })}
                        </h3>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="flex-table-grid w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-flex-workspace-divider text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="px-4 py-2.5">{t('campaigns.detail.table.name')}</th>
                                    <th className="px-4 py-2.5">{t('campaigns.detail.table.phone')}</th>
                                    <th className="px-4 py-2.5">{t('campaigns.detail.table.status')}</th>
                                    <th className="px-4 py-2.5">{t('campaigns.detail.table.dialedAt')}</th>
                                    <th className="px-4 py-2.5">{t('campaigns.detail.table.duration')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-flex-workspace-divider">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2.5 font-medium text-foreground">{contact.name}</td>
                                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{contact.phone}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`capitalize font-semibold ${CONTACT_TONE[contact.status]}`}>
                                                {t(`campaigns.contactStatus.${contact.status}` as const)}
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
                    </div>
                </div>
            </div>

            <CampaignFormSheet open={editOpen} onOpenChange={setEditOpen} editing={campaign} onSaved={() => window.location.reload()} />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('campaigns.detail.deleteTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('campaigns.detail.deleteDescription', { title: campaign.title })}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>{t('campaigns.detail.cancel')}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? t('campaigns.detail.deleting') : t('campaigns.detail.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminShell>
    );
}

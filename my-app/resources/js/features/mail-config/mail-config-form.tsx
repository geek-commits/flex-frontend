import { RiSave3Line } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { MailConfigDraft, MailConfigRecord, MailEncryption } from '@/domain/mail-types';

export interface MailConfigFormProps {
    config: MailConfigRecord;
    isSaving?: boolean;
    onSave: (draft: MailConfigDraft) => { ok: boolean; config: MailConfigRecord; reason?: string };
}

export function MailConfigForm({ config, isSaving = false, onSave }: MailConfigFormProps) {
    const { t } = useTranslation('administration');
    const [fromName, setFromName] = useState(config.fromName);
    const [fromAddress, setFromAddress] = useState(config.fromAddress);
    const [replyTo, setReplyTo] = useState(config.replyTo ?? '');
    const [smtpHost, setSmtpHost] = useState(config.smtpHost);
    const [port, setPort] = useState(config.port);
    const [encryption, setEncryption] = useState<MailEncryption>(config.encryption);
    const [username, setUsername] = useState(config.username);
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(config.active);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};

        if (!fromName.trim()) {
            errs.fromName = t('mail.form.errors.fromName');
        }

        if (!fromAddress.trim()) {
            errs.fromAddress = t('mail.form.errors.fromAddress');
        }

        if (!smtpHost.trim()) {
            errs.smtpHost = t('mail.form.errors.smtpHost');
        }

        if (!port || port < 1 || port > 65535) {
            errs.port = t('mail.form.errors.port');
        }

        if (!username.trim()) {
            errs.username = t('mail.form.errors.username');
        }

        if (Object.keys(errs).length > 0) {
            setErrors(errs);

            return;
        }

        setErrors({});

        const res = onSave({
            fromName: fromName.trim(),
            fromAddress: fromAddress.trim(),
            replyTo: replyTo.trim() || undefined,
            smtpHost: smtpHost.trim(),
            port: Number(port),
            encryption,
            username: username.trim(),
            password: password.trim() || undefined,
            active,
        });

        if (res.ok) {
            setPassword('');
            toast.success(t('mail.form.toast.saved'));
        } else {
            toast.error(res.reason ?? t('mail.form.toast.saveFailed'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Sender Identity Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">{t('mail.form.senderIdentity')}</CardTitle>
                    <CardDescription className="text-xs">
                        {t('mail.form.senderIdentityDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-from-name" className="text-xs font-semibold">
                            {t('mail.form.fromName')}
                        </Label>
                        <Input
                            id="mail-from-name"
                            value={fromName}
                            onChange={(e) => {
                                setFromName(e.target.value);
                                setErrors((prev) => ({ ...prev, fromName: '' }));
                            }}
                            placeholder={t('mail.form.fromNamePlaceholder')}
                            className="h-9 text-xs"
                        />
                        {errors.fromName && <p className="text-[11px] text-destructive">{errors.fromName}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-from-address" className="text-xs font-semibold">
                            {t('mail.form.fromEmail')}
                        </Label>
                        <Input
                            id="mail-from-address"
                            type="email"
                            value={fromAddress}
                            onChange={(e) => {
                                setFromAddress(e.target.value);
                                setErrors((prev) => ({ ...prev, fromAddress: '' }));
                            }}
                            placeholder={t('mail.form.fromEmailPlaceholder')}
                            className="h-9 text-xs"
                        />
                        {errors.fromAddress && (
                            <p className="text-[11px] text-destructive">{errors.fromAddress}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor="mail-reply-to" className="text-xs font-semibold">
                            {t('mail.form.replyTo')} <span className="text-flex-text-muted font-normal">{t('mail.form.replyToOptional')}</span>
                        </Label>
                        <Input
                            id="mail-reply-to"
                            type="email"
                            value={replyTo}
                            onChange={(e) => setReplyTo(e.target.value)}
                            placeholder={t('mail.form.replyToPlaceholder')}
                            className="h-9 text-xs"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SMTP Server Connection Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">{t('mail.form.smtpSettings')}</CardTitle>
                    <CardDescription className="text-xs">
                        {t('mail.form.smtpSettingsDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor="mail-smtp-host" className="text-xs font-semibold">
                            {t('mail.form.smtpHost')}
                        </Label>
                        <Input
                            id="mail-smtp-host"
                            value={smtpHost}
                            onChange={(e) => {
                                setSmtpHost(e.target.value);
                                setErrors((prev) => ({ ...prev, smtpHost: '' }));
                            }}
                            placeholder={t('mail.form.smtpHostPlaceholder')}
                            className="h-9 text-xs"
                        />
                        {errors.smtpHost && <p className="text-[11px] text-destructive">{errors.smtpHost}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-port" className="text-xs font-semibold">
                            {t('mail.form.port')}
                        </Label>
                        <Input
                            id="mail-port"
                            type="number"
                            value={port}
                            onChange={(e) => {
                                setPort(Number(e.target.value));
                                setErrors((prev) => ({ ...prev, port: '' }));
                            }}
                            placeholder={t('mail.form.portPlaceholder')}
                            className="h-9 text-xs flex-numeric"
                        />
                        {errors.port && <p className="text-[11px] text-destructive">{errors.port}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-encryption" className="text-xs font-semibold">
                            {t('mail.form.encryption')}
                        </Label>
                        <Select
                            value={encryption}
                            onValueChange={(val) => setEncryption(val as MailEncryption)}
                        >
                            <SelectTrigger id="mail-encryption" className="h-9 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TLS" className="text-xs">
                                    {t('mail.form.encryptionOptions.tls')}
                                </SelectItem>
                                <SelectItem value="SSL" className="text-xs">
                                    {t('mail.form.encryptionOptions.ssl')}
                                </SelectItem>
                                <SelectItem value="None" className="text-xs">
                                    {t('mail.form.encryptionOptions.none')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-username" className="text-xs font-semibold">
                            {t('mail.form.username')}
                        </Label>
                        <Input
                            id="mail-username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setErrors((prev) => ({ ...prev, username: '' }));
                            }}
                            placeholder={t('mail.form.usernamePlaceholder')}
                            className="h-9 text-xs"
                        />
                        {errors.username && <p className="text-[11px] text-destructive">{errors.username}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-password" className="text-xs font-semibold">
                            {t('mail.form.password')}
                        </Label>
                        <Input
                            id="mail-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={config.hasPassword ? t('mail.form.passwordPlaceholderUnchanged') : t('mail.form.passwordPlaceholderNew')}
                            className="h-9 text-xs"
                        />
                        <p className="text-[10px] text-flex-text-muted">
                            {config.hasPassword
                                ? t('mail.form.passwordHintHasPassword')
                                : t('mail.form.passwordHintNoPassword')}
                        </p>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-between p-3 rounded-lg bg-muted/20 border mt-1">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-flex-text-primary">
                                {t('mail.form.enableDelivery')}
                            </span>
                            <span className="text-[11px] text-flex-text-muted">
                                {t('mail.form.enableDeliveryDescription')}
                            </span>
                        </div>
                        <Checkbox
                            checked={active}
                            onCheckedChange={(val) => setActive(Boolean(val))}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
                <Button type="submit" size="sm" disabled={isSaving} className="gap-1.5 text-xs h-9">
                    <RiSave3Line className="size-3.5" />
                    {isSaving ? t('mail.form.saving') : t('mail.form.save')}
                </Button>
            </div>
        </form>
    );
}

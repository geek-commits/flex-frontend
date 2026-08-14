import { RiSave3Line } from '@remixicon/react';
import React, { useState } from 'react';
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
            errs.fromName = 'From Name is required.';
        }

        if (!fromAddress.trim()) {
            errs.fromAddress = 'From Address is required.';
        }

        if (!smtpHost.trim()) {
            errs.smtpHost = 'SMTP Host is required.';
        }

        if (!port || port < 1 || port > 65535) {
            errs.port = 'Port must be between 1 and 65535.';
        }

        if (!username.trim()) {
            errs.username = 'Username is required.';
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
            toast.success('Mail configuration saved successfully');
        } else {
            toast.error(res.reason ?? 'Failed to save mail configuration');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Sender Identity Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Sender Identity</CardTitle>
                    <CardDescription className="text-xs">
                        Configure the sender name and address displayed on automated emails.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-from-name" className="text-xs font-semibold">
                            From Name
                        </Label>
                        <Input
                            id="mail-from-name"
                            value={fromName}
                            onChange={(e) => {
                                setFromName(e.target.value);
                                setErrors((prev) => ({ ...prev, fromName: '' }));
                            }}
                            placeholder="e.g. Flex Contact Center"
                            className="h-9 text-xs"
                        />
                        {errors.fromName && <p className="text-[11px] text-destructive">{errors.fromName}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-from-address" className="text-xs font-semibold">
                            From Email Address
                        </Label>
                        <Input
                            id="mail-from-address"
                            type="email"
                            value={fromAddress}
                            onChange={(e) => {
                                setFromAddress(e.target.value);
                                setErrors((prev) => ({ ...prev, fromAddress: '' }));
                            }}
                            placeholder="notifications@yourdomain.com"
                            className="h-9 text-xs"
                        />
                        {errors.fromAddress && (
                            <p className="text-[11px] text-destructive">{errors.fromAddress}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor="mail-reply-to" className="text-xs font-semibold">
                            Reply-To Address <span className="text-flex-text-muted font-normal">(Optional)</span>
                        </Label>
                        <Input
                            id="mail-reply-to"
                            type="email"
                            value={replyTo}
                            onChange={(e) => setReplyTo(e.target.value)}
                            placeholder="support@yourdomain.com"
                            className="h-9 text-xs"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SMTP Server Connection Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">SMTP Server Settings</CardTitle>
                    <CardDescription className="text-xs">
                        Configure SMTP host, authentication, port, and transport security.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor="mail-smtp-host" className="text-xs font-semibold">
                            SMTP Host
                        </Label>
                        <Input
                            id="mail-smtp-host"
                            value={smtpHost}
                            onChange={(e) => {
                                setSmtpHost(e.target.value);
                                setErrors((prev) => ({ ...prev, smtpHost: '' }));
                            }}
                            placeholder="e.g. smtp.office365.com or smtp.sendgrid.net"
                            className="h-9 text-xs"
                        />
                        {errors.smtpHost && <p className="text-[11px] text-destructive">{errors.smtpHost}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-port" className="text-xs font-semibold">
                            Port
                        </Label>
                        <Input
                            id="mail-port"
                            type="number"
                            value={port}
                            onChange={(e) => {
                                setPort(Number(e.target.value));
                                setErrors((prev) => ({ ...prev, port: '' }));
                            }}
                            placeholder="587"
                            className="h-9 text-xs flex-numeric"
                        />
                        {errors.port && <p className="text-[11px] text-destructive">{errors.port}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-encryption" className="text-xs font-semibold">
                            Encryption Security
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
                                    TLS (Recommended - Port 587)
                                </SelectItem>
                                <SelectItem value="SSL" className="text-xs">
                                    SSL (Port 465)
                                </SelectItem>
                                <SelectItem value="None" className="text-xs">
                                    None (Unencrypted - Port 25)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-username" className="text-xs font-semibold">
                            SMTP Username
                        </Label>
                        <Input
                            id="mail-username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setErrors((prev) => ({ ...prev, username: '' }));
                            }}
                            placeholder="username or api key"
                            className="h-9 text-xs"
                        />
                        {errors.username && <p className="text-[11px] text-destructive">{errors.username}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="mail-password" className="text-xs font-semibold">
                            SMTP Password
                        </Label>
                        <Input
                            id="mail-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={config.hasPassword ? '•••••••• (unchanged)' : 'Enter SMTP password'}
                            className="h-9 text-xs"
                        />
                        <p className="text-[10px] text-flex-text-muted">
                            {config.hasPassword
                                ? 'Leave blank to preserve stored secret.'
                                : 'Password will be stored securely write-only.'}
                        </p>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-between p-3 rounded-lg bg-muted/20 border mt-1">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-flex-text-primary">
                                Enable Mail Delivery
                            </span>
                            <span className="text-[11px] text-flex-text-muted">
                                Allow system to send automated subscription reminders, alerts, and reports.
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
                    {isSaving ? 'Saving Settings...' : 'Save Mail Configuration'}
                </Button>
            </div>
        </form>
    );
}

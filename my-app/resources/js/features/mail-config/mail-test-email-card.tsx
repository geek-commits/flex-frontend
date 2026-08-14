import {
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiLoader4Line,
    RiMailSendLine,
} from '@remixicon/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SendTestEmailResult } from '@/domain/mail-types';

export interface MailTestEmailCardProps {
    isSending: boolean;
    result: SendTestEmailResult | null;
    onSend: (recipient: string) => void;
}

export function MailTestEmailCard({
    isSending,
    result,
    onSend,
}: MailTestEmailCardProps) {
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState<string>();

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        if (!recipient.trim() || !recipient.includes('@')) {
            setError('Please enter a valid recipient email address.');

            return;
        }

        setError(undefined);
        onSend(recipient.trim());
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Send Test Email</CardTitle>
                <CardDescription className="text-xs">
                    Dispatch an actual test email to verify mailbox receipt, reverse-DNS, and spam filters.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {result && (
                    <div
                        className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                            result.ok
                                ? 'border-success/30 bg-success/5 text-flex-text-primary'
                                : 'border-destructive/30 bg-destructive/5 text-destructive'
                        }`}
                    >
                        {result.ok ? (
                            <RiCheckboxCircleLine className="size-4 text-success shrink-0 mt-0.5" />
                        ) : (
                            <RiCloseCircleLine className="size-4 text-destructive shrink-0 mt-0.5" />
                        )}
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold">{result.ok ? 'Email Dispatched' : 'Send Failed'}</span>
                            <span className="text-[11px] text-flex-text-muted">{result.message}</span>
                            {result.messageId && (
                                <span className="text-[10px] text-flex-text-muted font-mono mt-1">
                                    Message ID: {result.messageId}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSend} className="flex flex-col sm:flex-row items-end gap-2">
                    <div className="flex flex-col gap-1.5 flex-1 w-full">
                        <Label htmlFor="test-recipient" className="text-xs font-semibold">
                            Recipient Address
                        </Label>
                        <Input
                            id="test-recipient"
                            type="email"
                            placeholder="admin@example.com"
                            value={recipient}
                            onChange={(e) => {
                                setRecipient(e.target.value);
                                setError(undefined);
                            }}
                            className="h-9 text-xs"
                        />
                        {error && <p className="text-[11px] text-destructive">{error}</p>}
                    </div>

                    <Button
                        type="submit"
                        size="sm"
                        disabled={isSending}
                        className="gap-1.5 text-xs h-9 w-full sm:w-auto"
                    >
                        {isSending ? (
                            <RiLoader4Line className="size-3.5 animate-spin" />
                        ) : (
                            <RiMailSendLine className="size-3.5" />
                        )}
                        {isSending ? 'Dispatching...' : 'Send Test Email'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

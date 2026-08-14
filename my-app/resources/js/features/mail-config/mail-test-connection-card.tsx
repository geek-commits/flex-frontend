import {
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiExchangeLine,
    RiLoader4Line,
} from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TestConnectionResult } from '@/domain/mail-types';

export interface MailTestConnectionCardProps {
    isTesting: boolean;
    result: TestConnectionResult | null;
    onTest: () => void;
}

export function MailTestConnectionCard({
    isTesting,
    result,
    onTest,
}: MailTestConnectionCardProps) {
    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Test Connection</CardTitle>
                <CardDescription className="text-xs">
                    Verify socket handshake, SSL/TLS negotiation, and credentials without sending an email.
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
                            <span className="font-semibold">{result.ok ? 'Connection Verified' : 'Connection Failed'}</span>
                            <span className="text-[11px] text-flex-text-muted">{result.message}</span>
                            {result.latencyMs && (
                                <span className="text-[10px] text-flex-text-muted font-mono mt-1">
                                    Latency: {result.latencyMs}ms
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isTesting}
                    onClick={onTest}
                    className="gap-1.5 text-xs h-9 w-full sm:w-auto self-start"
                >
                    {isTesting ? (
                        <RiLoader4Line className="size-3.5 animate-spin" />
                    ) : (
                        <RiExchangeLine className="size-3.5" />
                    )}
                    {isTesting ? 'Verifying Handshake...' : 'Run Test Connection'}
                </Button>
            </CardContent>
        </Card>
    );
}

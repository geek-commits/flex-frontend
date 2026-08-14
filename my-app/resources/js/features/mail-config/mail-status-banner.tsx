import {
    RiAlertLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiInformationLine,
    RiLoader4Line,
} from '@remixicon/react';
import React from 'react';
import type { MailConfigRecord } from '@/domain/mail-types';

export interface MailStatusBannerProps {
    config: MailConfigRecord;
}

export function MailStatusBanner({ config }: MailStatusBannerProps) {
    const { status, active, lastTestedAt, lastTestError } = config;

    if (status === 'testing') {
        return (
            <div className="flex items-center gap-3 p-3.5 rounded-lg border border-info/30 bg-info/5 text-xs text-flex-text-primary">
                <RiLoader4Line className="size-4 text-info animate-spin shrink-0" />
                <span className="font-medium">Testing SMTP server connectivity...</span>
            </div>
        );
    }

    if (!active) {
        return (
            <div className="flex items-center gap-3 p-3.5 rounded-lg border border-muted bg-muted/20 text-xs text-flex-text-muted">
                <RiInformationLine className="size-4 shrink-0" />
                <span>
                    Mail delivery is currently <span className="font-semibold text-flex-text-primary">Disabled</span>. System notifications will not be sent.
                </span>
            </div>
        );
    }

    if (status === 'connected') {
        return (
            <div className="flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-success/30 bg-success/5 text-xs text-flex-text-primary">
                <div className="flex items-center gap-2.5">
                    <RiCheckboxCircleLine className="size-4 text-success shrink-0" />
                    <div>
                        <span className="font-semibold text-success">Mail Server Connected & Active</span>
                        <span className="text-flex-text-muted ml-2">
                            Ready for automated subscription reminders, agent alerts, and reports.
                        </span>
                    </div>
                </div>
                {lastTestedAt && (
                    <span className="text-[11px] text-flex-text-muted shrink-0">
                        Verified {new Date(lastTestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-destructive/30 bg-destructive/5 text-xs text-flex-text-primary">
                <div className="flex items-start gap-2.5">
                    <RiCloseCircleLine className="size-4 text-destructive shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-destructive">Connection Failed</span>
                        <span className="text-flex-text-muted">
                            {lastTestError || 'Could not connect to the configured SMTP server.'}
                        </span>
                    </div>
                </div>
                {lastTestedAt && (
                    <span className="text-[11px] text-flex-text-muted shrink-0">
                        Tested {new Date(lastTestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 p-3.5 rounded-lg border border-warning/30 bg-warning/5 text-xs text-flex-text-primary">
            <RiAlertLine className="size-4 text-warning shrink-0" />
            <span>
                SMTP Configuration has not been tested. Run <span className="font-semibold">Test Connection</span> to verify deliverability.
            </span>
        </div>
    );
}

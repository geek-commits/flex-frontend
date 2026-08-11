import { RiDatabase2Line, RiExternalLinkLine, RiRefreshLine, RiShieldKeyholeLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCrmIntegrationState } from './crm-integration-state';

export interface CrmIntegrationHostProps {
    title?: string;
    mockConfigPath?: string;
}

/**
 * Host-owned UI around the frozen external iframe boundary.
 *
 * The iframe content is NOT designed or recreated here. Until real integration,
 * the host reads an isolated synthetic mock JSON (public/mocks/integrations/*.json)
 * for host/integration state only, driven by the integration-state owner
 * (AGENT_WORKSPACE_PLAN §4, §16). No external API, auth/token exchange,
 * postMessage protocol, or production URL is fabricated.
 */
export function CrmIntegrationHost({
    title = 'Customer Workspace',
    mockConfigPath = '/mocks/integrations/crm-primary.json',
}: CrmIntegrationHostProps) {
    const { status, config, frameKey, retry, handleFrameLoad, handleFrameError } =
        useCrmIntegrationState(mockConfigPath);
    const effectiveSrc = config?.iframeConfig?.src ?? null;
    const chip =
        status === 'mock' ? 'Mock integration' : status === 'connected' ? 'Connected' : null;
    const showFrame =
        config !== null &&
        (status === 'loading' || status === 'mock' || status === 'connected');

    return (
        <Card className="flex flex-col h-full bg-card border-border overflow-hidden shadow-2xs relative">
            {/* Embedded Boundary Header */}
            <div className="h-10 px-3 border-b border-border bg-muted/30 flex items-center justify-between shrink-0 select-none text-xs">
                <div className="flex items-center gap-2 text-muted-foreground font-medium truncate">
                    <RiShieldKeyholeLine className="size-3.5 text-primary" />
                    <span className="truncate font-semibold text-foreground">{title}</span>
                    <span className="px-1.5 py-px text-[9px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                        Integration Boundary
                    </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {effectiveSrc && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Open in new window"
                            onClick={() => window.open(effectiveSrc, '_blank')}
                        >
                            <RiExternalLinkLine className="size-3.5" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon-xs" title="Reload Frame" onClick={retry}>
                        <RiRefreshLine className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* Mock host state line */}
            <div className="h-7 px-3 border-b border-border bg-muted/10 flex items-center gap-2 text-[10px] text-muted-foreground select-none overflow-hidden">
                <RiDatabase2Line className="size-3 shrink-0" />
                <span className="truncate">
                    External CRM
                    {config?.integrationId && (
                        <span className="ml-1 font-mono text-muted-foreground/60">
                            {config.integrationId}
                        </span>
                    )}
                </span>
                {chip && (
                    <span className="px-1 py-px rounded bg-muted text-muted-foreground uppercase font-semibold shrink-0">
                        {chip}
                    </span>
                )}
                {config?.version && (
                    <span className="hidden sm:inline font-mono text-muted-foreground/60">
                        v{config.version}
                    </span>
                )}
                <span className="ml-auto hidden lg:inline truncate text-muted-foreground/70">
                    {config?.vendor}
                </span>
            </div>

            {/* Iframe Viewport Area */}
            <div className="flex-1 relative bg-background min-h-[400px]">
                {(status === 'loading' || status === 'retrying') && (
                    <div
                        role="status"
                        className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs z-10 text-xs text-muted-foreground gap-2"
                    >
                        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>
                            {status === 'loading'
                                ? 'Loading integration workspace...'
                                : 'Reconnecting integration workspace...'}
                        </span>
                    </div>
                )}

                {status === 'configuration-missing' && (
                    <div
                        role="alert"
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground gap-3"
                    >
                        <p className="font-semibold text-foreground text-sm">Configuration Missing</p>
                        <p className="max-w-md">
                            External CRM integration configuration was not found. Retry the connection or
                            supply public/mocks/integrations/crm-primary.json. The Call Manager remains
                            available.
                        </p>
                        <Button variant="outline" size="sm" onClick={retry}>
                            Retry Connection
                        </Button>
                    </div>
                )}

                {status === 'unavailable' && (
                    <div
                        role="alert"
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground gap-3"
                    >
                        <p className="font-semibold text-foreground text-sm">External Host Unavailable</p>
                        <p className="max-w-md">
                            The external CRM host could not be reached. Telephony and the Call Manager keep
                            working independently.
                        </p>
                        <Button variant="outline" size="sm" onClick={retry}>
                            Retry Connection
                        </Button>
                    </div>
                )}

                {showFrame && (
                    <iframe
                        key={frameKey}
                        src={effectiveSrc || 'about:blank'}
                        title={title}
                        sandbox={config?.iframeConfig?.sandbox}
                        allow={config?.iframeConfig?.allow}
                        referrerPolicy={
                            config?.iframeConfig?.referrerPolicy as React.HTMLAttributeReferrerPolicy | undefined
                        }
                        className="w-full h-full border-0"
                        onLoad={handleFrameLoad}
                        onError={handleFrameError}
                    />
                )}
            </div>
        </Card>
    );
}

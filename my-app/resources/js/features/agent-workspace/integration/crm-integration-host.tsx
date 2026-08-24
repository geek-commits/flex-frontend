import {
    RiExternalLinkLine,
    RiInformationLine,
    RiRefreshLine,
    RiShieldKeyholeLine,
} from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';
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
    const metadata = [
        { label: 'Integration ID', value: config?.integrationId, mono: true },
        { label: 'Version', value: config?.version, mono: true },
        { label: 'Vendor', value: config?.vendor, mono: false },
    ].filter((item): item is { label: string; value: string; mono: boolean } => Boolean(item.value));
    const showFrame =
        config !== null &&
        (status === 'loading' || status === 'mock' || status === 'connected');

    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            {/* Embedded Boundary Header */}
            <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-flex-workspace-divider bg-flex-workspace-surface-muted px-3 text-xs select-none">
                <div className="flex items-center gap-2 text-muted-foreground font-medium truncate">
                    <RiShieldKeyholeLine className="size-3.5 text-primary" />
                    <span className="truncate font-semibold text-foreground">{title}</span>
                    {chip && (
                        <span className="shrink-0 rounded bg-muted px-1 py-px text-[10px] font-semibold uppercase text-muted-foreground">
                            {chip}
                        </span>
                    )}
                    <span className="px-1.5 py-px text-[9px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                        Integration Boundary
                    </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {metadata.length > 0 && (
                        <Popover>
                            <PopoverTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        aria-label="Integration details"
                                    >
                                        <RiInformationLine className="size-3.5" />
                                    </Button>
                                }
                            />
                            <PopoverContent align="end" className="w-64 gap-2 p-3 text-xs">
                                <PopoverTitle className="text-sm font-semibold">
                                    Integration boundary
                                </PopoverTitle>
                                <PopoverDescription>
                                    FLEX owns the boundary. CRM content remains external and
                                    isolated.
                                </PopoverDescription>

                                <dl className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-2 gap-y-1 pt-1">
                                    {metadata.map((item) => (
                                        <React.Fragment key={item.label}>
                                            <dt className="font-medium uppercase text-muted-foreground">
                                                {item.label}
                                            </dt>
                                            <dd
                                                className={`min-w-0 truncate ${item.mono ? 'font-mono' : ''} text-foreground`}
                                            >
                                                {item.value}
                                            </dd>
                                        </React.Fragment>
                                    ))}
                                </dl>
                            </PopoverContent>
                        </Popover>
                    )}

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

            {/* Iframe Viewport Area */}
            <div className="relative min-h-[400px] flex-1 bg-flex-workspace-surface-muted">
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
        </div>
    );
}

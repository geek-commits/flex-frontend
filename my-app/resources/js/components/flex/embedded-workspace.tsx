import { RiRefreshLine, RiExternalLinkLine, RiShieldKeyholeLine, RiDatabase2Line } from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface EmbeddedWorkspaceProps {
    src?: string;
    title?: string;
    mockConfigPath?: string;
    allowFullscreen?: boolean;
}

interface IntegrationMockConfig {
    integrationId?: string;
    type?: string;
    vendor?: string;
    version?: string;
    mode?: string;
    iframeConfig?: {
        src?: string | null;
        sandbox?: string;
        allow?: string;
        referrerPolicy?: string;
    };
}

/**
 * Host-owned UI around the frozen external iframe boundary.
 *
 * The iframe content is NOT designed or recreated here. Until real integration,
 * the host reads an isolated synthetic mock JSON (public/mocks/integrations/*.json)
 * for host/integration state only. No external API, auth/token exchange,
 * postMessage protocol, or production URL is fabricated.
 */
export function EmbeddedWorkspace({
    src,
    title = 'External CRM / Embedded Workspace Integration',
    mockConfigPath = '/mocks/integrations/crm-primary.json',
    allowFullscreen = true,
}: EmbeddedWorkspaceProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [key, setKey] = useState(0);
    const [config, setConfig] = useState<IntegrationMockConfig | null>(null);

    useEffect(() => {
        let active = true;

        fetch(mockConfigPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('mock config not found');
                }

                return response.json() as Promise<IntegrationMockConfig>;
            })
            .then((data) => {
                if (active) {
                    setConfig(data);
                }
            })
            .catch(() => {
                if (active) {
                    setHasError(true);
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [mockConfigPath, key]);

    const handleReload = () => {
        setIsLoading(true);
        setHasError(false);
        setConfig(null);
        setKey((prev) => prev + 1);
    };

    const effectiveSrc = src ?? config?.iframeConfig?.src ?? null;
    const mode = config?.mode ?? 'mock';

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
                    {effectiveSrc && allowFullscreen && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Open in new window"
                            onClick={() => window.open(effectiveSrc, '_blank')}
                        >
                            <RiExternalLinkLine className="size-3.5" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon-xs" title="Reload Frame" onClick={handleReload}>
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
                        <span className="ml-1 font-mono text-muted-foreground/60">{config.integrationId}</span>
                    )}
                </span>
                <span className="px-1 py-px rounded bg-muted text-muted-foreground uppercase font-semibold shrink-0">
                    {mode === 'mock' ? 'Mock integration' : 'Connected'}
                </span>
                {config?.version && <span className="hidden sm:inline font-mono text-muted-foreground/60">v{config.version}</span>}
                <span className="ml-auto hidden lg:inline truncate text-muted-foreground/70">{config?.vendor}</span>
            </div>

            {/* Iframe Viewport Area */}
            <div className="flex-1 relative bg-background min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs z-10 text-xs text-muted-foreground gap-2">
                        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Loading integration workspace...</span>
                    </div>
                )}

                {!isLoading && hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground gap-3">
                        <p className="font-semibold text-foreground text-sm">Integration Host Boundary Active</p>
                        <p className="max-w-md">
                            External CRM integration workspace is configured via host adapter contract. Mock config not
                            found — retry connection or supply `public/mocks/integrations/crm-primary.json`.
                        </p>
                        <Button variant="outline" size="sm" onClick={handleReload}>
                            Retry Connection
                        </Button>
                    </div>
                ) : (
                    <iframe
                        key={key}
                        src={effectiveSrc || 'about:blank'}
                        title={title}
                        sandbox={config?.iframeConfig?.sandbox}
                        allow={config?.iframeConfig?.allow}
                        referrerPolicy={config?.iframeConfig?.referrerPolicy as React.HTMLAttributeReferrerPolicy | undefined}
                        className="w-full h-full border-0"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                )}
            </div>
        </Card>
    );
}

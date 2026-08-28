import { RiExternalLinkLine, RiRefreshLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useExternalWorkspaceState } from './use-external-workspace-state';

export interface ExternalWorkspaceHostProps {
    title: string;
    configPath: string;
    className?: string;
    chrome?: 'full' | 'none';
}

export function ExternalWorkspaceHost({ title, configPath, className, chrome = 'full' }: ExternalWorkspaceHostProps) {
    const { t } = useTranslation('common');
    const { status, config, frameKey, retry, handleFrameLoad, handleFrameError } = useExternalWorkspaceState(configPath);
    const effectiveSrc = config?.iframeConfig?.src ?? null;
    const showFrame = config !== null && (status === 'loading' || status === 'mock' || status === 'connected' || status === 'loaded');

    return (
        <div className={`flex h-full min-h-0 flex-col overflow-hidden bg-background ${className ?? ''}`}>
            {/* Toolbar — minimal, operational (hidden when chrome="none" for old-version parity) */}
            {chrome !== 'none' && (
                <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-flex-workspace-divider bg-flex-workspace-surface px-3">
                    <h2 className="truncate text-sm font-semibold text-flex-text-primary">{title}</h2>
                    <div className="flex items-center gap-1">
                        {effectiveSrc && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={t('common:actions.openExternally', 'Open externally')}
                                onClick={() => window.open(effectiveSrc, '_blank', 'noopener,noreferrer')}
                            >
                                <RiExternalLinkLine className="size-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon-sm" aria-label={t('common:actions.refresh', 'Reload')} onClick={retry}>
                            <RiRefreshLine className="size-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Viewport — full-bleed: relative min-h-0 + absolute inset-0 iframe */}
            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-flex-workspace-surface-muted">
                {(status === 'loading' || status === 'retrying') && (
                    <div role="status" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm px-4 text-center">
                        <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
                        <span className="text-xs text-flex-text-muted">
                            {status === 'loading' ? t('common:status.loading', 'Loading workspace...') : t('common:status.reconnecting', 'Reconnecting workspace...')}
                        </span>
                    </div>
                )}

                {status === 'configuration-missing' && (
                    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                        <p className="text-sm font-medium text-flex-text-primary">{t('common:status.configurationMissing')}</p>
                        <p className="max-w-md text-xs text-flex-text-muted">{configPath} {t('common:status.configurationMissingDescription')}</p>
                        <Button onClick={retry} size="sm">
                            {t('common:actions.retry')}
                        </Button>
                    </div>
                )}

                {status === 'unavailable' && (
                    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                        <p className="text-sm font-medium text-flex-text-primary">{t('common:status.unavailable', 'Workspace unavailable')}</p>
                        <p className="max-w-md text-xs text-flex-text-muted">{t('common:status.unavailableDescription', 'External workspace is unavailable. Telephony and Call Manager keep working independently.')}</p>
                        <div className="flex items-center gap-2">
                            {effectiveSrc && (
                                <Button variant="outline" size="sm" onClick={() => window.open(effectiveSrc, '_blank', 'noopener,noreferrer')}>
                                    {t('common:actions.openExternally', 'Open externally')}
                                </Button>
                            )}
                            <Button onClick={retry} size="sm">
                                {t('common:actions.retry', 'Retry')}
                            </Button>
                        </div>
                    </div>
                )}

                {showFrame && (
                    <iframe
                        key={frameKey}
                        src={effectiveSrc || 'about:blank'}
                        title={title}
                        sandbox={config?.iframeConfig?.sandbox}
                        allow={config?.iframeConfig?.allow}
                        referrerPolicy={(config?.iframeConfig?.referrerPolicy as React.IframeHTMLAttributes<HTMLIFrameElement>['referrerPolicy']) ?? 'strict-origin-when-cross-origin'}
                        className="absolute inset-0 block h-full w-full border-0"
                        onLoad={handleFrameLoad}
                        onError={handleFrameError}
                    />
                )}
            </div>
        </div>
    );
}

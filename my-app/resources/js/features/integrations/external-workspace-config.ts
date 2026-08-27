export type ExternalWorkspaceConnectionState = 'connected' | 'unavailable';

export interface ExternalWorkspaceConfig {
    integrationId?: string;
    type?: 'crm' | 'social';
    vendor?: string;
    version?: string;
    mode?: string;
    connection?: ExternalWorkspaceConnectionState;
    iframeConfig?: {
        src?: string | null;
        sandbox?: string;
        allow?: string;
        referrerPolicy?: string;
    };
}

export function hasExternalSrc(config: ExternalWorkspaceConfig | null | undefined): boolean {
    return Boolean(config?.iframeConfig?.src);
}

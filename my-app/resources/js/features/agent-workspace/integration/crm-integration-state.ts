import { useCallback, useEffect, useRef, useState } from 'react';
import { hasExternalSrc } from './crm-host-config';
import type { CrmHostConfig } from './crm-host-config';

/** CRM integration host feedback states (AGENT_WORKSPACE_PLAN §16). */
export type CrmIntegrationStatus =
    | 'loading'
    | 'connected'
    | 'unavailable'
    | 'retrying'
    | 'mock'
    | 'configuration-missing';

export interface CrmIntegrationState {
    status: CrmIntegrationStatus;
    config: CrmHostConfig | null;
    /** Bumped on each successful config load to remount the iframe. */
    frameKey: number;
    /** Refetch config + reload frame (initial load is not a retry). */
    retry: () => void;
    handleFrameLoad: () => void;
    handleFrameError: () => void;
}

async function fetchCrmConfig(path: string): Promise<CrmHostConfig> {
    const response = await fetch(path, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('mock config not found');
    }

    return response.json() as Promise<CrmHostConfig>;
}

/** Maps a loaded config onto the host status (config connection state is §4-sanctioned). */
function resolveStatus(data: CrmHostConfig): CrmIntegrationStatus {
    if (data.connection === 'unavailable') {
        return 'unavailable';
    }

    return hasExternalSrc(data) ? 'loading' : 'mock';
}

/**
 * Integration-state owner for the frozen external CRM boundary.
 *
 * Loads the isolated mock config; maps fetch/frame outcomes onto the §16
 * states. Retry is a real recovery path (refetch + frame reload). No external
 * API, auth/token exchange, or postMessage protocol is invented here.
 */
export function useCrmIntegrationState(mockConfigPath: string): CrmIntegrationState {
    const [status, setStatus] = useState<CrmIntegrationStatus>('loading');
    const [config, setConfig] = useState<CrmHostConfig | null>(null);
    const [frameKey, setFrameKey] = useState(0);
    const activeRef = useRef(true);

    const applyConfig = useCallback((data: CrmHostConfig) => {
        setConfig(data);
        setFrameKey((key) => key + 1);
        setStatus(resolveStatus(data));
    }, []);

    const applyMissing = useCallback(() => {
        setConfig(null);
        setStatus('configuration-missing');
    }, []);

    useEffect(() => {
        activeRef.current = true;

        fetchCrmConfig(mockConfigPath)
            .then((data) => {
                if (activeRef.current) {
                    applyConfig(data);
                }
            })
            .catch(() => {
                if (activeRef.current) {
                    applyMissing();
                }
            });

        return () => {
            activeRef.current = false;
        };
    }, [mockConfigPath, applyConfig, applyMissing]);

    const retry = useCallback(() => {
        setStatus('retrying');

        fetchCrmConfig(mockConfigPath)
            .then((data) => applyConfig(data))
            .catch(() => applyMissing());
    }, [mockConfigPath, applyConfig, applyMissing]);

    const handleFrameLoad = useCallback(() => {
        setStatus((prev) => (prev === 'loading' ? 'connected' : prev));
    }, []);

    const handleFrameError = useCallback(() => {
        setStatus((prev) => (prev === 'loading' ? 'unavailable' : prev));
    }, []);

    return { status, config, frameKey, retry, handleFrameLoad, handleFrameError };
}

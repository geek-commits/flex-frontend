import { useCallback, useEffect, useRef, useState } from 'react';
import { hasExternalSrc  } from './external-workspace-config';
import type {ExternalWorkspaceConfig} from './external-workspace-config';

export type ExternalWorkspaceStatus =
    | 'loading'
    | 'connected'
    | 'unavailable'
    | 'retrying'
    | 'mock'
    | 'configuration-missing';

export interface ExternalWorkspaceState {
    status: ExternalWorkspaceStatus;
    config: ExternalWorkspaceConfig | null;
    frameKey: number;
    retry: () => void;
    handleFrameLoad: () => void;
    handleFrameError: () => void;
}

async function fetchConfig(path: string): Promise<ExternalWorkspaceConfig> {
    const response = await fetch(path, { cache: 'no-store' });

    if (!response.ok) {
throw new Error('config not found');
}

    return (await response.json()) as ExternalWorkspaceConfig;
}

function resolveStatus(data: ExternalWorkspaceConfig): ExternalWorkspaceStatus {
    if (data.connection === 'unavailable') {
return 'unavailable';
}

    return hasExternalSrc(data) ? 'loading' : 'mock';
}

export function useExternalWorkspaceState(configPath: string): ExternalWorkspaceState {
    const [status, setStatus] = useState<ExternalWorkspaceStatus>('loading');
    const [config, setConfig] = useState<ExternalWorkspaceConfig | null>(null);
    const [frameKey, setFrameKey] = useState(0);
    const activeRef = useRef(true);

    const applyConfig = useCallback(
        (data: ExternalWorkspaceConfig) => {
            setConfig(data);
            setFrameKey((k) => k + 1);
            setStatus(resolveStatus(data));
        },
        [],
    );

    const applyMissing = useCallback(() => {
        setConfig(null);
        setStatus('configuration-missing');
    }, []);

    useEffect(() => {
        activeRef.current = true;
        fetchConfig(configPath)
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
    }, [configPath, applyConfig, applyMissing]);

    const retry = useCallback(() => {
        setStatus('retrying');
        fetchConfig(configPath)
            .then((data) => applyConfig(data))
            .catch(() => applyMissing());
    }, [configPath, applyConfig, applyMissing]);

    const handleFrameLoad = useCallback(() => {
        setStatus((prev) => (prev === 'loading' ? 'connected' : prev));
    }, []);

    const handleFrameError = useCallback(() => {
        setStatus((prev) => (prev === 'loading' ? 'unavailable' : prev));
    }, []);

    return { status, config, frameKey, retry, handleFrameLoad, handleFrameError };
}

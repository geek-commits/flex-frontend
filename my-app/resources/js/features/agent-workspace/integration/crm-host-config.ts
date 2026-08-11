/**
 * Host-side CRM integration configuration (isolated mock boundary).
 *
 * The host consumes host/integration metadata only — never CRM content or
 * external-system APIs. The JSON lives at public/mocks/integrations/*.json
 * (AGENT_WORKSPACE_PLAN §4). `mockContent` and `hostBridge` in the file are
 * intentionally NOT modeled here: the host does not render CRM content and
 * does not implement any postMessage protocol.
 *
 * `connection` mirrors the §4 "connection state" the mock/config may describe;
 * until the real adapter exists it is the deterministic host-reachability
 * signal (Chrome does not reliably fire iframe `error` for failed loads).
 */
export type CrmHostConnectionState = 'connected' | 'unavailable';

export interface CrmHostConfig {
    integrationId?: string;
    type?: string;
    vendor?: string;
    version?: string;
    mode?: string;
    connection?: CrmHostConnectionState;
    iframeConfig?: {
        src?: string | null;
        sandbox?: string;
        allow?: string;
        referrerPolicy?: string;
    };
}

/** True when the integration points at a real external host (not about:blank). */
export function hasExternalSrc(config: CrmHostConfig | null): boolean {
    return Boolean(config?.iframeConfig?.src);
}

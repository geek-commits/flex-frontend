/**
 * @deprecated DEPRECATED: canonical is ExternalWorkspaceHost at features/integrations/external-workspace-config.ts, not mounted in production, pending deletion after tests.
 * This file is dead code — only imported by the deprecated crm-integration-state.ts.
 * Canonical type is ExternalWorkspaceConfig (features/integrations/external-workspace-config.ts).
 * Retained for tests only; do not add new usages.
 *
 * Host-side CRM integration configuration (isolated mock boundary) — legacy mock variant.
 *
 * The host consumes host/integration metadata only — never CRM content or
 * external-system APIs. The JSON this legacy host read lived at public/mocks/integrations/*.json
 * (AGENT_WORKSPACE_PLAN §4) — that path is now test-only; production reads public/integrations/*.json
 * with a real external URL (e.g. https://demo-crm.flex.co.tz/login) via the canonical ExternalWorkspaceHost.
 * `mockContent` and `hostBridge` in the mock file are intentionally NOT modeled here: the host does not
 * render CRM content and does not implement any postMessage protocol.
 *
 * `connection` mirrors the §4 "connection state" the mock/config may describe; it is the deterministic
 * host-reachability signal (Chrome does not reliably fire iframe `error` for failed loads).
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

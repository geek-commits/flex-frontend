/**
 * Lightweight frontend observability emitter — Increment 2 scaffolding.
 * No sensitive payloads (§11, §14, §34). Safe to no-op in POC.
 */

export type ObservabilitySeverity = 'info' | 'warn' | 'error';

export interface ObservabilityEvent {
    event_name: string;
    feature: string;
    severity: ObservabilitySeverity;
    route?: string;
    operation?: string;
    status?: string;
    duration_ms?: number;
    error_code?: string;
    tenant_id?: string; // masked/safe identifier only
    session_id?: string;
    timestamp?: string;
    correlation_id?: string;
}

type Emitter = (event: ObservabilityEvent) => void;

let emitter: Emitter | null = null;

export function setObservabilityEmitter(next: Emitter | null): void {
    emitter = next;
}

export function emitObservability(event: ObservabilityEvent): void {
    const enriched: ObservabilityEvent = {
        timestamp: new Date().toISOString(),
        ...event,
    };

    if (emitter) {
        try {
            emitter(enriched);
        } catch {
            // emitter must never throw into UI
        }
    }

    // POC fallback: console for diagnostics without sensitive payloads
    if (import.meta.env.DEV) {
        // keep quiet in prod; dev-only trace
         
        console.debug('[observe]', enriched.event_name, enriched.feature, enriched.status ?? '');
    }
}

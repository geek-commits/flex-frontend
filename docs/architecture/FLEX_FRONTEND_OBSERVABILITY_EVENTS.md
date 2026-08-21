# FLEX Frontend Observability Events — Increment 2 Scaffolding

> **Increment:** 2 — scaffolding only; full instrumentation in Increments 3–4. No sensitive payloads (§11, §14).

## Event model (hardening §11)

```ts
ObservabilityEvent {
  event_name, feature, severity: 'info'|'warn'|'error',
  route, operation, status, duration_ms, error_code,
  tenant_id (masked), session_id,
  correlation_id, timestamp
}
```

Implementation: `resources/js/lib/observability.ts` (`emitObservability`, `setObservabilityEmitter`).

## High-risk event catalogue (Increment 2 intent → Increments 3–4 wire-up)

| Event | Feature | Severity | When |
|---|---|---|---|
| `connection_lost` / `connection_restored` | telephony | warn/info | `workspaceState.connection` `live → disconnected/reconnecting` |
| `call_command_failed` | telephony | error | `dial/answer/hold/transfer` guard failure |
| `call_state_desync_detected` | telephony | error | state derivation mismatch |
| `conference_command_failed` | conference | error | conference mutation failure |
| `assist_session_start_failed` | assist | error | `isAssistEligible` → start failed |
| `transcript_stream_stalled` | assist | warn | interim stall |
| `assist_reconnect_failed` | assist | error | stream reconnect |
| `message_send_failed` | social | error | `socialRepository.sendReply` failure |
| `social_realtime_disconnect` / `reconnect` | social | warn/info | once transport exists |
| `conversation_load_failed` | social | error | `getMessages` failure |
| `iframe_load_failed` / `iframe_timeout` | crm integration | error | `crm-integration-host` |
| `tenant_switch` / `tenant_switch_failed` | tenant | info/error | `enterTenant/returnToPlatform` + ADR-002 invalidator |
| `route_load_failed` | shell | error | Inertia `networkError/httpException` boundary |

## Privacy (§34)

Never emit: `transcript text`, `message body`, `password`, `auth token`, `recording token`, full customer content. Use masked identifiers.

## Error model (§28)

`resources/js/lib/errors.ts` — `FlexError {type, code, message, retryable, correlationId, cause}` + `normalizeError()` + `isRetryable()`. Route/feature/call-critical boundaries preserve `correlationId` for support triage (Increment 4).

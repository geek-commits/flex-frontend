# CALL MANAGER PARITY MAP

Parity map of the documented FLEX softphone controls (`Flex CC User Manual`) against the current POC runtime, per the call-scoped modernization plan §2/§92. This records the **truth** of what exists so the Call Manager never fabricates controls the runtime cannot back.

## Control inventory

| # | Documented control | Runtime evidence | Status | Notes |
|---|---|---|---|---|
| 1 | **Mute / Unmute** | `active-call-surface.tsx` | ✓ PRESENT | `onToggleMute`, gated to `connected`/`hold` |
| 2 | **Hold / Resume** | `active-call-surface.tsx` | ✓ PRESENT | `onToggleHold`, gated to `connected`/`hold` |
| 3 | **Show Key Pad** | — | ✗ MISSING | Dialer (`dialer.tsx`) is **outbound-initiation only**; no in-call DTMF pad exists |
| 4 | **Transfer Call** | `transfer panel` + `transfer-targets.ts` | ✓ PRESENT (direct only) | `transfer` flow; ends the agent's call with the customer |
| 5 | **Conference Call** | — | ✗ MISSING | No SDK/backend/consultation/merge state (see `CONFERENCE_IMPLEMENTATION_AUDIT.md`) |
| 6 | **Settings** | — | ✗ MISSING | No call/softphone settings surface |
| 7 | **End Call** | `active-call-surface.tsx` | ✓ PRESENT | `onEnd`, destructive |
| 8 | **Assist** (Call Manager control) | — | ✗ MISSING (UI added, no runtime) | Documented in the Call Manager; no assist runtime (see `AGENT_ASSIST_RUNTIME_AUDIT.md`) |
| 9 | **Warm Transfer** | — | ✗ MISSING | Recorded `NEEDS_PRODUCT_DECISION` (AGENT-CALL-011) — no consultation state |

## Summary

- **Present:** Mute, Hold, Transfer (direct), End.
- **Documented but missing (parity defects):** Show Key Pad, Conference Call, Settings, Assist, Warm Transfer.
- The active-call surface renders only Mute / Hold / Transfer / End today. No dead controls are added; missing documented behavior is recorded as parity defects and left absent from the UI.
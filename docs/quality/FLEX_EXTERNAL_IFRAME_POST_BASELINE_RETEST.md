# FLEX External Iframe — Post-Baseline Retest (2026-08-28)

**Branch:** `main` @ `dfd76e7` (post canonical UI baseline, lint PASS)
**Parent origin retest:** `http://localhost:8000` (APP_URL) and production `https://cc.flex.co.tz` (frame-ancestors must include both)
**Command:** `curl -I https://demo-crm.flex.co.tz/login` and `https://demo-chat.flex.co.tz/login` (Disable cache, Preserve log)

## CRM Retest
```
HTTP/1.1 200 OK
Content-Security-Policy: frame-ancestors self https://demo-chat.flex.co.tz https://demo-crm.flex.co.tz https://cc.flex.co.tz https://devcc.flex.co.tz; object-src *
X-Frame-Options: SAMEORIGIN
```
- **Result:** Still `SAMEORIGIN` — **BLOCKED**. Browser will refuse `http://localhost:8000` and `https://cc.flex.co.tz` embed (same as 2026-08-28T12:26Z).
- **Required Apache fix (effective layer: Apache vhost per Server: Apache):**
```apache
# REMOVE
Header always set X-Frame-Options "SAMEORIGIN"
# SET canonical (dev/demo)
Header always set Content-Security-Policy "frame-ancestors 'self' https://cc.flex.co.tz https://devcc.flex.co.tz https://flxcc.flex.co.tz https://demo-crm.flex.co.tz https://demo-chat.flex.co.tz http://localhost:8000 http://localhost:5173; object-src *"
```

## Social Retest
```
HTTP/1.1 200 OK
X-Frame-Options: cc.flex.co.tz
Content-Security-Policy: object-src *; frame-ancestors 'self' https://demo-chat.flex.co.tz https://demo-crm.flex.co.tz https://cc.flex.co.tz https://flxcc.flex.co.tz https://devcc.flex.co.tz
```
- **Result:** Still invalid `X-Frame-Options: cc.flex.co.tz` — **BLOCKED** (browser may ignore vs treat as DENY; observed failed-document).
- **Required fix:**
```apache
Header always unset X-Frame-Options
# Keep CSP as above (already allows cc.flex.co.tz etc; add localhost for dev if needed)
```

## Login/Session Verification (pending server deploy)
- After header fix, hard reload (Disable cache) and verify:
  - `/agent` shows actual CRM login UI inside `ExternalWorkspaceHost` iframe (not "refused to connect")
  - `/agent/social` shows actual Social login UI
  - Console zero `Refused to display ... in a frame`
  - Network iframe document 200, `X-Frame-Options` absent, CSP `frame-ancestors` includes parent
  - Login inside iframe: CSRF accepted, `Set-Cookie: demo_crm_session` `Secure` `SameSite=Lax` (check `Network → Cookies` blocked reason; may need `SameSite=None; Secure` for cross-site iframe post-fix), redirect stays in iframe, authenticated UI renders, reload preserves session.

## Iframe Stability (post-fix to be measured)
- `frameKey` bumps only on `fetchConfig` success or explicit Reload; locale switch, Global Search, sidebar, Call Manager timer, Assist updates must **not** reload frame. Record `iframe document request count` =1 for `FLEX_RUNTIME_PERFORMANCE...:19` baseline.

**Status:** `CRM: BLOCKED — EXTERNAL SERVER FRAME POLICY` / `Social: BLOCKED — EXTERNAL SERVER FRAME POLICY` — no frontend `ExternalWorkspaceHost` change required (sandbox sufficient per mission §6). Phase E iframe stability assertions will remain BLOCKED until deploy.

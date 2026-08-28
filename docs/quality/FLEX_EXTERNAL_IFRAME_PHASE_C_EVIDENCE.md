# FLEX External Iframe Phase C — Browser/Server Evidence

**Plan:** `FLEX_EXTERNAL_IFRAME_BROWSER_SERVER_STABILIZATION_PLAN.md` (Phase C)  
**Branch:** `main` @ `e17d8fa8030440ba3f50fe2e9983b4a4d3152a3b` (2026-08-28T12:26Z re-checked)  
**Parent origins:** `http://localhost:8000` (APP_URL local), production `https://cc.flex.co.tz`, `https://devcc.flex.co.tz`, `https://flxcc.flex.co.tz` — `location.origin` to be confirmed in live Chrome DevTools Console per mission §1.

## Frontend Truth
- `my-app/resources/js/features/integrations/external-workspace-host.tsx:80-90` renders `<iframe sandbox="allow-same-origin allow-scripts allow-forms allow-popups" referrerPolicy="strict-origin-when-cross-origin">`
- `my-app/public/integrations/crm-primary.json:9` → `https://demo-crm.flex.co.tz/login`
- `my-app/public/integrations/social-primary.json:9` → `https://demo-chat.flex.co.tz/login`
- Sandbox is sufficient for server-rendered login flow — **do NOT remove** (mission §6).
- No forbidden workaround in repo (no `dangerouslySetInnerHTML` fetch-inject, no credential storage, no cross-origin DOM scrape).

## Network Inspection — CRM (`/agent` → `https://demo-crm.flex.co.tz/login`)

| Field | Value (curl -I 2026-08-28) |
|---|---|
| Request URL | `https://demo-crm.flex.co.tz/login` |
| Method | GET |
| Status | 200 |
| Redirect chain | none (final URL = login) |
| Final URL | `https://demo-crm.flex.co.tz/login` |
| `Content-Security-Policy` | `frame-ancestors self https://demo-chat.flex.co.tz https://demo-crm.flex.co.tz https://cc.flex.co.tz https://devcc.flex.co.tz; object-src *` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Set-Cookie` | `XSRF-TOKEN` `secure samesite=lax`; `demo_crm_session` `httponly samesite=lax secure` expiry 7200s |
| `Server` | `Apache` |
| `Cross-Origin-*` | none |

**Console expected (to confirm live):**
```
Refused to display 'https://demo-crm.flex.co.tz/login' in a frame because it set 'X-Frame-Options' to 'sameorigin'.
```
or
```
Refused to frame 'https://demo-crm.flex.co.tz/' because an ancestor violates CSP directive: "frame-ancestors ..."
```
Exact message to be captured from Chrome Console (Network disabled cache, Preserve log).

**Classification: CASE A — SERVER POLICY FAILURE**
- `X-Frame-Options: SAMEORIGIN` blocks any embed where parent origin != `demo-crm.flex.co.tz`. Parent `http://localhost:8000` or `https://cc.flex.co.tz` ⇒ blocked. React cannot fix.
- CSP `frame-ancestors` correctly allows `https://cc.flex.co.tz` + `https://devcc.flex.co.tz` but **missing** `http://localhost:8000` + `http://localhost:5173` for local dev, and **conflicts** with `XFO SAMEORIGIN` (Chrome prioritizes CSP but still enforces `XFO` when present → failure).

## Network Inspection — Social (`/agent/social` → `https://demo-chat.flex.co.tz/login`)

| Field | Value (curl -I 2026-08-28) |
|---|---|
| Request URL | `https://demo-chat.flex.co.tz/login` |
| Method | GET |
| Status | 200 |
| Redirect chain | none |
| Final URL | `https://demo-chat.flex.co.tz/login` |
| `Content-Security-Policy` | `object-src *; frame-ancestors 'self' https://demo-chat.flex.co.tz https://demo-crm.flex.co.tz https://cc.flex.co.tz https://flxcc.flex.co.tz https://devcc.flex.co.tz` |
| `X-Frame-Options` | `cc.flex.co.tz` — **INVALID** (valid: `DENY`/`SAMEORIGIN`/`ALLOW-FROM`) |
| `Set-Cookie` | `XSRF-TOKEN` `secure samesite=lax`; `demochat_session` `secure httponly samesite=lax` + `X-Request-Id`, `X-Response-Time-Ms` |
| `Server` | `Apache` |

**Console expected:**
```
Invalid 'X-Frame-Options' header encountered when loading 'https://demo-chat.flex.co.tz/login': 'cc.flex.co.tz' is not a recognized directive. The header will be ignored.  [or treated as DENY by some browsers → refused to connect]
```
Exact message to be captured live. `XFO` must NOT be used as origin allowlist — use CSP `frame-ancestors`.

**Classification: SERVER CSP/MALFORMED XFO FAILURE**
- Invalid `X-Frame-Options` value; browsers may ignore vs treat as `DENY` → observed `failed-document` icon.
- CSP `frame-ancestors` allows `https://cc.flex.co.tz` etc (includes `https://flxcc.flex.co.tz` unlike CRM) but **also missing** localhost for dev.

## Cookie Observations (pre-login GET)
- CRM: `demo_crm_session` `Path=/` `SameSite=Lax` `Secure` `HttpOnly` — `Lax` allows top-level navigation but **Lax + Secure + Https** is correct for same-site login inside iframe if frame-ancestors passes. After server fix, verify `login POST` → `Set-Cookie` not blocked (`Lax` → `None; Secure` may be needed for cross-site iframe cookie if Chrome flags `SameSite` — check `Network → Cookies → blocked reason` after login attempt per mission §11-12).
- Social: `demochat_session` same (`Lax`/`Secure`/`HttpOnly`).

## Required Server Change (smallest correction, effective layer: Apache vhost/reverse-proxy/hosting panel — NOT `my-app` Laravel)

**Remove invalid `X-Frame-Options` at the layer that emits it (verified via `Server: Apache`):**
```apache
# REMOVE these browser-observed headers:
# Header always set X-Frame-Options "SAMEORIGIN"    (demo-crm)
# Header always set X-Frame-Options "cc.flex.co.tz"  (demo-chat)
```

**Set canonical CSP `frame-ancestors` (preserve unrelated headers — HSTS, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection):**
```apache
# On BOTH demo-crm and demo-chat hosts (dev/demo allowlist):
Header always set Content-Security-Policy "frame-ancestors 'self' https://cc.flex.co.tz https://devcc.flex.co.tz https://flxcc.flex.co.tz https://demo-crm.flex.co.tz https://demo-chat.flex.co.tz http://localhost:8000 http://localhost:5173; object-src *"

# On production (if ever mirrored): remove localhost origins.
```

- Do NOT add `X-Frame-Options: ALLOW-FROM` (unsupported).
- Do NOT weaken to `frame-ancestors *`.
- Do NOT duplicate layer (fix only the effective source after `grep -R Header /etc/apache2` etc).

## Retest Checklist (after deploy, hard reload, Disable cache)
- [ ] `/agent` → Customer Workspace shows actual CRM login UI (not "refused to connect")
- [ ] `/agent/social` → Social Inbox shows actual Social login UI (not failed-document)
- [ ] Console has **zero** `Refused to display … in a frame` errors
- [ ] Network iframe document 200, `X-Frame-Options` absent, CSP `frame-ancestors` includes parent origin
- [ ] Login inside iframe: CSRF accepted, session cookie `demo_*_session` stored, redirect stays in iframe, authenticated UI renders, reload preserves session (mission §11)
- [ ] Cookies: record Domain/Path/SameSite/Secure/HttpOnly + blocked-reason if any (mission §12)
- [ ] Iframe stability: locale switch / Global Search / sidebar / Call Manager timer / Assist do NOT reload frame (mission §14-15) — record `iframe document request count` for Phase D baseline (mission §16)

## Status
- **CRM: BLOCKED — EXTERNAL SERVER FRAME POLICY** (XFO `SAMEORIGIN` must be removed; CSP ok for prod but needs localhost for dev)
- **Social: BLOCKED — EXTERNAL SERVER FRAME POLICY** (invalid `X-Frame-Options: cc.flex.co.tz` must be removed; CSP ok for prod but needs localhost)
- **No frontend `ExternalWorkspaceHost` change required** per mission §6 until browser evidence proves otherwise.
- **Forgotten workarounds avoided** per mission §7.

## Forbidden Workarounds NOT Applied
No `fetch+inject`, `dangerouslySetInnerHTML`, proxy login, `web-security disabled`, copied login screens, credential storage, cross-origin DOM scrape, or `CSP *`.

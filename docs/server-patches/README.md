# FLEX External Iframe — Server Patches

**Applies to:** `demo-crm.flex.co.tz` and `demo-chat.flex.co.tz` (both `Server: Apache` at `41.59.199.53`)

**Why:** Browser `Network` shows `X-Frame-Options: SAMEORIGIN` (CRM) and `X-Frame-Options: cc.flex.co.tz` (Social, invalid) — both block FLEX parent `https://cc.flex.co.tz` / `http://localhost:8000` even though `Content-Security-Policy: frame-ancestors` already allows those origins. CSP `frame-ancestors` is canonical; `X-Frame-Options` must not be used as allowlist.

**Patches:**
- `demo-crm-apache-fix.conf` — unset `SAMEORIGIN`, set precise `frame-ancestors`
- `demo-chat-apache-fix.conf` — unset invalid `cc.flex.co.tz`, set precise `frame-ancestors`

**Verification after reload (hard reload, Disable cache):**
```bash
curl -I https://demo-crm.flex.co.tz/login | grep -i -E "x-frame|content-security"
# Expected: no X-Frame-Options, CSP frame-ancestors includes cc.flex.co.tz and localhost

curl -I https://demo-chat.flex.co.tz/login | grep -i -E "x-frame|content-security"
# Expected: no X-Frame-Options, CSP frame-ancestors includes cc.flex.co.tz

# Then in Chrome DevTools:
# /agent → Customer Workspace shows actual CRM login UI inside iframe
# /agent/social → Social Inbox shows actual Social login UI
# Console: zero "Refused to display ... in a frame"
```

**Frontend ready:** `my-app/resources/js/features/integrations/external-workspace-host.tsx` now uses neutral `loaded` status (not treating `onLoad` as proof of `connected/healthy`), `sandbox="allow-same-origin allow-scripts allow-forms allow-popups"` sufficient, `frameKey` stable (no reload on locale/sidebar/timer/Assist).

**Do not:** proxy login via FLEX, `dangerouslySetInnerHTML`, `ALLOW-FROM`, `frame-ancestors *`, or scraping cross-origin DOM.

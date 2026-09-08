# FLEX External Iframe — Server Patches

**Applies to:** `demo-crm.flex.co.tz` and `demo-chat.flex.co.tz` (both `Server: Apache` at `41.59.199.53`)

**Why:** Browser `Network` shows `X-Frame-Options: SAMEORIGIN` (CRM) and `X-Frame-Options: cc.flex.co.tz` (Social, invalid). Both conflict with FLEX embedding. CSP `frame-ancestors` is the sole canonical policy; `X-Frame-Options` must not be used as an allowlist.

**Supported embedded-auth parents:** `https://cc.flex.co.tz`, `https://devcc.flex.co.tz`, and `https://flxcc.flex.co.tz`. Localhost remains suitable for shell/layout work only; it is not a supported persistent embedded-auth environment.

**Patches:**
- `demo-crm-apache-fix.conf` — unset `SAMEORIGIN`, set precise `frame-ancestors`
- `demo-chat-apache-fix.conf` — unset invalid `cc.flex.co.tz`, set precise `frame-ancestors`

**Verification after reload (hard reload, Disable cache):**
```bash
curl -I https://demo-crm.flex.co.tz/login | grep -i -E "x-frame|content-security"
# Expected: no X-Frame-Options, one CSP frame-ancestors policy containing only
# 'self', cc.flex.co.tz, devcc.flex.co.tz, and flxcc.flex.co.tz

curl -I https://demo-chat.flex.co.tz/login | grep -i -E "x-frame|content-security"
# Expected: no X-Frame-Options, one CSP frame-ancestors policy containing only
# 'self', cc.flex.co.tz, devcc.flex.co.tz, and flxcc.flex.co.tz

# Then in Chrome DevTools:
# /agent → Customer Workspace shows the CRM root (or its own login when unauthenticated)
# /agent/social → Social Inbox shows the Social root (or its own login when unauthenticated)
# Switch /agent ↔ /agent/social ↔ /agent in devcc and confirm each external
# session remains authenticated after its iframe remounts.
# Console: zero "Refused to display ... in a frame"
```

**Frontend ready:** the integration configs target each external application's root, so that application decides whether to show its login or authenticated landing route. `my-app/resources/js/features/integrations/external-workspace-host.tsx` keeps `loaded` neutral (not proof of authentication or health); its existing sandbox remains `allow-same-origin allow-scripts allow-forms allow-popups`, and `frameKey` is stable outside config/retry work.

**Do not:** proxy login via FLEX, `dangerouslySetInnerHTML`, `ALLOW-FROM`, `frame-ancestors *`, or scraping cross-origin DOM.

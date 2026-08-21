# FLEX Contextual Navigation Map — Increment A1

| Source | Target | Route | Filter mapping | Permission |
|---|---|---|---|---|
| CDR row (phone) | Customer 360 | `/customers/:id` (`encodeURIComponent(phone)`) | phone → timeline aggregator | `cdr.view` |
| Recovery row (phone) | Customer 360 | `/customers/:id` | phone → timeline | `missed-calls.view` |
| Social conversation (participant) | Customer 360 | `/customers/:id` | participant/phone → timeline | `social.view` |
| Customer 360 timeline item (call) | CDR | `/admin/cdr` | `?search=phone` | `cdr.view` |
| Customer 360 timeline item (social) | Social | `/agent/social` | conversation id | `social.view` |
| Customer 360 timeline item (callback) | Missed Calls | `/agent/missed-calls` | `?search=phone` | `missed-calls.view` |

All links are tenant-aware (current `TenantContext`) and bookmarkable. No cross-tenant navigation.

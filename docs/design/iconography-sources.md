# Iconography — Source Provenance

Records the source and license context for the curated FLEX icon set. Vendor
provenance must not be removed.

## Source

- **Library:** Koboyo (curated SVG product/illustration icon set)
- **Retrieval date:** 2026-08-15
- **Package:** `koboyo-svg-files.zip`
- **License:** permissive embeddable icon library. Confirm the current source
  license remains compatible with the intended application use before any wider
  redistribution. FLEX does **not** redistribute the selected set as a standalone
  competing icon library.

## Extraction

Only approved SVG files entered the repository. Excluded from the source package:

```text
__MACOSX/
._* metadata
B2B_Company_Profiles_in_Dar_es_Salaam.md
```

Assets live under `resources/assets/flex/icons/` grouped by family:
`product/` (clean), `illustration/` (cartoon), `feature/` (solid).

## Selected source filenames

The 63 selected source files are:

```text
airmail-border, analytics-dashboard, assistant-avatar, audio-file,
backup-action, backup, benefit-security, bot, broadcast-advert, busy-server,
callback-returning-later, callback-url, campaign, card-reports,
cartoon-callback-completion, cartoon-callback-queue, cartoon-campaign,
cartoon-database-cylinder-data, cartoon-database-cylinder,
cartoon-email-for-subscription, cartoon-group, cartoon-highlight-security,
cartoon-mail, cartoon-network-map-diagram, cartoon-neural-network-diagram,
cartoon-poll-bars-social, cartoon-push-subscription, cartoon-queue,
cartoon-server, cartoon-subscription-card, cartoon-support-agent-clipboard,
cartoon-support-agent, cartoon-team, cloud-backup, cloud-folder, dashboard,
database-cylinder, database, engagement-graph, face-headset, gauge,
grid-messages, invoice, list-messages, lock, log-file, logs, mail,
navigation-log, queue, quota-gauge, scheduled-transcript, server-stack-icon,
settings-2, settings, severity-levels, shield-for-security,
solid-customer-support-headset, solid-network-globe, solid-server-rack,
solid-voicemail, switchboard-headset, team
```

## Source filename → FLEX semantic name

The semantic registry maps FLEX meanings to sources. Application code requests
semantics (`<FlexIcon name="reports" />`), never source filenames. The mapping
below is the approved starting set; individual selections may be refined at
runtime/design review before migration.

```text
dashboard                       → product/dashboard.svg
analytics                       → product/analytics-dashboard.svg
agent-monitoring                → product/face-headset.svg
call-operations                 → product/switchboard-headset.svg
campaigns                       → product/campaign.svg
reports                         → product/card-reports.svg
scheduled-reports               → product/scheduled-transcript.svg
queues                          → product/queue.svg
recordings                      → product/audio-file.svg
users                           → product/team.svg
mail                            → product/mail.svg
management-console              → product/settings.svg
system-settings                 → product/settings-2.svg
backup                          → product/backup.svg
cloud-backup                    → product/cloud-backup.svg
database                        → product/database-cylinder.svg
database-alt                    → product/database.svg
system-infrastructure           → product/server-stack-icon.svg
server-degraded                 → product/busy-server.svg
logs                            → product/logs.svg
log-file                        → product/log-file.svg
audit-log                       → product/navigation-log.svg
security                        → product/shield-for-security.svg
security-benefit                → product/benefit-security.svg
access-control                  → product/lock.svg
system-health                   → product/gauge.svg
quota                           → product/quota-gauge.svg
severity                        → product/severity-levels.svg
callback                        → product/callback-returning-later.svg
callback-link                   → product/callback-url.svg
voicemail-feature               → feature/solid-voicemail.svg
ai-center                       → product/bot.svg
agent-assist                    → product/assistant-avatar.svg
social-inbox                    → product/grid-messages.svg
social-list                     → product/list-messages.svg
social-analytics                → product/engagement-graph.svg
broadcast                       → product/broadcast-advert.svg
subscription-billing            → product/invoice.svg
cloud-files                     → product/cloud-folder.svg
```

Illustration (cartoon) mappings for empty/setup/onboarding contexts are approved
for the surfaces listed in `docs/design/iconography.md` (§ Feedback & illustrations)
and the empty-state map in the FLEX Iconography System plan (§21).

## Approved family & context

```text
PRODUCT (clean)   → navigation, module directories, category headers, settings,
                    reports, system administration
ILLUSTRATION      → empty states, setup guidance, onboarding, help (not default
                    18–20px sidebar icons)
FEATURE (solid)   → occasional large feature identity, used sparingly
```

## Validation

```bash
python3 resources/assets/flex/icons/validate-flex-icons.py resources/assets/flex/icons
```

Checks: safe markup (no `<script>`, external `href`, inline event handlers,
`foreignObject`), `currentColor` inheritance, `<svg>` root, and `viewBox`.
Wired into `bun run icons:audit`.
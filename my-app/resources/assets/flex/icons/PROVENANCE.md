# FLEX Icon Source Provenance

## Source library

- **Library:** Koboyo (curated SVG product/illustration icon set)
- **Retrieval date:** 2026-08-15
- **Package:** `koboyo-svg-files.zip`

## Retrieval / extraction

From the source ZIP, the following were **excluded** and must never enter the application repository:

- `__MACOSX/` metadata
- `._*` metadata files
- `B2B_Company_Profiles_in_Dar_es_Salaam.md` (unrelated Markdown)

Only the 63 approved `.svg` files were copied into the FLEX icon asset set under
`resources/assets/flex/icons/`.

## Selected source filenames → FLEX families

### Product (clean / operational) — `resources/assets/flex/icons/product/`

```text
airmail-border, analytics-dashboard, assistant-avatar, audio-file,
backup-action, backup, benefit-security, bot, broadcast-advert, busy-server,
callback-returning-later, callback-url, campaign, card-reports, cloud-backup,
cloud-folder, dashboard, database-cylinder, database, engagement-graph,
face-headset, gauge, grid-messages, invoice, list-messages, lock, log-file,
logs, mail, navigation-log, queue, quota-gauge, scheduled-transcript,
server-stack-icon, settings-2, settings, severity-levels, shield-for-security,
switchboard-headset, team
```

### Illustration (cartoon) — `resources/assets/flex/icons/illustration/`

```text
cartoon-callback-completion, cartoon-callback-queue, cartoon-campaign,
cartoon-database-cylinder-data, cartoon-database-cylinder,
cartoon-email-for-subscription, cartoon-group, cartoon-highlight-security,
cartoon-mail, cartoon-network-map-diagram, cartoon-neural-network-diagram,
cartoon-poll-bars-social, cartoon-push-subscription, cartoon-queue,
cartoon-server, cartoon-subscription-card, cartoon-support-agent-clipboard,
cartoon-support-agent, cartoon-team
```

### Feature (solid) — `resources/assets/flex/icons/feature/`

```text
solid-customer-support-headset, solid-network-globe, solid-server-rack,
solid-voicemail
```

## Approved context

- **Product** → compact navigation, module directories, category headers,
  settings, reports, system administration.
- **Illustration (cartoon)** → empty states, setup guidance, onboarding, help.
  Not used as default 18–20px sidebar icons.
- **Feature (solid)** → occasional large feature identity. Used sparingly; never
  mixed randomly into a clean-line sidebar.

## License / reference note

Koboyo is distributed as a permissive icon library intended for embedding in
products. Confirm the current source license remains compatible with the
intended FLEX application use before any wider redistribution. FLEX does **not**
redistribute the selected set as a standalone competing icon library.

## Validation

Run the safety/`currentColor`/`viewBox` audit with:

```bash
python3 resources/assets/flex/icons/validate-flex-icons.py resources/assets/flex/icons
```

No `<script>`, external `href`, inline event handlers, `foreignObject`, or
runtime remote loading is permitted in the curated set.
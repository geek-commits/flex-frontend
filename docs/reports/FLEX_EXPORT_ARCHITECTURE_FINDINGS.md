# FLEX Export Architecture Findings — Reports / CDR / Recordings / Print & Localization

**Workspace root:** `/Users/air/flex-frontend`  
**Target plan refs:** `FLEX_GENERATED_OUTPUTS_RECORDINGS_EXPORT_LOCALIZATION_PLAN.md:2` (not present on-disk at audit time — inferred from task: outputs + recordings export + localization), `docs/design/domain/reporting.md`, `docs/localization/FLEX_LOCALIZATION_ARCHITECTURE.md`, `docs/product/FLEX_FEATURE_PARITY.md`  
**Scope:** `my-app/routes/web.php`, `routes/api.php`, `app/Http/Controllers/*Report*/*Export*`, `app/Services/*`, `config/*`, `resources` PDF/XLSX libs, existing report/CDR/recording export endpoints, `storage`, tenant/auth scope, print views  
**Date:** 2026-08-28  
**Mode:** read-only audit — no code implemented

---

## 1. Existing capability (what the runtime actually does)

### 1.1 Routes — no export endpoints exist
- `my-app/routes/web.php:9-61` — all `auth+verified` Inertia pages. No `Route::get/post` for `/exports`, `/reports/*/export`, `/cdr/export`, `/recordings/export`.
- `my-app/routes/api.php` — **does not exist** (`bootstrap/app.php:12-17` registers only `web`, `commands`, `health: /up`). No API surface at all.
- `my-app/routes/settings.php:8-33` — profile/security/appearance only.
- `my-app/app/Http/Controllers/` — only `HomeController.php:8` + `Controller.php` + `Settings/{ProfileController,SecurityController}.php`. Zero `Report*`/`Export*` controllers.

### 1.2 Services — none
- `my-app/app/Services/**` — directory does not exist.
- `my-app/config/*` — stock Laravel 13 (`app.php`, `auth.php`, `filesystems.php`, `cache.php`, `database.php`, `queue.php`, `logging.php`, `mail.php`, `services.php`, `admin.php`, `inertia.php`, `session.php`, `fortify.php`). No `flex.php` / `exports.php` / `reports.php` config, no PDF/XLSX driver config.

### 1.3 Dependencies — no PDF/XLSX/CSV generation libraries
- `my-app/composer.json:11-19` — `php ^8.3`, `laravel/framework ^13.17`, `inertiajs/inertia-laravel ^3`, `laravel/fortify`, `chisel`, `wayfinder`. No `barryvdh/laravel-dompdf`, `barryvdh/laravel-snappy`, `maatwebsite/excel`, `phpoffice/phpspreadsheet`, `league/csv`, `dompdf/dompdf`, `tecnickcom/tcpdf`.
- `my-app/package.json:41-104` — no `jspdf`, `pdfmake`, `exceljs`, `xlsx`, `papaparse`, `react-to-print`. `recharts 3.8.0` + `@visx/*` (charts) + `@tanstack/react-table` present but none used for export.

### 1.4 Frontend report surface — mock-only, canonical contract but no backend
- `my-app/resources/js/features/reports/report-registry.ts:17-27` — 10 canonical `ReportId` (`contact-center-performance`, `yearly-performance`, `agent-performance`, `agent-state-log`, `agent-outgoing`, `ivr-report`, `customer-end-to-ivr`, `queue-logs`, `outgoing-calls`, `recordings`), each `supportedFormats: ['PDF','Excel','CSV']` (`ReportFormat`). `REPORT_PERMISSION: 'reports.view'` only — no `reports.export` / `reports.manage`.
- `my-app/resources/js/domain/report-repository.ts:14-91` — `ReportRepository { runReport(reportId, query):ReportRun; exportReport(reportId, format, query):Promise<void> }`. `runReport` filters deterministic `REPORT_MOCK_RESULTS` (`domain/report-repository.ts:67-84`); `exportReport` is `await delay 900ms` with comment `// POC MOCK — no real file is produced. Real adapter would call export endpoint with tenant/auth` (`domain/report-repository.ts:86-90`). No HTTP call, no blob, no download.
- `my-app/resources/js/features/reports/report-export-menu.tsx:26-85` — `ReportExportMenu` renders Popover `Export as → PDF/Excel/CSV` from `report.supportedFormats`, `exporting` spinner `Preparing ${format}…`, calls `reportRepository.exportReport` then `toast.success|error`. Duplicate prevention only. No locale passed, no tenant passed, no file download.
- `my-app/resources/js/features/reports/report-types.ts:16-22` — `ReportQuery { dateFrom?, dateTo?, agent?, queue?, ivr?, provider?, year? }` (period + report-specific filters). No `locale`, `tenantId`, `format` validation beyond `string`.
- `my-app/resources/js/features/reports/report-viewer.tsx:31-154` — canonical `ReportViewer` with `idle→loading→ready|empty|error` lifecycle, `FlexEmptyState`/`FlexErrorState`, `runReport` memo. Export slot is injected (`renderExport`) — viewer never produces a file itself.
- `my-app/resources/js/features/reports/reports-page.tsx:27-153` — `ReportsPage` composes library (`ReportLibrary`), viewer, scheduled workspace (`ScheduledReportsPage`), `ScheduleFormSheet`, `ExecutionHistorySheet`, `DeleteScheduleDialog`. All scheduled data via `scheduledReportsRepository.querySchedules()` (mock in-memory).
- `my-app/resources/js/features/reports/viewers/index.tsx:21-45` — dispatch to 10 specialized viewers (`ContactCenterPerformanceViewer`, `YearlyPerformanceViewer`, `AgentPerformanceViewer`, etc.). All read `ReportRun` directly; no print-specific view.

### 1.5 CDR — mock repository, no export
- `my-app/resources/js/domain/cdr-repository.ts:12-68` — `CdrRepository { query(CdrQuery):CDRRecord[]; getById }` filtering `CDR_MOCK_RECORDS` (search/status/queue/dateFrom/dateTo). No `exportCdr`.
- `my-app/resources/js/features/cdr/cdr-page.tsx:28-229` — `FlexWorkbenchShell` + `CdrToolbar` (search, quickFilter, dateFrom/dateTo, advanced `Filter[]`) + `CdrTable` (`@tanstack/react-table`). No Export button in toolbar. `cdr-columns.tsx:127-152` — `recording` column has `RiPlayFill` when `hasRecording`, `actions` column only `RiEyeLine` view → `CdrDetailSheet`. `FLEX_FEATURE_PARITY.md:197-198` + `FLEX_PARITY_AUDIT_REPORT.md:91` confirm `GAP-013`: `SUP-CDR-012 Export — buttons render with no handler / non-functional affordance`. Current `cdr-columns.tsx` in this branch has already removed the dead Export/Download buttons (confirming the gap closure attempt) — leaving **zero** CDR export affordance.
- CDR detail sheet (`resources/js/features/cdr/cdr-detail-sheet.tsx`) — playback only, no download.

### 1.6 Recordings — mock repository, playback only, no bulk export
- `my-app/resources/js/domain/recording-repository.ts:16-188` — `RecordingRepository { queryRecordings, getById, createRecording, updateRecording, replaceAudio, deleteRecording, getSummary }` — all in-memory `RECORDINGS_MOCK_DATA`. No export. `RecordingReport` (in `report-types.ts:128-131`) is the *usage-count* report (`recordingName`, `playCount`) — distinct from `admin/recordings` audio-management surface per `docs/design/domain/reporting.md:69`.
- `my-app/resources/js/features/recordings/recordings-page.tsx:13-253` — `FlexMetricStrip` (totalAssets/storage/ivrPrompts/queueAudio) + `RecordingToolbar` (search/category/format) + `RecordingsTable` + `RecordingAudioPlayer` (url `https://cdn.freesound.org/...`), `RecordingFormSheet` (create/edit/replace), `RecordingDetailSheet`, `RecordingDeleteDialog`. File mutation is mock; no `download` / `export csv|xlsx` / `bulk export`.

### 1.7 Storage — stock Laravel, no export disk
- `my-app/config/filesystems.php:31-63` — disks `local → storage_path('app/private')`, `public → storage_path('app/public')`, `s3` (env only). `default: env('FILESYSTEM_DISK','local')`. `storage/app/private/.gitignore`, `storage/app/public/.gitignore` — both empty placeholders. No `exports`, `reports`, `temp` disk. No `Storage::temporaryUrl` usage anywhere.

### 1.8 Auth & tenant scope — frontend-only, backend not authoritative yet
- `my-app/config/auth.php:40-45` — `web` guard `session` + `users` eloquent only. `bootstrap/app.php:18-26` — middleware `encryptCookies('appearance','sidebar_state')` + `SetLocaleFromCookie` → `HandleAppearance` → `HandleInertiaRequests`. All `routes/web.php` inside `['auth','verified']` (`web.php:9`).
- `my-app/resources/js/auth/capabilities.tsx:18-61` — `Capability` union has `reports.view` but **no** `reports.export|reports.manage|cdr.export|recordings.export`. `ROLE_CAPABILITIES`: `super-admin`/`admin`/`supervisor` have `reports.view`; `agent` does not. Backend has **no roles/permissions** (POC `localStorage:flex.poc.role`, `capabilities.tsx:10` disclaimer).
- `my-app/resources/js/features/tenants/tenant-context.tsx:18-49` — `TenantContext { mode:'platform' }|{mode:'tenant', tenant}` — in-memory `useState`, no `localStorage`, no server header. `tenant-repository.ts` is mock `TENANTS_MOCK_RECORDS`. `docs/design/domain/tenant-context.md:5-58` + `FLEX_FEATURE_PARITY.md:311` `GAP-004 TENANT_SCOPE_UNKNOWN` — real switch/authorization/isolation deferred, `tenant.invalidation.ts` is no-op locally.
- Export tenant/auth propagation therefore **does not exist** today — neither cookie/header/query nor signed URL.

### 1.9 Localization — cookie-driven, no per-request export locale
- `my-app/app/Http/Middleware/SetLocaleFromCookie.php:20-28` — reads `cookie('flex_locale')`, strict `in_array(['en','sw','fr'], true)`, `App::setLocale(locale)`, registered `bootstrap/app.php:22`. Invalid/missing → default `en` (`config/app.php:80-85`).
- `my-app/resources/js/i18n/locale.ts:3-144` — `SUPPORTED_LOCALES ['en','sw','fr']`, `COOKIE_NAME flex_locale`, `STORAGE_KEY flex.locale`, `DEFAULT_LOCALE en`, `LOCALE_CONFIG {en:en-GB, sw:sw-TZ, fr:fr-FR, direction:ltr}`. `getInitialLocale()` order: `localStorage flex.locale → cookie flex_locale → navigator.languages → en`. `setFlexLocale(locale)` writes `i18n.changeLanguage` + `localStorage` + `cookie SameSite=Lax 365d` + `html lang`. `useFlexLocale()` subscribes to `languageChanged` (`locale.ts:146-183`).
- `my-app/resources/js/i18n/index.ts:73-94` — `i18n.init { resources: en/sw/fr ×9ns, lng:getInitialLocale(), fallbackLng:DEFAULT_LOCALE, defaultNS:'common' }` before React render, syncs `document.documentElement.lang`. Namespaces: `common, auth, navigation, agent, assist, supervision, administration, platform, validation` (`i18n/index.ts:37-71`).
- `my-app/resources/js/i18n/formatters.ts:5-104` — `resolveLocale()` → `LOCALE_CONFIG[locale].formatLocale`; `formatDate/formatDateTime` via `Intl.DateTimeFormat`, `formatNumber/Percent/Currency` via `Intl.NumberFormat`, `formatDuration→hh:mm:ss` (locale-independent per localization doc). No server-side formatter bridge.
- Report viewers/tables/exports **do not pass `locale` anywhere** (`ReportQuery`, `report/export-menu.tsx`, `reportRepository`). `FLEX_LOCALIZATION_ARCHITECTURE.md:28` confirms currency from business data, technical IDs raw. `docs/localization/FLEX_LOCALIZATION_SURFACE_MATRIX.md:74` flags `admin/reports` as either ❌ not i18n or partial — `ReportExportMenu`/`ReportLibrary`/viewers are Top-30 hardcoded files.

### 1.10 Print — none
- `grep print/@media print/window.print` — zero hits outside `prettier printWidth`/SVG validate scripts. `resources/css/app.css:1-802` — no `@media print`, no `@page`, no `print:` variant. No `react-to-print`, no print-only Blade view, no `?print=1` route. Report viewers use `rounded-lg border bg-background` cards with no print stylesheet.

---

## 2. Missing capability (must be built — backend authoritative)

| # | Gap | Evidence | Risk if invented |
|---|-----|----------|------------------|
| 1 | **No export HTTP contract** (reports/CDR/recordings) | No routes, no controllers, no services, `reportRepository.exportReport` is delay + toast | Must not fake a blob in the browser; ownership §5 |
| 2 | **No file generation** (PDF/XLSX/CSV) | No composer/pdf/excel libs, no Blade/pdf view, no csv writer | PDF ≠ screenshot of the DOM; sheet ≠ CSV-rename |
| 3 | **No server-side filtering/query** | `report-repository.ts:20-65` client-side `filter(rows)` only; `cdr-repository.ts:46-63` mock | Export must not be "export what's rendered on page 1" |
| 4 | **No authZ on export** | `reports.view` only, `cdr.view` only, `agent.workspace` only; no `export` capability, backend Fortify session only | 403 + redirect semantics undefined |
| 5 | **No tenant isolation on export** | `TenantContext` is mock in-memory; no `tenant_id` column/header, no `SignedUrl`, no disk prefix | Cross-tenant leakage would be a safety defect (`tenant-context.md:21`) |
| 6 | **No locale-aware export** | `ReportQuery` has no `locale`; middleware ignores `Accept-Language`; `formatDate/formatNumber` are client-only | Export headers/numbers/dates must match user's `flex_locale` |
| 7 | **No storage/retention/URL** | No `exports` disk, no `temporaryUrl`, no cleanup job, no `download` endpoint | Must define sync vs async, expiry, 410 |
| 8 | **No audit/scheduled-export bridge** | `ScheduledReportsRepository` mock only; no queue, no `reports.view` schedule execution, no `emails sent/failed` delivery | Must not invent email delivery |
| 9 | **No print contract** | No print route/CSS/component | `Print` is distinct from `PDF` export |
| 10 | **No rate limiting / size guard** | No `throttle:6,1` beyond password update; no `max rows`, no `streamDownload` | Large `queue-logs` export could OOM |

---

## 3. Smallest recommended contract (report ID / filters / format / locale / tenant / auth)

> Design target: **one** endpoint family covering all report surfaces, reusing the same auth/tenant/locale plumbing for CDR + recordings.

### 3.1 Route shape (Laravel `routes/web.php` or `routes/api.php` — recommendation `web` to reuse `auth+verified+SetLocaleFromCookie`)

```php
// Authn: web session (Fortify). AuthZ: server-side `can:reports.view` (and future `reports.export`).
// Tenant: resolved from authoritative session / header — never from client-supplied `tenant_id`.
// Locale: resolved from `flex_locale` cookie (existing) + overridable `locale` query param (strict allowlist).
Route::middleware(['auth','verified'])->group(function () {
    Route::get ('/reports/{report}/export', [ReportExportController::class, 'export'])
        ->middleware('throttle:export')   // e.g. 10/min
        ->name('reports.export');

    Route::get ('/cdr/export',            [CdrExportController::class, 'export'])
        ->name('cdr.export');

    Route::get ('/recordings/export',     [RecordingExportController::class, 'export'])
        ->name('recordings.export');      // bulk inventory export, not audio binary

    // Optional async + print variants
    Route::post('/reports/{report}/export/jobs', [ReportExportJobController::class, 'store'])
        ->name('reports.export.jobs.store');   // returns job id for polling when rows > threshold
    Route::get ('/reports/{report}/print', [ReportPrintController::class, 'show'])
        ->name('reports.print');               // HTML print view, @media print
});
```

### 3.2 Request parameters (query string — GET, signed when needed)

| Param | Type | Required | Allowed | Notes |
|-------|------|----------|---------|-------|
| `report` | path `ReportId` | yes | `REPORTS[].id` allowlist (`report-registry.ts:17-27`) | Unknown → `404 report_not_found`, never fallback to first |
| `format` | `format` | yes | `pdf | xlsx | csv` (canonical lower) — `ReportFormat` is `PDF|Excel|CSV` in FE; normalize lower | Unknown → `422 format_unsupported` |
| `locale` | `locale` | no | `en|sw|fr` strict | Resolved order: `?locale=` → `cookie flex_locale` → `App::getLocale()` → `en`. Invalid → `en` (never 400) — matches `SetLocaleFromCookie.php:23` |
| `dateFrom` | `YYYY-MM-DD` | no | `dateFrom ≤ dateTo`, not in future beyond tolerance | Mirrors `ReportQuery.dateFrom/dateTo` |
| `dateTo` | `YYYY-MM-DD` | no | | |
| `year` | `YYYY` | no | `year` only for `yearly-performance`; reject otherwise | `report-types.ts:21` |
| `agent` | string | no | trimmed, length guard (e.g. ≤64) | Filter semantics = `includes` insensitive (`report-repository.ts:26-34`) — server should use `ILIKE %needle%` |
| `queue` | string | no | | |
| `ivr` | string | no | | Only `ivr-report` |
| `provider` | string | no | | Only `outgoing-calls` |
| `customer` | string | no | | CDR/recordings parity — dedicated field desired (`GAP-013`) |
| `tenant` | ✗ | ✗ | **Never client-supplied** | Resolved from `auth()->user()->tenant_id` / `TenantContext` session (`tenant-context.md`). Sending it → `422` |

CDR export reuses the same filters (`search`, `status`, `queue`, `dateFrom`, `dateTo`, `customer`). Recordings bulk export uses `search`, `category`, `format`.

### 3.3 Responses

**Synchronous (small result)** — stream directly:

```
200 OK
Content-Type:  {pdf→application/pdf, xlsx→application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, csv→text/csv; charset=utf-8}
Content-Disposition: attachment; filename="flex-{report}-{YYYY-MM-DD}-{locale}.{ext}"
Content-Language:  en|sw|fr
X-Tenant-Id:       (hashed/opaque, not raw if PII-sensitive)
Cache-Control:     private, no-store
```

Empty result → still `200` with valid file (header row + localized empty caption), never `204`.

**Asynchronous (large result / scheduled)** — `202 Accepted`:

```
202 Accepted
Content-Type: application/json
{ "jobId": "01H...", "status": "Queued", "pollUrl": "/reports/{report}/export/jobs/01H..." }
```

Polling (`GET /reports/{report}/export/jobs/{jobId}`) returns `Scheduled|Running|Completed|Failed|Retrying` (same states as `domain/reporting.md:39`) + on `Completed`: `downloadUrl` (signed, short-lived) + `recordsProcessed`, `fileSizeBytes`.

### 3.4 Frontend adapter (keeps repository boundary)

```
reportRepository.exportReport(reportId, format, query)
// → GET /reports/{report}/export?format=csv&locale=sw&dateFrom=...&agent=...
//   Cookie: flex_locale=sw ; Authorization: session cookie
// → receive blob or jobId ; trigger download via <a download> or poll
cdrRepository.exportCdr(query, format, locale)
recordingRepository.exportInventory(query, format, locale)
```

`locale` sourced from `getInitialLocale()` / `useFlexLocale()` (`i18n/locale.ts:87-118`), not hardcoded `'en'`.

### 3.5 Validation & limits

- `report` allowlist; `format` allowlist; `locale` strict `in_array(..., true)`.
- `dateFrom/dateTo` validated with `after_or_equal:dateFrom`, same timezone `UTC` (`config/app.php:68`) — export header shows `Generated at: formatDateTime(generatedAt, locale)` using `i18n/formatters.ts` server equivalent (`Intl.DateTimeFormat` with `LOCALE_CONFIG.locale.formatLocale` = `en-GB/sw-TZ/fr-FR`).
- Max rows guard: sync ≤ e.g. 10k; above → `202` async required. `streamDownload` (league/csv + PhpSpreadsheet or dompdf streamed).
- `throttle:export` + per-tenant + per-user.

---

## 4. Security ownership

| Concern | Current POC state | Required owner (backend authoritative) |
|---------|-------------------|----------------------------------------|
| **Authn** | Fortify session cookie (`auth` guard `web`, `bootstrap/app.php:21`) — correct | Keep — all export routes inside `['auth','verified']`. No API token invented. |
| **AuthZ** | Frontend `reports.view` only (`capabilities.tsx:25`), no backend check | **Backend** `Gate/Policy`: `can:reports.view` is minimum; introduce `reports.export` (and `cdr.export`) only when demanded; deny `agent`. Forbidden → `403` (or `302` to login if unauthenticated, consistent with `auth/capabilities.test.ts` forbidden-route tests). Never broaden agent to `reports.*`. |
| **Tenant isolation** | Mock `TenantContext` never scopes data (`tenant-context.md:14`) | **Backend** resolves tenant from authenticated session (`auth()->user()->tenant()->id` or `tenant_context` table), scopes every query `WHERE tenant_id = ?`, prefixes storage `tenants/{tenant_id}/exports/...`. Cross-tenant request → `404` not `403` to avoid enumeration. `FLEX_FEATURE_PARITY.md GAP-004` remains open until implemented. |
| **Authorization boundary** | Documented `docs/adr/ADR-005-authorization-boundary.md:30` `visible|read|...|export` per role | Extend ADR matrix to include `export` column per role. |
| **Storage auth** | `local`/`public` only, `serve:true` on `local` (`filesystems.php:36`) | Exports must be `private` disk, `serve:false`, never public symlink. Downloads via `Storage::download` / `Storage::temporaryUrl` (S3) with signed URL expiry (e.g. 15 min). Cleanup job prunes `>7d`. No `public/storage` export link. |
| **Input validation** | None for exports | Strict `FormRequest` per export; reject `tenant_id` param; length caps; `provider` allowlist where applicable. Log `export.requested` with `user_id, tenant_id, report_id, format, locale, rowCount` via `lib/observability.ts` parity at backend. |
| **Rate / DoS** | `throttle:6,1` only on password | `throttle:export` + per-report weight. |
| **Disclosure** | Export filename currently not defined | Filename must not leak internal IDs; use `flex-{report-slug}-{date}-{locale}.{ext}`; hash tenant if needed. `Content-Language` reflects locale used. |

---

## 5. Locale source — `flex_locale` (single source of truth)

**Authoritative source:** cookie `flex_locale` + `localStorage flex.locale` + `document.documentElement.lang` all mutated atomically by `setFlexLocale(locale)` (`i18n/locale.ts:119-144`).

- **Detection (client):** `i18n/locale.ts:87-117` `getInitialLocale(): localStorage flex.locale → cookie flex_locale → navigator.languages (xx-YY→xx) → en`. Allowlist `['en','sw','fr']` (`SUPPORTED_LOCALES`).
- **Detection (server):** `SetLocaleFromCookie.php:21-26` `cookie('flex_locale') in_array strict → App::setLocale`; registered `bootstrap/app.php:22` in `web` pipeline. Invalid/missing → `App::getLocale()` stays `en` (`config/app.php:80`).
- **Formatting:** `i18n/formatters.ts:5-104` centralizes `LOCALE_CONFIG[locale].formatLocale` (`en-GB/sw-TZ/fr-FR`) for `formatDate/formatDateTime/formatNumber/formatPercent/formatCurrency`; `formatDuration` is `hh:mm:ss` fixed.
- **Export requirement:** server must use the **same** allowlist + `LOCALE_CONFIG` mapping when rendering export headers, column titles, dates, numbers, percents. `?locale=` query param is an **override** (strict) that also sets `App::setLocale` for that request — but cookie remains canonical so subsequent page navigations stay consistent.
- **What must NOT be translated:** technical IDs `IVR/CDR/SIP/API/SMTP/URI/URL/UUID`, tenant names, phone numbers, durations `hh:mm:ss` (`FLEX_LOCALIZATION_ARCHITECTURE.md:30,49`). Dates/numbers/`%`/`currency` must use `Intl.*` with the resolved `formatLocale`.
- **Continuity:** locale switch must not remount `CapabilityProvider/TenantContextProvider/AgentAssistSessionProvider` (`FLEX_LOCALIZATION_ARCHITECTURE.md:42-44`) — exports must remain tenant/scroll stable after `EN→SW→FR`.

---

## 6. Findings per format

### 6.1 PDF (`format=pdf`)
- **Existing:** none — no `dompdf`/`snappy`/`blade` PDF view, no `GET .../print` HTML, `ReportExportMenu:10-14` treats `PDF` as icon `RiFilePdfLine` only, `report-repository.ts:86` delay only. `composer.json` has zero PDF libs.
- **Gap:** need server-side HTML→PDF. Choices: `barryvdh/laravel-dompdf` (pure PHP, no binary) vs `barryvdh/laravel-snappy` (wkhtmltopdf binary). For FLEX headers/tables, `dompdf` is sufficient and avoids infra. Add Blade `resources/views/reports/export/pdf.blade.php` receiving `report, locale, filters, rows, generatedAt` and using server-equivalent formatters (same strings as `i18n/locales/{locale}` keys via `__()` — translations already exist under `lang/{en,sw,fr}/auth.php` for auth only; reports translations would use `i18n/locales` JSON parity or backend `lang` copies).
- **Smallest contract:** `GET /reports/{report}/export?format=pdf&locale=fr&dateFrom=&dateTo=&agent=` → `application/pdf` streaming; header shows report label (translated), period, locale badge, row count. Queue Logs keeps telephony literals (`ENTERQUEUE/CONNECT/ABANDON/COMPLETECALLER/TRANSFER`). Page header `@page { margin: 16mm }`.
- **Security/locale:** signed download when async; 10k-row guard; locale from `flex_locale` drives header strings + `Intl.DateTimeFormat(formatLocale)`.

### 6.2 CSV (`format=csv`)
- **Existing:** none — no `league/csv` / `fputcsv`, no `Content-Type: text/csv`. `ReportExportMenu` lists `CSV → RiFileTextLine`, `FLEX_FEATURE_PARITY.md:216` `REPORT-014…017 REVAMPED` refers to menu only, not a file.
- **Gap:** need deterministic `UTF-8 BOM + \r\n` writer, column order matching viewer, header row translated per locale (`i18n/locales/{locale}/supervision|administration.json` parity), values formatted via same `format_*` helpers. `phpoffice/phpspreadsheet` not needed for CSV but `league/csv` is lightest.
- **Smallest contract:** `GET ...?format=csv&locale=sw` → `text/csv; charset=utf-8` with `sep=,` hint, header row translated. `queue-logs` `event` stays literal, `date` is `formatDateTime` with `sw-TZ`.
- **Security:** streaming (`StreamedResponse`) to avoid buffering; tenant scoping as above.

### 6.3 XLSX / Excel (`format=xlsx`, FE alias `Excel`)
- **Existing:** none — no `maatwebsite/excel` / `phpoffice/phpspreadsheet`, no `application/vnd.openxmlformats...` response. FE registry uses `Excel` (`report-registry.ts:29`) while HTTP should use `xlsx` — normalization `Excel→xlsx` is the adapter's job.
- **Gap:** needs `maatwebsite/excel` (or `phpoffice/phpspreadsheet` directly) + a single `Export` class per report or generic `ReportsExport` with `WithHeadings|WithMapping|ShouldAutoSize|WithStyles`. Avoid one Export per report if sharing layout; start with one `ReportsExport` fed by `reportId` + rows.
- **Smallest contract:** `GET ...?format=xlsx` (FE sends `Excel`) → adapter maps `Excel→xlsx` → `200` sheet with header style (`--flex-brand`), frozen header row, auto-filter, numeric `NumberFormat`, date as `DateTime` with locale formatting baked as displayed text. Same guard as PDF/CSV. Large (>10k) → `202` async job producing file on `private` disk then signed URL.

### 6.4 Print (`format` ≠ — `GET /reports/{report}/print?...&locale=...`)
- **Existing:** none — no `@media print`, no `@page`, no print Blade/route. `resources/css/app.css` has no print block; report viewers use screen cards. `grep print` hits zero in `resources/`.
- **Gap:** canonical print view is **distinct** from PDF download: same data, `?locale=` aware, but rendered as HTML with `@media print { body{-webkit-print-color-adjust:exact} nav,aside,[data-print-hidden]{display:none} @page{margin:12mm} }`. Should reuse the PDF Blade without `dompdf` framing + include `window.print()` trigger (guarded by user gesture) and `beforeprint/afterprint` observability.
- **Smallest contract:** `GET /reports/{report}/print?locale=sw&dateFrom=&...` → `text/html; charset=utf-8` with `Content-Language: sw`, `lang="sw"` on `<html>`, no `Content-Disposition: attachment`, print stylesheet, localized headings/dates/numbers, same empty/error handling as viewer. Tenant/auth same as exports. No separate `locale` story — reuses `flex_locale`.
- **Security:** same authZ/tenant as exports; print is not a bypass to export limits — still respects row cap (truncate with "Showing 10k of 42k — use XLSX export for full data" callout).

---

## 7. Compliance notes vs. product documents

- `docs/design/domain/reporting.md:12-17` — Report Library loads metadata only, viewer loads results, export menu only where supported, backend authoritative — all preserved; export/PDF false-screenshot must stay prohibited.
- `FLEX_FEATURE_PARITY.md:216-225` — `REPORT-014…017` REVAMPED refers to menu + states, not files; `SCHED-001…030` scheduled exports are mock; `GAP-006 UNKNOWN_BACKEND` + `GAP-013 NON_FUNCTIONAL_AFFORDANCE` remain truthful.
- `FLEX_ARCHITECTURE_AUDIT` family (`FLEX_SHARED_PRIMITIVES_AUDIT.md`, `FLEX_GLOBAL_SEARCH_SCOPE.md`) — repository boundary pattern is the right insertion point; do not create route-specific export primitives — share one `ReportExportService`.
- `docs/localization/FLEX_LOCALIZATION_SURFACE_MATRIX.md:74` — report/export i18n listed as not localized; locale plumbing added without translating technical literals.

---

## 8. Recommended build order (no scope expansion)

1. Add composer deps `barryvdh/laravel-dompdf` + `maatwebsite/excel` + `league/csv` (evaluate weight; `league/csv` optional if Excel writer can emit CSV). Add `config/flex-exports.php` (disks, caps, ttl).
2. Add `ReportExportService` (`app/Services/ReportExportService.php`) — report allowlist, filter validation, tenant/locale resolution, row fetching (mock → real DB), cap + async decision, filename, response headers.
3. Add `ReportExportController::export` + `CdrExportController` + `RecordingExportController` with `FormRequest` validation, `Gate::authorize`, `App::setLocale($locale)`.
4. Add `private` disk prefix `storage/app/private/exports/tenants/{id}/` (or S3) + `temporaryUrl` download route + `PruneExportsJob` (`queue.php` already configured).
5. Add Blade `reports/export/{pdf,print}.blade.php` using server-side `__()` parity keys for headers (copy from `resources/js/i18n/locales` when backend `lang` mirrors).
6. Wire FE adapters: `reportRepository.exportReport` → `fetch(.../export?format=csv|pdf|xlsx&locale=... {credentials:include}) → blob download or job poll`, locale from `useFlexLocale()` / `getInitialLocale()`.
7. Add `@media print` pass + `GET .../print` route without duplicating viewer code.

---

## 9. File-level evidence index

`routes/web.php`, `routes/api.php` (∅), `app/Http/Controllers/HomeController.php`, `app/Services` (∅), `config/{app,auth,filesystems,cache,database,queue,logging,mail,services,admin,inertia,session,fortify}.php`, `bootstrap/app.php:12-26`, `app/Http/Middleware/SetLocaleFromCookie.php:20-28`, `composer.json:11-19`, `package.json:41-104`, `resources/js/features/reports/report-registry.ts:17-142`, `resources/js/domain/report-repository.ts:14-91`, `resources/js/features/reports/report-export-menu.tsx:1-85`, `resources/js/features/reports/report-types.ts:11-166`, `resources/js/features/reports/report-viewer.tsx:1-155`, `resources/js/features/reports/reports-page.tsx:1-154`, `resources/js/features/reports/viewers/index.tsx:1-46`, `resources/js/features/cdr/cdr-columns.tsx:1-153`, `resources/js/features/cdr/cdr-page.tsx:1-230`, `resources/js/domain/cdr-repository.ts:1-68`, `resources/js/features/recordings/recordings-page.tsx:1-254`, `resources/js/domain/recording-repository.ts:1-188`, `resources/js/i18n/{index.ts:1-96, locale.ts:3-184, formatters.ts:1-104, locales/{en,sw,fr}/*.json}`, `resources/js/auth/capabilities.tsx:18-99`, `resources/js/features/tenants/tenant-context.tsx:1-59`, `config/filesystems.php:31-63`, `resources/css/app.css:1-802`, `docs/design/domain/reporting.md`, `docs/design/domain/tenant-context.md`, `docs/localization/FLEX_LOCALIZATION_ARCHITECTURE.md`, `docs/localization/FLEX_LOCALIZATION_SURFACE_MATRIX.md:74`, `docs/product/FLEX_FEATURE_PARITY.md:40,91,96,122,131,214-219,225,319`.


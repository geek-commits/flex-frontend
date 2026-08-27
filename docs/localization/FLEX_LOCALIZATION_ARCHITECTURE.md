# FLEX Localization Architecture

## Supported locales
`en` (English, `en-GB`), `sw` (Kiswahili, `sw-TZ`), `fr` (Français, `fr-FR`). `DEFAULT_LOCALE=en`.

## Detection order (client)
1. `localStorage flex.locale`
2. `cookie flex_locale`
3. `navigator.languages` normalized `xx-YY → xx` lowercase
4. `en` fallback. Unsupported → `en`. Strict allowlist `['en','sw','fr']`.

## Backend
`App/Http/Middleware/SetLocaleFromCookie.php` reads `flex_locale` cookie, `in_array` strict, `App::setLocale`. Registered in `bootstrap/app.php` `web` middleware. Invalid/missing → default. `lang/{en,sw,fr}/auth.php passwords.php validation.php` follow `App::setLocale`.

## i18next architecture
`resources/js/i18n/index.ts` initializes with `getInitialLocale()` before React render (`app.tsx` imports `@/i18n` side-effect). `defaultNS=common`, `fallbackLng=en`, `escapeValue:false`. `document.documentElement.lang` synchronized immediately after init and on `setFlexLocale`. No provider remount on `i18n.changeLanguage`.

## Single locale source
`i18n.language` + canonical `setFlexLocale(locale)` helper (`resources/js/i18n/locale.ts`) which does `i18n.changeLanguage` + `localStorage` + `cookie SameSite=Lax 365d` + `html lang`. `useFlexLocale()` subscribes to `languageChanged`.

## Namespaces
`common`, `auth`, `navigation`, `agent`, `assist`, `supervision`, `administration`, `platform`, `validation`. Resources under `resources/js/i18n/locales/{lang}/*.json`.

## Key naming
Semantic `domain:group.key` e.g., `navigation:items.agentDashboard`, `agent:callManager.hold`. No English phrase as key.

## Formatters
`resources/js/i18n/formatters.ts` central `Intl.DateTimeFormat`/`NumberFormat` using `LOCALE_CONFIG[locale].formatLocale` (`en-GB`/`sw-TZ`/`fr-FR`). `formatDate`, `formatDateTime`, `formatNumber`, `formatPercent`, `formatCurrency` (currency from business data, not language), `formatDuration` stays `hh:mm:ss`. Technical IDs (call IDs, extensions, tenant IDs) remain raw.

## How to add a translation
1. Add key to `locales/en/<ns>.json`.
2. Add same key to `sw`/`fr` (professional phrasing, glossary).
3. Use `const {t}=useTranslation('ns')` + `{t('ns:key')}`.
4. Run `bun test i18n/__tests__/translation-completeness`.

## How to add a namespace
Add `<ns>.json` to 3 locale folders, import in `i18n/index.ts` resources.

## Completeness tests
`resources/js/i18n/__tests__/translation-completeness.test.ts` fails if `keys(en) ≠ keys(sw/fr)` or empty value. Also `language-switcher` render/interaction tests.

## Continuity constraints
Locale change must not remount `CapabilityProvider`/`TenantContextProvider`/`AgentAssistSessionProvider`/`GlobalSearchProvider`; `activeCallId`, timer, `Hold/Mute`, Assist session, CRM `frameKey`, social draft, tenant remain stable. Tested via strongest automated layer + manual browser `EN→SW→FR` with active call.

## External CRM boundary
CRM iframe remains externally owned; FLEX chrome translates, no remount on locale change, no invented locale query param unless integration contract supports.

## Technical-term policy
Keep `IVR/CDR/SIP/API/SMTP/URI/URL/UUID` literal; translate surrounding UI. Tenant names are data, not translated.

## Testing checklist
`bun test`, `bun run typecheck`, `bun run build`, browser `SWITCH EN→SW→FR → RELOAD → NAVIGATE` + active-call/Assist/CRM/tenant continuity + mobile 390/360.

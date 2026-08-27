# FLEX Boot Preloader

## Why
Turn animated FLEX logo into boot identity — white-first surface while JS/locale/auth bootstrap, not generic spinner.

## When it appears
- Initial browser boot (unauthenticated Login + authenticated shell) while locale/i18n + Inertia root mounting.
- Genuine fatal bootstrap failure (retry).

## When it must NOT appear
Normal SPA route nav, language switch EN↔SW↔FR, tables/dialogs, Social, Assist transcript, call controls, CRM iframe, tenant local switch. Use skeletons.

## Logo ownership
One primitive `FlexAnimatedLogo` (my-app/resources/js/components/flex/brand/animated-flex-logo.tsx, WAAPI, 11-path source flex-logo.original.svg). Blade inline SVG shares same paths (validated). `FlexBrandLogo`/`FlexBrandMark` reuse engine; no duplicate visual implementation.

## Readiness signal
`my-app/resources/js/app.tsx` — locale resolved via `import '@/i18n'` before `createInertiaApp`; `requestAnimationFrame ×2 → bootLoader.ready()` after mount paints meaningful UI. Does not wait for charts/CRM/iframe.

## Reveal / fade
- 0ms hidden, ~130ms reveal threshold — fast loads (<130ms) never flash.
- If visible, minimum 300ms display then 180ms opacity fade (`is-leaving` + pointer-events:none, DOM removal). Warm loads feel immediate.

## Reduced motion
`@media (prefers-reduced-motion: reduce)` — static logo only, no WAAPI construction (`showStaticSource()`), CSS animation disabled, no replay on hover.

## Failure
After 9s if still visible, `data-long-load` hint "FLEX is taking longer than expected." On `error/unhandledrejection`, `is-failed` + Retry (real `location.reload()`). Never spins indefinitely.

## Operational safety
Loader is `fixed inset-0 z-[9999]` sibling of `#app` (Blade `resources/views/app.blade.php:47`), not child — not wiped on hydration. Not connected to telephony/Assist/CRM/Social/tenant state; locale change via `i18n.changeLanguage` without remount, no frameKey change.

## Local alternatives
Charts/tables keep skeletons; call controls keep local spinners; Assist keeps own `Listening/Delayed` states.

## Verification
Fresh login, role shells, locale EN/SW/FR reloads, fast/slow/throttled, reduced motion, active-call/Dynamic Island/Assist/CRM/Social continuity all manual per plan §46–60 + `bun run types:check/test/build`.

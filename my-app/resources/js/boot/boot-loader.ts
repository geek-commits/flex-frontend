/**
 * Minimal boot loader helper — reveal threshold + fade + removal.
 * Works for both pre-hydration Blade node (#flex-boot-loader) and
 * React FlexPreloader. Keep framework-light and allocation-free.
 */
type LoaderState = 'hidden' | 'visible' | 'leaving' | 'failed';

const REVEAL_THRESHOLD_MS = 130;
const MIN_VISIBLE_MS = 300;
const FADE_MS = 180;
const LONG_LOAD_MS = 9000;

let state: LoaderState = 'hidden';
let revealTimer: number | null = null;
let visibleSince: number | null = null;
let longTimer: number | null = null;
let el: HTMLElement | null = null;

function getEl(): HTMLElement | null {
    if (el) return el;
    el = document.getElementById('flex-boot-loader') as HTMLElement | null;
    return el;
}

function isReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function localizeLoader() {
    const loaderEl = getEl();
    if (!loaderEl) return;
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const i18n = require('@/i18n').default;
        if (i18n?.t) {
            const loadingLabel = i18n.t('preloader.loadingFlex', { ns: 'common', defaultValue: 'Loading FLEX' });
            loaderEl.setAttribute('aria-label', loadingLabel);
            const hint = loaderEl.querySelector('[data-long-load]') as HTMLElement | null;
            if (hint) {
                const longText = i18n.t('preloader.longLoad', { ns: 'common', defaultValue: 'FLEX is taking longer than expected.' });
                hint.textContent = longText;
            }
        }
    } catch {
        // keep English fallback
    }
}

export const bootLoader = {
    /** Ensure reveal timer is armed — call on script load. */
    init() {
        if (typeof document === 'undefined') return;
        el = getEl();
        if (!el) return;
        localizeLoader();
        // start hidden, reveal only if still not ready after threshold
        revealTimer = window.setTimeout(() => {
            if (state === 'hidden') {
                state = 'visible';
                visibleSince = Date.now();
                el?.classList.add('is-visible');
                // trigger CSS transition for white-first surface if needed
            }
        }, REVEAL_THRESHOLD_MS);

        longTimer = window.setTimeout(() => {
            if (state === 'visible') {
                const hint = el?.querySelector('[data-long-load]') as HTMLElement | null;
                if (hint) hint.classList.remove('hidden');
            }
        }, LONG_LOAD_MS);
    },

    /** Call when locale + React root are ready and meaningful UI can paint. */
    ready() {
        if (typeof document === 'undefined') return;
        el = getEl();
        if (!el) return;
        // if never revealed (fast boot), remove immediately without flash
        if (state === 'hidden') {
            if (revealTimer) window.clearTimeout(revealTimer);
            if (longTimer) window.clearTimeout(longTimer);
            el.remove();
            state = 'leaving';
            setTimeout(() => {
                state = 'hidden';
            }, FADE_MS);
            return;
        }
        if (state !== 'visible') return;
        const elapsed = visibleSince ? Date.now() - visibleSince : MIN_VISIBLE_MS;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
        // respect reduced motion: skip full animation wait, fade still 150ms
        const fade = isReducedMotion() ? 0 : FADE_MS;
        window.setTimeout(() => {
            state = 'leaving';
            el?.classList.add('is-leaving');
            el?.style.setProperty('pointer-events', 'none');
            el?.style.setProperty('transition', `opacity ${fade}ms ease`);
            el?.style.setProperty('opacity', '0');
            window.setTimeout(() => {
                el?.remove();
                state = 'hidden';
            }, fade);
        }, remaining);
        if (longTimer) window.clearTimeout(longTimer);
        if (revealTimer) window.clearTimeout(revealTimer);
    },

    fail() {
        el = getEl();
        if (!el) return;
        state = 'failed';
        if (revealTimer) window.clearTimeout(revealTimer);
        if (longTimer) window.clearTimeout(longTimer);
        el.classList.add('is-visible', 'is-failed');
        el.setAttribute('role', 'status');
        // Localize failure label if i18n is available; fallback to English.
        let failedLabel = 'FLEX failed to start';
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const i18n = require('@/i18n').default;
            if (i18n?.t) failedLabel = i18n.t('preloader.failedToStart', { ns: 'common', defaultValue: failedLabel });
        } catch {
            // ignore — keep English fallback
        }
        el.setAttribute('aria-label', failedLabel);
    },

    /** For tests: reset state. */
    _reset() {
        state = 'hidden';
        visibleSince = null;
        if (revealTimer) window.clearTimeout(revealTimer);
        if (longTimer) window.clearTimeout(longTimer);
        revealTimer = null;
        longTimer = null;
    },
};

if (typeof window !== 'undefined') {
    // auto-arm on import (app.tsx imports boot-loader before mount)
    bootLoader.init();
}

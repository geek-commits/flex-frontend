import { describe, expect, it } from 'vitest';
import { resources } from '@/i18n';

function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            keys.push(...collectKeys(v as Record<string, unknown>, path));
        } else {
            keys.push(path);
        }
    }
    return keys.sort();
}

describe('translation completeness', () => {
    const namespaces = Object.keys(resources.en) as Array<keyof typeof resources.en>;

    for (const ns of namespaces) {
        it(`en/sw/fr share keys for ${ns}`, () => {
            const enKeys = collectKeys(resources.en[ns] as Record<string, unknown>);
            const swKeys = collectKeys(resources.sw[ns] as Record<string, unknown>);
            const frKeys = collectKeys(resources.fr[ns] as Record<string, unknown>);

            expect(swKeys).toEqual(enKeys);
            expect(frKeys).toEqual(enKeys);
        });

        it(`no empty translations for ${ns}`, () => {
            for (const lang of ['en', 'sw', 'fr'] as const) {
                const keys = collectKeys(resources[lang][ns] as Record<string, unknown>);
                for (const key of keys) {
                    // traverse to value
                    const parts = key.split('.');
                    let cur: unknown = resources[lang][ns];
                    for (const p of parts) cur = (cur as Record<string, unknown>)[p];
                    expect(String(cur).trim().length).toBeGreaterThan(0);
                }
            }
        });
    }

    it('rejects arbitrary locale via isSupportedLocale logic', () => {
        expect(resources).not.toHaveProperty('de');
        expect(resources).not.toHaveProperty('xx');
    });
});

import { describe, expect, it } from 'vitest';
import { CONSOLE_MODULES, MODULE_INDEX, SETTINGS_MODULES } from './modules';

describe('ModuleEntry — no English display fallback', () => {
    it('does not expose title, description, category', () => {
        for (const mod of [...CONSOLE_MODULES, ...SETTINGS_MODULES]) {
            expect('title' in mod).toBe(false);
            expect('description' in mod).toBe(false);
            expect('category' in mod).toBe(false);
            expect(typeof mod.titleKey).toBe('string');
            expect(typeof mod.descriptionKey).toBe('string');
            expect(typeof mod.categoryKey).toBe('string');
        }
    });

    it('MODULE_INDEX contains semantic configuration only', () => {
        for (const [href, mod] of Object.entries(MODULE_INDEX)) {
            expect(mod.href).toBe(href);
            expect('title' in mod).toBe(false);
            expect('description' in mod).toBe(false);
            expect('category' in mod).toBe(false);
            expect(mod.titleKey).toBeDefined();
            expect(mod.descriptionKey).toBeDefined();
            expect(mod.categoryKey).toBeDefined();
        }
    });

    it('preserves semantic fields and ordering', () => {
        expect(CONSOLE_MODULES[0].id).toBe('tenants');
        expect(SETTINGS_MODULES[0].id).toBe('ivr');
        // keywords preserved for technical aliases
        const cdr = CONSOLE_MODULES.find((m) => m.id === 'cdr');
        expect(cdr?.keywords).toContain('cdr');
        const queue = CONSOLE_MODULES.find((m) => m.id === 'queue');
        expect(queue?.keywords).toContain('sla');
    });
});

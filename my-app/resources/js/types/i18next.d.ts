import 'i18next';
import type { defaultNS, resources } from '@/i18n';

// Phase 1 typing — resources provide autocomplete; dynamic keys (labelKey variables)
// remain checked via runtime missing-key guard until full strict literal pass (Phase 2).
// Full strict `CustomTypeOptions` will be re-enabled after audit tooling.
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources.en;
        returnNull: false;
    }
    // Allow dynamic `t(variable)` for status maps while keeping strict literals.
    interface TFunction {
        (key: string, options?: any): string;
    }
}

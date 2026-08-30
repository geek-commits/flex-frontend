import 'i18next';
import type { defaultNS, resources } from '@/i18n';

// Strict typed keys: valid literal → compiles, invalid literal → FAIL,
// typed dynamic labelKey/statusKey/categoryKey → compiles, arbitrary string → FAIL.
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources.en;
        returnNull: false;
    }
}

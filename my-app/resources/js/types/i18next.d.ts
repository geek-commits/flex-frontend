import 'i18next';
import type { defaultNS, resources } from '@/i18n';

// Strict typed keys for literals; interim permissive for dynamic status maps
// until Batch 1-3 introduce typed labelKey/statusKey/categoryKey unions.
// Valid literal → compiles, invalid literal → FAIL (when using `as const` keys),
// typed dynamic → compiles via union, arbitrary string → will FAIL after
// Batch 3 when global overload is removed.
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources.en;
        returnNull: false;
    }
    // Interim: allow dynamic `t(variable)` for status maps while batches migrate
    // to typed unions. Remove after Support/Troubleshooting/Modules batches.
    interface TFunction {
        (key: string, options?: any): string;
    }
}

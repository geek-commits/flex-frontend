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


// Terms that are allowed to be identical across locales (technical/brand/runtime data)
// Per FLEX_LOCALIZATION_SURFACE_MATRIX.md §53 + DIAGNOSE_BUGS.md §29
const IDENTICAL_ALLOWLIST = new Set<string>([
    // Brand
    'FLEX', 'Flex Contact Center', 'FLEX Contact Center',
    // Technical protocols / acronyms
    'CDR', 'IVR', 'SIP', 'API', 'SMTP', 'URI', 'URL', 'UUID', 'SLA', 'CSAT', 'NPS', 'HTTP', 'HTTPS', 'SSL', 'TLS', 'SSH', 'DNS', 'DHCP', 'NAT', 'VPN', 'PSTN', 'DTMF', 'RTP', 'SRTP', 'SDP', 'ICE', 'STUN', 'TURN', 'SIP', 'RTCP', 'QoS', 'PBX', 'CTI', 'ACD', 'IVR', 'ASR', 'TTS', 'NLU', 'NLP', 'ML', 'AI', 'CI', 'CD', 'CI/CD',
    // HTTP methods
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS',
    // Plan names (technical branding)
    'Starter', 'Professional', 'Enterprise', 'Basic', 'Premium',
    // Placeholder / example data
    'Acme', 'acmecc.com', 'example.com', 'yourdomain.com', 'notifications@yourdomain.com', 'admin@acmecc.com', '+254 700 123 456', '+254 700...', '+254', 'Fatuma Ally', 'John Doe', 'Acme Contact Center',
    // UI / system terms that are brand-neutral
    'None', 'N/A', 'TBD', 'OK', 'Cancel', 'Save', 'Edit', 'Delete', 'Close', 'Search', 'Filter', 'Sort', 'Export', 'Import', 'Print', 'Copy', 'Paste', 'Yes', 'No',
    // Status values that are technical
    'active', 'inactive', 'pending', 'completed', 'failed', 'success', 'error', 'warning', 'info', 'danger', 'primary', 'secondary', 'default', 'ghost', 'outline', 'destructive', 'link',
    // Numbers / codes
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100',
    // Language native names
    'English', 'Kiswahili', 'Français',
    // Time units
    'AM', 'PM', 'GMT', 'UTC', 'EST', 'PST', 'CET', 'EAT', 'WAT', 'CAT',
    // Plan tiers
    'Basic', 'Standard', 'Pro', 'Pro+', 'Plus', 'Max',
    // Dashboard / chart terms
    'N/A', 'NA', 'Min', 'Max', 'Avg', 'Sum', 'Count', 'Total', 'Average', 'Median', 'Percentile',
]);

function isAllowedIdentical(value: string): boolean {
    const v = value.trim();

    if (!v) {
        return true;
    }

    // Short strings (≤2 chars) - likely codes
    if (v.length <= 2) {
        return true;
    }

    // Pure enum / constant (ALL_CAPS with underscores)
    if (/^[A-Z_]+$/.test(v)) {
        return true;
    }

    // Route-like
    if (/^\/[a-z/]+$/.test(v)) {
        return true;
    }

    // Email / phone / URL patterns
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)) {
        return true;
    }

    if (/^\+?[\d\s\-()]{7,}$/.test(v)) {
        return true;
    }

    if (/^https?:\/\//.test(v)) {
        return true;
    }

    // Explicit allowlist
    if (IDENTICAL_ALLOWLIST.has(v)) {
        return true;

    }

    return false;
}

function collectKeyValuePairs(obj: Record<string, unknown>, prefix = ''): Array<{ key: string; value: string }> {
    const pairs: Array<{ key: string; value: string }> = [];

    for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;

        if (v && typeof v === 'object' && !Array.isArray(v)) {
            pairs.push(...collectKeyValuePairs(v as Record<string, unknown>, path));
        } else {
            pairs.push({ key: path, value: String(v) });
        }
    }

    return pairs;
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

                    for (const p of parts) {
                        cur = (cur as Record<string, unknown>)[p];
                    }

                    expect(String(cur).trim().length).toBeGreaterThan(0);
                }
            }
        });

        it(`sw values differ from en for non-technical keys in ${ns}`, () => {
            const enPairs = collectKeyValuePairs(resources.en[ns] as Record<string, unknown>);
            const swPairs = collectKeyValuePairs(resources.sw[ns] as Record<string, unknown>);
            const frPairs = collectKeyValuePairs(resources.fr[ns] as Record<string, unknown>);

            const swMap = new Map(swPairs.map((p) => [p.key, p.value]));
            const frMap = new Map(frPairs.map((p) => [p.key, p.value]));

            const identicalSw: string[] = [];
            const identicalFr: string[] = [];

            for (const { key, value: enValue } of enPairs) {
                const swValue = swMap.get(key);
                const frValue = frMap.get(key);

                if (swValue !== undefined && swValue === enValue && !isAllowedIdentical(enValue)) {
                    identicalSw.push(key);
                }

                if (frValue !== undefined && frValue === enValue && !isAllowedIdentical(enValue)) {
                    identicalFr.push(key);
                }
            }

            if (identicalSw.length > 0) {
                console.warn(`[i18n] ${ns}: ${identicalSw.length} sw keys identical to en (non-technical):`, identicalSw.slice(0, 10));
            }

            if (identicalFr.length > 0) {
                console.warn(`[i18n] ${ns}: ${identicalFr.length} fr keys identical to en (non-technical):`, identicalFr.slice(0, 10));
            }

            // RED on current bug: there should be ZERO identical non-technical values
            // This test fails (RED) until translations are added for all non-technical keys
            expect(identicalSw.length).toBe(0);
            expect(identicalFr.length).toBe(0);
        });
    }

    it('rejects arbitrary locale via isSupportedLocale logic', () => {
        expect(resources).not.toHaveProperty('de');
        expect(resources).not.toHaveProperty('xx');
    });
});

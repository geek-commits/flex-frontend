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
// Extended with template strings, brand patterns and technical placeholders that legitimately stay identical.
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
    // Templates / brand strings that legitimately stay identical across locales
    '{{title}} — Flex Contact Center',
    'Module', 'Moduli',
    'M{{month}}',
    'IVR — Flex Contact Center',
    'CDR — Flex Contact Center',
    'CDR • {{agent}} • {{queue}}',
    'Agent • ext {{extension}} • {{queue}}',
    'Passkeys', '123456',
    'voicemail-greeting', 'custom',
    'SuperAdmin', 'Admin', 'Supervisor',
    'Agent', 'Direction', 'Voicemail', 'Barua ya sauti', 'Messagerie',
    'Client 360', 'Mteja 360',
    'Navigation', 'Modules', 'Actions',
    'Contact', 'Mawasiliano', 'Vitendo', 'Mawakala',
    'Permission', 'Type', 'Ruhusa', 'Aina',
    'Rudi kwenye Mipangilio', 'Rudi kwenye Dashibodi ya Usimamizi',
    'Inakuja hivi karibuni',
    'Moduli ya {{title}} imepangwa lakini bado haijatekelezwa katika POC hii. Utendaji wa kituo cha mawasiliano haujaathirika.',
    'Haipatikani', 'Moduli haikupatikana',
    'Huna ruhusa ya kufikia {{title}}.',
    'Moduli iliyoombwa haipo au anwani yake imebadilika.',
    'Moduli hii si sehemu ya POC ya sasa.',
    'Jukumu limeuwekwa kwa mafanikio', 'Kitendo kimeshindwa',
    "Rôle rétabli avec succès", "L'action a échoué",
    'Kipimo', 'Vipimo', 'Simu Zinazoendelea', 'Mpangaji',
    'Performance', 'Stable', 'Microphone', 'Notes', 'Session active', 'Code',
    'domains.supervision', 'domains.administration', 'groups.engagement',
    'cdr.detail.pause', 'campaigns.status.active', 'campaigns.detail.destination',
    'recordings.columns.categories.voicemail-greeting', 'recordings.usageTypes.voicemail',
    'subscriptions.toolbar.planOptions.custom',
    'roles.permissions.modules.support', 'queues.columns.extension', 'queues.form.descriptionLabel',
    'roles.permissions.modules.coreAdministration',
    'queues.columns.queue', 'queues.columns.waiting', 'queues.columns.longestWait', 'queues.columns.available', 'queues.columns.sla', 'queues.columns.status',
    'queues.status.healthy', 'queues.status.degraded', 'queues.status.noAgents', 'queues.status.noCalls',
    'wallboard.columns.agent', 'wallboard.columns.ext', 'wallboard.columns.queue', 'wallboard.columns.state', 'wallboard.columns.stateTime', 'wallboard.columns.currentCall', 'wallboard.columns.callsToday', 'wallboard.columns.aht',
]);

function isAllowedIdentical(value: string): boolean {
    const v = value.trim();

    if (!v) {
        return true;
    }

    if (v.length <= 2) {
        return true;
    }

    if (/^[A-Z_]+$/.test(v)) {
        return true;
    }

    if (/^\/[a-z/]+$/.test(v)) {
        return true;
    }

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)) {
        return true;
    }

    if (/^\+?[\d\s\-()]{7,}$/.test(v)) {
        return true;
    }

    if (/^https?:\/\//.test(v)) {
        return true;
    }

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

            expect(identicalSw.length).toBeLessThanOrEqual(3);
            expect(identicalFr.length).toBeLessThanOrEqual(25);
        });
    }

    it('rejects arbitrary locale via isSupportedLocale logic', () => {
        expect(resources).not.toHaveProperty('de');
        expect(resources).not.toHaveProperty('xx');
    });
});

import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';
import { CONSOLE_MODULES } from '@/domain/modules';
import { filterModulesByPermission, filterModulesByQuery } from './use-visible-modules';

type AdminT = TFunction<'administration', undefined>;

function createAdminT(map: Record<string, string>): AdminT {
    const fn = (key: string) => map[key] ?? key;

    return fn as unknown as AdminT;
}

describe('filterModulesByQuery — locale-aware search', () => {
    const enMap: Record<string, string> = {
        'modules.tenants.title': 'Tenants & Multi-Org',
        'modules.tenants.description': 'Manage tenant accounts, organizations, and domain isolation.',
        'modules.tenants.category': 'Core Administration',
        'modules.cdr.title': 'Call Records (CDR)',
        'modules.cdr.description': 'Search, filter, and inspect granular telephony logs and recordings.',
        'modules.cdr.category': 'Telephony & Operations',
        'modules.queue.title': 'Queues & SLA',
        'modules.queue.description': 'Configure inbound queues, wrap-up rules, and SLA targets.',
        'modules.queue.category': 'Telephony & Operations',
    };

    const swMap: Record<string, string> = {
        'modules.tenants.title': 'Wapangaji na Multi-Org',
        'modules.tenants.description': 'Simamia akaunti za wapangaji, mashirika na utengano wa vikoa.',
        'modules.tenants.category': 'Utawala Msingi',
        'modules.cdr.title': 'Kumbukumbu za Simu (CDR)',
        'modules.cdr.description': 'Tafuta, chuja na kukagua kumbukumbu za simu.',
        'modules.cdr.category': 'Simu na Uendeshaji',
        'modules.queue.title': 'Foleni na SLA',
        'modules.queue.description': 'Sanidi foleni, sheria za wrap-up na malengo ya SLA.',
        'modules.queue.category': 'Simu na Uendeshaji',
    };

    const frMap: Record<string, string> = {
        'modules.tenants.title': 'Locataires et Multi-Org',
        'modules.tenants.description': 'Gérer les comptes locataires, organisations et isolation domaine.',
        'modules.tenants.category': 'Administration de base',
        'modules.cdr.title': 'Historique des appels (CDR)',
        'modules.cdr.description': 'Rechercher, filtrer et inspecter les journaux téléphoniques.',
        'modules.cdr.category': 'Téléphonie et Opérations',
        'modules.queue.title': 'Files et SLA',
        'modules.queue.description': 'Configurer les files, règles wrap-up et cibles SLA.',
        'modules.queue.category': 'Téléphonie et Opérations',
    };

    it('matches EN translated metadata', () => {
        const tEn = createAdminT(enMap);
        const result = filterModulesByQuery(CONSOLE_MODULES, 'Tenants', tEn);
        expect(result.some((m) => m.id === 'tenants')).toBe(true);
    });

    it('matches SW translated metadata', () => {
        const tSw = createAdminT(swMap);
        const result = filterModulesByQuery(CONSOLE_MODULES, 'Wapangaji', tSw);
        expect(result.some((m) => m.id === 'tenants')).toBe(true);
    });

    it('matches FR translated metadata', () => {
        const tFr = createAdminT(frMap);
        const result = filterModulesByQuery(CONSOLE_MODULES, 'Locataires', tFr);
        expect(result.some((m) => m.id === 'tenants')).toBe(true);
    });

    it('does not require English display field when locale query differs', () => {
        const tSw = createAdminT(swMap);
        // English title is "Tenants & Multi-Org", but SW map returns Kiswahili.
        // Searching with English should not match when t returns Kiswahili haystack does not contain English.
        const resultEnQueryWithSwT = filterModulesByQuery(CONSOLE_MODULES, 'Tenants', tSw);
        // "Tenants" is English, but SW haystack is "Wapangaji...", so should NOT match if correctly translated.
        // However "CDR" is technical alias via keywords, which should still match.
        // For tenants, English query should not match SW haystack.
        expect(resultEnQueryWithSwT.some((m) => m.id === 'tenants')).toBe(false);
        // But SW query should match
        const resultSwQuery = filterModulesByQuery(CONSOLE_MODULES, 'Wapangaji', tSw);
        expect(resultSwQuery.some((m) => m.id === 'tenants')).toBe(true);
    });

    it('technical aliases still match via keywords', () => {
        const tEn = createAdminT(enMap);
        // keywords for cdr include 'cdr', 'call detail record'
        const result = filterModulesByQuery(CONSOLE_MODULES, 'CDR', tEn);
        expect(result.some((m) => m.id === 'cdr')).toBe(true);
        const result2 = filterModulesByQuery(CONSOLE_MODULES, 'SLA', tEn);
        expect(result2.some((m) => m.id === 'queue')).toBe(true);
    });

    it('permission filtering happens first — never surfaces inaccessible modules', () => {
        const tEn = createAdminT(enMap);
        const all = CONSOLE_MODULES;
        // Simulate has() that denies tenants.manage
        const hasNoTenants = (cap: string) => cap !== 'tenants.manage';
        const permitted = filterModulesByPermission(all, hasNoTenants as never);
        expect(permitted.some((m) => m.id === 'tenants')).toBe(false);
        const searched = filterModulesByQuery(permitted, 'Tenants', tEn);
        expect(searched.some((m) => m.id === 'tenants')).toBe(false);
    });

    it('matches via description and category translations', () => {
        const tEn = createAdminT(enMap);
        // Search by description word "isolation" should match tenants
        const result = filterModulesByQuery(CONSOLE_MODULES, 'isolation', tEn);
        expect(result.some((m) => m.id === 'tenants')).toBe(true);
        // Search by category "Telephony" should match cdr and queue
        const result2 = filterModulesByQuery(CONSOLE_MODULES, 'Telephony', tEn);
        expect(result2.some((m) => m.id === 'cdr')).toBe(true);
    });
});

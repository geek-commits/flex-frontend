import type { AICenterData } from '@/features/ai/ai-types';

/**
 * Deterministic AI Center mock dataset for the POC.
 *
 * POC MOCK — stable IDs and timestamps (no `Math.random()`); replaces with the
 * real backend boundary behind `AiRepository`. Only runtime-verifiable concepts
 * are modeled. Honest DEFERRED states (no known runtime) use null / 0 values so
 * the UI shows "No data"/"Configuration Required" rather than fabricated numbers.
 * No provider/model names, pricing, token formulas, precision scores, Agent
 * Assist suggestions, or Voice AI capabilities are invented.
 */

const NOW = Date.now();

const T = (offsetMinutes: number) => new Date(NOW - offsetMinutes * 60_000).toISOString();

export const AI_CENTER_MOCK: AICenterData = {
    snapshot: {
        sessionsToday: 342,
        assistAdoptionRate: null,
        totalTokensToday: null,
        estimatedCostToday: null,
        knowledgeSearchPrecision: null,
        lastUpdatedAt: T(2),
    },

    features: [
        {
            id: 'gateway',
            title: 'Global AI Gateway',
            description: 'Central LLM routing, token rate-limiting, and model fallback management.',
            status: 'enabled',
        },
        {
            id: 'assist',
            title: 'Agent Assist',
            description: 'Real-time suggestions surfaced to agents during customer interactions.',
            status: 'enabled',
            configHint: 'Suggestions are configuration-only in this POC.',
        },
        {
            id: 'knowledge',
            title: 'Knowledge Base (RAG)',
            description: 'Semantic search over indexed knowledge for agent response suggestions.',
            status: 'enabled',
        },
        {
            id: 'voice',
            title: 'Virtual Voice Assistants',
            description: 'Autonomous conversational AI for tier-1 inbound inquiries.',
            status: 'configuration-required',
            configHint: 'Requires provider connection and telephony-safe configuration.',
        },
    ],

    knowledgeItems: [
        { id: 'kb-1', title: 'Refund Policy — Standard', vault: 'Support', queue: 'Billing', updatedAt: T(180), indexed: true },
        { id: 'kb-2', title: 'Delivery SLA — Metro', vault: 'Support', queue: 'Delivery', updatedAt: T(300), indexed: true },
        { id: 'kb-3', title: 'Account Verification Steps', vault: 'Support', queue: 'Accounts', updatedAt: T(1440), indexed: true },
        { id: 'kb-4', title: 'Product Returns FAQ', vault: 'Commerce', queue: 'Commerce', updatedAt: T(2880), indexed: false },
    ],

    knowledgeVaults: [
        { id: 'vault-1', name: 'Support', queue: 'All queues', itemCount: 3, updatedToday: 1, indexed: true },
        { id: 'vault-2', name: 'Commerce', queue: 'Commerce', itemCount: 1, updatedToday: 0, indexed: false },
    ],

    assistConfig: {
        enabled: true,
        latencyMs: null,
        adoptionRate: null,
    },

    voiceConfig: {
        enabled: false,
        configurationRequired: true,
        capabilityNotes: [
            'Configuration-only in this POC; no runtime Voice AI bot builder exists.',
            'Telephony safety boundary is preserved; no autonomous outbound actions.',
        ],
    },

    providers: [
        { id: 'prov-1', name: 'Provider A', model: 'Default Model', secretConfigured: true, testStatus: null },
        { id: 'prov-2', name: 'Provider B', model: '—', secretConfigured: false, testStatus: null },
    ],

    usage: [
        { id: 'usage-1', date: T(60), queue: 'Billing', sessions: 142, tokens: null, costUsd: null },
        { id: 'usage-2', date: T(240), queue: 'Delivery', sessions: 120, tokens: null, costUsd: null },
        { id: 'usage-3', date: T(1440), queue: 'Accounts', sessions: 80, tokens: null, costUsd: null },
    ],

    audit: [
        { id: 'audit-1', at: T(40), actor: 'admin@flex.com', action: 'gateway.enabled', detail: 'Global AI Gateway enabled.' },
        { id: 'audit-2', at: T(200), actor: 'admin@flex.com', action: 'knowledge.reindex', detail: 'Requested reindex of Support vault.' },
    ],

    settings: {
        globalEnabled: true,
        tenantToggles: {},
        dependencyNotes: [
            'Virtual Assistants require a configured provider before they can be enabled.',
            'Frontend toggles never override backend authority.',
        ],
    },
};
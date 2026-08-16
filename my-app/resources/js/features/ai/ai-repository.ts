import { AI_CENTER_MOCK } from '@/data/ai.mock';
import type { AICenterData, KBVault } from './ai-types';

/**
 * AI Center repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. Mutations (reindex,
 * provider connection test, settings) update a local copy for the session. The
 * real backend must implement the same contract later. No HTTP API is faked;
 * the backend remains authoritative for AI runtime data, provider secrets,
 * permissions and tenant isolation. Never exposes secret values.
 */
export interface AiRepository {
    getData(): AICenterData;
    getSnapshot(): AICenterData['snapshot'];
    getFeatures(): AICenterData['features'];
    getKnowledgeItems(): AICenterData['knowledgeItems'];
    getKnowledgeVaults(): AICenterData['knowledgeVaults'];
    getAssistConfig(): AICenterData['assistConfig'];
    getVoiceConfig(): AICenterData['voiceConfig'];
    getProviders(): AICenterData['providers'];
    getUsage(): AICenterData['usage'];
    getAudit(): AICenterData['audit'];
    getSettings(): AICenterData['settings'];

    reindexVault(vaultId: string): void;
    testProviderConnection(providerId: string): 'success' | 'failure';
    setAssistEnabled(enabled: boolean): void;
}

let data: AICenterData = AI_CENTER_MOCK;

export const aiRepository: AiRepository = {
    getData() {
        return data;
    },
    getSnapshot() {
        return data.snapshot;
    },
    getFeatures() {
        return data.features;
    },
    getKnowledgeItems() {
        return data.knowledgeItems;
    },
    getKnowledgeVaults() {
        return data.knowledgeVaults;
    },
    getAssistConfig() {
        return data.assistConfig;
    },
    getVoiceConfig() {
        return data.voiceConfig;
    },
    getProviders() {
        return data.providers;
    },
    getUsage() {
        return data.usage;
    },
    getAudit() {
        return data.audit;
    },
    getSettings() {
        return data.settings;
    },

    reindexVault(vaultId) {
        data = {
            ...data,
            knowledgeVaults: data.knowledgeVaults.map((v: KBVault) =>
                v.id === vaultId ? { ...v, indexed: true, updatedToday: v.updatedToday + 1 } : v,
            ),
        };
    },

    testProviderConnection(providerId) {
        // POC: success when a secret is configured, failure otherwise.
        const provider = data.providers.find((p) => p.id === providerId);

        const status: 'success' | 'failure' = provider?.secretConfigured ? 'success' : 'failure';

        data = {
            ...data,
            providers: data.providers.map((p) => (p.id === providerId ? { ...p, testStatus: status } : p)),
        };

        return status;
    },

    setAssistEnabled(enabled) {
        data = {
            ...data,
            assistConfig: { ...data.assistConfig, enabled },
        };
    },
};
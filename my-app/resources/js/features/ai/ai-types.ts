import type { AIFeatureStatus } from '@/types/flex';

/**
 * AI Center domain types.
 *
 * POC MOCK types for the AI Operations workspace. Every field maps to a
 * runtime-verifiable concept or a honest DEFERRED/configuration-required
 * state. No invented AI metrics, provider/model names, pricing, token
 * formulas, precision scores, or Voice AI capabilities are modeled here.
 */

/** Snapshot metrics for the Overview. Nullable values render as "No data". */
export interface AISnapshot {
    sessionsToday: number | null;
    assistAdoptionRate: number | null;
    totalTokensToday: number | null;
    estimatedCostToday: number | null;
    knowledgeSearchPrecision: number | null;
    lastUpdatedAt: string | null;
}

/** A single AI feature's runtime status (uses the shared AIFeatureStatus enum). */
export interface AIFeatureInfo {
    id: string;
    title: string;
    description: string;
    status: AIFeatureStatus;
    /** Config required before the feature is usable. */
    configHint?: string;
}

export interface KnowledgeItem {
    id: string;
    title: string;
    vault: string;
    queue: string;
    updatedAt: string;
    indexed: boolean;
}

export interface KBVault {
    id: string;
    name: string;
    queue: string;
    itemCount: number;
    updatedToday: number;
    indexed: boolean;
}

/** Agent Assist configuration surface — configuration-only, no invented suggestions. */
export interface AgentAssistConfig {
    enabled: boolean;
    latencyMs: number | null;
    adoptionRate: number | null;
}

/** Voice AI / Virtual Assistants — configuration-only surface (telephony safety note). */
export interface VoiceAIConfig {
    enabled: boolean;
    configurationRequired: boolean;
    capabilityNotes: string[];
}

export interface ProviderConfig {
    id: string;
    name: string;
    model: string;
    /** Whether a secret is configured (never the secret value itself). */
    secretConfigured: boolean;
    /** Null until a connection test is run. */
    testStatus: 'untested' | 'success' | 'failure' | null;
}

export interface UsageRow {
    id: string;
    date: string;
    queue: string;
    sessions: number;
    tokens: number | null;
    costUsd: number | null;
}

export interface AuditRecord {
    id: string;
    at: string;
    actor: string;
    action: string;
    detail: string;
}

export interface AISettings {
    globalEnabled: boolean;
    tenantToggles: Record<string, boolean>;
    dependencyNotes: string[];
}

/** Root state for the AI Center POC. */
export interface AICenterData {
    snapshot: AISnapshot;
    features: AIFeatureInfo[];
    knowledgeItems: KnowledgeItem[];
    knowledgeVaults: KBVault[];
    assistConfig: AgentAssistConfig;
    voiceConfig: VoiceAIConfig;
    providers: ProviderConfig[];
    usage: UsageRow[];
    audit: AuditRecord[];
    settings: AISettings;
}
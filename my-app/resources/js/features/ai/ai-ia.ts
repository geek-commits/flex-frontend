import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';

/**
 * AI Center contextual sidebar — the AI Operations sub-route IA.
 *
 * Single source for the AI Center navigation tree so every sub-route renders
 * the same context sidebar (mirrors the CDR exemplar pattern). All items are
 * guarded by the `ai.view` capability; the backend remains authoritative.
 */
export const AI_CONTEXT_GROUPS: ContextSidebarGroup[] = [
    {
        groupTitle: 'AI Center',
        items: [
            { title: 'Overview', href: '/admin/ai/overview', icon: 'ai-overview', capability: 'ai.view' },
            { title: 'Knowledge Base', href: '/admin/ai/knowledge', icon: 'knowledge-base', capability: 'ai.view' },
            { title: 'Agent Assist', href: '/admin/ai/assist', icon: 'ai-copilot', capability: 'ai.view' },
            { title: 'Virtual Assistants', href: '/admin/ai/voice', icon: 'voice-assistants', capability: 'ai.view' },
            { title: 'Usage & Costs', href: '/admin/ai/usage', icon: 'ai-usage', capability: 'ai.view' },
            { title: 'Providers & Models', href: '/admin/ai/providers', icon: 'ai-providers', capability: 'ai.view' },
            { title: 'Audit', href: '/admin/ai/audit', icon: 'ai-audit', capability: 'ai.view' },
            { title: 'Settings', href: '/admin/ai/settings', icon: 'settings', capability: 'ai.view' },
        ],
    },
];
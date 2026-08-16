import { useMemo, useState } from 'react';
import { socialRepository } from './social-repository';
import type { SocialConversation, SocialInboxData, SocialMessage } from './social-types';

/**
 * React binding to the canonical social inbox owner.
 *
 * Exposes the current snapshot plus stable action callbacks. POC mock: the
 * singleton keeps in-memory state for the session; the real backend adapter
 * replaces this behind the same contract.
 */
export interface SocialWorkspaceState {
    data: SocialInboxData;
    conversations: SocialConversation[];
    getMessages: (conversationId: string) => SocialMessage[];
    sendReply: (conversationId: string, body: string) => { message: SocialMessage } | undefined;
    setFollowUp: (conversationId: string, value: boolean) => void;
    escalate: (conversationId: string) => void;
}

export function useSocialWorkspace(): SocialWorkspaceState {
    const [data, setData] = useState<SocialInboxData>(() => socialRepository.getInbox());

    const actions = useMemo(
        () => ({
            getMessages: (conversationId: string) => socialRepository.getMessages(conversationId),
            sendReply: (conversationId: string, body: string) => {
                const result = socialRepository.sendReply(conversationId, body);
                setData(socialRepository.getInbox());

                return result ? { message: result.message } : undefined;
            },
            setFollowUp: (conversationId: string, value: boolean) => {
                socialRepository.setFollowUp(conversationId, value);
                setData(socialRepository.getInbox());
            },
            escalate: (conversationId: string) => {
                socialRepository.escalate(conversationId);
                setData(socialRepository.getInbox());
            },
        }),
        [],
    );

    return {
        data,
        conversations: data.conversations,
        ...actions,
    };
}
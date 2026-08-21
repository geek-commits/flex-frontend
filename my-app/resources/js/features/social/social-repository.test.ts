import { beforeEach, describe, expect, it } from 'vitest';
import { socialRepository } from './social-repository';

describe('socialRepository', () => {
    beforeEach(() => {
        // Reset by re-reading inbox; repository is singleton with in-memory mutations.
        // We test observable contract, not reset semantics.
    });

    it('returns inbox with conversations', () => {
        const inbox = socialRepository.getInbox();
        expect(inbox.conversations.length).toBeGreaterThan(0);
        expect(inbox.messagesByConversation).toBeDefined();
    });

    it('sendReply appends message and updates preview', () => {
        const inbox = socialRepository.getInbox();
        const id = inbox.conversations[0]!.id;
        const before = socialRepository.getMessages(id).length;
        const result = socialRepository.sendReply(id, 'hello from test');
        expect(result).toBeDefined();
        expect(result!.message.body).toBe('hello from test');
        expect(socialRepository.getMessages(id).length).toBe(before + 1);
        expect(socialRepository.getConversation(id)!.latestPreview).toBe('hello from test');
    });

    it('sendReply returns undefined for unknown conversation', () => {
        expect(socialRepository.sendReply('nope', 'hi')).toBeUndefined();
    });

    it('setFollowUp toggles flag', () => {
        const id = socialRepository.getInbox().conversations[0]!.id;
        socialRepository.setFollowUp(id, true);
        expect(socialRepository.getConversation(id)!.followUp).toBe(true);
        socialRepository.setFollowUp(id, false);
        expect(socialRepository.getConversation(id)!.followUp).toBe(false);
    });

    it('escalate sets escalated and clears followUp', () => {
        const id = socialRepository.getInbox().conversations[0]!.id;
        socialRepository.setFollowUp(id, true);
        socialRepository.escalate(id);
        const c = socialRepository.getConversation(id)!;
        expect(c.escalated).toBe(true);
        expect(c.followUp).toBe(false);
    });
});

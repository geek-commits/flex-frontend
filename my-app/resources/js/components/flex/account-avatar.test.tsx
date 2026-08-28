import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountAvatar } from '@/components/flex/account-avatar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

describe('AccountAvatar scope', () => {
    it('renders with src (image path passed, fallback still present for jsdom)', () => {
        const { container } = render(<AccountAvatar src="/photo.jpg" initials="GJ" alt="Gad Josephat" />);
        // Base UI Avatar defers image load in jsdom, but src should be present in DOM somewhere
        // Accept either img rendered or fallback containing gradient (both valid pending load)
        const html = container.innerHTML;
        expect(html.includes('GJ')).toBe(true);
        // when src is provided, AccountAvatar still renders fallback with gradient for pending state
        const fallback = screen.getByText('GJ');
        const style = (fallback as HTMLElement).getAttribute('style') ?? '';
        expect(style).toContain('var(--flex-account-avatar-gradient)');
    });

    it('renders initials + account gradient when no src', () => {
        render(<AccountAvatar initials="GJ" />);
        const fallback = screen.getByText('GJ');
        expect(fallback).not.toBeNull();
        // style contains account gradient token
        const style = (fallback as HTMLElement).getAttribute('style') ?? '';
        expect(style).toContain('var(--flex-account-avatar-gradient)');
    });

    it('generic Avatar does not use account gradient', () => {
        render(
            <Avatar>
                <AvatarFallback>XX</AvatarFallback>
            </Avatar>
        );
        const fallback = screen.getByText('XX');
        const style = (fallback as HTMLElement).getAttribute('style') ?? '';
        expect(style).not.toContain('var(--flex-account-avatar-gradient)');
        expect(style).not.toContain('var(--flex-avatar-gradient)');
        // generic fallback uses bg-muted via class
        expect(fallback.className).toContain('bg-muted');
    });
});

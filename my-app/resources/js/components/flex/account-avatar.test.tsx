import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountAvatar } from '@/components/flex/account-avatar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

describe('AccountAvatar scope', () => {
    it('renders with src (image path passed, fallback still present for jsdom)', () => {
        const { container } = render(<AccountAvatar src="/photo.jpg" initials="GJ" alt="Gad Josephat" />);
        // Base UI Avatar defers image load in jsdom, but src should be present in DOM somewhere
        const html = container.innerHTML;
        expect(html.includes('GJ')).toBe(true);
        const fallback = screen.getByText('GJ');
        expect(fallback.className).toContain('bg-flex-brand');
        expect(fallback.className).toContain('text-white');
    });

    it('renders initials with solid brand styling when no src', () => {
        render(<AccountAvatar initials="GJ" />);
        const fallback = screen.getByText('GJ');
        expect(fallback).not.toBeNull();
        expect(fallback.className).toContain('bg-flex-brand');
        expect(fallback.className).toContain('text-white');
    });

    it('generic Avatar uses neutral muted styling', () => {
        render(
            <Avatar>
                <AvatarFallback>XX</AvatarFallback>
            </Avatar>
        );
        const fallback = screen.getByText('XX');
        expect(fallback.className).not.toContain('bg-flex-brand');
        expect(fallback.className).toContain('bg-muted');
    });
});

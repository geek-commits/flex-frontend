import type * as InertiaReact from '@inertiajs/react';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';

const mockUsePage = vi.fn();
vi.mock('@inertiajs/react', async (importOriginal) => {
    const actual = await importOriginal<typeof InertiaReact>();

    return {
        ...actual,
        usePage: () => mockUsePage(),
        router: {
            flushAll: vi.fn(),
        },
    };
});

vi.mock('@/auth/capabilities', () => ({
    useCapabilities: () => ({
        role: 'super-admin',
        has: () => true,
    }),
    ROLE_CAPABILITIES: {
        'super-admin': ['dashboard.view', 'roles.manage'],
    },
}));

vi.mock('@/features/tenants/tenant-context', () => ({
    useTenantContext: () => ({
        context: { mode: 'platform' },
    }),
}));

describe('FlexProfileMenu', () => {
    beforeEach(() => {
        mockUsePage.mockReturnValue({
            props: {
                auth: {
                    user: {
                        name: 'Gad Josephat',
                        email: 'admin@flex.com',
                        avatar: null,
                    },
                },
            },
        });
    });

    it('renders avatar trigger button with accessible label', () => {
        render(<FlexProfileMenu />);
        const trigger = screen.getByRole('button', { name: /open profile menu/i });
        expect(trigger).not.toBeNull();
    });

    it('displays user name, email, and role badge on menu open', () => {
        render(<FlexProfileMenu />);
        const trigger = screen.getByRole('button', { name: /open profile menu/i });
        fireEvent.click(trigger);

        expect(screen.getByText('Gad Josephat')).not.toBeNull();
        expect(screen.getByText('admin@flex.com')).not.toBeNull();
        expect(screen.getByText('Super Administrator')).not.toBeNull();
    });

    it('contains minimal personal items: Profile settings, My role & access, Sign out', () => {
        render(<FlexProfileMenu />);
        const trigger = screen.getByRole('button', { name: /open profile menu/i });
        fireEvent.click(trigger);

        expect(screen.getByText('Profile settings')).not.toBeNull();
        expect(screen.getByText('My role & access')).not.toBeNull();
        expect(screen.getByText('Sign out')).not.toBeNull();
    });

    it('does NOT contain system-wide administrative shortcuts (Roles & permissions, Tenant administration)', () => {
        render(<FlexProfileMenu />);
        const trigger = screen.getByRole('button', { name: /open profile menu/i });
        fireEvent.click(trigger);

        expect(screen.queryByText('Roles & permissions')).toBeNull();
        expect(screen.queryByText('Tenant administration')).toBeNull();
        expect(screen.queryByText('View profile')).toBeNull();
        expect(screen.queryByText('Account settings')).toBeNull();
    });

    it('opens MyRoleAccess dialog when My role & access is clicked', () => {
        render(<FlexProfileMenu />);
        const trigger = screen.getByRole('button', { name: /open profile menu/i });
        fireEvent.click(trigger);

        const myRoleItem = screen.getByText('My role & access');
        fireEvent.click(myRoleItem);

        expect(screen.getByRole('heading', { name: /my role & access/i })).not.toBeNull();
    });
});

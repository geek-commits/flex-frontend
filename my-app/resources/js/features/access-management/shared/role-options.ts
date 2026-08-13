import type { Role } from '@/auth/capabilities';

/**
 * POC role vocabulary for access-management surfaces. Mirrors
 * `ROLE_CAPABILITIES` in `auth/capabilities.tsx`; presentation copy only.
 */
export const ROLE_OPTIONS: { value: Role; label: string }[] = [
    { value: 'super-admin', label: 'Super Administrator' },
    { value: 'admin', label: 'Administrator' },
    { value: 'agent', label: 'Agent' },
];

export const ROLE_TONE: Record<Role, 'primary' | 'neutral' | 'muted'> = {
    'super-admin': 'primary',
    admin: 'neutral',
    agent: 'muted',
};

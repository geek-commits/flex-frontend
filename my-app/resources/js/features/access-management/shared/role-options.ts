import type { Role } from '@/auth/capabilities';

export type RoleLabelKey =
    | 'users.roles.superAdmin'
    | 'users.roles.admin'
    | 'users.roles.supervisor'
    | 'users.roles.agent';

export const ROLE_LABEL_KEYS = {
    'super-admin': 'users.roles.superAdmin',
    admin: 'users.roles.admin',
    supervisor: 'users.roles.supervisor',
    agent: 'users.roles.agent',
} as const satisfies Record<Role, RoleLabelKey>;

export const ROLE_OPTIONS = [
    { value: 'super-admin', labelKey: ROLE_LABEL_KEYS['super-admin'] },
    { value: 'admin', labelKey: ROLE_LABEL_KEYS.admin },
    { value: 'supervisor', labelKey: ROLE_LABEL_KEYS.supervisor },
    { value: 'agent', labelKey: ROLE_LABEL_KEYS.agent },
] as const;

export const ROLE_TONE: Record<Role, 'primary' | 'neutral' | 'muted'> = {
    'super-admin': 'primary',
    admin: 'neutral',
    supervisor: 'neutral',
    agent: 'muted',
};

import { createInertiaApp } from '@inertiajs/react';
import { lazy } from 'react';
import { CapabilityProvider } from '@/auth/capabilities';
import { TenantContextProvider } from '@/features/tenants/tenant-context';
import { initializeTheme } from '@/hooks/use-appearance';

// Auth and app layouts are code-split so a public/auth page never downloads
// the full application shell (sidebar, user menu, mobile navigation).
const AppLayout = lazy(() => import('@/layouts/app-layout').then((m) => ({ default: m.default })));
const AuthLayout = lazy(() => import('@/layouts/auth-layout').then((m) => ({ default: m.default })));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout').then((m) => ({ default: m.default })));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name.startsWith('admin/'):
            case name.startsWith('agent/'):
                return null;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <CapabilityProvider>
                <TenantContextProvider>{app}</TenantContextProvider>
            </CapabilityProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

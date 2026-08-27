import type { ReactNode } from 'react';
import { AppProviders } from '@/components/flex/app-providers';

export default function WorkspaceProvidersLayout({ children }: { children: ReactNode }) {
    return <AppProviders>{children}</AppProviders>;
}

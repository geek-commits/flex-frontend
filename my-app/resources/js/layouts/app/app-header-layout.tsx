import { FlexAppShell } from '@/components/flex/flex-app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
}: AppLayoutProps) {
    return <FlexAppShell mode="admin">{children}</FlexAppShell>;
}

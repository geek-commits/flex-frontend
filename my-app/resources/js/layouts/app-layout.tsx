import { FlexAppShell } from '@/components/flex/flex-app-shell';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    void breadcrumbs;
    return <FlexAppShell mode="admin">{children}</FlexAppShell>;
}

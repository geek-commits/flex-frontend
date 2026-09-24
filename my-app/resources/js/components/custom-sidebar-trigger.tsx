import { useTranslation } from 'react-i18next';
import { SidebarTrigger } from '@/components/ui/sidebar';

/**
 * Mobile-only entry point for the full navigation drawer.
 */
export function CustomSidebarTrigger() {
    const { t } = useTranslation('navigation');

    return (
        <SidebarTrigger
            className="md:hidden"
            aria-label={t('aria.openNavigation')}
        />
    );
}

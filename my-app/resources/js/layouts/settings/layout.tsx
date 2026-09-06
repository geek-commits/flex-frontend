import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation('common');

    return (
        <FlexPageContent className="flex min-h-full flex-col gap-[var(--flex-space-section)]">
            <FlexPageHeader title={t('settings.title')} description={t('settings.description')} />
            <section className="max-w-3xl space-y-12">{children}</section>
        </FlexPageContent>
    );
}

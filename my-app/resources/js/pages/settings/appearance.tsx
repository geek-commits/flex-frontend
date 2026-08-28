import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppearanceTabs from '@/components/appearance-tabs';
import { SettingsCard } from '@/components/settings/settings-card';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { t } = useTranslation('common');

    return (
        <>
            <Head title={t('settings.appearanceHeadTitle')} />

            <h1 className="sr-only">{t('settings.appearanceHeadTitle')}</h1>

            <div className="flex flex-col gap-6">
                <SettingsCard
                    title="Appearance settings"
                    description="Update the appearance settings for your account"
                >
                    <AppearanceTabs />
                </SettingsCard>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};

import { Head } from '@inertiajs/react';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { ModuleDirectory } from '@/components/flex/module-directory';
import type { ModuleItem } from '@/components/flex/module-directory';
import { SETTINGS_MODULES } from '@/domain/modules';
import { AdminShell } from '@/layouts/admin-shell';



export default function SettingsDirectoryPage() {
    const { t } = useTranslation('administration');
    const modules: ModuleItem[] = SETTINGS_MODULES;

    return (
        <AdminShell
            title={t('settings.title')}
            subtitle={t('settings.subtitle')}
            
        >
            <Head title={t('settings.headTitle')} />
            <ModuleDirectory
                title={t('settings.catalogTitle')}
                description={t('settings.catalogDescription')}
                modules={modules}
            />
        </AdminShell>
    );
}

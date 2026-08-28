import { Head } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SocialIntegrationHost } from '@/features/social/social-integration-host';

export default function SocialInboxIndex() {
    const { t } = useTranslation('agent');

    return (
        <>
            <Head title={t('social.headTitle')} />
            <SocialIntegrationHost />
        </>
    );
}
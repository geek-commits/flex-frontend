import { Head } from '@inertiajs/react';
import React from 'react';
import { SocialIntegrationHost } from '@/features/social/social-integration-host';

export default function SocialInboxIndex() {
    return (
        <>
            <Head title="Social Inbox — Flex Contact Center" />
            <SocialIntegrationHost />
        </>
    );
}
import { Head } from '@inertiajs/react';
import React from 'react';
import { SocialWorkspacePage } from '@/features/social/social-workspace-page';

export default function SocialInboxIndex() {
    return (
        <>
            <Head title="Social Inbox — Flex Contact Center" />
            <SocialWorkspacePage />
        </>
    );
}
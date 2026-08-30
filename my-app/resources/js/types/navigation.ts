import type { InertiaLinkProps } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import type { ComponentType } from 'react';
import type { FlexIconName } from '@/components/flex/iconography';


export type BreadcrumbItem = {
    title: string;
    titleKey?: Exclude<Parameters<TFunction<'common', undefined>>[0], string | string[] | TemplateStringsArray>;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: FlexIconName | ComponentType<{ className?: string }> | null;
    isActive?: boolean;
};

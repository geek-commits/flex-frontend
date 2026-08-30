import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthTitleKey =
    | 'login.title'
    | 'login.description'
    | 'login.visualHeadline'
    | 'login.visualDescription'
    | 'register.title'
    | 'register.description'
    | 'forgotPassword.title'
    | 'forgotPassword.description'
    | 'resetPassword.title'
    | 'resetPassword.description'
    | 'confirmPassword.title'
    | 'confirmPassword.description'
    | 'verifyEmail.title'
    | 'verifyEmail.description'
    | 'twoFactor.title'
    | 'twoFactor.description';
export type AuthVisualProps = {
    src: string;
    alt?: string;
    headline?: string;
    headlineKey?: AuthTitleKey;
    description?: string;
    descriptionKey?: AuthTitleKey;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    titleKey?: AuthTitleKey;
    description?: string;
    descriptionKey?: AuthTitleKey;
    visual?: AuthVisualProps;
};

import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FlexBrandLogo } from '@/components/flex/brand';
import { LanguageSwitcher } from '@/components/language-switcher';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    titleKey,
    description,
    descriptionKey,
    visual,
}: AuthLayoutProps) {
    const { t: tAuth } = useTranslation('auth');
    const resolvedTitle = titleKey ? tAuth(titleKey) : title;
    const resolvedDescription = descriptionKey ? tAuth(descriptionKey) : description;
    const resolvedVisualHeadline = visual?.headlineKey ? tAuth(visual.headlineKey) : visual?.headline;
    const resolvedVisualDescription = visual?.descriptionKey ? tAuth(visual.descriptionKey) : visual?.description;

    return (
        <main className="min-h-svh bg-background p-3 sm:p-4 lg:p-6">
            <div className="grid min-h-[calc(100svh-1.5rem)] sm:min-h-[calc(100svh-2rem)] lg:min-h-[calc(100svh-3rem)] w-full lg:grid-cols-[44%_56%] xl:grid-cols-[42%_58%]">
                {/* Left: Auth Form Column */}
                <div className="flex flex-col justify-between p-4 sm:p-6 lg:p-10">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                        >
                            <FlexBrandLogo variant="auth" decorative />
                            <span className="sr-only">FLEX Contact Center</span>
                        </Link>
                        <LanguageSwitcher />
                    </div>

                    <div className="mx-auto w-full max-w-sm py-8 sm:py-12">
                        <div className="mb-6 space-y-2 text-left">
                            {resolvedTitle && (
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {resolvedTitle}
                                </h1>
                            )}
                            {resolvedDescription && (
                                <p className="text-sm text-muted-foreground">
                                    {resolvedDescription}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>

                    <div className="text-xs text-muted-foreground" />
                </div>

                {/* Right: Visual Image Panel (hidden on mobile) */}
                {visual && (
                    <section
                        aria-label="FLEX Contact Center Overview"
                        className="relative hidden overflow-hidden rounded-xl border border-border/40 bg-muted lg:flex lg:flex-col lg:justify-end p-8 xl:p-12"
                    >
                        <img
                            src={visual.src}
                            alt={visual.alt ?? ''}
                            className="absolute inset-0 size-full object-cover object-center"
                            fetchPriority="high"
                        />
                        {/* Subtle bottom gradient to ensure text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                        {/* Image Panel Caption */}
                        {(resolvedVisualHeadline || resolvedVisualDescription) && (
                            <div className="relative z-10 max-w-lg space-y-2 text-white">
                                {resolvedVisualHeadline && (
                                    <h2 className="text-xl font-semibold tracking-tight leading-snug xl:text-2xl">
                                        {resolvedVisualHeadline}
                                    </h2>
                                )}
                                {resolvedVisualDescription && (
                                    <p className="text-sm text-zinc-200 leading-relaxed">
                                        {resolvedVisualDescription}
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}
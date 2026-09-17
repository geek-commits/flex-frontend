import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FlagIcon, hasFlag } from '@/components/flags';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALE_CONFIG, SUPPORTED_LOCALES, useFlexLocale } from '@/i18n/locale';
import type { FlexLocale } from '@/i18n/locale';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
    className?: string;
    variant?: 'default' | 'compact';
};

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
    const { locale, setLocale } = useFlexLocale();
    const { t } = useTranslation('common');

    const current = LOCALE_CONFIG[locale];
    const label = t('languages.language', 'Language');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size={variant === 'compact' ? 'sm' : 'default'}
                        className={cn(
                            'h-9 gap-1.5 px-2.5 text-sm font-normal text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-9 min-w-9',
                            variant === 'compact' && 'h-8 px-2 text-xs min-h-8',
                            className,
                        )}
                        aria-label={`${label}: ${current.label}`}
                        data-test="language-switcher-trigger"
                    >
                        {hasFlag(locale) ? (
                            <span className="inline-flex h-3 w-4 shrink-0 overflow-hidden rounded-sm ring-1 ring-border/30">
                                <FlagIcon code={locale} aria-hidden />
                            </span>
                        ) : (
                            <Globe className="size-4 opacity-70" aria-hidden="true" />
                        )}
                        <span>{current.label}</span>
                    </Button>
                }
            />
            <DropdownMenuContent align="end" className="min-w-40">
                {SUPPORTED_LOCALES.map((code) => {
                    const meta = LOCALE_CONFIG[code as FlexLocale];
                    const isActive = locale === code;

                    return (
                        <DropdownMenuItem
                            key={code}
                            onClick={() => setLocale(code as FlexLocale)}
                            aria-current={isActive ? 'true' : undefined}
                            className="flex items-center gap-2 min-h-9 cursor-pointer"
                            data-test={`language-option-${code}`}
                        >
                            {hasFlag(code as FlexLocale) ? (
                                <span className="inline-flex h-3 w-4 shrink-0 overflow-hidden rounded-sm ring-1 ring-border/30">
                                    <FlagIcon code={code as FlexLocale} aria-hidden />
                                </span>
                            ) : (
                                <Globe className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                            )}
                            <span className={cn('flex-1', isActive && 'font-medium')}>{meta.label}</span>
                            {isActive && (
                                <Check className="ml-auto size-4 shrink-0 text-primary" aria-hidden="true" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageSwitcher;

import { RiSunLine, RiMoonLine, RiComputerLine } from '@remixicon/react';
import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { t } = useTranslation('common');
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: typeof RiSunLine; label: string }[] = [
        { value: 'light', icon: RiSunLine, label: t('settings.appearance.light') },
        { value: 'dark', icon: RiMoonLine, label: t('settings.appearance.dark') },
        { value: 'system', icon: RiComputerLine, label: t('settings.appearance.system') },
    ];

    return (
        <div
            role="radiogroup"
            aria-label={t('settings.appearance.ariaLabel')}
            className={cn('inline-flex gap-1 rounded-lg bg-muted p-1', className)}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={appearance === value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-card text-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}

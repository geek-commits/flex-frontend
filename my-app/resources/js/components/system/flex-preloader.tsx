import { useTranslation } from 'react-i18next';
import { AnimatedFlexLogo } from '@/components/flex/brand/animated-flex-logo';

type FlexPreloaderProps = {
    visible?: boolean;
    leaving?: boolean;
    failed?: boolean;
    onRetry?: () => void;
};

export function FlexPreloader({ visible = true, leaving = false, failed = false, onRetry }: FlexPreloaderProps) {
    const { t } = useTranslation('common');
    if (!visible && !leaving && !failed) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={t('preloader.loadingFlex')}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6 transition-opacity duration-200 ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${failed ? 'bg-white' : ''}`}
            data-test="flex-preloader"
        >
            <div className="flex flex-col items-center gap-6">
                <AnimatedFlexLogo
                    animateOnMount={!failed}
                    loop={!failed}
                    ariaLabel="FLEX"
                    style={{ width: 96, height: 96 }}
                    className="flex-logo--preloader"
                />
                {failed ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <p className="text-sm font-medium text-flex-text-primary">{t('preloader.couldntStart')}</p>
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                {t('preloader.retry')}
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
            <span className="sr-only">{t('preloader.loadingFlex')}</span>
        </div>
    );
}

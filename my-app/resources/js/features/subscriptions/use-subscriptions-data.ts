import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mailRepository } from '@/domain/mail-repository';
import { subscriptionRepository } from '@/domain/subscription-repository';
import type {
    SubscriptionDraft,
    SubscriptionQuery,
    SubscriptionSummary,
} from '@/domain/subscription-types';

export function useSubscriptionsData() {
    const [query, setQuery] = useState<SubscriptionQuery>({});
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
    const loadTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const records = useMemo(() => {
        void refreshKey;

        return subscriptionRepository.querySubscriptions(query);
    }, [query, refreshKey]);

    const summary: SubscriptionSummary = useMemo(() => {
        void refreshKey;

        return subscriptionRepository.getSummary();
    }, [refreshKey]);

    const mailStatus = useMemo(() => {
        void refreshKey;

        return mailRepository.getStatus();
    }, [refreshKey]);

    const refresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
        setLastUpdated(new Date());
    }, []);

    useEffect(() => {
        loadTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            setLastUpdated(new Date());
        }, 250);

        return () => {
            if (loadTimerRef.current) {
                clearTimeout(loadTimerRef.current);
            }
        };
    }, []);

    const triggerReminder = useCallback(
        (id: string) => {
            const res = subscriptionRepository.triggerReminder(id);

            if (res.ok) {
                refresh();
            }

            return res;
        },
        [refresh]
    );

    const renewSubscription = useCallback(
        (id: string, months: number = 1) => {
            const res = subscriptionRepository.renewSubscription(id, months);

            if (res.ok) {
                refresh();
            }

            return res;
        },
        [refresh]
    );

    const updateSubscription = useCallback(
        (id: string, patch: Partial<SubscriptionDraft>) => {
            const res = subscriptionRepository.updateSubscription(id, patch);

            if (res.ok) {
                refresh();
            }

            return res;
        },
        [refresh]
    );

    const getById = useCallback((id: string) => subscriptionRepository.getById(id), []);

    return {
        records,
        summary,
        mailStatus,
        query,
        setQuery,
        isLoading,
        lastUpdated,
        refresh,
        triggerReminder,
        renewSubscription,
        updateSubscription,
        getById,
    };
}

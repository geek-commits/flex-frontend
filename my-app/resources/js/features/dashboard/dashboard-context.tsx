import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import {
    DASHBOARD_POLL_INTERVAL,
    STALE_THRESHOLD_MS,
} from '@/features/dashboard/constants';
import { fetchDashboardData } from '@/features/dashboard/dashboard-data';
import type {
    DashboardData,
    ConnectionState,
    UseDashboardDataReturn,
} from '@/features/dashboard/dashboard-types';

type DashboardContextValue = UseDashboardDataReturn;

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [connectionState, setConnectionState] =
        useState<ConnectionState>('live');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isRefreshingRef = useRef(false);
    const lastUpdateRef = useRef<Date | null>(null);
    const mountedRef = useRef(true);

    const refresh = useCallback(async () => {
        if (!mountedRef.current || isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;
        setIsRefreshing(true);
        setError(null);

        try {
            const freshData = await fetchDashboardData();

            if (!mountedRef.current) {
                return;
            }

            setData(freshData);
            setIsLoading(false);
            const now = new Date();
            setLastUpdated(now);
            lastUpdateRef.current = now;
            setConnectionState('live');
        } catch (err) {
            if (!mountedRef.current) {
                return;
            }

            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to fetch dashboard data'),
            );
            setConnectionState('error');
        } finally {
            if (mountedRef.current) {
                isRefreshingRef.current = false;
                setIsRefreshing(false);
            }
        }
    }, []);

    const stopPolling = useCallback(() => {
        if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
        }
    }, []);

    const startPolling = useCallback(() => {
        if (pollTimerRef.current) {
            return;
        }

        pollTimerRef.current = setInterval(() => {
            if (!mountedRef.current || document.hidden) {
                return;
            }

            refresh();
        }, DASHBOARD_POLL_INTERVAL);
    }, [refresh]);

    const checkStale = useCallback(() => {
        if (!lastUpdateRef.current) {
            return;
        }

        const stale =
            Date.now() - lastUpdateRef.current.getTime() > STALE_THRESHOLD_MS;

        if (stale) {
            setConnectionState((prev) =>
                prev === 'stale' || prev === 'reconnecting' ? prev : 'stale',
            );
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        const initialLoad = setTimeout(refresh, 0);
        startPolling();

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refresh();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const staleCheckInterval = setInterval(checkStale, 5000);

        return () => {
            clearTimeout(initialLoad);
            mountedRef.current = false;
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
            clearInterval(staleCheckInterval);
            stopPolling();
        };
    }, [refresh, startPolling, stopPolling, checkStale]);

    const value: UseDashboardDataReturn = {
        data,
        isLoading,
        isRefreshing,
        error,
        connectionState,
        lastUpdated,
        refresh,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboardData(): UseDashboardDataReturn {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error(
            'useDashboardData must be used within a DashboardProvider',
        );
    }

    return context;
}

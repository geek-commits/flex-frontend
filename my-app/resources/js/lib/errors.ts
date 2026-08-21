/**
 * Minimal normalized frontend error model per hardening §28.
 * Preserves backend context (correlationId) for diagnostics.
 */
export type FlexErrorType = 'network' | 'auth' | 'validation' | 'tenant' | 'realtime' | 'unknown';

export interface FlexError {
    type: FlexErrorType;
    code: string;
    message: string;
    retryable: boolean;
    correlationId?: string;
    cause?: unknown;
}

export function normalizeError(err: unknown, fallbackCode = 'UNKNOWN'): FlexError {
    if (err instanceof Error && 'correlationId' in (err as unknown as Record<string, unknown>)) {
        const c = err as unknown as Error & { code?: string; correlationId?: string; retryable?: boolean };
        return {
            type: 'unknown',
            code: c.code ?? fallbackCode,
            message: c.message,
            retryable: c.retryable ?? false,
            correlationId: c.correlationId,
            cause: err,
        };
    }
    if (err instanceof Error) {
        return { type: 'unknown', code: fallbackCode, message: err.message, retryable: false, cause: err };
    }
    if (typeof err === 'string') {
        return { type: 'unknown', code: fallbackCode, message: err, retryable: false };
    }
    return { type: 'unknown', code: fallbackCode, message: 'Something went wrong', retryable: false, cause: err };
}

export function isRetryable(error: FlexError): boolean {
    return error.retryable;
}

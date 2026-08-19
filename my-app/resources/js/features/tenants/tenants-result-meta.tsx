export interface TenantsResultMetaProps {
    shown: number;
    total: number;
}

export function TenantsResultMeta({ shown, total }: TenantsResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} tenants
            </span>
        </div>
    );
}
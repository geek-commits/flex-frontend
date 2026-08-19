export interface UsersResultMetaProps {
    shown: number;
    total: number;
}

export function UsersResultMeta({ shown, total }: UsersResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} users
            </span>
        </div>
    );
}
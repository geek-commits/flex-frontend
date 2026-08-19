export interface CampaignsResultMetaProps {
    shown: number;
    total: number;
}

export function CampaignsResultMeta({ shown, total }: CampaignsResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} campaigns
            </span>
        </div>
    );
}
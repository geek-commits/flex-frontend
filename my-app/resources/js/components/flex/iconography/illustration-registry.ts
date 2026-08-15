import type React from 'react';
import CartoonCallbackCompletion from '@assets/flex/icons/illustration/cartoon-callback-completion.svg?react';
import CartoonCallbackQueue from '@assets/flex/icons/illustration/cartoon-callback-queue.svg?react';
import CartoonCampaign from '@assets/flex/icons/illustration/cartoon-campaign.svg?react';
import CartoonDatabaseCylinderData from '@assets/flex/icons/illustration/cartoon-database-cylinder-data.svg?react';
import CartoonDatabaseCylinder from '@assets/flex/icons/illustration/cartoon-database-cylinder.svg?react';
import CartoonEmailForSubscription from '@assets/flex/icons/illustration/cartoon-email-for-subscription.svg?react';
import CartoonGroup from '@assets/flex/icons/illustration/cartoon-group.svg?react';
import CartoonHighlightSecurity from '@assets/flex/icons/illustration/cartoon-highlight-security.svg?react';
import CartoonMail from '@assets/flex/icons/illustration/cartoon-mail.svg?react';
import CartoonNetworkMapDiagram from '@assets/flex/icons/illustration/cartoon-network-map-diagram.svg?react';
import CartoonNeuralNetworkDiagram from '@assets/flex/icons/illustration/cartoon-neural-network-diagram.svg?react';
import CartoonPollBarsSocial from '@assets/flex/icons/illustration/cartoon-poll-bars-social.svg?react';
import CartoonPushSubscription from '@assets/flex/icons/illustration/cartoon-push-subscription.svg?react';
import CartoonQueue from '@assets/flex/icons/illustration/cartoon-queue.svg?react';
import CartoonServer from '@assets/flex/icons/illustration/cartoon-server.svg?react';
import CartoonSubscriptionCard from '@assets/flex/icons/illustration/cartoon-subscription-card.svg?react';
import CartoonSupportAgentClipboard from '@assets/flex/icons/illustration/cartoon-support-agent-clipboard.svg?react';
import CartoonSupportAgent from '@assets/flex/icons/illustration/cartoon-support-agent.svg?react';
import CartoonTeam from '@assets/flex/icons/illustration/cartoon-team.svg?react';

export type FlexIllustrationName =
    | 'empty-campaigns'
    | 'empty-callbacks'
    | 'callback-complete'
    | 'empty-queues'
    | 'mail-not-configured'
    | 'subscription-configuration'
    | 'subscription-email-setup'
    | 'subscription-push'
    | 'agents-support'
    | 'agent-workflow-help'
    | 'team-setup'
    | 'users-group'
    | 'database-setup'
    | 'database-data'
    | 'server-setup'
    | 'network-setup'
    | 'ai-setup'
    | 'security-setup'
    | 'social-analytics';

export type FlexIllustrationComponent = React.ComponentType<{ className?: string }>;

/**
 * Semantic illustration registry (cartoon family). Used only for empty states,
 * setup guidance, onboarding, and help at illustration sizes (48–80px). Not for
 * compact navigation or dense table rows.
 */
export const FLEX_ILLUSTRATION_REGISTRY: Record<FlexIllustrationName, FlexIllustrationComponent> = {
    'empty-campaigns': CartoonCampaign,
    'empty-callbacks': CartoonCallbackQueue,
    'callback-complete': CartoonCallbackCompletion,
    'empty-queues': CartoonQueue,
    'mail-not-configured': CartoonMail,
    'subscription-configuration': CartoonSubscriptionCard,
    'subscription-email-setup': CartoonEmailForSubscription,
    'subscription-push': CartoonPushSubscription,
    'agents-support': CartoonSupportAgent,
    'agent-workflow-help': CartoonSupportAgentClipboard,
    'team-setup': CartoonTeam,
    'users-group': CartoonGroup,
    'database-setup': CartoonDatabaseCylinder,
    'database-data': CartoonDatabaseCylinderData,
    'server-setup': CartoonServer,
    'network-setup': CartoonNetworkMapDiagram,
    'ai-setup': CartoonNeuralNetworkDiagram,
    'security-setup': CartoonHighlightSecurity,
    'social-analytics': CartoonPollBarsSocial,
};
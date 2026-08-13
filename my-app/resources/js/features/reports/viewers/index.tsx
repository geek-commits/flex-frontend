import React from 'react';
import type { ReportDefinition } from '@/features/reports/report-registry';
import { ReportResults } from '@/features/reports/report-results';
import type { ReportQuery, ReportRun } from '@/features/reports/report-types';
import { AgentOutgoingViewer } from '@/features/reports/viewers/agent-outgoing';
import { AgentPerformanceViewer } from '@/features/reports/viewers/agent-performance';
import { AgentStateLogViewer } from '@/features/reports/viewers/agent-state-log';
import { ContactCenterPerformanceViewer } from '@/features/reports/viewers/contact-center-performance';
import { CustomerEndToIVRViewer } from '@/features/reports/viewers/customer-end-to-ivr';
import { IVRReportViewer } from '@/features/reports/viewers/ivr-report';
import { OutgoingCallsViewer } from '@/features/reports/viewers/outgoing-calls';
import { QueueLogsViewer } from '@/features/reports/viewers/queue-logs';
import { RecordingsViewer } from '@/features/reports/viewers/recordings';
import { YearlyPerformanceViewer } from '@/features/reports/viewers/yearly-performance';

/**
 * Dispatches a ready report run to its specialized viewer. Reports with
 * materially different structures get their own composition; simpler reports
 * fall back to the canonical dense table.
 */
export function ReportViewerContent({ run }: { run: ReportRun; report: ReportDefinition; query: ReportQuery }) {
    switch (run.reportId) {
        case 'contact-center-performance':
            return <ContactCenterPerformanceViewer run={run} />;
        case 'yearly-performance':
            return <YearlyPerformanceViewer run={run} />;
        case 'agent-performance':
            return <AgentPerformanceViewer run={run} />;
        case 'agent-state-log':
            return <AgentStateLogViewer run={run} />;
        case 'agent-outgoing':
            return <AgentOutgoingViewer run={run} />;
        case 'ivr-report':
            return <IVRReportViewer run={run} />;
        case 'customer-end-to-ivr':
            return <CustomerEndToIVRViewer run={run} />;
        case 'outgoing-calls':
            return <OutgoingCallsViewer run={run} />;
        case 'queue-logs':
            return <QueueLogsViewer run={run} />;
        case 'recordings':
            return <RecordingsViewer run={run} />;
        default:
            return <ReportResults run={run} />;
    }
}

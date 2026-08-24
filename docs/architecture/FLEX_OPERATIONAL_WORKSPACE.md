# FLEX Operational Workspace — Phase 07

> **Callback/Voicemail, Campaigns, Reports — data-first, one dominant surface.**

* **Callback/Voicemail** (`AgentShell Missed Calls`) — `FlexWorkbenchShell` `toolbar px-3 py-2.5` `Status/Queue/Ownership/Voicemail selects + Search lg:w-64 + Columns/Refresh` → `DataGrid dense columnsMovable skeleton pageSize 10 sorted missedAt desc` 9 cols `customer 260 / missedAt 160 relative / queue 220 / category 200 / attempts 88 / voicemail icon 160 / ownership 220 / status FlexStatus / action 140`. Details via `FlexDetailSheet sm:max-w-lg` (`RecoveryDetailSheet`) with real `<audio>` (`VoicemailPlayer preload=metadata`) and `CallbackAction` (`claimRecord → incrementAttempt → workspaceState.dial phone` canonical, IN_CALL guard). No card per filter, preserve query/pagination.

* **Campaigns** (`AdminShell Telephony`) — `CampaignSummary FlexMetricStrip` + `FlexWorkbenchShell toolbar quick pill All/draft…completed + search lg:w-64 + Columns/Refresh + New Campaign default` → `CampaignsTable 6 cols identity/schedule mono/progress/answerRate/status FlexStatus/actions view/edit/pause/delete`. Restfulness: View/Edit/Delete/Create/Start-Stop (active↔paused) real via `campaignRepository`; Upload/Import absent (no fake button).

* **Reports** (`ReportsPage` view enum `library→viewer→scheduled` on same URL `/admin/reports`, no contextual tabs merge) — Library `grouped PERFORMANCE/AGENTS/QUEUE & IVR/TELEPHONY` `Input search lg:w-72` + `Scheduled Reports` button; Viewer `Back + label/desc + Export PDF/Excel/CSV + Run Report` → `rounded-lg border p-4 renderFilters (Period/Year/Agent/Queue/Provider) + Clear` → `renderResult`; Scheduled `FlexWorkbenchShell Status/State + search lg:w-72` + `ScheduledReportsTable`. Not card per filter.

Preserve permissions (`missed-calls.view` agent, `campaigns.view/manage`, `reports.view`), tenant mock, empty/loading/error (`FlexEmptyState Try Again/Clear filters`).

No no-op actions visible (Download removed in Phase 03).

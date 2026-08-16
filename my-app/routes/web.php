<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin Surfaces
    Route::inertia('dashboard', 'admin/contact-center-dashboard')->name('dashboard');
    Route::inertia('admin/monitoring', 'admin/agent-monitoring')->name('admin.monitoring');
    Route::inertia('admin/console', 'admin/management-console')->name('admin.console');
    Route::inertia('admin/cdr', 'admin/cdr')->name('admin.cdr');
    Route::inertia('admin/campaigns', 'admin/campaigns')->name('admin.campaigns');
    Route::inertia('admin/reports', 'admin/reports')->name('admin.reports');
    Route::inertia('admin/settings', 'admin/settings')->name('admin.settings');
    Route::inertia('admin/system', 'admin/system')->name('admin.system');
    Route::inertia('admin/ai', 'admin/ai')->name('admin.ai');
    Route::inertia('admin/users', 'admin/users')->name('admin.users');
    Route::inertia('admin/roles', 'admin/roles')->name('admin.roles');
    Route::inertia('admin/queues', 'admin/queues')->name('admin.queues');
    Route::inertia('admin/ivr', 'admin/ivr')->name('admin.ivr');
    Route::inertia('admin/time-groups', 'admin/time-groups')->name('admin.time-groups');
    Route::inertia('admin/time-conditions', 'admin/time-conditions')->name('admin.time-conditions');
    Route::inertia('admin/recordings', 'admin/recordings')->name('admin.recordings');
    Route::inertia('admin/subscription', 'admin/subscription')->name('admin.subscription');
    Route::inertia('admin/mail-config', 'admin/mail-config')->name('admin.mail-config');

    // Entity detail pages
    Route::get('admin/cdr/{record}', fn (string $record) => Inertia::render('admin/cdr-detail', ['record' => $record]))->name('admin.cdr.show');
    Route::get('admin/campaigns/{campaign}', fn (string $campaign) => Inertia::render('admin/campaign-detail', ['campaign' => $campaign]))->name('admin.campaigns.show');

    // Agent Workspace Surfaces
    Route::inertia('agent', 'agent/index')->name('agent.index');
    Route::inertia('agent/missed-calls', 'agent/missed-calls')->name('agent.missed-calls');
    Route::inertia('agent/troubleshooting', 'agent/troubleshooting')->name('agent.troubleshooting');
    Route::inertia('agent/support', 'agent/support')->name('agent.support');

    // Module placeholders (declared after static routes so specific pages win)
    Route::inertia('admin/settings/{module}', 'admin/module-placeholder')
        ->where('module', '[a-z-]+')
        ->name('admin.settings.module');
    Route::inertia('admin/{module}', 'admin/module-placeholder')
        ->where('module', '[a-z-]+')
        ->name('admin.module');
});

require __DIR__.'/settings.php';

// Dev-only surfaces — never registered in production.
if (app()->environment(['local', 'testing'])) {
    Route::inertia('dev/brand-preview', 'dev/brand-preview')->name('dev.brand-preview');
}

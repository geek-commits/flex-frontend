/* eslint-disable no-undef */
import fs from 'fs';

const allowlist = new Set([
    'recordings.columns.categories.voicemail-greeting',
    'subscriptions.toolbar.planOptions.custom',
    'subscriptions.toolbar.planOptions.enterprise',
    'subscriptions.toolbar.planOptions.professional',
    'subscriptions.toolbar.planOptions.starter',
    'tenants.form.contactEmailPlaceholder',
    'tenants.form.phonePlaceholder',
    'users.form.emailPlaceholder',
    'queues.columns.actions',
    'queues.columns.extension',
    'queues.detail.description',
    'queues.form.descriptionLabel',
    'recordings.toolbar.formatLabel',
    'roles.columns.actions',
    'roles.columns.module',
    'roles.columns.type',
    'roles.columns.permission',
    'roles.lifecycleDialog.actionFailed',
    'roles.lifecycleDialog.deactivateSuccess',
    'roles.lifecycleDialog.removeSuccess',
    'roles.lifecycleDialog.restoreSuccess',
    'users.columns.actions',
    'roles.columns.permission',
    'queues.members.table.agent',
    'recordings.usageTypes.ivr',
    'recordings.usageTypes.voicemail',
    'recordings.player.audio',
    'users.roles.agent',
    'roles.permissions.modules.support',
    'roles.permissions.columns.permission',
    'roles.permissions.columns.type',
    'roles.permissions.columns.module',
]);

function flatten(obj, prefix='') {
    const out={};

    for (const [k,v] of Object.entries(obj)) {
        if (v && typeof v==='object' && !Array.isArray(v)) {
Object.assign(out, flatten(v, prefix+k+'.'));
} else {
out[prefix+k]=v;
}
    }

    return out;
}

let failed=false;

for (const loc of ['sw','fr']) {
    const en = JSON.parse(fs.readFileSync(`my-app/resources/js/i18n/locales/en/administration.json`,'utf8'));
    const other = JSON.parse(fs.readFileSync(`my-app/resources/js/i18n/locales/${loc}/administration.json`,'utf8'));
    const enFlat=flatten(en);
    const otherFlat=flatten(other);

    for (const [key, enVal] of Object.entries(enFlat)) {
        if (!key.startsWith('queues.') && !key.startsWith('recordings.') && !key.startsWith('users.') && !key.startsWith('roles.') && !key.startsWith('tenants.') && !key.startsWith('subscriptions.')) {
continue;
}

        if (typeof enVal !== 'string' || enVal.trim()==='') {
continue;
}

        if (key in otherFlat && otherFlat[key]===enVal && !allowlist.has(key)) {
            console.error(`Placeholder English in ${loc}: ${key} = "${enVal}"`);
            failed=true;
        }
    }
}

if (failed) {
    console.error('Phase 7 SW placeholder-English check FAILED');
    process.exit(1);
} else {
    console.log('Phase 7 placeholder check PASS');
}
// Temporary add for recordings UI - will be properly allowlisted in file
// This is a duplicate entry for testing

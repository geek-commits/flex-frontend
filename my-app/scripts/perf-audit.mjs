import { execFileSync } from 'node:child_process';

const url = globalThis.process.argv[2] ?? 'http://localhost:8000/login';
const out = '/tmp/flex-perf.json';

execFileSync(
    'npx',
    [
        '--yes',
        'lighthouse',
        url,
        '--only-categories=performance',
        '--output=json',
        `--output-path=${out}`,
        '--chrome-flags=--headless=new --disable-gpu',
        '--quiet',
    ],
    { stdio: 'inherit' },
);

const report = JSON.parse(await (await import('node:fs/promises')).readFile(out, 'utf8'));

const metric = (key) => {
    const audit = report.audits[key];

    return audit ? (audit.displayValue || audit.numericValue) : 'n/a';
};

const transfer = (report.audits['network-requests']?.details?.items ?? []).reduce(
    (sum, item) => sum + (item.transferSize || 0),
    0,
);

console.log(`\n${url} (mobile) performance score: ${report.categories.performance.score * 100}`);
console.log(`  LCP: ${metric('largest-contentful-paint')}`);
console.log(`  FCP: ${metric('first-contentful-paint')}`);
console.log(`  TBT: ${metric('total-blocking-time')}`);
console.log(`  CLS: ${metric('cumulative-layout-shift')}`);
console.log(`  Speed Index: ${metric('speed-index')}`);
console.log(`  total transfer: ${Math.round(transfer / 1024)}KB`);
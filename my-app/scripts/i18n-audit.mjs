#!/usr/bin/env node
/* global process */
/**
 * FLEX i18n literal audit — report mode (Phase 2)
 * Detects likely hardcoded user-facing literals not via t().
 * Allowlist per §77: CSS/classes/URLs/routes/testIds/technical enums are ignored.
 * This is a lightweight regex audit; prefer AST parsing later.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', 'resources', 'js');
const ALLOW_PATTERNS = [
  /^FLEX$/, /^Flex Contact Center$/, /^(GET|POST|PUT|DELETE)$/,
  /^(CDR|IVR|SIP|API|SMTP|URI|URL|UUID|SLA|CSAT|NPS)$/,
];
const IGNORE_FILES = [/\.test\.(ts|tsx)$/, /__tests__/, /mock/, /\.mock\./];

function isAllowedLiteral(text) {
  const t = text.trim();

  if (!t) {
return true;
}

  if (t.length < 3) {
return true;
}

  if (/^[A-Z_]+$/.test(t)) {
return true;
} // enum

  if (/^\/[a-z/]+$/.test(t)) {
return true;
} // route

  if (ALLOW_PATTERNS.some((re) => re.test(t))) {
return true;
}

  return false;
}

function scanFile(file) {
  if (IGNORE_FILES.some((re) => re.test(file))) {
return [];
}

  const content = fs.readFileSync(file, 'utf8');
  const hits = [];
  // Heuristic: JSX text >...< where inner is plain English words not {t( or {t` and not brand
  const jsxTextRe = />\s*([A-Z][A-Za-z0-9 ,.'’—/()&-]{3,})\s*</g;
  let m;

  while ((m = jsxTextRe.exec(content))) {
    const literal = m[1].trim();

    if (isAllowedLiteral(literal)) {
continue;
}

    // skip if line contains t( nearby
    const lineStart = content.lastIndexOf('\n', m.index);
    const line = content.slice(lineStart, m.index + m[0].length);

    if (line.includes('t(') || line.includes('{t') || line.includes('<Trans')) {
continue;
}

    // skip if inside Head title already handled? still report
    hits.push({ file: path.relative(ROOT, file), line: content.slice(0, m.index).split('\n').length, literal, type: 'JSX text' });
  }

  // aria-label="Literal" not via t
  const ariaRe = /(aria-label|aria-description|placeholder|alt|title)=["']([^"']{3,})["']/g;

  while ((m = ariaRe.exec(content))) {
    const attr = m[1];
    const literal = m[2].trim();

    if (isAllowedLiteral(literal)) {
continue;
}

    const lineStart = content.lastIndexOf('\n', m.index);
    const line = content.slice(lineStart, m.index + m[0].length + 50);

    if (line.includes('t(') || line.includes('{t')) {
continue;
}

    // ignore if literal is translation key-like with dot
    if (literal.includes('.') && literal.split('.').length > 1 && /^[a-z.]+$/.test(literal.toLowerCase())) {
continue;
}

    hits.push({ file: path.relative(ROOT, file), line: content.slice(0, m.index).split('\n').length, literal: `${attr}="${literal}"`, type: attr });
  }

  return hits;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
files.push(...walk(full));
} else if (e.isFile() && /\.(ts|tsx)$/.test(e.name)) {
files.push(full);
}
  }

  return files;
}

const files = walk(ROOT);
const allHits = files.flatMap(scanFile);
const outPath = path.resolve(import.meta.dirname, '..', '..', 'docs', 'localization', 'FLEX_I18N_LITERAL_AUDIT.md');

let md = `# FLEX i18n Literal Audit — Report Mode (Phase 2)\n\n`;
md += `**Generated:** ${new Date().toISOString()} **SHA:** ${(globalThis.process?.env?.GITHUB_SHA) ?? 'local'} **Files scanned:** ${files.length} **Hits:** ${allHits.length}\n\n`;
md += `> Classification per §107: TRANSLATE / RUNTIME_DATA / TECHNICAL / BRAND / EXTERNAL / FALSE_POSITIVE — triage before CI gate.\n\n`;

if (allHits.length === 0) {
  md += `No likely hardcoded literals detected (heuristic).\n`;
} else {
  md += `| File | Line | Type | Literal |\n|---|---|---|---|\n`;

  for (const h of allHits.slice(0, 500)) {
    md += `| ${h.file} | ${h.line} | ${h.type} | \`${h.literal.replace(/\|/g, '\\|').slice(0, 80)}\` |\n`;
  }

  if (allHits.length > 500) {
md += `\n*Truncated ${allHits.length - 500} more hits*\n`;
}
}

md += `\n## Next\n\nTriage every hit per §107. New violations must be zero before CI gate (\`bun run i18n:audit\` as failing).\n`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);
console.log(`i18n audit: ${allHits.length} hits across ${files.length} files → ${path.relative(process.cwd(), outPath)}`);
// report mode never fails
globalThis.process?.exit(0);

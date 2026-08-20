import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

const assetsDir = fileURLToPath(new URL('../public/build/assets/', import.meta.url));
const compressible = new Set(['js', 'css']);

async function walk(dir) {
    const out = [];

    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);

        if (entry.isDirectory()) {
            out.push(...(await walk(path)));
        } else {
            out.push(path);
        }
    }

    return out;
}

const files = (await walk(assetsDir)).filter((f) => compressible.has(extname(f).slice(1)));

let brotliBytes = 0;
let gzipBytes = 0;
let written = 0;

for (const file of files) {
    const [source, srcStat] = await Promise.all([readFile(file), stat(file)]);

    const brFile = `${file}.br`;
    const gzFile = `${file}.gz`;

    const brStale =
        (await stat(brFile).then((s) => s.mtimeMs < srcStat.mtimeMs).catch(() => true));
    const gzStale =
        (await stat(gzFile).then((s) => s.mtimeMs < srcStat.mtimeMs).catch(() => true));

    const jobs = [];

    if (brStale) {
        const br = brotliCompressSync(source, {
            params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
        });
        jobs.push(writeFile(brFile, br));
        brotliBytes += br.length;
    }

    if (gzStale) {
        const gz = gzipSync(source, { level: 9 });
        jobs.push(writeFile(gzFile, gz));
        gzipBytes += gz.length;
    }

    if (jobs.length > 0) {
        await Promise.all(jobs);
        written += 1;
    }
}

console.log(
    `precompress: ${written} asset(s) written (brotli ${(brotliBytes / 1024).toFixed(0)}KB, gzip ${(gzipBytes / 1024).toFixed(0)}KB)`,
);
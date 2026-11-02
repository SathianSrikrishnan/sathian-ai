import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const value = key => args.includes(key) ? args[args.indexOf(key) + 1] : null;
const urls = args.flatMap((arg, index) => arg === '--url' ? [args[index + 1]] : []);
const runs = Number(value('--runs') || 3);
const out = value('--out');
const cli = process.env.LIGHTHOUSE_CLI;
if (!out || !cli || !urls.length || !Number.isInteger(runs) || runs < 1 || runs > 5) throw new Error('Set existing LIGHTHOUSE_CLI and CHROME_PATH. Use --url URL [--url URL] --out NEW_FOLDER [--runs 3] [--desktop]. No dependencies are installed.');
for (const url of urls) { const parsed = new URL(url); if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('Public/local URLs only'); }
if (fs.existsSync(out)) throw new Error('Preserve prior measurements; choose a new output folder.');
fs.mkdirSync(out, { recursive: true });
const records = [];
for (const [index, url] of urls.entries()) for (let run = 1; run <= runs; run++) {
  const file = path.resolve(out, `page-${index + 1}-run-${run}.json`);
  const result = spawnSync(process.execPath, [cli, url, '--only-categories=performance', '--output=json', `--output-path=${file}`, '--quiet', '--chrome-flags=--headless=new --mute-audio --no-first-run --no-default-browser-check --disable-extensions', '--max-wait-for-load=45000', ...(args.includes('--desktop') ? ['--preset=desktop'] : [])], { encoding: 'utf8', windowsHide: true });
  fs.writeFileSync(file + '.log', (result.stderr || '') + (result.stdout || ''));
  if (!fs.existsSync(file)) throw new Error(`No report for ${url}; see log. Do not call this a speed score.`);
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  const audits = report.audits;
  const document = audits['network-requests']?.details?.items?.find(item => item.resourceType === 'Document' && item.url.replace(/\/$/, '') === url.replace(/\/$/, ''));
  const valid = !report.runtimeError && document?.statusCode === 200 && report.finalDisplayedUrl?.replace(/\/$/, '') === url.replace(/\/$/, '');
  const row = { url, run, valid, performance: report.categories.performance.score * 100, LCPms: audits['largest-contentful-paint'].numericValue, FCPms: audits['first-contentful-paint'].numericValue, TBTms: audits['total-blocking-time'].numericValue, CLS: audits['cumulative-layout-shift'].numericValue, warnings: report.runWarnings, runtimeError: report.runtimeError || null, processExit: result.status, tempCleanupError: /destroyTmp|EPERM/.test(result.stderr || ''), freeMemoryBytes: os.freemem() };
  records.push(row); console.log(JSON.stringify(row));
}
const median = values => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)];
const summary = urls.map(url => {
  const rows = records.filter(row => row.url === url);
  const scores = rows.map(row => row.performance);
  return { url, valid: rows.every(row => row.valid), runs: rows.length, performanceMedian: median(scores), performanceRange: [Math.min(...scores), Math.max(...scores)], LCPmsMedian: median(rows.map(row => row.LCPms)), TBTmsMedian: median(rows.map(row => row.TBTms)), CLSmedian: median(rows.map(row => row.CLS)), warnings: rows.flatMap(row => row.warnings), noisy: Math.max(...scores) - Math.min(...scores) >= 10 };
});
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify({ at: new Date().toISOString(), method: args.includes('--desktop') ? 'Lighthouse desktop preset' : 'Lighthouse default mobile simulated throttling', sequential: true, lighthouseCLI: cli, cpu: os.cpus()[0]?.model, logicalCPUs: os.availableParallelism(), sharedWorkstation: true, records, summary }, null, 2));
console.log(JSON.stringify(summary));
if (summary.some(row => !row.valid)) process.exitCode = 1;

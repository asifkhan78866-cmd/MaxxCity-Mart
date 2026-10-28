#!/usr/bin/env node
/**
 * Crawls every page in the sitemap of a running site and checks that each
 * internal link, image and #anchor resolves.
 *
 *   npm run check:links                       # http://localhost:3000
 *   npm run check:links -- http://localhost:3001
 *   npm run check:links -- https://www.your-domain.example
 *
 * Exits with status 1 if anything is broken.
 */

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const origin = new URL(base).origin;

const pageCache = new Map();
async function load(path) {
  if (!pageCache.has(path)) {
    pageCache.set(
      path,
      fetch(base + path, { redirect: "follow" }).then(async (res) => ({
        status: res.status,
        finalPath: new URL(res.url).pathname,
        html: res.headers.get("content-type")?.includes("text/html") ? await res.text() : "",
      })),
    );
  }
  return pageCache.get(path);
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

function internalTargets(html, pageUrl) {
  const found = new Set();
  for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const raw = decode(value);
    if (/^(mailto:|tel:|data:|blob:|javascript:)/.test(raw)) continue;
    if (attr === "src" && raw.startsWith("/_next/")) continue; // build assets
    const url = new URL(raw, pageUrl);
    if (url.origin !== origin) continue;
    if (url.pathname.startsWith("/_next/static/")) continue;
    found.add(url.pathname + url.search + url.hash);
  }
  return found;
}

const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);
if (pages.length === 0) {
  console.error(`No pages found in ${base}/sitemap.xml`);
  process.exit(1);
}

const problems = [];
let checked = 0;
for (const page of pages) {
  const { status, html } = await load(page);
  if (status !== 200) {
    problems.push(`${page} → ${status}`);
    continue;
  }
  for (const target of internalTargets(html, base + page)) {
    const [pathAndQuery, hash] = target.split("#");
    const path = pathAndQuery || page;
    const res = await load(path);
    checked++;
    if (res.status >= 400) {
      problems.push(`${page} links to ${target} → ${res.status}`);
    } else if (hash && res.html && !res.html.includes(`id="${hash}"`)) {
      problems.push(`${page} links to ${target} → no element with id="${hash}" on ${res.finalPath}`);
    }
  }
}

console.log(`Checked ${pages.length} pages and ${checked} internal links on ${base}.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ${[...new Set(problems)].join("\n  ")}`);
  process.exit(1);
}
console.log("No broken internal links.");

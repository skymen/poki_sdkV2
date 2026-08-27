// CHANGELOG.json, turned into release notes.
//
// One entry per version, three optional free-text fields, each holding one or
// more lines. A line is the unit everything here works in: it is what gets
// counted, what gets dropped when there is not enough room, and what "3 other
// changes" is counting.
//
// Two renderings come out of the same model. GitHub takes Markdown; the
// Construct addon page takes BBCode and has a size limit on the field, so that
// one can be asked to fit.

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CATEGORIES = [
  { key: "added", label: "Added" },
  { key: "changed", label: "Changed" },
  { key: "fixed", label: "Fixed" },
];

const CHANGELOG_FILE = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "CHANGELOG.json");

export function readChangelog(file = CHANGELOG_FILE) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

/** Newest first. Versions are four numbers, compared as numbers. */
export function sortVersions(versions) {
  return [...versions].sort((a, b) => {
    const left = a.split(".").map(Number);
    const right = b.split(".").map(Number);
    for (let i = 0; i < 4; ++i)
      if (left[i] !== right[i]) return (right[i] ?? 0) - (left[i] ?? 0);
    return 0;
  });
}

export function compareVersions(a, b) {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);
  for (let i = 0; i < 4; ++i)
    if (left[i] !== right[i]) return (left[i] ?? 0) - (right[i] ?? 0);
  return 0;
}

/**
 * One version, flattened into its individual changes.
 *
 * A field may hold several lines, and may or may not write them as a bullet
 * list. The marker is stripped either way so that rendering can put its own
 * back without doubling it up.
 */
export function entryFor(changelog, version) {
  const data = changelog?.[version];
  if (!data) return null;

  const changes = [];
  for (const { key, label } of CATEGORIES) {
    if (!data[key]) continue;
    for (const line of String(data[key]).split("\n")) {
      const text = line.trim().replace(/^[-*]\s+/, "");
      if (text) changes.push({ label, text });
    }
  }

  return changes.length ? { version, changes } : null;
}

export function entriesFor(changelog, versions) {
  return versions.map((v) => entryFor(changelog, v)).filter(Boolean);
}

/**
 * Every version up to and including `upTo`, newest first, stopping after
 * `after`. With no `after` this is just the one version - which is what a
 * release with nothing missing behind it wants.
 */
export function versionsBetween(changelog, upTo, after = "") {
  if (!changelog) return [];
  if (!after) return changelog[upTo] ? [upTo] : [];

  return sortVersions(Object.keys(changelog)).filter(
    (v) => compareVersions(v, upTo) <= 0 && compareVersions(v, after) > 0
  );
}

// ------------------------------------------------------------------ markdown

export function renderMarkdown(entries) {
  if (!entries.length) return "";
  const multi = entries.length > 1;

  const blocks = entries.map((entry) => {
    const lines = entry.changes.map((c) => `- **${c.label}:** ${c.text}`);
    return multi ? [`#### ${entry.version}`, ...lines].join("\n") : lines.join("\n");
  });

  return blocks.join("\n\n");
}

// ------------------------------------------------------------------- bbcode

/**
 * Markdown that may have been written in a changelog line, in the tags the
 * Construct addon page understands. Deliberately a small set: bold, italic,
 * code and links are safe everywhere, list markup is not, so a bullet is drawn
 * as a character rather than as a tag that might not be supported.
 */
export function inlineBBCode(text) {
  return String(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "[url=$2]$1[/url]")
    .replace(/\*\*([^*]+)\*\*/g, "[b]$1[/b]")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?![*\w])/g, "$1[i]$2[/i]")
    .replace(/`([^`]+)`/g, "[code]$1[/code]");
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * How the "there was more" line can be written, best first.
 *
 * More than one, because a limit small enough to leave no room for the link -
 * or for the line at all - should still produce something that fits rather than
 * something that overshoots.
 */
function truncationTails(changesLeft, versionsLeft, moreUrl) {
  if (!changesLeft) return [""];

  const what =
    versionsLeft > 1
      ? `${plural(changesLeft, "other change")} across ${plural(versionsLeft, "version")}`
      : plural(changesLeft, "other change");

  const note = `[i]...and ${what}.[/i]`;
  const link = moreUrl ? `[url=${moreUrl}]Full changelog on GitHub[/url]` : "";

  return [link ? `${note}\n${link}` : note, note, link, ""].filter(
    (t, i, all) => t !== "" || i === all.length - 1
  );
}

function assemble(lines, tail) {
  const body = lines.join("\n");
  if (!tail) return body;
  return body ? `${body}\n\n${tail}` : tail;
}

/** The first way of writing the tail that keeps the whole thing within limit. */
function fit(lines, tails, limit) {
  for (const tail of tails) {
    const out = assemble(lines, tail);
    if (!limit || out.length <= limit) return out;
  }
  return "";
}

/**
 * BBCode, cut down to `limit` characters if it has to be.
 *
 * Truncation happens a change at a time, not a version at a time: one version's
 * notes can be long enough to need cutting on their own. A change is only kept
 * if it still leaves room for the line saying how much was left out, so the
 * result never overshoots and never ends mid-sentence.
 */
export function renderBBCode(entries, { limit = 0, moreUrl = "" } = {}) {
  if (!entries.length) return "";
  const multi = entries.length > 1;

  const items = entries.flatMap((entry) =>
    entry.changes.map((change) => ({ version: entry.version, ...change }))
  );

  const versionsAfter = (index) =>
    new Set(items.slice(index).map((i) => i.version)).size;

  const lines = [];
  let lastVersion = null;
  let taken = 0;

  for (; taken < items.length; ++taken) {
    const item = items[taken];
    const next = lines.slice();

    if (multi && item.version !== lastVersion) {
      if (next.length) next.push("");
      next.push(`[b]${item.version}[/b]`);
    }
    next.push(`• [b]${item.label}:[/b] ${inlineBBCode(item.text)}`);

    const left = items.length - taken - 1;
    const candidate = assemble(
      next,
      truncationTails(left, versionsAfter(taken + 1), moreUrl)[0]
    );

    if (limit && candidate.length > limit) break;

    lines.length = 0;
    lines.push(...next);
    lastVersion = item.version;
  }

  return fit(
    lines,
    truncationTails(items.length - taken, versionsAfter(taken), moreUrl),
    limit
  );
}

// ---------------------------------------------------------------------- cli

function githubUrl() {
  try {
    const url = execSync("git config --get remote.origin.url", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return url.endsWith(".git") ? url.slice(0, -4) : url;
  } catch {
    return "";
  }
}

function arg(name, fallback = "") {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const changelog = readChangelog();
  const versions = versionsBetween(changelog, arg("version"), arg("since"));
  const entries = entriesFor(changelog, versions);

  if (arg("format", "markdown") === "bbcode") {
    const base = githubUrl();
    process.stdout.write(
      renderBBCode(entries, {
        limit: Number(arg("limit", "0")) || 0,
        moreUrl: arg("url", base ? `${base}#changelog` : ""),
      })
    );
  } else {
    process.stdout.write(renderMarkdown(entries));
  }
}

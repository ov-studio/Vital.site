#!/usr/bin/env node
/**
 * sync.js — copies everything inside shared/ into frontend/ and backend/,
 * mirroring the directory structure. Run automatically via predev/prebuild.
 */

const fs   = require('fs');
const path = require('path');

const SHARED_DIR  = __dirname;
const TARGETS     = [
  path.resolve(__dirname, '../frontend'),
  path.resolve(__dirname, '../backend'),
];

// Files/dirs inside shared/ to skip (this script itself, etc.)
const SKIP = new Set(['sync.js']);

function copy_dir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const src_path  = path.join(src,  entry.name);
    const dest_path = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copy_dir(src_path, dest_path);
    } else {
      fs.copyFileSync(src_path, dest_path);
      console.log(`  synced: ${path.relative(SHARED_DIR, src_path)}`);
    }
  }
}

// Collect relative paths of everything that will be copied
function collect_paths(src, base = '') {
  const result = [];
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      result.push(...collect_paths(path.join(src, entry.name), rel));
    } else {
      result.push(rel);
    }
  }
  return result;
}

// Write .gitignore entries for synced files into each target
function update_gitignore(target_dir, rel_paths) {
  const gitignore_path = path.join(target_dir, '.gitignore');
  const marker_start   = '# <sync:shared>';
  const marker_end     = '# </sync:shared>';
  const block          = [
    marker_start,
    '# Auto-copied from shared/ by sync.js — do not edit this block manually',
    ...rel_paths,
    marker_end,
  ].join('\n');

  let existing = '';
  if (fs.existsSync(gitignore_path)) {
    existing = fs.readFileSync(gitignore_path, 'utf8');
  }

  // Replace existing block or append
  if (existing.includes(marker_start)) {
    const re  = new RegExp(`${marker_start}[\\s\\S]*?${marker_end}`, 'm');
    existing  = existing.replace(re, block);
  } else {
    existing  = existing.trimEnd() + '\n\n' + block + '\n';
  }

  fs.writeFileSync(gitignore_path, existing, 'utf8');
  console.log(`  gitignore updated: ${path.relative(process.cwd(), gitignore_path)}`);
}

// Also mirror the CDN-facing assets — stylesheets and shared/ui components —
// into frontend/public/cdn/ so they're exported as static files and served
// directly off the site's own domain (vital-sandbox.com/cdn/...) instead of
// external consumers (Vital.kit, Vital.vault) relying on jsDelivr, or on
// having this repo checked out locally, to reach them.
const CDN_TARGET_DIR = path.resolve(__dirname, '../frontend/public/cdn');

const CDN_CSS_FILES = [
  { src: path.join(SHARED_DIR, 'app', 'theme.css'),  dest: path.join(CDN_TARGET_DIR, 'theme.css') },
  { src: path.join(SHARED_DIR, 'app', 'global.css'), dest: path.join(CDN_TARGET_DIR, 'global.css') },
];

function sync_cdn_assets() {
  fs.mkdirSync(CDN_TARGET_DIR, { recursive: true });

  for (const { src, dest } of CDN_CSS_FILES) {
    if (!fs.existsSync(src)) {
      console.warn(`[sync] cdn source missing, skipping: ${path.relative(SHARED_DIR, src)}`);
      continue;
    }
    fs.copyFileSync(src, dest);
    console.log(`  synced (cdn): ${path.relative(SHARED_DIR, src)} -> frontend/public/cdn/${path.basename(dest)}`);
  }

  // shared/ui/*.jsx + ui.css -> frontend/public/cdn/ui/  (fetched at build
  // time by Vital.kit/Vital.vault via scripts/sync-ui.mjs)
  const ui_src_dir  = path.join(SHARED_DIR, 'ui');
  const ui_dest_dir = path.join(CDN_TARGET_DIR, 'ui');
  if (fs.existsSync(ui_src_dir)) {
    fs.mkdirSync(ui_dest_dir, { recursive: true });
    for (const entry of fs.readdirSync(ui_src_dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!/\.(jsx?|css)$/.test(entry.name)) continue;
      fs.copyFileSync(path.join(ui_src_dir, entry.name), path.join(ui_dest_dir, entry.name));
      console.log(`  synced (cdn): ui/${entry.name} -> frontend/public/cdn/ui/${entry.name}`);
    }
  }
}

// ── main ────────────────────────────────────────────────────────────────────

const rel_paths = collect_paths(SHARED_DIR);

if (rel_paths.length === 0) {
  console.log('[sync] nothing in shared/ to copy');
  process.exit(0);
}

for (const target of TARGETS) {
  if (!fs.existsSync(target)) {
    console.warn(`[sync] target not found, skipping: ${target}`);
    continue;
  }
  console.log(`[sync] → ${path.basename(target)}/`);
  copy_dir(SHARED_DIR, target);
  update_gitignore(target, rel_paths);
}

sync_cdn_assets();

console.log('[sync] done');

const fs = require('fs');
const path = require('path');

const SHARED_DIR = __dirname;
const TARGETS = [
  path.resolve(__dirname, '../frontend'),
  path.resolve(__dirname, '../backend'),
];

const SKIP = new Set(['sync.js']);

function copy_dir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const src_path = path.join(src, entry.name);
    const dest_path = path.join(dest, entry.name);
    if (entry.isDirectory()) copy_dir(src_path, dest_path);
    else {
      fs.copyFileSync(src_path, dest_path);
      console.log(`  synced: ${path.relative(SHARED_DIR, src_path)}`);
    }
  }
}

function collect_paths(src, base = '') {
  const result = [];
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...collect_paths(path.join(src, entry.name), rel));
    else result.push(rel);
  }
  return result;
}

function update_gitignore(target_dir, rel_paths) {
  const gitignore_path = path.join(target_dir, '.gitignore');
  const marker_start = '# <sync:shared>';
  const marker_end = '# </sync:shared>';
  const block = [
    marker_start,
    '# Auto-copied from shared/ by sync.js — do not edit this block manually',
    ...rel_paths,
    marker_end,
  ].join('\n');

  let existing = '';
  if (fs.existsSync(gitignore_path)) existing = fs.readFileSync(gitignore_path, 'utf8');
  if (existing.includes(marker_start)) {
    const re = new RegExp(`${marker_start}[\\s\\S]*?${marker_end}`, 'm');
    existing = existing.replace(re, block);
  }
  else existing = existing.trimEnd() + '\n\n' + block + '\n';
  fs.writeFileSync(gitignore_path, existing, 'utf8');
  console.log(`  gitignore updated: ${path.relative(process.cwd(), gitignore_path)}`);
}

const CDN_TARGET_DIR = path.resolve(__dirname, '../frontend/public/cdn');
const UI_SRC_DIR = path.resolve(__dirname, '../frontend/ui');
const CDN_CSS_FILES = [
  { src: path.join(SHARED_DIR, 'app', 'theme.css'), dest: path.join(CDN_TARGET_DIR, 'theme.css') },
  { src: path.join(SHARED_DIR, 'app', 'global.css'), dest: path.join(CDN_TARGET_DIR, 'global.css') },
];

function sync_cdn_assets() {
  fs.mkdirSync(CDN_TARGET_DIR, { recursive: true });
  const cdn_rel_paths = [];

  for (const { src, dest } of CDN_CSS_FILES) {
    if (!fs.existsSync(src)) {
      console.warn(`[sync] cdn source missing, skipping: ${path.relative(SHARED_DIR, src)}`);
      continue;
    }
    fs.copyFileSync(src, dest);
    const rel = path.relative(path.resolve(CDN_TARGET_DIR, '..', '..'), dest).split(path.sep).join('/');
    cdn_rel_paths.push(rel);
    console.log(`  synced (cdn): ${path.relative(SHARED_DIR, src)} -> frontend/public/cdn/${path.basename(dest)}`);
  }

  const ui_dest_dir = path.join(CDN_TARGET_DIR, 'ui');
  if (!fs.existsSync(UI_SRC_DIR)) console.warn(`[sync] ui source missing, skipping: ${path.relative(path.resolve(__dirname, '..'), UI_SRC_DIR)} does not exist`);
  else {
    let copied_any = false;
    const ui_files = []; // relative paths like "card/index.jsx"
    const copy_ui_recursive = (src, dest) => {
      fs.mkdirSync(dest, { recursive: true });
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const src_path = path.join(src, entry.name);
        const dest_path = path.join(dest, entry.name);
        if (entry.isDirectory()) copy_ui_recursive(src_path, dest_path);
        else if (/\.(jsx?|css)$/.test(entry.name)) {
          fs.copyFileSync(src_path, dest_path);
          const rel = path.relative(UI_SRC_DIR, src_path).split(path.sep).join('/');
          ui_files.push(rel);
          console.log(`  synced (cdn): ui/${rel} -> frontend/public/cdn/ui/${rel}`);
          copied_any = true;
        }
      }
    };
    copy_ui_recursive(UI_SRC_DIR, ui_dest_dir);

    ui_files.sort();
    const components = {};
    for (const rel of ui_files) {
      const parts = rel.split('/');
      if (parts.length < 2) continue;
      const name = parts[0];
      (components[name] ||= []).push(parts.slice(1).join('/'));
    }
    const manifest = {
      version: 1,
      generated: new Date().toISOString(),
      components: Object.keys(components).sort().map(name => ({
        name,
        files: components[name].sort(),
      })),
      files: ui_files
    };
    const manifest_path = path.join(ui_dest_dir, 'manifest.json');
    fs.writeFileSync(manifest_path, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log(`  synced (cdn): ui/manifest.json (${ui_files.length} files, ${Object.keys(components).length} components)`);
    if (!copied_any) console.warn(`[sync] ui source exists but contained no .jsx/.css files: ${path.relative(path.resolve(__dirname, '..'), UI_SRC_DIR)}`);
    if (copied_any) cdn_rel_paths.push('public/cdn/ui/');
  }
  return cdn_rel_paths;
}

const rel_paths = collect_paths(SHARED_DIR);
if (rel_paths.length === 0) {
  console.log('[sync] nothing in shared/ to copy');
  process.exit(0);
}

const cdn_rel_paths = sync_cdn_assets();
for (const target of TARGETS) {
  if (!fs.existsSync(target)) {
    console.warn(`[sync] target not found, skipping: ${target}`);
    continue;
  }
  console.log(`[sync] → ${path.basename(target)}/`);
  copy_dir(SHARED_DIR, target);

  const is_frontend = path.basename(target) === 'frontend';
  const gitignore_paths = is_frontend ? [...rel_paths, ...cdn_rel_paths] : rel_paths;
  update_gitignore(target, gitignore_paths);
}

console.log('[sync] done');
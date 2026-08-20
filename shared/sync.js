// Copies files from shared/configs into each app's own local configs
// folder so Next.js/Turbopack never has to resolve anything outside its
// own project root (which is what caused the OOM). Run automatically via
// the "predev"/"prebuild" npm scripts in backend/ and frontend/.
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT           = __dirname;
const SHARED_CONFIGS = path.join(ROOT, 'configs');
const TARGETS        = [
  path.join(ROOT, '..', 'backend',  'configs'),
  path.join(ROOT, '..', 'frontend', 'configs')
];

const files = fs.readdirSync(SHARED_CONFIGS);

for (const target of TARGETS) {
  fs.mkdirSync(target, { recursive: true });

  for (const file of files) {
    const src = path.join(SHARED_CONFIGS, file);
    const dst = path.join(target, file);
    fs.copyFileSync(src, dst);
  }
}

console.log(`[sync] copied ${files.length} shared config file(s) into backend/configs and frontend/configs`);

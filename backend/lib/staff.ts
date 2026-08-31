import * as fs   from 'fs';
import * as path from 'path';

const STAFFS_PATH  = path.join(process.cwd(), 'configs', 'staff.json');
const CACHE_TTL_MS = 10_000;

let cached_logins: Set<string> = new Set();
let cached_at = 0;

function read_staff_list(): Set<string> {
  let raw: string;
  try {
    raw = fs.readFileSync(STAFFS_PATH, 'utf8');
  }
  catch (err) {
    console.error(`[Staffs] Could not read ${STAFFS_PATH}:`, err);
    return cached_logins;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('staff.json must be a JSON array of GitHub logins');
    return new Set(
      parsed
        .map((login) => String(login).trim().toLowerCase())
        .filter(Boolean)
    );
  }
  catch (err) {
    console.error(`[Staffs] Ignoring ${STAFFS_PATH}, invalid JSON:`, err);
    return cached_logins;
  }
}

function staff_logins(): Set<string> {
  const now = Date.now();
  if (now - cached_at > CACHE_TTL_MS) {
    cached_logins = read_staff_list();
    cached_at = now;
  }
  return cached_logins;
}

export function is_staff_login(login: string): boolean {
  return staff_logins().has(login.toLowerCase());
}

export function all_staff_logins(): string[] {
  return Array.from(staff_logins());
}

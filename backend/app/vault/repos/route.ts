import * as lib_auth      from '@/lib/auth';
import * as lib_ratelimit from '@/lib/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

type GhRepo = {
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
};

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;

  if (!lib_auth.auth_configured()) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }

  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const gh = await lib_auth.github_token_from_auth_header(req.headers.get('authorization'));
  if (!gh) {
    return Response.json(
      { error: 'reauth_required', message: 'Sign in again to grant repository access' },
      { status: 403 }
    );
  }

  const repos: GhRepo[] = [];
  let page = 1;
  while (page <= 5) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${gh}`,
          'User-Agent': 'Vital.site/1.0'
        }
      }
    );
    if (!res.ok) {
      return Response.json({ error: 'Failed to list repositories' }, { status: 502 });
    }
    const batch = (await res.json()) as GhRepo[];
    if (!Array.isArray(batch) || !batch.length) break;
    for (const r of batch) {
      if (r.private) continue;
      repos.push({
        full_name: r.full_name,
        html_url: r.html_url,
        description: r.description,
        private: r.private,
        fork: r.fork,
        stargazers_count: r.stargazers_count,
        updated_at: r.updated_at,
        default_branch: r.default_branch
      });
    }
    if (batch.length < 100) break;
    page += 1;
  }

  return Response.json({ repos });
}

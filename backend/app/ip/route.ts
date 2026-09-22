export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    if (!ip) return Response.json({ error: 'could not determine ip' }, { status: 500 });
    return Response.json({ ip });
}

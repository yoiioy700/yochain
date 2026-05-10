import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// GET /api/profiles — return all profiles
export async function GET() {
  try {
    const profiles = await kv.get('profiles') || [];
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles from KV:', error);
    // If KV fails (e.g. not configured), return empty array
    return NextResponse.json([]);
  }
}

// POST /api/profiles — upsert a profile by username
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, role, photo, ecosystems, focus, available, score, gh, tw, sol, profileUrl, savedAt } = body;

    if (!username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const profiles: any = await kv.get('profiles') || [];
    const existingIdx = profiles.findIndex((p: { username: string }) => p.username === username);

    const entry = { username, name, role, photo, ecosystems, focus, available, score, gh, tw, sol, profileUrl, savedAt: savedAt || new Date().toISOString() };

    if (existingIdx >= 0) {
      profiles[existingIdx] = entry;
    } else {
      profiles.push(entry);
    }

    await kv.set('profiles', profiles);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

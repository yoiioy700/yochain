import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Strip any absolute domain from a profileUrl so it's always a relative path
// e.g. "https://yochain.vercel.app/cv/foo?d=..." → "/cv/foo?d=..."
function toRelativeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    // If it's already relative, return as-is
    if (url.startsWith('/')) return url;
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
}

// GET /api/profiles — return all profiles ordered by score, or a single profile by username
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (username) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return NextResponse.json(null); // Not found
        throw error;
      }
      return NextResponse.json({
        ...data,
        profileUrl: toRelativeUrl(data.profile_url),
        savedAt: data.saved_at
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('score', { ascending: false });

    if (error) throw error;

    // Map snake_case DB columns → camelCase for frontend
    const mapped = (data || []).map((p: any) => ({
      ...p,
      profileUrl: toRelativeUrl(p.profile_url),
      savedAt: p.saved_at,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching profiles from Supabase:', error);
    return NextResponse.json([]);
  }
}

// POST /api/profiles — upsert a profile by username
export async function POST(req: NextRequest) {
  try {
    // Debug: log env vars presence
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    console.log('[profiles POST] SUPABASE_URL set:', !!supabaseUrl);
    console.log('[profiles POST] SUPABASE_ANON_KEY set:', !!supabaseKey);

    const body = await req.json();
    const { username, name, role, photo, ecosystems, focus, available, score, gh, tw, sol, profileUrl, savedAt } = body;
    console.log('[profiles POST] username:', username);

    if (!username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          username,
          name,
          role,
          photo,
          ecosystems,
          focus,
          available,
          score,
          gh,
          tw,
          sol,
          profile_url: profileUrl,
          saved_at: savedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'username' }
      );

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Supabase upsert error:', err);
    return NextResponse.json({ error: 'Failed to save profile', detail: err?.message || String(err) }, { status: 500 });
  }
}

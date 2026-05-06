import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILES_FILE = path.join(process.cwd(), 'data', 'profiles.json');

function readProfiles() {
  try {
    if (!fs.existsSync(PROFILES_FILE)) {
      fs.writeFileSync(PROFILES_FILE, '[]', 'utf-8');
    }
    const raw = fs.readFileSync(PROFILES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeProfiles(profiles: object[]) {
  fs.mkdirSync(path.dirname(PROFILES_FILE), { recursive: true });
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
}

// GET /api/profiles — return all profiles
export async function GET() {
  const profiles = readProfiles();
  return NextResponse.json(profiles);
}

// POST /api/profiles — upsert a profile by username
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, role, photo, ecosystems, focus, available, score, gh, tw, sol, profileUrl, savedAt } = body;

    if (!username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const profiles = readProfiles();
    const existingIdx = profiles.findIndex((p: { username: string }) => p.username === username);

    const entry = { username, name, role, photo, ecosystems, focus, available, score, gh, tw, sol, profileUrl, savedAt: savedAt || new Date().toISOString() };

    if (existingIdx >= 0) {
      profiles[existingIdx] = entry;
    } else {
      profiles.push(entry);
    }

    writeProfiles(profiles);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

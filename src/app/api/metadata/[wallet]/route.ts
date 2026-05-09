import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'metadata');

export async function GET(req: NextRequest, props: { params: Promise<{ wallet: string }> }) {
  const params = await props.params;
  const wallet = params.wallet;
  
  try {
    const filePath = path.join(DATA_DIR, `${wallet}.json`);
    
    // Default fallback metadata if not yet saved
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        name: `YoChain Profile - ${wallet.slice(0, 4)}...${wallet.slice(-4)}`,
        description: "CV Web3 onchain yang dibuat oleh YoChain",
        image: `https://api.dicebear.com/9.x/shapes/svg?seed=${wallet}&backgroundColor=0a0a0a`
      });
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Metaplex Standard JSON response
    return new NextResponse(JSON.stringify(parsed), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read metadata' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ wallet: string }> }) {
  const params = await props.params;
  const wallet = params.wallet;
  
  try {
    const body = await req.json();
    
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(path.join(DATA_DIR, `${wallet}.json`), JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true, url: `/api/metadata/${wallet}` });
  } catch (err) {
    console.error('Save metadata error:', err);
    return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 });
  }
}

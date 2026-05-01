import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'EVM support removed. Solana only.', txCount: 0, chains: [] });
}

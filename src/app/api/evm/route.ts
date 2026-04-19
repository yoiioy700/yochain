import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = (searchParams.get('address') || '').trim();

  // Normalize — strip whitespace, ensure 0x prefix case-insensitive, exact 42 chars
  if (!raw || raw.length < 10 || !raw.toLowerCase().startsWith('0x')) {
    return NextResponse.json({ error: 'Invalid EVM address', address: raw, txCount: 0 });
  }

  const address = raw; // keep original casing for RPC call

  // Try multiple public RPCs as fallback
  const rpcs = [
    'https://eth.llamarpc.com',
    'https://rpc.ankr.com/eth',
    'https://cloudflare-eth.com',
  ];

  for (const rpcUrl of rpcs) {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionCount',
          params: [address, 'latest'],
          id: 1
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) continue;
      
      const data = await response.json();
      if (data.error) continue;

      const txCount = parseInt(data.result || '0x0', 16);
      return NextResponse.json({ address, txCount });

    } catch {
      // try next RPC
      continue;
    }
  }

  return NextResponse.json({ error: 'All RPC providers failed', address, txCount: 0 }, { status: 502 });
}


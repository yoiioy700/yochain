import { NextRequest, NextResponse } from 'next/server';

// Chains supported for multi-chain EVM scanning
const EVM_CHAINS = [
  { id: 'eth-mainnet',    name: 'Ethereum',  rpc: 'https://eth.llamarpc.com',                 color: '#627EEA' },
  { id: 'matic-mainnet',  name: 'Polygon',   rpc: 'https://polygon-rpc.com',                  color: '#8247E5' },
  { id: 'bsc-mainnet',    name: 'BSC',       rpc: 'https://bsc-dataseed.binance.org',          color: '#F3BA2F' },
  { id: 'base-mainnet',   name: 'Base',      rpc: 'https://mainnet.base.org',                  color: '#0052FF' },
  { id: 'optimism-mainnet', name: 'Optimism', rpc: 'https://mainnet.optimism.io',             color: '#FF0420' },
  { id: 'arbitrum-mainnet', name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc',            color: '#28A0F0' },
  { id: 'avalanche-mainnet', name: 'Avalanche', rpc: 'https://api.avax.network/ext/bc/C/rpc', color: '#E84142' },
  { id: 'linea-mainnet',  name: 'Linea',     rpc: 'https://rpc.linea.build',                  color: '#61DFFF' },
  { id: 'zksync-mainnet', name: 'zkSync',    rpc: 'https://mainnet.era.zksync.io',             color: '#8C8DFC' },
];

async function getTxCountFromRpc(rpc: string, address: string): Promise<number> {
  try {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', method: 'eth_getTransactionCount',
        params: [address, 'latest'], id: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return parseInt(data.result || '0x0', 16);
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = (searchParams.get('address') || '').trim();

  if (!raw || raw.length < 10 || !raw.toLowerCase().startsWith('0x')) {
    return NextResponse.json({ error: 'Invalid EVM address', address: raw, txCount: 0, chains: [] });
  }

  const address = raw;
  const covalentKey = process.env.COVALENT_API_KEY;

  // ── COVALENT PATH: Multi-chain address activity ─────────────────────────────
  if (covalentKey) {
    try {
      // First: check which chains this address is active on
      const activityRes = await fetch(
        `https://api.covalenthq.com/v1/address/${address}/activity/?key=${covalentKey}&testnets=false`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (activityRes.ok) {
        const activity = await activityRes.json();
        const activeItems: any[] = activity?.data?.items || [];

        if (activeItems.length > 0) {
          // Fetch tx summary for each active chain in parallel
          const chainResults = await Promise.allSettled(
            activeItems.slice(0, 8).map(async (item: any) => {
              const chainName = item.chain_id;
              const txRes = await fetch(
                `https://api.covalenthq.com/v1/${chainName}/address/${address}/transaction_summary/?key=${covalentKey}`,
                { signal: AbortSignal.timeout(8000) }
              );
              if (!txRes.ok) return null;
              const txData = await txRes.json();
              const txCount = txData?.data?.items?.[0]?.total_count || 0;
              const lastSeen = txData?.data?.items?.[0]?.latest_transaction?.block_signed_at || null;
              const knownChain = EVM_CHAINS.find(c => c.id === chainName);
              return {
                chain: knownChain?.name || chainName,
                chainId: chainName,
                color: knownChain?.color || '#888',
                txCount,
                lastSeen,
              };
            })
          );

          const chains = chainResults
            .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value !== null)
            .map(r => r.value)
            .filter(c => c.txCount > 0)
            .sort((a, b) => b.txCount - a.txCount);

          const txCount = chains.reduce((sum, c) => sum + c.txCount, 0);

          return NextResponse.json({
            address,
            txCount,
            chains,
            source: 'covalent',
          });
        }
      }
    } catch (err) {
      console.error('Covalent API error, falling back to public RPC:', err);
    }
  }

  // ── FALLBACK PATH: Parallel public RPC calls ────────────────────────────────
  const results = await Promise.allSettled(
    EVM_CHAINS.map(async (chain) => {
      const txCount = await getTxCountFromRpc(chain.rpc, address);
      return { chain: chain.name, chainId: chain.id, color: chain.color, txCount };
    })
  );

  const chains = results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value.txCount > 0)
    .map(r => r.value)
    .sort((a, b) => b.txCount - a.txCount);

  const txCount = chains.reduce((sum, c) => sum + c.txCount, 0);

  return NextResponse.json({
    address,
    txCount,
    chains,
    source: 'rpc',
  });
}

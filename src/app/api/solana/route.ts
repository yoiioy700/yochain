import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const KNOWN_PROTOCOLS: Record<string, string> = {
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter',
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK': 'Raydium CLMM',
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium AMM',
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX': 'Serum',
  'So11111111111111111111111111111111111111112': 'Wrapped SOL',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD': 'Marinade',
  'MFv2hWf31Z9kbCa1snEPdcgp168vLs2izgZ8Df45pPk': 'MangoV4',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet')?.trim();

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
  }

  let pubkey: PublicKey;
  try {
    pubkey = new PublicKey(wallet);
  } catch {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  const heliusKey = process.env.HELIUS_API_KEY;

  // ── HELIUS PATH: Rich enriched data ────────────────────────────────────────
  if (heliusKey) {
    try {
      const baseUrl = `https://api.helius.xyz`;

      // Run in parallel: balance, token accounts, enriched tx history
      const [balanceRes, tokenRes, txRes] = await Promise.all([
        // SOL Balance via Helius RPC
        fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [wallet] }),
          signal: AbortSignal.timeout(8000),
        }).then(r => r.json()),

        // Token holdings via Helius RPC
        fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner',
            params: [wallet, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, { encoding: 'jsonParsed' }],
          }),
          signal: AbortSignal.timeout(8000),
        }).then(r => r.json()),

        // Enriched transaction history — Helius parses protocol interactions
        fetch(`${baseUrl}/v0/addresses/${wallet}/transactions?api-key=${heliusKey}&limit=100`, {
          signal: AbortSignal.timeout(12000),
        }).then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      const solBalance = (balanceRes?.result?.value || 0) / LAMPORTS_PER_SOL;

      // Count tokens with non-zero balance
      const tokenCount = (tokenRes?.result?.value || []).filter((acc: any) => {
        const amount = acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        return amount && amount > 0;
      }).length;

      // Parse enriched txs — extract protocols and stats
      const txList: any[] = Array.isArray(txRes) ? txRes : [];
      const totalTransactions = txList.length;

      const protocolSet = new Set<string>();
      let swapCount = 0;
      let nftCount = 0;
      let firstTxDate: string | null = null;
      let walletAge = 'Unknown';

      for (const tx of txList) {
        if (tx.type === 'SWAP') swapCount++;
        if (tx.type?.startsWith('NFT')) nftCount++;

        // Detect protocols from account keys
        for (const prog of (tx.accountData || [])) {
          const name = KNOWN_PROTOCOLS[prog.account];
          if (name) protocolSet.add(name);
        }
        // Also from top-level source field Helius provides
        if (tx.source && tx.source !== 'SYSTEM_PROGRAM' && tx.source !== 'UNKNOWN') {
          const niceName = tx.source.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
          protocolSet.add(niceName);
        }
      }

      // Wallet age from oldest tx timestamp
      if (txList.length > 0) {
        const oldest = txList[txList.length - 1];
        if (oldest.timestamp) {
          const ms = oldest.timestamp * 1000;
          firstTxDate = new Date(ms).toISOString();
          const days = Math.floor((Date.now() - ms) / 86400000);
          if (days < 30) walletAge = `${days} days`;
          else if (days < 365) walletAge = `${Math.floor(days / 30)} months`;
          else walletAge = `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m`;
        }
      }

      return NextResponse.json({
        wallet,
        sol: parseFloat(solBalance.toFixed(4)),
        totalTransactions,
        walletAge,
        firstTxDate,
        tokenCount,
        protocols: Array.from(protocolSet).slice(0, 10),
        swapCount,
        nftCount,
        source: 'helius',
      });

    } catch (err) {
      console.error('Helius fetch error, falling back to public RPC:', err);
      // fall through to RPC fallback below
    }
  }

  // ── FALLBACK PATH: Standard @solana/web3.js ─────────────────────────────────
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');

  try {
    const [balanceLamports, tokenAccounts, signatures] = await Promise.all([
      connection.getBalance(pubkey),
      connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      }),
      connection.getSignaturesForAddress(pubkey, { limit: 1000 }),
    ]);

    const solBalance = balanceLamports / LAMPORTS_PER_SOL;
    const totalTransactions = signatures.length;

    let walletAge = 'Unknown';
    let firstTxDate: string | null = null;
    if (signatures.length > 0) {
      const oldest = signatures[signatures.length - 1];
      if (oldest.blockTime) {
        const ms = oldest.blockTime * 1000;
        firstTxDate = new Date(ms).toISOString();
        const days = Math.floor((Date.now() - ms) / 86400000);
        if (days < 30) walletAge = `${days} days`;
        else if (days < 365) walletAge = `${Math.floor(days / 30)} months`;
        else walletAge = `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m`;
      }
    }

    const tokenCount = tokenAccounts.value.filter((acc) => {
      const amount = acc.account.data.parsed?.info?.tokenAmount?.uiAmount;
      return amount && amount > 0;
    }).length;

    return NextResponse.json({
      wallet,
      sol: parseFloat(solBalance.toFixed(4)),
      totalTransactions,
      walletAge,
      firstTxDate,
      tokenCount,
      protocols: [],
      swapCount: 0,
      nftCount: 0,
      source: 'rpc',
    });
  } catch (err) {
    console.error('Solana fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch onchain data' }, { status: 500 });
  }
}

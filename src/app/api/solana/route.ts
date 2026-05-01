import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { resolve, reverseLookup } from '@bonfida/spl-name-service';

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

  let targetWallet = wallet;
  let domainName: string | null = null;
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
  const rpcConnection = new Connection(rpcUrl, 'confirmed');

  if (wallet.toLowerCase().endsWith('.sol')) {
    domainName = wallet.toLowerCase();
    try {
      // Resolve .sol to pubkey (drop the .sol for the resolve function usually, but check standard)
      // The resolve function typically takes the full domain like "bonfida.sol"
      const resolvedKey = await resolve(rpcConnection, domainName);
      targetWallet = resolvedKey.toBase58();
    } catch (err) {
      return NextResponse.json({ error: 'Failed to resolve .sol domain' }, { status: 400 });
    }
  }

  let pubkey: PublicKey;
  try {
    pubkey = new PublicKey(targetWallet);
  } catch {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  if (!domainName) {
    try {
      const reverse = await reverseLookup(rpcConnection, pubkey);
      if (reverse) {
        domainName = reverse + '.sol';
      }
    } catch (err) {
      // No reverse record found
    }
  }

  const heliusKey = process.env.HELIUS_API_KEY;

  // ── HELIUS PATH: Rich enriched data ────────────────────────────────────────
  if (heliusKey) {
    try {
      const baseUrl = `https://api.helius.xyz`;

      // Run in parallel: balance, token accounts, enriched tx history, and signatures from RPC
      const [balanceRes, tokenRes, txRes, signatures] = await Promise.all([
        // SOL Balance via Helius RPC
        fetch(`https://devnet.helius-rpc.com/?api-key=${heliusKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [targetWallet] }),
          signal: AbortSignal.timeout(8000),
        }).then(r => r.json()),

        // Token holdings via Helius RPC
        fetch(`https://devnet.helius-rpc.com/?api-key=${heliusKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner',
            params: [targetWallet, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, { encoding: 'jsonParsed' }],
          }),
          signal: AbortSignal.timeout(8000),
        }).then(r => r.json()),

        // Enriched transaction history — Helius parses protocol interactions
        fetch(`${baseUrl}/v0/addresses/${targetWallet}/transactions?api-key=${heliusKey}&limit=100`, {
          signal: AbortSignal.timeout(12000),
        }).then(r => r.ok ? r.json() : []).catch(() => []),

        // Always fetch signatures from standard RPC for consistent total transaction count
        rpcConnection.getSignaturesForAddress(pubkey, { limit: 1000 }),
      ]);

      const solBalance = (balanceRes?.result?.value || 0) / LAMPORTS_PER_SOL;

      // Count tokens with non-zero balance
      const tokenCount = (tokenRes?.result?.value || []).filter((acc: any) => {
        const amount = acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        return amount && amount > 0;
      }).length;

      // Parse enriched txs — extract protocols and stats
      const txList: any[] = Array.isArray(txRes) ? txRes : [];
      const totalTransactions = signatures.length;

      const protocolSet = new Set<string>();
      let swapCount = 0;
      let nftCount = 0;
      
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

      // Wallet age consistently calculated from signatures
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

      const badges: string[] = [];
      const days = firstTxDate ? Math.floor((Date.now() - new Date(firstTxDate).getTime()) / 86400000) : 0;
      if (days >= 365) badges.push('💎 Early Adopter');
      if (swapCount >= 10 || protocolSet.size >= 5) badges.push('🔥 DeFi Degen');
      if (tokenCount >= 5) badges.push('🙌 Diamond Hands');
      if (nftCount >= 2) badges.push('🖼️ NFT Collector');

      return NextResponse.json({
        wallet: targetWallet,
        domainName,
        badges,
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
  const connection = rpcConnection;

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

    const badges: string[] = [];
    const days = firstTxDate ? Math.floor((Date.now() - new Date(firstTxDate).getTime()) / 86400000) : 0;
    if (days >= 365) badges.push('💎 Early Adopter');
    if (tokenCount >= 5) badges.push('🙌 Diamond Hands');

    return NextResponse.json({
      wallet: targetWallet,
      domainName,
      badges,
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

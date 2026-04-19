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
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
  }

  let pubkey: PublicKey;
  try {
    pubkey = new PublicKey(wallet);
  } catch {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

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

    // Wallet age
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

    // Filter meaningful SPL tokens (balance > 0)
    const tokens = tokenAccounts.value
      .filter((acc) => {
        const amount = acc.account.data.parsed?.info?.tokenAmount?.uiAmount;
        return amount && amount > 0;
      })
      .map((acc) => ({
        mint: acc.account.data.parsed?.info?.mint,
        amount: acc.account.data.parsed?.info?.tokenAmount?.uiAmount,
        decimals: acc.account.data.parsed?.info?.tokenAmount?.decimals,
      }))
      .slice(0, 20);

    // Detect protocol interactions from recent signatures
    const recentSigs = signatures.slice(0, 50);
    const protocolSet = new Set<string>();
    // Simple heuristic: check known program IDs (would need parsed tx for full accuracy)
    // For MVP just show top tx stats

    return NextResponse.json({
      wallet: wallet,
      sol: parseFloat(solBalance.toFixed(4)),
      totalTransactions,
      walletAge,
      firstTxDate,
      tokenCount: tokens.length,
      tokens: tokens.slice(0, 10),
      protocols: Array.from(protocolSet),
    });
  } catch (err) {
    console.error('Solana fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch onchain data' }, { status: 500 });
  }
}

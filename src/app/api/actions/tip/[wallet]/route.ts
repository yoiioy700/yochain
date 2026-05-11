import { NextRequest } from 'next/server';
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse } from '@solana/actions';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getProfile(username: string) {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.eq.${username},sol.eq.${username}`)
      .single();
    return data;
  } catch {
    return null;
  }
}

// Blinks spec requires these headers in addition to CORS headers
const BLINKS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, x-sdk-variant, x-sdk-version, x-blockchain-ids, x-action-version',
  'Content-Type': 'application/json',
  'X-Action-Version': '1.0',
  'X-Blockchain-Ids': 'solana:devnet',
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ wallet: string }> }) {
  try {
    const { wallet: username } = await params;
    const profile = await getProfile(username);
    
    // CRITICAL: hrefs must be ABSOLUTE URLs for dial.to / X Blinks to work
    // dial.to makes server-side POST requests to these hrefs
    const origin = new URL(req.url).origin;
    const baseHref = `${origin}/api/actions/tip/${username}`;

    const title = profile?.name ? `Tip ${profile.name}` : 'Tip Developer';
    
    let icon = profile?.photo || '';
    if (icon && icon.startsWith('/')) {
      icon = `${origin}${icon}`;
    } else if (!icon) {
      icon = `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;
    }

    const payload: ActionGetResponse = {
      title,
      icon,
      description: profile?.name
        ? `Tip ${profile.name} — ${profile.role || 'Web3 Developer'} — directly on Solana.`
        : 'Support this builder by sending a SOL tip directly to their wallet.',
      label: 'Tip',
      links: {
        actions: [
          {
            type: 'transaction',
            label: '0.1 SOL',
            href: `${baseHref}?amount=0.1`,
          },
          {
            type: 'transaction',
            label: '0.5 SOL',
            href: `${baseHref}?amount=0.5`,
          },
          {
            type: 'transaction',
            label: '1 SOL',
            href: `${baseHref}?amount=1`,
          },
          {
            type: 'transaction',
            label: 'Send Tip',
            href: `${baseHref}?amount={amount}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter SOL amount',
                required: true,
              },
            ],
          },
        ] as any,
      },
    };

    return Response.json(payload, { headers: BLINKS_HEADERS });
  } catch (err) {
    return Response.json({ error: 'Failed to generate action' }, { status: 500, headers: BLINKS_HEADERS });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ wallet: string }> }) {
  try {
    const { wallet: username } = await params;
    const profile = await getProfile(username);
    
    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(profile?.sol || username);
    } catch {
      return Response.json({ error: 'Invalid recipient address' }, { status: 400, headers: BLINKS_HEADERS });
    }

    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return Response.json({ error: 'Invalid "account" provided' }, { status: 400, headers: BLINKS_HEADERS });
    }

    const url = new URL(req.url);
    const amountParam = url.searchParams.get('amount') || '0.1';
    const amount = parseFloat(amountParam);
    if (isNaN(amount) || amount <= 0) {
      return Response.json({ error: 'Invalid "amount" provided' }, { status: 400, headers: BLINKS_HEADERS });
    }

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
    const connection = new Connection(rpc, 'confirmed');
    
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: recipientPubkey,
        lamports: Math.round(amount * 1e9),
      })
    );
    
    tx.feePayer = account;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });

    const payload: ActionPostResponse = {
      type: 'transaction',
      transaction: serialized.toString('base64'),
      message: `Sent ${amount} SOL to ${profile?.name || 'Developer'}!`,
    } as any;

    return Response.json(payload, { headers: BLINKS_HEADERS });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Failed to create transaction' }, { status: 500, headers: BLINKS_HEADERS });
  }
}

export const OPTIONS = async () => Response.json(null, { headers: BLINKS_HEADERS });

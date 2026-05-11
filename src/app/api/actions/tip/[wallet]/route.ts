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

export async function GET(req: NextRequest, { params }: { params: Promise<{ wallet: string }> }) {
  try {
    const { wallet: username } = await params;
    const profile = await getProfile(username);
    
    const title = profile?.name ? `Tip ${profile.name}` : "Tip Developer";
    
    let icon = profile?.photo || '';
    if (icon && icon.startsWith('/')) {
      icon = new URL(icon, new URL(req.url).origin).toString();
    } else if (!icon) {
      icon = `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;
    }

    const payload: ActionGetResponse = {
      title,
      icon,
      description: `Support this builder by sending a SOL tip directly to their wallet.`,
      label: "Tip",
      links: {
        actions: [
          {
            label: "0.1 SOL",
            href: `/api/actions/tip/${username}?amount=0.1`,
          },
          {
            label: "0.5 SOL",
            href: `/api/actions/tip/${username}?amount=0.5`,
          },
          {
            label: "1 SOL",
            href: `/api/actions/tip/${username}?amount=1`,
          },
          {
            label: "Send Tip",
            href: `/api/actions/tip/${username}?amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Enter custom SOL amount",
                required: true
              }
            ]
          }
        ]
      }
    };

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    return Response.json({ error: "Failed to generate action" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
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
      return Response.json({ error: "Invalid recipient address" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return Response.json({ error: 'Invalid "account" provided' }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const url = new URL(req.url);
    const amountParam = url.searchParams.get('amount') || '0.1';
    const amount = parseFloat(amountParam);
    if (isNaN(amount) || amount <= 0) {
      return Response.json({ error: 'Invalid "amount" provided' }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com', 'confirmed');
    
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
      transaction: serialized.toString('base64'),
      message: `Sent ${amount} SOL to ${profile?.name || 'Developer'}!`
    };

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to create transaction" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
}

export const OPTIONS = async () => Response.json(null, { headers: ACTIONS_CORS_HEADERS });

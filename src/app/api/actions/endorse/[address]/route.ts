import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, createActionHeaders } from '@solana/actions';

export async function GET(req: NextRequest, props: { params: Promise<{ address: string }> }) {
  const params = await props.params;
  const address = params.address;

  // Use a fallback image or generic SVG
  const iconUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${address}&backgroundColor=0a0a0a`;

  const payload: ActionGetResponse = {
    title: 'Endorse YoChain Profile',
    icon: iconUrl,
    description: `Berikan dukungan (endorsement) kepada developer ini dengan mengirim 0.001 SOL beserta pesan singkat yang akan dicatat di Solana blockchain.`,
    label: 'Endorse Profile',
    links: {
      actions: [
        {
          type: 'transaction',
          label: 'Kirim Endorsement',
          href: `/api/actions/endorse/${address}?message={message}`,
          parameters: [
            {
              name: 'message',
              label: 'Pesan endorsement (maks 100 karakter)',
              required: true
            }
          ]
        }
      ]
    }
  };

  return NextResponse.json(payload, { headers: createActionHeaders() });
}

export const OPTIONS = async () => new NextResponse(null, { headers: createActionHeaders() });

export async function POST(req: NextRequest, props: { params: Promise<{ address: string }> }) {
  try {
    const params = await props.params;
    const address = params.address;
    
    const body: ActionPostRequest = await req.json();
    const account = new PublicKey(body.account);
    const recipient = new PublicKey(address);

    const url = new URL(req.url);
    const rawMessage = url.searchParams.get('message') || 'Great developer!';
    const finalMessage = rawMessage.slice(0, 100);

    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    const tx = new Transaction();
    
    // 1. Transfer 0.001 SOL instruction
    tx.add(SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: recipient,
      lamports: 0.001 * LAMPORTS_PER_SOL
    }));

    // 2. Add Memo instruction
    const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLXFpx');
    tx.add(new TransactionInstruction({
      keys: [{ pubkey: account, isSigner: true, isWritable: true }],
      programId: memoProgramId,
      data: Buffer.from(`YoChain Endorsement: ${finalMessage}`, 'utf-8')
    }));

    // 3. Set fee payer and blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.feePayer = account;

    const payload: ActionPostResponse = {
      type: 'transaction',
      transaction: tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
      message: 'Endorsement berhasil disiapkan! Silakan approve transaksi di wallet.'
    };

    return NextResponse.json(payload, { headers: createActionHeaders() });
  } catch (err) {
    console.error('Endorse Action Error:', err);
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 400, headers: createActionHeaders() });
  }
}

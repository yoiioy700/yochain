import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  ACTIONS_CORS_HEADERS
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) => {
  try {
    const { wallet } = await params;
    const targetWallet = new PublicKey(wallet);

    const payload: ActionGetResponse = {
      title: "Hire or Tip this Dev",
      icon: new URL("/profile-placeholder.png", req.url).toString(), // Make sure an image exists or we use the actual photo if we can query it
      description: "Support this web3 professional directly onchain! Choose an amount to tip or send a custom amount.",
      label: "Send SOL",
      links: {
        actions: [
          {
            type: "transaction",
            label: "Tip 0.1 SOL",
            href: `/api/actions/tip/${targetWallet.toBase58()}?amount=0.1`,
          },
          {
            type: "transaction",
            label: "Tip 0.5 SOL",
            href: `/api/actions/tip/${targetWallet.toBase58()}?amount=0.5`,
          },
          {
            type: "transaction",
            label: "Tip 1.0 SOL",
            href: `/api/actions/tip/${targetWallet.toBase58()}?amount=1.0`,
          },
          {
            type: "transaction",
            label: "Send Custom Amount",
            href: `/api/actions/tip/${targetWallet.toBase58()}?amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Enter SOL amount",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    return Response.json("Invalid wallet address", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const OPTIONS = GET;

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) => {
  try {
    const { wallet } = await params;
    const url = new URL(req.url);
    const amountParam = url.searchParams.get("amount");
    const amount = parseFloat(amountParam || "0.1");

    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const targetWallet = new PublicKey(wallet);

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta"),
      "confirmed"
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: targetWallet,
        lamports: amount * 10 ** 9,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: `Successfully tipped ${amount} SOL!`,
      },
      // no signers required for a simple transfer since the user's wallet will sign
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    return Response.json("An unknown error occurred", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

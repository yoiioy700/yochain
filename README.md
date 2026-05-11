# YoChain — Onchain Developer Identity

![Solana](https://img.shields.io/badge/Network-Solana-14F195?style=flat-square)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square)
![Metaplex](https://img.shields.io/badge/Protocol-Metaplex_Core-E33F85?style=flat-square)
![Superteam Indonesia](https://img.shields.io/badge/Track-Superteam_Indonesia-9945FF?style=flat-square)

**YoChain** is a decentralized platform for developers to craft, mint, and showcase their professional identity on the Solana blockchain — bridging GitHub contributions and onchain activity into a single, verifiable profile.

---

## Features

- **GitHub Integration** — Sync repos, stars, and developer stats into your CV
- **Onchain Profile** — Fetch Solana activity via Helius RPC (transactions, NFTs, tokens)
- **Mint Identity NFT** — Immortalize your CV as a Metaplex Core NFT on Solana Devnet
- **Solana Blinks (Tip)** — Share your profile on X; viewers can tip SOL directly from their feed
- **PDF Export** — Generate a clean, print-ready CV from your profile
- **`.sol` Domain Support** — Natively resolves Bonfida SNS domains
- **1 GitHub = 1 Identity** — Each GitHub account maps to exactly one onchain identity

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | Next.js 15 (App Router), React 19 |
| Web3 | `@solana/web3.js`, Wallet Standard, Metaplex UMI |
| NFT | Metaplex Core (`@metaplex-foundation/mpl-core`) |
| Auth | NextAuth.js (GitHub OAuth) |
| Data | Helius RPC, Supabase |
| Naming | Bonfida SNS (`@bonfida/spl-name-service`) |
| Blinks | `@solana/actions` |

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Solana wallet (Phantom, Backpack) on Devnet

### Installation

```bash
git clone https://github.com/yoiioy700/yochain.git
cd yochain
npm install
```

### Environment Variables

Create `.env.local`:

```env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
HELIUS_API_KEY=...
NEXT_PUBLIC_SOLANA_RPC=https://devnet.helius-rpc.com/?api-key=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Run

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## How It Works

1. **Connect** — Link your Solana wallet + GitHub account
2. **Build** — Platform auto-fetches GitHub stats and onchain activity
3. **Customize** — Add bio, experience, projects, skills
4. **Mint** — Mint your profile as a Metaplex Core Identity NFT
5. **Share** — Profile lives at `yochain.tech/cv/[github-username]` with Blinks for tipping

---

Built for the [Colosseum Frontier Hackathon](https://colosseum.org/) — [Superteam Indonesia](https://superteam.fun/) track.

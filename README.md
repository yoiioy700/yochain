---

**YoChain: The Onchain Developer Identity & CV Builder**

![Solana](https://img.shields.io/badge/Network-Solana-14F195?style=flat-square)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square)
![Metaplex](https://img.shields.io/badge/Protocol-Metaplex_Core-E33F85?style=flat-square)
![Superteam Indonesia](https://img.shields.io/badge/Track-Superteam_Indonesia-9945FF?style=flat-square)

YoChain is a decentralized platform that empowers developers to craft, mint, and showcase their professional identity on the Solana blockchain. By bridging GitHub contributions and onchain activity, YoChain creates an immutable, verifiable, and elegant portfolio that lives forever on the network.

Traditional CVs are static and easy to forge, while onchain activity is often fragmented across multiple explorers and dashboards. YoChain solves this by aggregating your GitHub stats, Solana transaction history, token holdings, and protocol interactions into a single, beautifully designed profile. 

Built with an editorial-style "Aurora" aesthetic, the platform ensures that your developer identity isn't just verified—it looks premium. Every profile can be minted as a Metaplex Core NFT, cementing your professional milestones onchain.

### Key Features
- **Connect Wallet:** Seamless, standard-compliant Solana wallet integration.
- **GitHub Integration:** Sync your top repositories, commits, and developer stats directly into your CV.
- **Onchain Profile:** Automatically fetch your Solana activity, including wallet age, DeFi badges, and token count via Helius RPC.
- **Mint NFT Identity:** Immortalize your CV by minting it as a Metaplex Core NFT on the Solana network.
- **Blinks Endorsement:** Share your profile as a Solana Blink, allowing others to endorse your skills directly from their X (Twitter) feed.
- **Export to PDF:** Generate a print-ready, beautifully formatted PDF version of your onchain CV.
- **Multi-template CV:** Choose from various premium layouts, including the signature "Aurora" design.
- **`.sol` Domain Support:** Natively resolves Bonfida Solana Name Service (SNS) domains for cleaner profile URLs.

## How It Works
1. **Connect & Authenticate** - Users connect their Solana wallet (via Wallet Standard) and link their GitHub account.
2. **Build Profile** - The platform fetches GitHub data and onchain activity (via Helius) to auto-populate the CV data.
3. **Customize** - Users select a template, add personal details, and customize the skills and links they want to showcase.
4. **Mint** - Users mint their profile as a Metaplex Core Identity NFT on the Solana Devnet.
5. **Share** - The profile is now publicly available at `/cv/[wallet]` or `/cv/[name].sol` and ready to be shared.

## Tech Stack
| Layer        | Tools                                             |
| ------------ | ------------------------------------------------- |
| Frontend     | Next.js (App Router), React 19, Tailwind CSS      |
| Web3         | `@solana/web3.js`, Wallet Standard, Metaplex UMI  |
| NFT Standard | Metaplex Core (`@metaplex-foundation/mpl-core`)   |
| Data RPC     | Helius RPC (Enriched transaction parsing)         |
| Naming       | `@bonfida/spl-name-service`                       |
| Authentication| NextAuth.js (GitHub Provider)                    |
| PDF Export   | `html2canvas`, `jspdf`                            |

## Getting Started

### Prerequisites
- Node.js 20 or newer
- npm or yarn
- A Solana Wallet (e.g., Phantom, Backpack) on the Devnet network

### Installation
```bash
git clone https://github.com/your-username/yochain.git
cd yochain
npm install
```

### Environment Configuration
Copy the environment template file:
```bash
cp .env.local.example .env.local
```
Then fill in the following values in `.env.local`:

| Variable | Description | Required/Optional |
| -------- | ----------- | ----------------- |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Required |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | Required |
| `NEXTAUTH_URL` | Base URL for NextAuth (e.g., `http://localhost:3000`) | Required |
| `NEXTAUTH_SECRET` | Secret key for NextAuth session encryption | Required |
| `HELIUS_API_KEY` | Helius RPC API Key for parsing onchain data | Required |
| `NEXT_PUBLIC_SOLANA_RPC` | Public Solana RPC URL | Required |
| `COVALENT_API_KEY` | Covalent API Key (for legacy multi-chain features) | Optional |

### Run the Application
Start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## Roadmap

### Completed
- [x] Full transition to a Solana-native architecture
- [x] Wallet Standard integration for auto-discovery
- [x] GitHub OAuth authentication & repository data fetching
- [x] "Aurora" editorial-style profile UI design (no emojis)
- [x] Rich onchain data parsing using Helius RPC
- [x] `.sol` domain name resolution (Bonfida)
- [x] Mint Identity NFTs using the Metaplex Core standard on Devnet
- [x] Export CV profile to PDF
- [x] Multi-templates for CV customization

### In Progress
- [ ] Optimize PDF export output for mobile screen resolutions
- [ ] Implement Solana Blinks integration for endorsements
- [ ] Refine network transaction handling

### Planned
- [ ] Deployment to Solana Mainnet
- [ ] Integrate onchain attestations (decentralized skill verification)
- [ ] Support custom Web2 domain mapping for user profiles

## Acknowledgements
Built for the [Colosseum Frontier Hackathon](https://colosseum.org/) under the [Superteam Indonesia](https://superteam.fun/) track. Powered by Solana, Helius, and Metaplex.

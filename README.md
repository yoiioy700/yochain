---

**YoChain: The Onchain Developer Identity & CV Builder**

![Solana](https://img.shields.io/badge/Network-Solana-14F195?style=flat-square)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square)
![Metaplex](https://img.shields.io/badge/Protocol-Metaplex_Core-E33F85?style=flat-square)
![Superteam Indonesia](https://img.shields.io/badge/Track-Superteam_Indonesia-9945FF?style=flat-square)

YoChain is a decentralized platform that empowers developers to craft, mint, and showcase their professional identity on the Solana blockchain. By bridging GitHub contributions and onchain activity, YoChain creates an immutable, verifiable, and elegant portfolio that lives forever on the network.

Traditional CVs are static and easy to forge, while onchain activity is often fragmented across multiple explorers and dashboards. YoChain solves this by aggregating your GitHub stats, Solana transaction history, token holdings, and protocol interactions into a single, beautifully designed profile. 

Built with an editorial-style "Aurora" aesthetic, the platform ensures that your developer identity isn't just verified—it looks premium. Every profile can be minted as a Metaplex Core NFT, cementing your professional milestones onchain.

### Fitur Utama
- **Connect Wallet:** Seamless, standard-compliant Solana wallet integration.
- **GitHub Integration:** Sync your top repositories, commits, and developer stats directly into your CV.
- **Onchain Profile:** Automatically fetch your Solana activity, including wallet age, DeFi badges, and token count via Helius RPC.
- **Mint NFT Identity:** Immortalize your CV by minting it as a Metaplex Core NFT on the Solana network.
- **Blinks Endorsement:** Share your profile as a Solana Blink, allowing others to endorse your skills directly from their X (Twitter) feed.
- **Export to PDF:** Generate a print-ready, beautifully formatted PDF version of your onchain CV.
- **Multi-template CV:** Choose from various premium layouts, including the signature "Aurora" design.
- **`.sol` Domain Support:** Natively resolves Bonfida Solana Name Service (SNS) domains for cleaner profile URLs.

## Cara Kerja
1. **Connect & Authenticate** - Pengguna menghubungkan dompet Solana mereka (via Wallet Standard) dan menghubungkan akun GitHub.
2. **Build Profile** - Platform menarik data GitHub dan aktivitas onchain (via Helius) untuk mengisi data CV secara otomatis.
3. **Customize** - Pengguna memilih template, menambahkan detail personal, dan menyesuaikan skill serta tautan yang ingin ditampilkan.
4. **Mint** - Pengguna mencetak (mint) profil mereka sebagai Metaplex Core Identity NFT di jaringan Solana Devnet.
5. **Share** - Profil kini tersedia secara publik di `/cv/[wallet]` atau `/cv/[name].sol` dan siap dibagikan.

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

## Cara Mulai

### Prerequisites
- Node.js 20 atau versi terbaru
- npm atau yarn
- Dompet Solana (contoh: Phantom, Backpack) di jaringan Devnet

### Install
```bash
git clone https://github.com/your-username/yochain.git
cd yochain
npm install
```

### Konfigurasi Environment Variables
Copy file template environment:
```bash
cp .env.local.example .env.local
```
Lalu isi nilai-nilai berikut di `.env.local`:

| Variable | Keterangan | Wajib/Opsional |
| -------- | ----------- | ----------------- |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Wajib |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | Wajib |
| `NEXTAUTH_URL` | Base URL untuk NextAuth (contoh: `http://localhost:3000`) | Wajib |
| `NEXTAUTH_SECRET` | Secret key untuk enkripsi sesi NextAuth | Wajib |
| `HELIUS_API_KEY` | API Key Helius RPC untuk parsing data onchain | Wajib |
| `NEXT_PUBLIC_SOLANA_RPC` | Public Solana RPC URL | Wajib |
| `COVALENT_API_KEY` | API Key Covalent (untuk fitur legacy multi-chain) | Opsional |

### Jalankan Aplikasi
Jalankan development server:
```bash
npm run dev
```
Aplikasi akan bisa diakses melalui `http://localhost:3000`.

## Roadmap

### Sudah Diimplementasi
- [x] Transisi penuh ke arsitektur Solana-native
- [x] Integrasi Wallet Standard untuk auto-discovery
- [x] Autentikasi GitHub OAuth & penarikan data repositori
- [x] Desain UI profil bergaya editorial "Aurora" tanpa emoji
- [x] Parsing data onchain yang kaya menggunakan Helius RPC
- [x] Resolusi nama domain `.sol` (Bonfida)
- [x] Mint Identity NFT menggunakan standar Metaplex Core di Devnet
- [x] Export profil CV ke PDF
- [x] Multi-template untuk kustomisasi CV

### Sedang Dikerjakan
- [ ] Optimasi hasil export PDF pada resolusi layar mobile
- [ ] Implementasi integrasi Solana Blinks untuk fitur endorsement
- [ ] Penyempurnaan handling transaksi di jaringan

### Direncanakan
- [ ] Deployment ke Solana Mainnet
- [ ] Integrasi onchain attestations (verifikasi skill secara desentralisasi)
- [ ] Dukungan custom Web2 domain mapping untuk profil pengguna

## Acknowledgements
Built for the [Colosseum Frontier Hackathon](https://colosseum.org/) under the [Superteam Indonesia](https://superteam.fun/) track. Powered by Solana, Helius, and Metaplex.

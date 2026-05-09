import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { resolve, reverseLookup } from '@bonfida/spl-name-service';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import ShareButton from '@/components/ShareButton';
import Nav from '@/components/Nav';
import Link from 'next/link';

export const revalidate = 0; // Dynamic rendering for public profiles

type PageProps = {
  params: Promise<{ address: string }>;
};

export default async function PublicProfilePage(props: PageProps) {
  const params = await props.params;
  const rawAddress = decodeURIComponent(params.address).trim();
  
  let targetWallet = rawAddress;
  let domainName: string | null = null;
  let errorMsg = '';

  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');

  // Resolve .sol jika dibutuhkan
  if (rawAddress.toLowerCase().endsWith('.sol')) {
    domainName = rawAddress.toLowerCase();
    try {
      const resolvedKey = await resolve(connection, domainName);
      targetWallet = resolvedKey.toBase58();
    } catch (err) {
      errorMsg = 'Gagal me-resolve domain .sol. Domain mungkin belum terdaftar.';
    }
  }

  let pubkey: PublicKey | null = null;
  if (!errorMsg) {
    try {
      pubkey = new PublicKey(targetWallet);
    } catch {
      errorMsg = 'Format alamat wallet tidak valid.';
    }
  }

  let solBalance = 0;
  let nftCount = 0;
  let endorsements: Array<{ signature: string; message: string; sender: string; time: string }> = [];

  if (pubkey && !errorMsg) {
    try {
      // Reverse lookup untuk mencari domain .sol jika belum ada
      if (!domainName) {
        try {
          const reverse = await reverseLookup(connection, pubkey);
          if (reverse) {
            domainName = reverse + '.sol';
          }
        } catch (e) {
          // Tidak ada domain ditemukan
        }
      }

      // Ambil saldo SOL
      const lamports = await connection.getBalance(pubkey);
      solBalance = lamports / LAMPORTS_PER_SOL;

      // Ambil jumlah NFT via Metaplex UMI
      try {
        const umi = createUmi(rpcUrl);
        const assets = await fetchAssetsByOwner(umi, umiPublicKey(pubkey.toBase58()));
        nftCount = assets.length;
      } catch (err) {
        console.error('UMI fetch error, falling back to DAS RPC:', err);
        // Fallback jika fetchAssetsByOwner gagal (contoh RPC tidak full support)
        try {
          const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0', id: 'yochain', method: 'getAssetsByOwner',
              params: { ownerAddress: pubkey.toBase58(), page: 1, limit: 100 }
            })
          });
          const data = await response.json();
          if (data.result?.items) {
             nftCount = data.result.items.length;
          }
        } catch(e) {}
      }

      // Ambil riwayat endorsement dari memo transaksi
      try {
        const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 20 });
        if (signatures.length > 0) {
          const txs = await connection.getParsedTransactions(signatures.map(s => s.signature), { maxSupportedTransactionVersion: 0 });
          
          for (const tx of txs) {
            if (!tx || !tx.meta || tx.meta.err) continue;
            
            const instructions = tx.transaction.message.instructions;
            for (const ix of instructions) {
              if (ix.programId.toBase58() === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLXFpx') {
                // @ts-ignore
                const memoStr = ix.parsed || '';
                if (memoStr.includes('YoChain Endorsement:')) {
                  endorsements.push({
                    signature: tx.transaction.signatures[0],
                    message: memoStr.replace('YoChain Endorsement:', '').trim(),
                    sender: tx.transaction.message.accountKeys[0].pubkey.toBase58(),
                    time: tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString('id-ID') : 'Baru saja'
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching endorsements:', err);
      }

    } catch (err) {
      errorMsg = 'Gagal memuat data dari Solana. Silakan coba lagi nanti.';
    }
  }

  // Fallback URL jika env belum diset
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const profileUrl = `${baseUrl}/profile/${rawAddress}`;
  
  const actionUrl = `${baseUrl}/api/actions/endorse/${targetWallet}`;
  const blinkUrl = `https://dial.to/?action=solana-action:${encodeURIComponent(actionUrl)}`;

  return (
    <>
      <Nav />
      <main className="container" style={{ padding: '4rem 0', maxWidth: '600px', margin: '0 auto' }}>
        
        {errorMsg ? (
          <div style={{ background: 'rgba(255, 50, 50, 0.1)', border: '1px solid rgba(255,50,50,0.3)', padding: '2rem', borderRadius: '8px', color: '#ff6b6b', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Profil Tidak Ditemukan</h2>
            <p>{errorMsg}</p>
            <Link href="/" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, rgba(20,241,149,0.05) 100%)',
            border: '1px solid rgba(20,241,149,0.15)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: '-10%', left: '50%',
              transform: 'translate(-50%, 0)',
              width: '100%', height: '150px',
              background: 'radial-gradient(ellipse at top, rgba(20,241,149,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              width: '80px', height: '80px', margin: '0 auto 1.5rem',
              borderRadius: '50%', background: '#111',
              border: '2px solid rgba(20,241,149,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${targetWallet}&backgroundColor=0a0a0a`}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>
              {domainName || `${targetWallet.slice(0, 4)}...${targetWallet.slice(-4)}`}
            </h1>
            
            {domainName && (
              <p style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', marginBottom: '2rem' }}>
                {targetWallet.slice(0, 8)}...{targetWallet.slice(-8)}
              </p>
            )}

            {!domainName && (
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Pengguna Solana Anonim
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
              <div style={{
                background: 'rgba(0,0,0,0.4)', border: '1px solid #333',
                padding: '1rem', borderRadius: '12px', minWidth: '120px'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  SOL Balance
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#14F195' }}>
                  {solBalance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </div>
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.4)', border: '1px solid #333',
                padding: '1rem', borderRadius: '12px', minWidth: '120px'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  NFT Owned
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                  {nftCount}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href={`/cv/${targetWallet}`} className="btn btn-primary">
                Lihat CV Onchain
              </Link>
              <ShareButton url={profileUrl} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <a href={blinkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#F1C40F', borderColor: '#F1C40F', background: 'rgba(241, 196, 15, 0.05)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Endorse Profil Ini
              </a>
            </div>

            {endorsements.length > 0 && (
              <div style={{ marginTop: '3rem', textAlign: 'left', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14F195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  Endorsement Terbaru
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {endorsements.map((end, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#14F195', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(20,241,149,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {end.sender.slice(0, 4)}...{end.sender.slice(-4)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{end.time}</span>
                      </div>
                      <p style={{ margin: 0, color: '#e0e0e0', fontStyle: 'italic', lineHeight: 1.5 }}>"{end.message}"</p>
                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                        <a href={`https://explorer.solana.com/tx/${end.signature}?cluster=devnet`} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px dashed #555' }}>
                          View Transaction ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

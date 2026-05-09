'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { create, mplCore } from '@metaplex-foundation/mpl-core';
import { generateSigner } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';

interface MintCVProps {
  walletAddress: string;
  domainName?: string | null;
  githubUsername: string;
  repoCount: number;
  topLanguage: string;
  walletAge: string;
}

export default function MintCVButton({
  walletAddress,
  domainName,
  githubUsername,
  repoCount,
  topLanguage,
  walletAge
}: MintCVProps) {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Harap hubungkan wallet Anda terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setTxSignature('');

    try {
      // 1. Siapkan Metadata Payload
      const metadataName = `YoChain Profile - ${domainName || walletAddress.slice(0, 8)}`;
      const metadataPayload = {
        name: metadataName,
        description: "CV Web3 onchain yang dibuat oleh YoChain",
        image: `https://api.dicebear.com/9.x/shapes/svg?seed=${walletAddress}&backgroundColor=0a0a0a`,
        attributes: [
          { trait_type: "Username GitHub", value: githubUsername },
          { trait_type: "Jumlah Repo", value: repoCount },
          { trait_type: "Bahasa Utama", value: topLanguage || "N/A" },
          { trait_type: "Umur Wallet", value: walletAge || "Baru" }
        ]
      };

      // 2. Upload Metadata ke server
      const uploadRes = await fetch(`/api/metadata/${walletAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataPayload)
      });
      
      if (!uploadRes.ok) {
        throw new Error('Gagal menyimpan metadata CV ke server');
      }
      
      // Gunakan URL absolute karena umi membutuhkannya
      const uri = `${window.location.origin}/api/metadata/${walletAddress}`;

      // 3. Inisialisasi UMI
      // TODO: Switch ke 'https://api.mainnet-beta.solana.com' untuk production mainnet
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';
      const umi = createUmi(rpcUrl)
        .use(walletAdapterIdentity(wallet))
        .use(mplCore());

      // 4. Proses Mint Core NFT
      const assetSigner = generateSigner(umi);
      
      const tx = await create(umi, {
        asset: assetSigner,
        name: metadataName,
        uri: uri,
      }).sendAndConfirm(umi);

      // Ekstrak signature transaksi untuk ditampilkan
      const signature = base58.deserialize(tx.signature)[0];
      setTxSignature(signature);

    } catch (err: any) {
      console.error('Minting error:', err);
      // Parsing error message jika user cancel transaksi dari wallet
      if (err.message && err.message.includes('User rejected')) {
        setError('Transaksi dibatalkan oleh pengguna.');
      } else {
        setError(err.message || 'Terjadi kesalahan tidak terduga saat proses minting.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <button 
        onClick={handleMint} 
        disabled={!wallet.connected || loading}
        className="btn btn-primary"
        style={{ 
          width: '100%', 
          padding: '1rem', 
          fontSize: '1.1rem',
          opacity: (!wallet.connected || loading) ? 0.6 : 1,
          cursor: (!wallet.connected || loading) ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {loading ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            Memproses Transaksi...
          </>
        ) : !wallet.connected ? (
          'Hubungkan Wallet untuk Mint'
        ) : (
          'Mint CV Saya (Metaplex Core)'
        )}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 50, 50, 0.1)', color: '#ff6b6b', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(255,50,50,0.3)' }}>
          {error}
        </div>
      )}

      {txSignature && (
        <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(20, 241, 149, 0.05)', borderRadius: '8px', border: '1px solid rgba(20, 241, 149, 0.2)', textAlign: 'center' }}>
          <div style={{ color: '#14F195', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Minting Sukses!
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            CV Web3 kamu berhasil dicetak sebagai Identity NFT di Solana.
          </p>
          <a 
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            Lihat Transaksi di Solana Explorer ↗
          </a>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

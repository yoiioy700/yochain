'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Nav from '@/components/Nav';
import Link from 'next/link';

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const [identities, setIdentities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!connected || !publicKey) {
      setIdentities([]);
      return;
    }

    const fetchIdentities = async () => {
      setLoading(true);
      setError('');
      try {
        const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC;
        if (!rpc) throw new Error('RPC URL is not configured in .env.local');

        const response = await fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'yochain-profile',
            method: 'getAssetsByOwner',
            params: {
              ownerAddress: publicKey.toBase58(),
              page: 1,
              limit: 100,
              displayOptions: {
                showFungible: false,
                showNativeBalance: false,
              },
            },
          }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message || 'Failed to fetch assets');
        
        const assets = data.result?.items || [];
        
        // Filter for YoChain Identity NFTs
        const yochainAssets = assets.filter((asset: any) => {
          const name = asset.content?.metadata?.name || '';
          return name.startsWith('YoChain ID');
        });

        // Hide duplicates from previous mints by only showing the first one
        setIdentities(yochainAssets.slice(0, 1));
      } catch (err: any) {
        console.error('Error fetching assets:', err);
        setError(err.message || 'Failed to load your identities');
      } finally {
        setLoading(false);
      }
    };

    fetchIdentities();
  }, [connected, publicKey]);

  return (
    <>
      <Nav />
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 className="display" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Your minted YoChain CVs and professional profiles on the Solana blockchain.
        </p>

        {!connected ? (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: 'linear-gradient(135deg, #0a0a0a 0%, rgba(20,241,149,0.03) 100%)',
            border: '1px solid rgba(20,241,149,0.12)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px', height: '300px',
              background: 'radial-gradient(circle, rgba(20,241,149,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            {/* Animated wallet icon */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto',
                background: 'rgba(20,241,149,0.08)',
                border: '1px solid rgba(20,241,149,0.25)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '28px', height: '28px',
                  border: '2px solid rgba(20,241,149,0.4)',
                  transform: 'rotate(45deg)',
                }} />
              </div>
              <div style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '14px', height: '14px', borderRadius: '50%',
                background: '#555',
                border: '2px solid #0a0a0a',
                animation: 'breathe 2s ease-in-out infinite',
              }} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
              No Wallet Connected
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Connect your Solana wallet using the button in the top‑right corner to view your minted YoChain identities.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
              color: 'rgba(20,241,149,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <span style={{ animation: 'breathe 1.5s ease-in-out infinite', fontSize: '0.5rem' }}>●</span>
              Devnet · Solana
            </div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: 'var(--accent-orange)', marginBottom: '1.5rem', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scanning blockchain...</div>
            <div style={{
              width: '32px', height: '32px', margin: '0 auto',
              border: '2px solid #333',
              borderTopColor: '#14F195',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : error ? (
          <div style={{ background: 'rgba(255, 50, 50, 0.1)', border: '1px solid rgba(255,50,50,0.3)', padding: '2rem', borderRadius: '8px', color: '#ff6b6b' }}>
            <strong>Error:</strong> {error}
          </div>
        ) : identities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0a0a0a', border: '1px dashed #333' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>NO_IDENTITIES_FOUND</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No Profiles Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't minted any YoChain ID NFTs on Devnet yet.</p>
            <Link href="/builder" className="btn btn-primary" style={{ display: 'inline-block' }}>Go to Builder &amp; Mint</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {identities.map((asset) => {
              const name = asset.content?.metadata?.name || 'Unknown Identity';
              const jsonUri = asset.content?.json_uri;
              let imgUrl = asset.content?.links?.image || asset.content?.files?.[0]?.uri;
              
              if ((!imgUrl || imgUrl === jsonUri) && jsonUri) {
                try {
                  const urlObj = new URL(jsonUri);
                  if (urlObj.searchParams.has('p')) {
                    imgUrl = urlObj.searchParams.get('p');
                  }
                } catch(e) {}
              }
              if (!imgUrl) imgUrl = '/placeholder.png';
              
              return (
                <div key={asset.id} style={{ background: '#111', borderRadius: '12px', border: '1px solid #2a2a2a', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ aspectRatio: '1', width: '100%', background: '#1a1a1a', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imgUrl} 
                      alt={name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { 
                        e.currentTarget.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(name)}&backgroundColor=0a0a0a`; 
                      }} 
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.65rem', color: '#14F195', fontWeight: 700, border: '1px solid rgba(20, 241, 149, 0.3)' }}>
                      Devnet
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Metaplex Core Asset</div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>{name}</h3>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <a href={`https://explorer.solana.com/address/${asset.id}?cluster=devnet`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', padding: '0.5rem' }}>
                        View on Explorer ↗
                      </a>
                      {jsonUri && (
                        <a href={jsonUri} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', padding: '0.5rem', opacity: 0.8 }}>
                          View Raw Metadata ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}} />
    </>
  );
}

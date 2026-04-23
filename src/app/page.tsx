'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { signIn, useSession } from 'next-auth/react';

export default function LandingPage() {
  const { publicKey, connected } = useWallet();
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to builder only if github is connected
  useEffect(() => {
    if (session?.user) {
      router.push('/builder');
    }
  }, [session, router]);

  return (
    <>
      <Nav />
      <main>
        <div className="container">
          <section className="hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '6rem 0' }}>
            <div className="animate-fade-up">
              <p className="hero-eyebrow">Web3 Developer Identity</p>
              <h1 className="hero-title display" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: '1.2', marginBottom: '1.5rem' }}>
                Your onchain story,<br />
                <em style={{ color: 'var(--accent-orange)' }}>proven on every chain.</em>
              </h1>
              <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                Login with GitHub. <strong>YoChain</strong> automatically generates a
                stunning developer profile powered by your real activity across
                Solana, EVM (ETH/Polygon/Base/OP/BSC), and GitHub.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', margin: '0 auto', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '320px', gap: '1.5rem', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Login to Start Building</div>
                  {session?.user ? (
                    <div style={{ background: '#2a2a2a', padding: '0.8rem 1.5rem', borderRadius: '100px', color: 'var(--accent-orange)' }}>
                      Connected as {session.user.name || session.user.email}
                    </div>
                  ) : (
                    <button 
                      onClick={() => signIn('github')}
                      className="btn"
                      style={{ background: '#fff', color: '#000', width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                      Authenticate with GitHub
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

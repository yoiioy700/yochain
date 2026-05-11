'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// Truncate Solana address: "5ziK...xK9m"
function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function Nav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  // ── Wallet Auth Guard ──────────────────────────────────────────────────────
  const [wrongWallet, setWrongWallet] = useState(false);
  const [registeredWallet, setRegisteredWallet] = useState('');
  const checkedRef = useRef<string>(''); // prevent repeated checks for same wallet

  useEffect(() => {
    if (!session?.user || !publicKey) return;

    const connectedAddress = publicKey.toBase58();
    // Don't re-check the same wallet address
    if (checkedRef.current === connectedAddress) return;
    checkedRef.current = connectedAddress;

    const ghUser = (session as any).githubUsername || session.user.name;
    if (!ghUser) return;

    fetch(`/api/profiles?username=${ghUser}`)
      .then(r => r.json())
      .then(profile => {
        if (profile?.sol && profile.sol !== connectedAddress) {
          // Mismatch! User has minted identity on a different wallet
          setRegisteredWallet(profile.sol);
          setWrongWallet(true);
          // Force sign out from GitHub session
          signOut({ redirect: false });
        }
      })
      .catch(() => {}); // silently ignore network errors
  }, [session, publicKey]);

  // Reset check ref when session or wallet disconnects
  useEffect(() => {
    if (!session?.user || !connected) {
      checkedRef.current = '';
      setWrongWallet(false);
    }
  }, [session, connected]);
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleWalletClick = useCallback(() => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  }, [connected, disconnect, setVisible]);

  const navLinks = [
    { href: '/builders', label: 'Builders' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  const addrLabel = publicKey ? truncateAddress(publicKey.toBase58()) : null;

  return (
    <>
      {/* ── Wrong Wallet Modal ─────────────────────────────────────────────── */}
      {wrongWallet && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            background: '#0a0a0a', border: '1px solid rgba(255,80,80,0.4)',
            borderTop: '3px solid #ff4444', padding: '2.5rem',
            maxWidth: '480px', width: '90%', textAlign: 'center',
          }}>
            {/* Icon */}
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
              color: '#ff4444', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              WALLET MISMATCH
            </div>

            <h2 style={{
              fontSize: '1.4rem', fontWeight: 800, color: '#fff',
              marginBottom: '1rem', lineHeight: 1.3,
            }}>
              Wrong Wallet Connected
            </h2>

            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Your GitHub account already has a YoChain Identity minted to a different wallet.
              You must connect the registered wallet to access your profile.
            </p>

            <div style={{
              background: '#111', border: '1px solid #222', padding: '0.75rem 1rem',
              marginBottom: '2rem', fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem', color: '#14F195', wordBreak: 'break-all',
              textAlign: 'left',
            }}>
              <div style={{ color: '#666', marginBottom: '0.25rem', fontSize: '0.65rem' }}>
                REGISTERED WALLET
              </div>
              {registeredWallet}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  disconnect();
                  setWrongWallet(false);
                  setVisible(true); // open wallet picker to choose correct wallet
                }}
                style={{
                  background: '#14F195', color: '#000', border: 'none',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  fontSize: '0.75rem', padding: '0.75rem 1.5rem',
                  cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase',
                }}
              >
                Switch Wallet
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setWrongWallet(false);
                }}
                style={{
                  background: 'transparent', color: '#666',
                  border: '1px solid #333',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem', padding: '0.75rem 1.5rem',
                  cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase',
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="nav" style={{ boxShadow: scrolled ? '0 2px 12px oklch(0% 0 0 / 0.06)' : 'none' }}>
        <div className="container">
          <div className="nav-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link href="/" className="nav-logo">
                Yo<span>Chain</span>
              </Link>
              {/* Global Nav Links */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.45rem 0.85rem',
                      textDecoration: 'none',
                      color: pathname === link.href ? '#14F195' : '#666',
                      borderBottom: pathname === link.href ? '1px solid #14F195' : '1px solid transparent',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = pathname === link.href ? '#14F195' : '#666'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Custom Wallet Button */}
              <button
                id="nav-wallet-btn"
                onClick={handleWalletClick}
                disabled={connecting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '36px',
                  padding: '0 1rem',
                  background: connected ? 'rgba(20, 241, 149, 0.08)' : '#1a1a1a',
                  border: connected ? '1px solid rgba(20, 241, 149, 0.35)' : '1px solid #333',
                  borderRadius: '100px',
                  color: connected ? '#14F195' : '#999',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: connecting ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={e => {
                  if (!connecting) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = connected ? 'rgba(255,80,80,0.5)' : '#14F195';
                    (e.currentTarget as HTMLButtonElement).style.color = connected ? '#ff6b6b' : '#14F195';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = connected ? 'rgba(20, 241, 149, 0.35)' : '#333';
                  (e.currentTarget as HTMLButtonElement).style.color = connected ? '#14F195' : '#999';
                }}
              >
                {/* Status dot */}
                <span style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: connecting ? '#f0a500' : connected ? '#14F195' : '#555',
                  boxShadow: connected ? '0 0 6px #14F195' : 'none',
                  flexShrink: 0,
                  animation: connecting ? 'pulse 1s ease-in-out infinite' : 'none',
                }} />
                {connecting ? 'Connecting...' : connected && addrLabel ? addrLabel : 'Connect Wallet'}
              </button>

              {session?.user && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link
                    href="/profile"
                    className="btn btn-outline"
                    style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/builder"
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
                  >
                    Go to Builder
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{
                      background: 'transparent',
                      border: '1px solid #2a2a2a',
                      borderRadius: '100px',
                      color: '#555',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.72rem',
                      padding: '0.45rem 0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      letterSpacing: '0.04em',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#ff6b6b';
                      e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#555';
                      e.currentTarget.style.borderColor = '#2a2a2a';
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </nav>
    </>
  );
}

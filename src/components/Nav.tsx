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
          // Mismatch! Show blocking modal — do NOT sign out here
          // (signOut causes session→null which immediately hides the modal)
          setRegisteredWallet(profile.sol);
          setWrongWallet(true);
        }
      })
      .catch(() => {}); // silently ignore network errors
  }, [session, publicKey]);

  // Reset check ref only when wallet disconnects (not when session changes)
  useEffect(() => {
    if (!connected) {
      checkedRef.current = '';
      setWrongWallet(false);
    }
  }, [connected]);
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
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.88)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          animation: 'backdropIn 0.3s ease',
        }}>
          {/* Scanline overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
          }} />

          <div style={{
            position: 'relative',
            background: 'linear-gradient(160deg, #0d0d0d 0%, #080808 100%)',
            border: '1px solid rgba(255,68,68,0.25)',
            borderTop: '2px solid #ff4444',
            padding: '2.5rem 2.5rem 2rem',
            maxWidth: '460px', width: '90%',
            boxShadow: '0 0 0 1px rgba(255,68,68,0.08), 0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,68,68,0.06)',
            animation: 'modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Accent corner */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,68,68,0.5))' }} />

            {/* Pulsing warning orb */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                {/* Pulse rings */}
                <div style={{
                  position: 'absolute', inset: '-8px', borderRadius: '50%',
                  border: '1px solid rgba(255,68,68,0.2)',
                  animation: 'ringPulse 2s ease-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: '-16px', borderRadius: '50%',
                  border: '1px solid rgba(255,68,68,0.1)',
                  animation: 'ringPulse 2s ease-out 0.4s infinite',
                }} />
                {/* Icon circle */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(255,68,68,0.1)',
                  border: '1px solid rgba(255,68,68,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#ff4444" strokeWidth="1.5"/>
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1.5" fill="#ff4444"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Status tag */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
              color: '#ff4444', letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '0.75rem', textAlign: 'center', opacity: 0.9,
            }}>
              ◆ ACCESS_DENIED · WALLET_MISMATCH
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: '1.5rem', fontWeight: 800, color: '#fff',
              marginBottom: '0.75rem', lineHeight: 1.2, textAlign: 'center',
              letterSpacing: '-0.02em',
            }}>
              Wrong Wallet Connected
            </h2>

            <p style={{
              color: '#666', fontSize: '0.85rem', lineHeight: 1.7,
              marginBottom: '1.75rem', textAlign: 'center',
            }}>
              Your GitHub account already has an onchain identity.<br/>
              You must connect the registered wallet to continue.
            </p>

            {/* Registered wallet */}
            <div style={{
              background: 'rgba(20,241,149,0.04)',
              border: '1px solid rgba(20,241,149,0.15)',
              borderLeft: '2px solid #14F195',
              padding: '0.875rem 1rem',
              marginBottom: '1.75rem',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem', color: '#14F195',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                marginBottom: '0.4rem', opacity: 0.7,
              }}>
                Registered Wallet
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem', color: '#14F195',
                wordBreak: 'break-all', lineHeight: 1.5,
              }}>
                {registeredWallet}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  disconnect();
                  setWrongWallet(false);
                  setVisible(true);
                }}
                style={{
                  flex: 1, background: '#14F195', color: '#000', border: 'none',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                  fontSize: '0.7rem', padding: '0.875rem',
                  cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00ffaa'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#14F195'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Switch Wallet ↗
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setWrongWallet(false);
                  signOut({ callbackUrl: '/' });
                }}
                style={{
                  flex: 1, background: 'transparent', color: '#555',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem', padding: '0.875rem',
                  cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                Sign Out
              </button>
            </div>

          </div>

          <style>{`
            @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes modalIn { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes ringPulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
          `}</style>
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

              {session?.user && !wrongWallet && (
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

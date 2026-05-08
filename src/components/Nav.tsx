'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
  );
}

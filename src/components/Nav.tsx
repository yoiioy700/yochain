'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function Nav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/builders', label: 'Builders' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

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
            <WalletMultiButton style={{ height: '36px', fontSize: '0.82rem', padding: '0 1rem', background: '#2a2a2a' }} />
            {session?.user && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href="/profile"
                  className="btn btn-outline"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
                >
                  My Identities
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
    </nav>
  );
}

